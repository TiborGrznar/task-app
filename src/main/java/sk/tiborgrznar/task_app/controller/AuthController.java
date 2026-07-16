package sk.tiborgrznar.task_app.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import sk.tiborgrznar.task_app.dto.AuthResponseDto;
import sk.tiborgrznar.task_app.dto.LoginRequestDto;
import sk.tiborgrznar.task_app.dto.MessageResponseDto;
import sk.tiborgrznar.task_app.dto.RegisterRequestDto;
import sk.tiborgrznar.task_app.service.AuthService;

/**
 * Public REST endpoints for registration and login — the only endpoints not
 * requiring a JWT (see SecurityConfig: /api/auth/** is permitAll).
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<MessageResponseDto> register(@Valid @RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDto> login(@Valid @RequestBody LoginRequestDto request) {
        return  ResponseEntity.ok(authService.login(request));
    }

}
