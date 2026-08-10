package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Department;
import com.andrews.examtimetablescheduler.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PutMapping("/{id}")
    public ResponseEntity<Department> update(@PathVariable Long id, @RequestBody Department updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setCode(updated.getCode());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}