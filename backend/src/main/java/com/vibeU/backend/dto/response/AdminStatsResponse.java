package com.vibeU.backend.dto.response;

public record AdminStatsResponse(
    long totalUsers,
    long totalOrganizers,
    long totalParticipants,
    long totalEvents,
    long activeEvents,
    long closedEvents,
    long totalFaculdades,
    long totalAtleticas,
    long ticketsIssued
) {
}
