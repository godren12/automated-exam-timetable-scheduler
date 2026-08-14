package com.andrews.examtimetablescheduler.service;

import com.andrews.examtimetablescheduler.dto.GenerateTimetableRequest;
import com.andrews.examtimetablescheduler.model.*;
import com.andrews.examtimetablescheduler.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final CourseRepository courseRepo;
    private final RoomRepository roomRepo;
    private final DepartmentRepository deptRepo;
    private final ExamSlotRepository examSlotRepo;
    private final ExamPeriodRepository examPeriodRepo;

    private static final long MIN_GAP_MINUTES = 60;

    public String generateTimetable(GenerateTimetableRequest req) {
        ExamPeriod period = examPeriodRepo.findById(req.getExamPeriodId())
                .orElseThrow(() -> new RuntimeException("Exam period not found"));

        if (period.getExamType() == null) {
            throw new RuntimeException("This exam period has no exam type set (e.g. Mid-Semester or End of Semester). Set it before generating.");
        }

        List<TimeSlot> timeSlots = period.getTimeSlots();
        if (timeSlots == null || timeSlots.isEmpty()) {
            throw new RuntimeException("This exam period has no time slots defined yet.");
        }
        timeSlots = timeSlots.stream()
                .sorted(Comparator.comparing(TimeSlot::getStartTime))
                .collect(Collectors.toList());

        List<Department> departments;
        if ("COLLEGE".equalsIgnoreCase(req.getScope())) {
            departments = deptRepo.findAll();
            if (departments.isEmpty()) throw new RuntimeException("No departments found.");
        } else {
            if (req.getDeptId() == null) throw new RuntimeException("Please select a department.");
            departments = List.of(deptRepo.findById(req.getDeptId())
                    .orElseThrow(() -> new RuntimeException("Department not found")));
        }

        List<Room> allRooms = roomRepo.findAll();
        if (allRooms.isEmpty()) throw new RuntimeException("No rooms have been added yet.");

        List<LocalDate> examDates = new ArrayList<>();
        LocalDate cursor = period.getStartDate();
        while (!cursor.isAfter(period.getEndDate())) {
            if (cursor.getDayOfWeek() != DayOfWeek.SATURDAY && cursor.getDayOfWeek() != DayOfWeek.SUNDAY) {
                examDates.add(cursor);
            }
            cursor = cursor.plusDays(1);
        }
        if (examDates.isEmpty()) {
            throw new RuntimeException("Exam period has no valid weekdays in its date range.");
        }

        List<Long> deptIds = departments.stream().map(Department::getId).collect(Collectors.toList());
        List<ExamSlot> existing = examSlotRepo.findByExamPeriodId(period.getId());
        List<ExamSlot> toDelete = existing.stream()
                .filter(s -> s.getDepartment() != null && deptIds.contains(s.getDepartment().getId()))
                .filter(s -> req.getLevel() == null || s.getLevel() == req.getLevel())
                .collect(Collectors.toList());
        examSlotRepo.deleteAll(toDelete);

        // State carried over from slots NOT being regenerated (other depts/levels in this period)
        List<ExamSlot> stillLive = examSlotRepo.findByExamPeriodId(period.getId()).stream()
                .filter(s -> "SCHEDULED".equals(s.getStatus()))
                .collect(Collectors.toList());

        Map<String, Integer> roomRemaining = new HashMap<>();       // roomId|dateTime -> seats left
        Map<String, Set<String>> roomOccupants = new HashMap<>();   // roomId|dateTime -> {"deptId-level", ...}
        Set<String> lecturerBooked = new HashSet<>();               // lecturerId|dateTime
        Map<String, Integer> levelDayCount = new HashMap<>();       // deptId|level|date -> count
        Map<String, List<LocalDateTime>> levelDayTimes = new HashMap<>(); // same key -> times used that day

        for (ExamSlot s : stillLive) {
            if (s.getRoom() == null || s.getExamDateTime() == null || s.getDepartment() == null) continue;
            String roomKey = s.getRoom().getId() + "|" + s.getExamDateTime();
            int seats = s.getSeatsInRoom() != null ? s.getSeatsInRoom() : s.getCourse().getStudentCount();
            int base = roomRemaining.getOrDefault(roomKey, s.getRoom().getCapacity());
            roomRemaining.put(roomKey, base - seats);
            roomOccupants.computeIfAbsent(roomKey, k -> new HashSet<>()).add(s.getDepartment().getId() + "-" + s.getLevel());
            if (s.getCourse().getLecturer() != null) {
                lecturerBooked.add(s.getCourse().getLecturer().getId() + "|" + s.getExamDateTime());
            }
            String dayKey = s.getDepartment().getId() + "|" + s.getLevel() + "|" + s.getExamDateTime().toLocalDate();
            levelDayCount.merge(dayKey, 1, Integer::sum);
            levelDayTimes.computeIfAbsent(dayKey, k -> new ArrayList<>()).add(s.getExamDateTime());
        }

        List<ExamSlot> results = new ArrayList<>();
        int scheduledCount = 0;
        int conflictCount = 0;
        int maxPerDay = period.getExamType().getMaxPerDay();

        for (Department dept : departments) {
            List<Course> courses = req.getLevel() != null
                    ? courseRepo.findByDepartmentIdAndLevel(dept.getId(), req.getLevel())
                    : courseRepo.findByDepartmentId(dept.getId());

            Map<Integer, List<Course>> byLevel = courses.stream().collect(Collectors.groupingBy(Course::getLevel));

            for (Map.Entry<Integer, List<Course>> entry : byLevel.entrySet()) {
                int level = entry.getKey();
                List<Course> levelCourses = new ArrayList<>(entry.getValue());
                levelCourses.sort((a, b) -> Integer.compare(b.getStudentCount(), a.getStudentCount()));

                int dateRotation = 0;

                for (Course course : levelCourses) {
                    boolean placed = false;
                    String lecturerId = course.getLecturer() != null ? String.valueOf(course.getLecturer().getId()) : null;

                    outer:
                    for (int di = 0; di < examDates.size(); di++) {
                        LocalDate date = examDates.get((dateRotation + di) % examDates.size());
                        String dayKey = dept.getId() + "|" + level + "|" + date;
                        if (levelDayCount.getOrDefault(dayKey, 0) >= maxPerDay) continue;

                        for (TimeSlot slot : timeSlots) {
                            LocalDateTime dateTime = LocalDateTime.of(date, slot.getStartTime());

                            boolean gapOk = true;
                            for (LocalDateTime existingDt : levelDayTimes.getOrDefault(dayKey, List.of())) {
                                if (Math.abs(Duration.between(existingDt, dateTime).toMinutes()) < MIN_GAP_MINUTES) {
                                    gapOk = false;
                                    break;
                                }
                            }
                            if (!gapOk) continue;

                            if (lecturerId != null && lecturerBooked.contains(lecturerId + "|" + dateTime)) continue;

                            String deptLevelKey = dept.getId() + "-" + level;
                            List<Room> candidateRooms = new ArrayList<>(allRooms);
                            candidateRooms.sort((a, b) -> {
                                int remA = roomRemaining.getOrDefault(a.getId() + "|" + dateTime, a.getCapacity());
                                int remB = roomRemaining.getOrDefault(b.getId() + "|" + dateTime, b.getCapacity());
                                return Integer.compare(remB, remA);
                            });

                            int needed = course.getStudentCount();
                            List<Room> chosenRooms = new ArrayList<>();
                            List<Integer> chosenSeats = new ArrayList<>();

                            for (Room room : candidateRooms) {
                                if (needed <= 0) break;
                                String roomKey = room.getId() + "|" + dateTime;
                                Set<String> occupants = roomOccupants.getOrDefault(roomKey, Set.of());
                                if (occupants.contains(deptLevelKey)) continue; // avoid same course splitting oddly into a room it's not in

                                int remaining = roomRemaining.getOrDefault(roomKey, room.getCapacity());
                                if (remaining <= 0) continue;

                                int take = Math.min(remaining, needed);
                                chosenRooms.add(room);
                                chosenSeats.add(take);
                                needed -= take;
                            }

                            if (needed > 0) continue;

                            String groupId = UUID.randomUUID().toString();
                            for (int i = 0; i < chosenRooms.size(); i++) {
                                Room room = chosenRooms.get(i);
                                int seats = chosenSeats.get(i);
                                String roomKey = room.getId() + "|" + dateTime;

                                ExamSlot examSlot = new ExamSlot();
                                examSlot.setCourse(course);
                                examSlot.setRoom(room);
                                examSlot.setExamDateTime(dateTime);
                                examSlot.setLevel(level);
                                examSlot.setDepartment(dept);
                                examSlot.setExamPeriod(period);
                                examSlot.setStatus("SCHEDULED");
                                examSlot.setGroupId(groupId);
                                examSlot.setSeatsInRoom(seats);
                                results.add(examSlot);

                                roomRemaining.put(roomKey, roomRemaining.getOrDefault(roomKey, room.getCapacity()) - seats);
                                roomOccupants.computeIfAbsent(roomKey, k -> new HashSet<>()).add(deptLevelKey);
                            }

                            if (lecturerId != null) lecturerBooked.add(lecturerId + "|" + dateTime);
                            levelDayCount.merge(dayKey, 1, Integer::sum);
                            levelDayTimes.computeIfAbsent(dayKey, k -> new ArrayList<>()).add(dateTime);

                            placed = true;
                            scheduledCount++;
                            dateRotation++;
                            break outer;
                        }
                    }

                    if (!placed) {
                        ExamSlot conflict = new ExamSlot();
                        conflict.setCourse(course);
                        conflict.setLevel(level);
                        conflict.setDepartment(dept);
                        conflict.setExamPeriod(period);
                        conflict.setStatus("CONFLICT");

                        int totalCapacity = allRooms.stream().mapToInt(Room::getCapacity).sum();
                        if (totalCapacity < course.getStudentCount()) {
                            conflict.setConflictReason("Not enough total room capacity for " + course.getStudentCount() + " students, even split across every room.");
                        } else if (lecturerId != null && course.getLecturer() != null) {
                            conflict.setConflictReason("No slot found within the daily limit / gap rules and lecturer availability for " + course.getLecturer().getName() + ".");
                        } else {
                            conflict.setConflictReason("No available date/time/room combination left within this exam period.");
                        }
                        results.add(conflict);
                        conflictCount++;
                    }
                }
            }
        }

        examSlotRepo.saveAll(results);

        String levelLabel = (req.getLevel() != null) ? "Level " + req.getLevel() : "All Levels";
        String scopeLabel = "COLLEGE".equalsIgnoreCase(req.getScope()) ? "the whole college" : departments.get(0).getName();

        return String.format("%s generated for %s (%s): %d scheduled, %d conflict(s).",
                period.getExamType().getLabel(), scopeLabel, levelLabel, scheduledCount, conflictCount);
    }
}