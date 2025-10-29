package com.example.backend.models;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class PerformanceReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false)
    private String title;

    @Column(length=2000)
    private String description;

    @Column(nullable=false)
    private Integer score; // 1–100

    private Instant createdAt;

    @PrePersist
    void pre() { if(createdAt == null) createdAt = Instant.now(); }

    // Relación con empleado (muchos reportes a un empleado)
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="employee_id", nullable=false)
    private Employee employee;

    // Relación con departamento (opcional, puede ser null si se elimina el departamento)
    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="department_id")
    private Department department;
}