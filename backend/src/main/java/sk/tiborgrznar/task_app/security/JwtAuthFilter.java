package sk.tiborgrznar.task_app.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

/**
 * Runs once per incoming HTTP request. Reads the JWT from the Authorization header,
 * validates it, and if valid, marks the request as authenticated in Spring Security's
 * SecurityContext so SecurityConfig and controllers know who's making the request.
 * Requests without a valid token are simply passed through unauthenticated —
 * SecurityConfig decides afterward whether the target endpoint requires authentication.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No token present at all -> nothing to authenticate, let the request continue as-is
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // strip the "Bearer " prefix
        String email = null;

        try {
            email = jwtUtil.extractEmail(token);
        } catch (Exception ignored) {
            // Malformed/tampered token -> leave email null, request stays unauthenticated

        }

        // Only authenticate if we got a usable email and nothing has authenticated this request yet
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);

            if (jwtUtil.isTokenValid(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // This is what actually marks the request as authenticated for the rest of the app
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Always continue the filter chain, authenticated or not
        filterChain.doFilter(request, response);

    }
}
