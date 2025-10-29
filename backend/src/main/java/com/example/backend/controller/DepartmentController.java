package com.example.backend.controller;

import com.example.backend.dto.DepartmentDTO;
import com.example.backend.dto.DepartmentStatsDTO;
import com.example.backend.models.Department;
import com.example.backend.service.DepartmentService;
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
@RequestMapping("/departments")
public class DepartmentController {

  private final DepartmentService service;

  public DepartmentController(DepartmentService service) {
    this.service = service;
  }

  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DepartmentDTO> create(@RequestBody Department d) {
    return ResponseEntity.ok(service.create(d));
  }

  @GetMapping
  public List<DepartmentDTO> all() {
    return service.all();
  }

  @PutMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<DepartmentDTO> update(
    @PathVariable Long id,
    @RequestBody Department d
  ) {
    return ResponseEntity.ok(service.update(id, d));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/stats")
  public List<DepartmentStatsDTO> stats() {
    return service.stats();
  }
}
