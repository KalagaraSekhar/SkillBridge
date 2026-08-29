package com.internx.notification.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${MAIL_SENDER_EMAIL:verify@internx.dev}")
    private String senderEmail;

    @Value("${MAIL_SENDER_NAME:InternX Security}")
    private String senderName;

    @Value("${SENDGRID_API_KEY:}")
    private String sendgridApiKey;

    public void sendOtpEmail(String toEmail, String otpCode) {
        String subject = "InternX — Your 6-Digit Verification Code: " + otpCode;
        String htmlContent = buildOtpTemplate(otpCode);

        // Pre-send diagnostic log
        log.info(">> [EmailService PRE-SEND] Initiating dispatch of 6-digit OTP [{}] to target inbox: <{}> (Sender: {} <{}>)",
                otpCode, toEmail, senderName, senderEmail);

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(toEmail);
                helper.setFrom(senderEmail, senderName);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);

                // Dispatch via SMTP / Email Provider
                mailSender.send(message);

                // Post-send delivery confirmation log
                log.info(">> [EmailService POST-SEND CONFIRMED] Provider confirmed OTP email delivery to target inbox: <{}>", toEmail);
            } catch (Exception e) {
                // Log actual provider error and throw exception to prevent silent failures
                log.error(">> [EmailService POST-SEND ERROR] Email provider dispatch rejected for <{}>. Reason: {}",
                        toEmail, e.getMessage(), e);
                throw new RuntimeException("Email provider delivery failed: " + e.getMessage(), e);
            }
        } else {
            // If JavaMailSender is not initialized in dev, log warning
            log.warn(">> [EmailService WARNING] JavaMailSender is not configured in Spring context. (Target: <{}>, OTP: {})", toEmail, otpCode);
        }
    }

    public void sendStatusUpdateEmail(String toEmail, String applicationId, String newStatus) {
        String subject = "InternX — Update on Your Internship Application (" + newStatus + ")";
        String htmlContent = buildStatusTemplate(applicationId, newStatus);

        log.info(">> [EmailService PRE-SEND] Sending application status update email to <{}> (status: {})", toEmail, newStatus);

        if (mailSender != null) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setTo(toEmail);
                helper.setFrom(senderEmail, senderName);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info(">> [EmailService POST-SEND CONFIRMED] Status update email delivered to <{}>", toEmail);
            } catch (Exception e) {
                log.error(">> [EmailService POST-SEND ERROR] Status update email failed for <{}>: {}", toEmail, e.getMessage(), e);
            }
        }
    }

    private String buildOtpTemplate(String otpCode) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 24px; color: #1F1F29; }
                .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E8E6DF; padding: 36px; box-shadow: 0 8px 24px -4px rgba(46, 42, 107, 0.08); }
                .logo { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #2E2A6B; margin-bottom: 20px; }
                .logo span { color: #FF6B5E; }
                .code-box { background: #F4F3FB; border: 2px dashed #2E2A6B; border-radius: 16px; text-align: center; padding: 20px; margin: 24px 0; }
                .code { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; color: #2E2A6B; letter-spacing: 6px; }
                .note { font-size: 13px; color: #6B6B7B; line-height: 1.6; }
                .footer { text-align: center; font-size: 11px; color: #6B6B7B; margin-top: 24px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">Intern<span>X</span></div>
                <h2 style="font-family: 'Sora', sans-serif; color: #1F1F29; margin-top: 0;">Verify Your Email Address</h2>
                <p class="note">Use this 6-digit one-time passcode to complete your InternX student account registration. This code expires in <strong>5 minutes</strong>.</p>
                <div class="code-box">
                  <div class="code">%s</div>
                </div>
                <p class="note">If you did not initiate this request, you can safely ignore this message.</p>
              </div>
              <div class="footer">
                &copy; 2026 InternX Platform &bull; Where Students Meet Real Experience
              </div>
            </body>
            </html>
            """.formatted(otpCode);
    }

    private String buildStatusTemplate(String appId, String status) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="UTF-8">
              <style>
                body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #FAF9F6; margin: 0; padding: 24px; color: #1F1F29; }
                .card { max-width: 520px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid #E8E6DF; padding: 36px; }
                .logo { font-family: 'Sora', sans-serif; font-size: 22px; font-weight: 800; color: #2E2A6B; }
                .status-chip { display: inline-block; background: #1FAE8B; color: #FFFFFF; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="card">
                <div class="logo">Intern<span style="color:#FF6B5E;">X</span></div>
                <h3>Application Status Changed</h3>
                <p>Your application status is now:</p>
                <div class="status-chip">%s</div>
                <p style="margin-top: 20px; font-size: 13px; color: #6B6B7B;">Log into your InternX Student Dashboard to review any feedback or next steps.</p>
              </div>
            </body>
            </html>
            """.formatted(status);
    }
}
