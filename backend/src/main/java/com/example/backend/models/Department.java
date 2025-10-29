package com.example.backend.models;

import java.time.Instant;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true)
    private String name;

    private String description;

    private Instant createdAt;

    @PrePersist
    void pre() { if(createdAt == null) createdAt = Instant.now(); }

    // Relación bidireccional con empleados
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<Employee> employees;

    // Relación bidireccional con reportes
    @OneToMany(mappedBy = "department", cascade = CascadeType.ALL, orphanRemoval = false)
    private List<PerformanceReport> reports;
}