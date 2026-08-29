package com.internx.application.client;

import com.internx.common.dto.ApiResponse;
import com.internx.common.dto.InternshipDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

@FeignClient(name = "internship-service")
public interface InternshipClient {

    @GetMapping("/api/internships/{id}")
    InternshipDto getInternshipById(@PathVariable("id") String id);

    @PostMapping("/api/internships/{id}/allocate-seat")
    ApiResponse<Boolean> allocateSeat(@PathVariable("id") String id);
}
