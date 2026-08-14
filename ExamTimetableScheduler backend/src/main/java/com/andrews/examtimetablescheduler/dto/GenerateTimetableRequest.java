package com.andrews.examtimetablescheduler.dto;
import lombok.Data;

@Data
public class GenerateTimetableRequest {
    private Long deptId;       // null when scope = COLLEGE
    private Integer level;     // null = all levels
    private Long examPeriodId;
    private String scope;      // "DEPARTMENT" or "COLLEGE"
}