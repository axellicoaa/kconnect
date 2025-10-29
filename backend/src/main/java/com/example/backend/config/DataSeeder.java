package com.example.backend.config;

import com.example.backend.entity.Role;
import com.example.backend.models.Department;
import com.example.backend.models.Employee;
import com.example.backend.repository.DepartmentRepository;
import com.example.backend.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataSeeder {

  @Bean
  CommandLineRunner initData(
    EmployeeRepository empRepo,
    DepartmentRepository depRepo,
    PasswordEncoder encoder
  ) {
    return args -> {
      // Departamento por defecto
      Department dept;
      if (depRepo.count() == 0) {
        dept = new Department();
        dept.setName("General");
        dept.setDescription("Departamento inicial");
        depRepo.save(dept);
      } else {
        dept = depRepo.findAll().get(0);
      }

      // Admin inicial
      if (empRepo.findByEmail("admin@kconnect.io").isEmpty()) {
        Employee admin = Employee.builder()
          .fullName("Admin KConnect")
          .email("admin@kconnect.io")
          .password(encoder.encode("admin123"))
          .role(Role.ADMIN)
          .department(dept)
          .build();
        empRepo.save(admin);

        System.out.println("✅ Admin creado: admin@kconnect.io / admin123");
      }
    };
  }
}
