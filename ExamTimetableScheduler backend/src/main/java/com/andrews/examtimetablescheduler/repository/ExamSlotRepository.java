package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.ExamSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface ExamSlotRepository extends JpaRepository<ExamSlot, Long> {
    List<ExamSlot> findByDepartmentIdAndLevel(Long departmentId, int level);
    void deleteByDepartmentIdAndLevel(Long departmentId, int level);
    List<ExamSlot> findByExamPeriodId(Long examPeriodId);
    List<ExamSlot> findByRoomIdAndExamDateTime(Long roomId, LocalDateTime examDateTime);
}