package com.example.backend.controller;

import com.example.backend.dto.EmployeeDTO;
import com.example.backend.models.Employee;
import com.example.backend.service.EmployeeService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/employees")
public class EmployeeController {

  private final EmployeeService service;

  public EmployeeController(EmployeeService service) {
    this.service = service;
  }

  // Crear empleado (solo ADMIN)
  @PostMapping
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<EmployeeDTO> create(@RequestBody Employee e) {
    Employee saved = service.create(e);
    return ResponseEntity.ok(service.findOne(saved.getId()).orElseThrow());
  }

  // Listar empleados (solo ADMIN)
  @GetMapping
  @PreAuthorize("hasRole('ADMIN')")
  public List<EmployeeDTO> all() {
    return service.findAll();
  }

  // Ver perfil por ID (ADMIN o dueño)
  @GetMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
  public ResponseEntity<EmployeeDTO> one(@PathVariable Long id) {
    Authentication auth = SecurityContextHolder.getContext()
      .getAuthentication();
    String email = auth.getName();
    boolean isAdmin = auth
      .getAuthorities()
      .stream()
      .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    var empOpt = service.findEntityById(id);
    if (empOpt.isEmpty()) return ResponseEntity.notFound().build();

    var emp = empOpt.get();
    if (!isAdmin && !emp.getEmail().equals(email)) {
      return ResponseEntity.status(403).build();
    }
    return ResponseEntity.ok(service.toDto(emp));
  }

  // Actualizar perfil (propio o ADMIN)
  @PutMapping("/{id}")
  @PreAuthorize("hasAnyRole('ADMIN','EMPLOYEE')")
  public ResponseEntity<EmployeeDTO> update(
    @PathVariable Long id,
    @RequestBody EmployeeDTO dto
  ) {
    return ResponseEntity.ok(service.update(id, dto));
  }

  //Eliminar empleado
  @DeleteMapping("/{id}")
  @PreAuthorize("hasRole('ADMIN')")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
