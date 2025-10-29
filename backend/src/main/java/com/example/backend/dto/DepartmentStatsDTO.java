package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DepartmentStatsDTO {

  private Long id;
  private String name;
  private int employeeCount;
}
