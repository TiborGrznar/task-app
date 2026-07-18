package sk.tiborgrznar.task_app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import sk.tiborgrznar.task_app.dto.MessageResponseDto;

/**
 * Catches exceptions thrown anywhere in the app and turns them into consistent
 * JSON error responses with appropriate HTTP status codes, instead of raw
 * stack traces or a generic 500.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Entity/task not found, or task doesn't belong to the requesting user -> 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<MessageResponseDto> handleNotFound(ResourceNotFoundException exception) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(new MessageResponseDto(exception.getMessage()));
    }

    // Login failed. Message is intentionally generic (not exception.getMessage())
    // so we don't reveal whether the email exists or just the password was wrong

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponseDto> handleBadCredentials(BadCredentialsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new MessageResponseDto("Invalid email or password!"));
    }

    // Our own validation failures, e.g. registering with an already-used email
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<MessageResponseDto> handleIllegalArgument(IllegalArgumentException exception) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponseDto(exception.getMessage()));
    }

    // Bean Validation (@Valid) failures, e.g. blank task text or malformed email.
    // Only the first field error is returned to keep the response simple.
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<MessageResponseDto> handleValidation(MethodArgumentNotValidException exception) {
        String message = exception.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .orElse("Validation error!");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new MessageResponseDto(message));
    }
}
