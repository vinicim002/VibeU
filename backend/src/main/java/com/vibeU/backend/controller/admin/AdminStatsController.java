package com.vibeU.backend.controller.admin;

import com.vibeU.backend.dto.response.AdminStatsResponse;
import com.vibeU.backend.dto.response.ApiResponse;
import com.vibeU.backend.dto.response.ChartItemResponse;
import com.vibeU.backend.service.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/stats")
@PreAuthorize("hasRole('ADMINISTRADOR')")
@RequiredArgsConstructor
public class AdminStatsController {

    private final AdminStatsService adminStatsService;

    @GetMapping
    public ApiResponse<AdminStatsResponse> getStats() {
        return ApiResponse.success(adminStatsService.getStats());
    }

    @GetMapping("/charts/events-by-month")
    public ApiResponse<List<ChartItemResponse>> eventsByMonth() {
        return ApiResponse.success(adminStatsService.getEventsByMonth());
    }

    @GetMapping("/charts/users-by-role")
    public ApiResponse<List<ChartItemResponse>> usersByRole() {
        return ApiResponse.success(adminStatsService.getUsersByRole());
    }

    @GetMapping("/charts/events-by-faculdade")
    public ApiResponse<List<ChartItemResponse>> eventsByFaculdade() {
        return ApiResponse.success(adminStatsService.getEventsByFaculdade());
    }

    @GetMapping("/charts/events-by-atletica")
    public ApiResponse<List<ChartItemResponse>> eventsByAtletica() {
        return ApiResponse.success(adminStatsService.getEventsByAtletica());
    }
}
