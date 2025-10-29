package com.example.backend.service;

import com.example.backend.dto.DepartmentDTO;
import com.example.backend.dto.DepartmentStatsDTO;
import com.example.backend.models.Department;
import com.example.backend.repository.DepartmentRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class DepartmentService {

  private final DepartmentRepository repo;

  public DepartmentService(DepartmentRepository repo) {
    this.repo = repo;
  }

  public DepartmentDTO create(Department d) {
    Department saved = repo.save(d);
    return toDto(saved);
  }

  public List<DepartmentDTO> all() {
    return repo.findAll().stream().map(this::toDto).toList();
  }

  public DepartmentDTO update(Long id, Department d) {
    Department dept = repo.findById(id).orElseThrow();
    dept.setName(d.getName());
    dept.setDescription(d.getDescription());
    Department updated = repo.save(dept);
    return toDto(updated);
  }

  public void delete(Long id) {
    repo.deleteById(id);
  }

  private DepartmentDTO toDto(Department d) {
    return DepartmentDTO.builder()
      .id(d.getId())
      .name(d.getName())
      .description(d.getDescription())
      .createdAt(d.getCreatedAt() != null ? d.getCreatedAt().toString() : null)
      .build();
  }

  public List<DepartmentStatsDTO> stats() {
    return repo
      .findAll()
      .stream()
      .map(d ->
        new DepartmentStatsDTO(
          d.getId(),
          d.getName(),
          d.getEmployees() != null ? d.getEmployees().size() : 0
        )
      )
      .toList();
  }
}
