package com.andrews.examtimetablescheduler.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data
public class ExamPeriod {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private LocalDate startDate;
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    private ExamType examType;

    @OneToMany(mappedBy = "examPeriod", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<TimeSlot> timeSlots;
}