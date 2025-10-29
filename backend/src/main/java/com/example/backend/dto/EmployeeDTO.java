package com.example.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EmployeeDTO {

  @NotNull
  private Long id;

  @NotBlank
  private String fullName;

  @Email
  private String email;

  @NotBlank
  private String role;

  @NotNull
  private LocalDate hireDate;

  @NotNull
  private Long departmentId;

  @NotBlank
  private String departmentName;
}
