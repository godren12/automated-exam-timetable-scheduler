package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.ExamPeriod;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExamPeriodRepository extends JpaRepository<ExamPeriod, Long> {
}