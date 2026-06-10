package com.vibeU.backend.service;

import com.vibeU.backend.dto.response.AdminStatsResponse;
import com.vibeU.backend.dto.response.ChartItemResponse;
import com.vibeU.backend.entity.Event;
import com.vibeU.backend.enums.EventStatus;
import com.vibeU.backend.enums.UserRole;
import com.vibeU.backend.repository.EventRepository;
import com.vibeU.backend.repository.FaculdadeRepository;
import com.vibeU.backend.repository.AtleticaRepository;
import com.vibeU.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatsService {

    private static final DateTimeFormatter MONTH_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM");

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final FaculdadeRepository faculdadeRepository;
    private final AtleticaRepository atleticaRepository;

    @Transactional(readOnly = true)
    public AdminStatsResponse getStats() {
        return new AdminStatsResponse(
            userRepository.count(),
            userRepository.countByRole(UserRole.ORGANIZADOR),
            userRepository.countByRole(UserRole.PARTICIPANTE),
            eventRepository.count(),
            eventRepository.countByStatus(EventStatus.PUBLICADO),
            eventRepository.countByStatus(EventStatus.ENCERRADO),
            faculdadeRepository.count(),
            atleticaRepository.count(),
            0L
        );
    }

    @Transactional(readOnly = true)
    public List<ChartItemResponse> getEventsByMonth() {
        Map<String, Long> grouped = eventRepository.findAll().stream()
            .collect(Collectors.groupingBy(
                e -> e.getEventDate().format(MONTH_FORMAT),
                LinkedHashMap::new,
                Collectors.counting()
            ));

        return grouped.entrySet().stream()
            .sorted(Map.Entry.comparingByKey())
            .map(e -> new ChartItemResponse(formatMonthLabel(e.getKey()), e.getValue()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ChartItemResponse> getUsersByRole() {
        return List.of(
            new ChartItemResponse("Administradores", userRepository.countByRole(UserRole.ADMINISTRADOR)),
            new ChartItemResponse("Organizadores", userRepository.countByRole(UserRole.ORGANIZADOR)),
            new ChartItemResponse("Participantes", userRepository.countByRole(UserRole.PARTICIPANTE))
        );
    }

    @Transactional(readOnly = true)
    public List<ChartItemResponse> getEventsByFaculdade() {
        Map<String, Long> grouped = new LinkedHashMap<>();

        for (Event event : eventRepository.findAll()) {
            event.getFaculdades().forEach(f -> {
                grouped.merge(f.getSigla(), 1L, Long::sum);
            });
        }

        return grouped.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
            .map(e -> new ChartItemResponse(e.getKey(), e.getValue()))
            .toList();
    }

    @Transactional(readOnly = true)
    public List<ChartItemResponse> getEventsByAtletica() {
        Map<String, Long> grouped = new LinkedHashMap<>();

        for (Event event : eventRepository.findAll()) {
            event.getAtleticas().forEach(a -> {
                grouped.merge(a.getSigla(), 1L, Long::sum);
            });
        }

        return grouped.entrySet().stream()
            .sorted(Map.Entry.<String, Long>comparingByValue(Comparator.reverseOrder()))
            .map(e -> new ChartItemResponse(e.getKey(), e.getValue()))
            .toList();
    }

    private String formatMonthLabel(String yyyyMm) {
        String[] parts = yyyyMm.split("-");
        if (parts.length != 2) {
            return yyyyMm;
        }
        return parts[1] + "/" + parts[0];
    }
}
