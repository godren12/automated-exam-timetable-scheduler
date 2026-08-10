package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.ExamPeriod;
import com.andrews.examtimetablescheduler.repository.ExamPeriodRepository;
import com.andrews.examtimetablescheduler.repository.ExamSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exam-periods")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class ExamPeriodController {
    private final ExamPeriodRepository repo;
    private final ExamSlotRepository examSlotRepo;

    @GetMapping
    public List<ExamPeriod> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public ExamPeriod create(@RequestBody ExamPeriod period) {
        return repo.save(period);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        // Clean up any exam slots (scheduled or conflict entries) tied to this period first
        examSlotRepo.deleteAll(examSlotRepo.findByExamPeriodId(id));
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}