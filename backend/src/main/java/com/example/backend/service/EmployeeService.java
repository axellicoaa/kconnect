package com.example.backend.service;

import com.example.backend.dto.EmployeeDTO;
import com.example.backend.models.Employee;
import com.example.backend.repository.EmployeeRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class EmployeeService {

  private final EmployeeRepository repo;

  public EmployeeService(EmployeeRepository repo) {
    this.repo = repo;
  }

  public Employee create(Employee e) {
    return repo.save(e);
  }

  public List<EmployeeDTO> findAll() {
    return repo.findAll().stream().map(this::toDto).toList();
  }

  public Optional<EmployeeDTO> findOne(Long id) {
    return repo.findById(id).map(this::toDto);
  }

  public Optional<Employee> findEntityById(Long id) { // 👈 para /{id}
    return repo.findById(id);
  }

  //Eliminar empleado
  public void delete(Long id) {
    repo.deleteById(id);
  }

  public EmployeeDTO update(Long id, EmployeeDTO dto) {
    Employee emp = repo.findById(id).orElseThrow();

    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    String currentUser = auth.getName();
    boolean isAdmin = auth
      .getAuthorities()
      .stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    if (!isAdmin && !emp.getEmail().equals(currentUser)) {
      throw new RuntimeException("No autorizado");
    }

    emp.setFullName(dto.getFullName());
    // TODO: si recibes departmentId aquí, cargar y setear
    repo.save(emp);
    return toDto(emp);
  }

  // 👇 hazlo public
  public EmployeeDTO toDto(Employee e) {
    return EmployeeDTO.builder()
      .id(e.getId())
      .fullName(e.getFullName())
      .email(e.getEmail())
      .role(e.getRole().name())
      .hireDate(e.getHireDate())
      .departmentId(
        e.getDepartment() != null ? e.getDepartment().getId() : null
      )
      .departmentName(
        e.getDepartment() != null ? e.getDepartment().getName() : null
      )
      .build();
  }
}
