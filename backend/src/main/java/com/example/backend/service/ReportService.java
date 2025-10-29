package com.example.backend.service;

import com.example.backend.dto.ReportDTO;
import com.example.backend.models.Employee;
import com.example.backend.models.PerformanceReport;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.repository.PerformanceReportRepository;
import java.time.Instant;
import java.util.List;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class ReportService {

  private final PerformanceReportRepository repo;
  private final EmployeeRepository empRepo;

  public ReportService(
    PerformanceReportRepository repo,
    EmployeeRepository empRepo
  ) {
    this.repo = repo;
    this.empRepo = empRepo;
  }

  // Crear reporte
  public ReportDTO create(ReportDTO dto) {
    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    Employee emp = empRepo.findByEmail(auth.getName()).orElseThrow();

    PerformanceReport report = new PerformanceReport();
    report.setTitle(dto.getTitle());
    report.setDescription(dto.getDescription());
    report.setScore(dto.getScore());
    report.setEmployee(emp);
    report.setDepartment(emp.getDepartment());
    report.setCreatedAt(Instant.now());

    repo.save(report);
    return toDto(report);
  }

  // Reportes del usuario autenticado
  public List<ReportDTO> myReports() {
    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    Employee emp = empRepo.findByEmail(auth.getName()).orElseThrow();

    return repo
      .findByEmployee_Id(emp.getId())
      .stream()
      .map(this::toDto)
      .toList();
  }

  // Reportes por departamento (ADMIN)
  public List<ReportDTO> byDepartment(Long deptId) {
    return repo.findByDepartment_Id(deptId).stream().map(this::toDto).toList();
  }

  // Actualizar
  public ReportDTO update(Long id, ReportDTO dto) {
    PerformanceReport report = repo.findById(id).orElseThrow();

    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    String currentUser = auth.getName();
    boolean isAdmin = auth
      .getAuthorities()
      .stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!report.getEmployee().getEmail().equals(currentUser) && !isAdmin) {
      throw new RuntimeException("No autorizado");
    }

    if (dto.getTitle() != null) report.setTitle(dto.getTitle());
    if (dto.getDescription() != null) report.setDescription(
      dto.getDescription()
    );
    if (dto.getScore() != null) report.setScore(dto.getScore());

    repo.save(report);
    return toDto(report);
  }

  // Eliminar
  public void delete(Long id) {
    repo.deleteById(id);
  }

  // Convertir entidad -> DTO
  private ReportDTO toDto(PerformanceReport r) {
    ReportDTO dto = new ReportDTO();
    dto.setId(r.getId());
    dto.setTitle(r.getTitle());
    dto.setDescription(r.getDescription());
    dto.setScore(r.getScore());
    dto.setEmployeeId(r.getEmployee().getId());
    dto.setDepartmentId(r.getDepartment().getId());
    dto.setCreatedAt(r.getCreatedAt().toString());

    // 👇 Aquí llenas los nombres
    dto.setEmployeeName(r.getEmployee().getFullName());
    dto.setDepartmentName(r.getDepartment().getName());

    return dto;
  }
}
