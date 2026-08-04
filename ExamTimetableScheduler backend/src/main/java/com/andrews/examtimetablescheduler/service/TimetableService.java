package com.andrews.examtimetablescheduler.service;

import com.andrews.examtimetablescheduler.model.*;
import com.andrews.examtimetablescheduler.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableService {

    private final CourseRepository courseRepo;
    private final RoomRepository roomRepo;
    private final DepartmentRepository deptRepo;
    private final ExamSlotRepository examSlotRepo;

    public String generateTimetable(Long deptId, int level) {
        Department dept = deptRepo.findById(deptId)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        List<Course> courses = courseRepo.findByDepartmentIdAndLevel(deptId, level);
        List<Room> rooms = roomRepo.findAll();

        examSlotRepo.deleteByDepartmentIdAndLevel(deptId, level);

        LocalDateTime currentSlot = LocalDateTime.now().plusDays(7).withHour(9).withMinute(0);

        for(Course course : courses) {
            Room availableRoom = rooms.stream()
                    .filter(r -> r.getCapacity() >= course.getStudentCount())
                    .findFirst()
                    .orElse(null);

            if(availableRoom != null) {
                ExamSlot slot = new ExamSlot();
                slot.setCourse(course);
                slot.setRoom(availableRoom);
                slot.setExamDateTime(currentSlot);
                slot.setLevel(level);
                slot.setDepartment(dept);
                examSlotRepo.save(slot);
                currentSlot = currentSlot.plusHours(3);
            }
        }
        return "Timetable generated for " + dept.getName() + " Level " + level;
    }
} // <- this was missing