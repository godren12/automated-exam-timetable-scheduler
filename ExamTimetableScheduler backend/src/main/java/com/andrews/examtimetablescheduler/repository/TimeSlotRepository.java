package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    List<TimeSlot> findByExamPeriodId(Long examPeriodId);
}