package com.example.backend.dto;
import com.example.backend.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class RegisterRequest {
  @NotBlank 
  private String fullName;
  @Email @NotBlank 
  private String email;
  @NotBlank @Size(min=8) 
  private String password;
  @NotNull 
  private Role role; // ADMIN o EMPLOYEE
  private Long departmentId; // opcional al registrarse
}