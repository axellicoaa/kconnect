package com.example.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.PerformanceReport;

public interface PerformanceReportRepository extends JpaRepository<PerformanceReport, Long> {
List<PerformanceReport> findByEmployee_Id(Long employeeId);
List<PerformanceReport> findByDepartment_Id(Long departmentId);
}