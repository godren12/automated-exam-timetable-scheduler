package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentRepository extends JpaRepository<Department, Long> {
}