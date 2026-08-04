package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Lecturer;
import com.andrews.examtimetablescheduler.repository.LecturerRepository;
import lombok.RequiredArgsConstructor;
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
}