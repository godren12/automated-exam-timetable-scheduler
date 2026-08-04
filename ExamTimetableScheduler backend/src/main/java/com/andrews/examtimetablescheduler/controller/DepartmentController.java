package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Department;
import com.andrews.examtimetablescheduler.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class DepartmentController {
    private final DepartmentRepository repo;

    @GetMapping
    public List<Department> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Department create(@RequestBody Department d) {
        return repo.save(d);
    }
}