package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.dto.GenerateTimetableRequest;
import com.andrews.examtimetablescheduler.model.ExamSlot;
import com.andrews.examtimetablescheduler.repository.ExamSlotRepository;
import com.andrews.examtimetablescheduler.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class TimetableController {
    private final TimetableService timetableService;
    private final ExamSlotRepository examSlotRepo;

    @PostMapping("/generate")
    public String generate(@RequestBody GenerateTimetableRequest req) {
        return timetableService.generateTimetable(req.getDeptId(), req.getLevel(), req.getExamPeriodId());
    }

    @GetMapping("/{deptId}/{level}")
    public List<ExamSlot> getTimetable(@PathVariable Long deptId, @PathVariable int level) {
        return examSlotRepo.findByDepartmentIdAndLevel(deptId, level);
    }
}