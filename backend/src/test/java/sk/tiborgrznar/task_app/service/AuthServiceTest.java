package sk.tiborgrznar.task_app.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import sk.tiborgrznar.task_app.dto.AuthResponseDto;
import sk.tiborgrznar.task_app.dto.LoginRequestDto;
import sk.tiborgrznar.task_app.dto.MessageResponseDto;
import sk.tiborgrznar.task_app.dto.RegisterRequestDto;
import sk.tiborgrznar.task_app.entity.User;
import sk.tiborgrznar.task_app.repository.UserRepository;
import sk.tiborgrznar.task_app.security.JwtUtil;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_savesNewUser_whenEmailNotTaken() {
        // Arrange
        RegisterRequestDto request = new RegisterRequestDto();
        request.setEmail("new@test.com");
        request.setPassword("password123");
        request.setName("Test User");

        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("hashedPassword");

        // Act
        MessageResponseDto response = authService.register(request);

        // Assert
        assertEquals("User created successfully!", response.getMessage());
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_throwsException_whenEmailAlreadyTaken() {
        // Arrange
        RegisterRequestDto request = new RegisterRequestDto();
        request.setEmail("existing@test.com");
        request.setPassword("password123");
        request.setName("Test User");

        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> authService.register(request));

        // The user should never be saved if registration was rejected
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_returnsAuthResponse_whenCredentialsValid() {
        // Arrange
        LoginRequestDto request = new LoginRequestDto();
        request.setEmail("test@test.com");
        request.setPassword("password123");

        User user = new User();
        user.setEmail("test@test.com");
        user.setName("Test User");

        when(jwtUtil.generateToken("test@test.com")).thenReturn("fake-jwt-token");
        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));

        // Act
        AuthResponseDto response = authService.login(request);

        // Assert
        assertEquals("fake-jwt-token", response.getToken());
        assertEquals("test@test.com", response.getEmail());
        assertEquals("Test User", response.getName());
    }

    @Test
    void login_throwsException_whenCredentialsInvalid() {
        // Arrange
        LoginRequestDto request = new LoginRequestDto();
        request.setEmail("test@test.com");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(BadCredentialsException.class, () -> authService.login(request));
    }

}