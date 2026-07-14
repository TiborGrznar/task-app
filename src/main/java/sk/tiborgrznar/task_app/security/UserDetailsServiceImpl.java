package sk.tiborgrznar.task_app.security;


import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import sk.tiborgrznar.task_app.entity.User;
import sk.tiborgrznar.task_app.repository.UserRepository;

import java.util.Collections;


/**
 * Bridges our own User entity/UserRepository with Spring Security's UserDetailsService
 * contract. Called by AuthenticationManager during login to look up a user and
 * verify their password.
 */
@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Loads a user by email (used as the "username" in this app) and wraps it into
     * a Spring Security UserDetails object. Throws if no user with that email exists.
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));


        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(Collections.emptyList())
                .build();
    }

}
