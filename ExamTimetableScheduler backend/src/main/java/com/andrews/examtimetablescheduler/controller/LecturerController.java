package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Lecturer;
import com.andrews.examtimetablescheduler.repository.LecturerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lecturers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class LecturerController {
    private final LecturerRepository repo;

    @GetMapping
    public List<Lecturer> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Lecturer create(@RequestBody Lecturer l) {
        return repo.save(l);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Lecturer> update(@PathVariable Long id, @RequestBody Lecturer updated) {
        return repo.findById(id).map(existing -> {
            existing.setName(updated.getName());
            existing.setEmail(updated.getEmail());
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