package com.example.backend.repository;

import com.example.backend.models.Employee;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
  Optional<Employee> findByEmail(String email);
  Optional<Employee> findEntityById(Long id);
}
