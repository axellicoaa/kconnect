package com.example.backend.controller;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.RegisterRequest;
import com.example.backend.entity.Role;
import com.example.backend.models.Employee;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.EmployeeRepository;
import com.example.backend.security.JwtService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

  private final AuthenticationManager authManager;
  private final JwtService jwtService;
  private final EmployeeRepository employeeRepo;
  private final DepartmentRepository departmentRepo;
  private final PasswordEncoder encoder;

  public AuthController(
    AuthenticationManager authManager,
    JwtService jwtService,
    EmployeeRepository employeeRepo,
    DepartmentRepository departmentRepo,
    PasswordEncoder encoder
  ) {
    this.authManager = authManager;
    this.jwtService = jwtService;
    this.employeeRepo = employeeRepo;
    this.departmentRepo = departmentRepo;
    this.encoder = encoder;
  }

  @PostMapping("/register")
  public ResponseEntity<AuthResponse> register(
    @Valid @RequestBody RegisterRequest request
  ) {
    if (employeeRepo.findByEmail(request.getEmail()).isPresent()) {
      return ResponseEntity.status(HttpStatus.CONFLICT).body(
        new AuthResponse("El correo ya está en uso")
      );
    }

    var emp = Employee.builder()
      .fullName(request.getFullName())
      .email(request.getEmail())
      .password(encoder.encode(request.getPassword()))
      .role(request.getRole() != null ? request.getRole() : Role.EMPLOYEE)
      .build();

    if (request.getDepartmentId() != null) {
      emp.setDepartment(
        departmentRepo
          .findById(request.getDepartmentId())
          .orElseThrow(() -> new RuntimeException("Departamento no encontrado"))
      );
    }

    employeeRepo.save(emp);
    var token = jwtService.generate(emp); // 👈 usa el objeto Employee
    return ResponseEntity.ok(new AuthResponse(token));
  }

  @PostMapping("/login")
  public ResponseEntity<AuthResponse> login(
    @Valid @RequestBody AuthRequest request
  ) {
    Authentication auth = authManager.authenticate(
      new UsernamePasswordAuthenticationToken(
        request.getEmail(),
        request.getPassword()
      )
    );
    var emp = employeeRepo
      .findByEmail(auth.getName())
      .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

    var token = jwtService.generate(emp); // 👈 idem
    return ResponseEntity.ok(new AuthResponse(token));
  }
}
