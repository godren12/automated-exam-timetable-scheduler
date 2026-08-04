package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.ExamSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExamSlotRepository extends JpaRepository<ExamSlot, Long> {

    // Used in TimetableController to get timetable for a dept + level
    List<ExamSlot> findByDepartmentIdAndLevel(Long departmentId, int level);

    // Used in TimetableService to clear old timetable before generating new one
    void deleteByDepartmentIdAndLevel(Long departmentId, int level);
}