package com.andrews.examtimetablescheduler.model;

public enum ExamType {
    FIRST_SEM_MID("First Semester, Mid-Semester Exams", 2),
    FIRST_SEM_END("First Semester, End of Semester Exams", 1),
    SECOND_SEM_MID("Second Semester, Mid-Semester Exams", 2),
    SECOND_SEM_END("Second Semester, End of Semester Exams", 1);

    private final String label;
    private final int maxPerDay;

    ExamType(String label, int maxPerDay) {
        this.label = label;
        this.maxPerDay = maxPerDay;
    }

    public String getLabel() { return label; }
    public int getMaxPerDay() { return maxPerDay; }
    public boolean isMidSem() { return maxPerDay == 2; }
}