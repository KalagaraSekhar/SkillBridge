package com.internx.gateway.filter;

import com.internx.common.security.JwtUtils;
import io.jsonwebtoken.Claims;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private static final List<String> OPEN_API_ENDPOINTS = List.of(
            "/api/auth/register",
            "/api/auth/verify-otp",
            "/api/auth/send-otp",
            "/api/auth/resend-otp",
            "/api/auth/login",
            "/api/auth/demo-login",
            "/api/auth/google",
            "/api/auth/google/init",
            "/api/auth/debug/user",
            "/eureka",
            "/actuator"
    );

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getURI().getPath();

        // Allow open auth endpoints and GET requests to public listings
        if (isSecured(request)) {
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);
            if (!JwtUtils.validateToken(token)) {
                return onError(exchange, "Invalid or Expired JWT Token", HttpStatus.UNAUTHORIZED);
            }

            try {
                Claims claims = JwtUtils.extractClaims(token);
                String userId = (String) claims.get("userId");
                String role = (String) claims.get("role");

                if (role == null || role.isBlank()) {
                    return onError(exchange, "Forbidden: Missing role claim in JWT token", HttpStatus.FORBIDDEN);
                }

                // Role-based route authorization at API Gateway level
                if (path.startsWith("/api/admin") && !"ADMIN".equalsIgnoreCase(role)) {
                    return onError(exchange, "Forbidden: Admin privilege required for this resource", HttpStatus.FORBIDDEN);
                }

                if (path.startsWith("/api/company") && !"COMPANY".equalsIgnoreCase(role) && !"ADMIN".equalsIgnoreCase(role)) {
                    return onError(exchange, "Forbidden: Company privilege required for this resource", HttpStatus.FORBIDDEN);
                }

                // Inject authenticated headers to downstream microservices
                ServerHttpRequest modifiedRequest = request.mutate()
                        .header("X-User-Id", userId != null ? userId : "")
                        .header("X-User-Role", role)
                        .build();

                return chain.filter(exchange.mutate().request(modifiedRequest).build());
            } catch (Exception e) {
                return onError(exchange, "Failed to parse JWT claims", HttpStatus.UNAUTHORIZED);
            }
        }

        return chain.filter(exchange);
    }

    private boolean isSecured(ServerHttpRequest request) {
        String path = request.getURI().getPath();
        String method = request.getMethod().name();

        // Allow GET /api/internships without authentication
        if (path.startsWith("/api/internships") && "GET".equalsIgnoreCase(method)) {
            return false;
        }

        return OPEN_API_ENDPOINTS.stream().noneMatch(path::startsWith);
    }

    private Mono<Void> onError(ServerWebExchange exchange, String err, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        return response.setComplete();
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
