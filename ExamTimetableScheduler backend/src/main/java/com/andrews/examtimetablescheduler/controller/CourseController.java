package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Course;
import com.andrews.examtimetablescheduler.repository.CourseRepository;
import com.andrews.examtimetablescheduler.repository.ExamSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CourseController {
    private final CourseRepository repo;
    private final ExamSlotRepository examSlotRepo;

    @GetMapping
    public List<Course> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Course create(@RequestBody Course c) {
        return repo.save(c);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course updated) {
        return repo.findById(id).map(existing -> {
            existing.setCourseCode(updated.getCourseCode());
            existing.setCourseName(updated.getCourseName());
            existing.setLevel(updated.getLevel());
            existing.setStudentCount(updated.getStudentCount());
            existing.setDepartment(updated.getDepartment());
            existing.setLecturer(updated.getLecturer());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        List<Long> slotIds = examSlotRepo.findAll().stream()
                .filter(s -> s.getCourse() != null && s.getCourse().getId().equals(id))
                .map(s -> s.getId())
                .collect(Collectors.toList());
        examSlotRepo.deleteAllById(slotIds);
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}