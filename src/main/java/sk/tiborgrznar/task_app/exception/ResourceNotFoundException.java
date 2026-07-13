package sk.tiborgrznar.task_app.exception;

/**
 * Thrown when an entity (User, Task) doesn't exist in the database,
 * or when a task doesn't belong to the currently authenticated user
 * (ownership check). Caught by GlobalExceptionHandler and turned into
 * an HTTP 404 response.
 */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
