package sk.tiborgrznar.task_app.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sk.tiborgrznar.task_app.dto.AuthResponseDto;
import sk.tiborgrznar.task_app.dto.LoginRequestDto;
import sk.tiborgrznar.task_app.dto.MessageResponseDto;
import sk.tiborgrznar.task_app.dto.RegisterRequestDto;
import sk.tiborgrznar.task_app.entity.User;
import sk.tiborgrznar.task_app.exception.ResourceNotFoundException;
import sk.tiborgrznar.task_app.repository.UserRepository;
import sk.tiborgrznar.task_app.security.JwtUtil;


/**
 * Handles user registration and login. Passwords are hashed with PasswordEncoder
 * before storage and never returned. Login delegates credential verification to
 * AuthenticationManager (which uses UserDetailsServiceImpl + PasswordEncoder under
 * the hood) and issues a JWT via JwtUtil on success.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    // Rejects registration if the email is already taken, otherwise hashes the
    // password and stores a new user
    public MessageResponseDto register(RegisterRequestDto request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email is already registered");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return new MessageResponseDto("User created successfully!");
    }


    // Verifies credentials (throws BadCredentialsException on mismatch, handled
    // globally) and returns a fresh JWT plus basic user info
    public AuthResponseDto login(LoginRequestDto request) {

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        String token = jwtUtil.generateToken(request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        return new AuthResponseDto(token, user.getEmail(), user.getName());
    }
}
