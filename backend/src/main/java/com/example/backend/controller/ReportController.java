package com.example.backend.controller;

import com.example.backend.dto.ReportDTO;
import com.example.backend.service.ReportService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/reports")
public class ReportController {

  private final ReportService service;

  public ReportController(ReportService service) {
    this.service = service;
  }

  // Crear reporte (empleado autenticado)
  @PostMapping
  public ResponseEntity<ReportDTO> create(@RequestBody ReportDTO dto) {
    return ResponseEntity.ok(service.create(dto));
  }

  // Listar reportes del empleado autenticado
  @GetMapping
  public List<ReportDTO> myReports() {
    return service.myReports();
  }

  // Listar reportes por departamento (solo ADMIN)
  @GetMapping("/department/{departmentId}")
  @PreAuthorize("hasRole('ADMIN')")
  public List<ReportDTO> byDepartment(@PathVariable Long departmentId) {
    return service.byDepartment(departmentId);
  }

  // Editar reporte (propio o ADMIN)
  @PutMapping("/{id}")
  public ResponseEntity<ReportDTO> update(
    @PathVariable Long id,
    @RequestBody ReportDTO dto
  ) {
    return ResponseEntity.ok(service.update(id, dto));
  }

  // Eliminar reporte (solo ADMIN)
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
