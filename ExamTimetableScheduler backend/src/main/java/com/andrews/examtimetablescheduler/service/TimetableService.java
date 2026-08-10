package com.andrews.examtimetablescheduler.service;

import com.andrews.examtimetablescheduler.model.*;
import com.andrews.examtimetablescheduler.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
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

    public String generateTimetable(Long deptId, int level, Long examPeriodId) {
        Department dept = deptRepo.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        ExamPeriod period = examPeriodRepo.findById(examPeriodId)
                .orElseThrow(() -> new RuntimeException("Exam period not found"));

        List<TimeSlot> timeSlots = period.getTimeSlots();
        if (timeSlots == null || timeSlots.isEmpty()) {
            throw new RuntimeException("This exam period has no time slots defined yet.");
        }

        List<Course> courses = courseRepo.findByDepartmentIdAndLevel(deptId, level);
        List<Room> rooms = roomRepo.findAll();

        // Sort courses largest enrollment first (greedy: hardest to place, place first)
        courses.sort((a, b) -> Integer.compare(b.getStudentCount(), a.getStudentCount()));

        // Sort rooms smallest capacity first (best-fit: use the smallest room that still fits)
        rooms.sort(Comparator.comparingInt(Room::getCapacity));

        // Clear only this department+level's existing slots for this exam period
        List<ExamSlot> existingForThisRun = examSlotRepo.findByDepartmentIdAndLevel(deptId, level).stream()
                .filter(s -> s.getExamPeriod() != null && s.getExamPeriod().getId().equals(examPeriodId))
                .collect(Collectors.toList());
        examSlotRepo.deleteAll(existingForThisRun);

        // Build the list of usable exam dates (weekdays only) within the period
        List<LocalDate> examDates = new ArrayList<>();
        LocalDate cursor = period.getStartDate();
        while (!cursor.isAfter(period.getEndDate())) {
            if (cursor.getDayOfWeek() != DayOfWeek.SATURDAY && cursor.getDayOfWeek() != DayOfWeek.SUNDAY) {
                examDates.add(cursor);
            }
            cursor = cursor.plusDays(1);
        }

        // Preload all room bookings already in this exam period (across ALL departments)
        // so we don't double-book a room that another department already claimed.
        Set<String> bookedRoomSlots = examSlotRepo.findByExamPeriodId(examPeriodId).stream()
                .filter(s -> "SCHEDULED".equals(s.getStatus()) && s.getRoom() != null)
                .map(s -> s.getRoom().getId() + "|" + s.getExamDateTime())
                .collect(Collectors.toCollection(HashSet::new));

        List<ExamSlot> results = new ArrayList<>();
        int scheduledCount = 0;
        int conflictCount = 0;

        for (Course course : courses) {
            boolean placed = false;

            outer:
            for (LocalDate date : examDates) {
                for (TimeSlot slot : timeSlots) {
                    LocalDateTime dateTime = LocalDateTime.of(date, slot.getStartTime());

                    for (Room room : rooms) {
                        if (room.getCapacity() < course.getStudentCount()) continue;

                        String key = room.getId() + "|" + dateTime;
                        if (bookedRoomSlots.contains(key)) continue;

                        // Found a valid room + slot combination
                        ExamSlot examSlot = new ExamSlot();
                        examSlot.setCourse(course);
                        examSlot.setRoom(room);
                        examSlot.setExamDateTime(dateTime);
                        examSlot.setLevel(level);
                        examSlot.setDepartment(dept);
                        examSlot.setExamPeriod(period);
                        examSlot.setStatus("SCHEDULED");

                        results.add(examSlot);
                        bookedRoomSlots.add(key);
                        placed = true;
                        scheduledCount++;
                        break outer;
                    }
                }
            }

            if (!placed) {
                ExamSlot conflict = new ExamSlot();
                conflict.setCourse(course);
                conflict.setLevel(level);
                conflict.setDepartment(dept);
                conflict.setExamPeriod(period);
                conflict.setStatus("CONFLICT");

                boolean noRoomBigEnough = rooms.stream().noneMatch(r -> r.getCapacity() >= course.getStudentCount());
                if (noRoomBigEnough) {
                    conflict.setConflictReason("No room large enough for " + course.getStudentCount() + " students.");
                } else {
                    conflict.setConflictReason("No available room/time slot combination left in this exam period.");
                }

                results.add(conflict);
                conflictCount++;
            }
        }

        examSlotRepo.saveAll(results);

        return String.format("Timetable generated for %s Level %d: %d scheduled, %d conflict(s).",
                dept.getName(), level, scheduledCount, conflictCount);
    }
}