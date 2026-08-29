package com.internx.notification.consumer;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.internx.notification.service.EmailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
public class KafkaNotificationConsumer {

    private static final Logger log = LoggerFactory.getLogger(KafkaNotificationConsumer.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private EmailService emailService;

    @KafkaListener(topics = "otp-events", groupId = "notification-group")
    public void consumeOtpEvent(String message) {
        try {
            log.info("Received OTP event from Kafka: {}", message);
            JsonNode node = objectMapper.readTree(message);
            String email = node.get("email").asText();
            String otp = node.get("otp").asText();

            emailService.sendOtpEmail(email, otp);
        } catch (Exception e) {
            log.error("Failed to process OTP event", e);
        }
    }

    @KafkaListener(topics = "application-status-events", groupId = "notification-group")
    public void consumeApplicationStatusEvent(String message) {
        try {
            log.info("Received Application Status event from Kafka: {}", message);
            JsonNode node = objectMapper.readTree(message);
            String email = node.get("studentEmail").asText();
            String applicationId = node.get("applicationId").asText();
            String status = node.get("status").asText();

            emailService.sendStatusUpdateEmail(email, applicationId, status);
        } catch (Exception e) {
            log.error("Failed to process Application Status event", e);
        }
    }
}
