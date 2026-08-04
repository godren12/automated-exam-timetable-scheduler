package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Course;
import com.andrews.examtimetablescheduler.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CourseController {
    private final CourseRepository repo;

    @GetMapping
    public List<Course> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Course create(@RequestBody Course c) {
        return repo.save(c);
    }
}