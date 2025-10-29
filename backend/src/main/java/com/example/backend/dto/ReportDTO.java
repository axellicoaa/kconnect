package com.example.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class ReportDTO {

  @NotNull
  private Long id;

  @NotBlank
  private String title;

  @NotBlank
  private String description;

  @NotNull
  private Integer score;

  @NotNull
  private Long employeeId;

  @NotNull
  private Long departmentId;

  @NotBlank
  private String createdAt;

  @NotBlank
  private String employeeName;

  @NotBlank
  private String departmentName;
}
