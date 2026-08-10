package com.andrews.examtimetablescheduler.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class ExamSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    private LocalDateTime examDateTime;
    private int level;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "exam_period_id")
    private ExamPeriod examPeriod;

    private String status;
    private String conflictReason;
}