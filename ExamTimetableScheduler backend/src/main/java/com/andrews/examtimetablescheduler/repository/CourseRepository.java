package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByLevel(int level);
    List<Course> findByDepartmentId(Long departmentId);
    List<Course> findByDepartmentIdAndLevel(Long departmentId, int level);
}