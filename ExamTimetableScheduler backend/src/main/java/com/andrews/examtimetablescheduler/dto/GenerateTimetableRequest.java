package com.andrews.examtimetablescheduler.dto;

import lombok.Data;

@Data
public class GenerateTimetableRequest {
    private Long deptId;
    private int level;
}