package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.TimeSlot;
import com.andrews.examtimetablescheduler.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/time-slots")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TimeSlotController {
    private final TimeSlotRepository repo;

    @GetMapping
    public List<TimeSlot> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public TimeSlot create(@RequestBody TimeSlot slot) {
        return repo.save(slot);
    }

    @GetMapping("/period/{examPeriodId}")
    public List<TimeSlot> getByPeriod(@PathVariable Long examPeriodId) {
        return repo.findByExamPeriodId(examPeriodId);
    }
}