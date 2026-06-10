package com.vibeU.backend.config;

import com.vibeU.backend.entity.Atletica;
import com.vibeU.backend.entity.Faculdade;
import com.vibeU.backend.entity.User;
import com.vibeU.backend.enums.EntityStatus;
import com.vibeU.backend.enums.UserRole;
import com.vibeU.backend.repository.AtleticaRepository;
import com.vibeU.backend.repository.FaculdadeRepository;
import com.vibeU.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final UserRepository userRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final AtleticaRepository atleticaRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        seedUsers();
        seedInstitutions();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        log.info("Seeding default users...");

        userRepository.save(User.builder()
            .name("Admin VibeU")
            .email("admin@vibeu.edu")
            .passwordHash(passwordEncoder.encode("Admin123"))
            .role(UserRole.ADMINISTRADOR)
            .status(EntityStatus.ATIVO)
            .phone("(11) 99999-0001")
            .bio("Administrador da plataforma VibeU")
            .build());

        userRepository.save(User.builder()
            .name("Carlos Organizador")
            .email("org@vibeu.edu")
            .passwordHash(passwordEncoder.encode("Org12345"))
            .role(UserRole.ORGANIZADOR)
            .status(EntityStatus.ATIVO)
            .phone("(11) 98888-0002")
            .bio("Organizador de eventos universitários")
            .build());

        userRepository.save(User.builder()
            .name("Ana Participante")
            .email("part@vibeu.edu")
            .passwordHash(passwordEncoder.encode("Part1234"))
            .role(UserRole.PARTICIPANTE)
            .status(EntityStatus.ATIVO)
            .phone("(11) 97777-0003")
            .bio("Estudante apaixonada por eventos")
            .build());
    }

    private void seedInstitutions() {
        if (faculdadeRepository.count() > 0) {
            return;
        }

        log.info("Seeding faculdades and atleticas...");

        Faculdade usp = faculdadeRepository.save(Faculdade.builder()
            .nome("Universidade de São Paulo")
            .sigla("USP")
            .cidade("São Paulo")
            .estado("SP")
            .logo(logo("USP"))
            .status(EntityStatus.ATIVO)
            .featured(true)
            .build());

        Faculdade unesp = faculdadeRepository.save(Faculdade.builder()
            .nome("Universidade Estadual Paulista")
            .sigla("UNESP")
            .cidade("São Paulo")
            .estado("SP")
            .logo(logo("UNESP"))
            .status(EntityStatus.ATIVO)
            .build());

        Faculdade unicamp = faculdadeRepository.save(Faculdade.builder()
            .nome("Universidade Estadual de Campinas")
            .sigla("UNICAMP")
            .cidade("Campinas")
            .estado("SP")
            .logo(logo("UNICAMP"))
            .status(EntityStatus.ATIVO)
            .featured(true)
            .build());

        Faculdade ufmg = faculdadeRepository.save(Faculdade.builder()
            .nome("Universidade Federal de Minas Gerais")
            .sigla("UFMG")
            .cidade("Belo Horizonte")
            .estado("MG")
            .logo(logo("UFMG"))
            .status(EntityStatus.ATIVO)
            .featured(true)
            .build());

        Faculdade puc = faculdadeRepository.save(Faculdade.builder()
            .nome("PUC-SP")
            .sigla("PUC")
            .cidade("São Paulo")
            .estado("SP")
            .logo(logo("PUC"))
            .status(EntityStatus.ATIVO)
            .build());

        atleticaRepository.save(Atletica.builder()
            .nome("AAA Medicina USP")
            .sigla("AAA Med USP")
            .descricao("Atlética Acadêmica de Medicina da USP")
            .logo(logo("AAA"))
            .faculdade(usp)
            .status(EntityStatus.ATIVO)
            .featured(true)
            .build());

        atleticaRepository.save(Atletica.builder()
            .nome("AAA Medicina UNESP")
            .sigla("AAA Med UNESP")
            .descricao("Atlética Acadêmica de Medicina da UNESP")
            .logo(logo("AAA"))
            .faculdade(unesp)
            .status(EntityStatus.ATIVO)
            .build());

        atleticaRepository.save(Atletica.builder()
            .nome("Atlética de Engenharia UNICAMP")
            .sigla("ATL Eng")
            .descricao("Atlética dos cursos de Engenharia")
            .logo(logo("ENG"))
            .faculdade(unicamp)
            .status(EntityStatus.ATIVO)
            .build());

        atleticaRepository.save(Atletica.builder()
            .nome("Imperial Atlética UFMG")
            .sigla("Imperial")
            .descricao("Uma das maiores atléticas do Brasil")
            .logo(logo("IMP"))
            .faculdade(ufmg)
            .status(EntityStatus.ATIVO)
            .featured(true)
            .build());

        atleticaRepository.save(Atletica.builder()
            .nome("Atlética Ciências Sociais PUC")
            .sigla("ATL PUC")
            .descricao("Atlética de Ciências Sociais")
            .logo(logo("PUC"))
            .faculdade(puc)
            .status(EntityStatus.ATIVO)
            .build());
    }

    private String logo(String sigla) {
        return "https://ui-avatars.com/api/?name=" + sigla + "&background=6D28D9&color=fff&size=128&bold=true";
    }
}
