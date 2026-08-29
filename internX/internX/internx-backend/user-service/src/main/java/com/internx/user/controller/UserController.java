package com.internx.user.controller;

import com.internx.common.dto.ApiResponse;
import com.internx.common.dto.UserDto;
import com.internx.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(@RequestHeader(value = "X-User-Id", defaultValue = "usr-1") String userId) {
        UserDto userDto = userService.getUserById(userId);
        return ResponseEntity.ok(ApiResponse.ok("User profile retrieved.", userDto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable String id) {
        UserDto userDto = userService.getUserById(id);
        return ResponseEntity.ok(ApiResponse.ok("User found.", userDto));
    }
}
