package com.vibeU.backend.entity;

import com.vibeU.backend.enums.EntityStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Entity
@Table(name = "atleticas")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Atletica extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 200)
    private String nome;

    @Column(nullable = false, length = 50)
    private String sigla;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(length = 500)
    private String logo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faculdade_id", nullable = false)
    private Faculdade faculdade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    @Builder.Default
    private EntityStatus status = EntityStatus.ATIVO;

    @Column(nullable = false)
    @Builder.Default
    private Boolean featured = false;
}
