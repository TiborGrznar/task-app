package sk.tiborgrznar.task_app.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import sk.tiborgrznar.task_app.dto.TaskRequestDto;
import sk.tiborgrznar.task_app.dto.TaskResponseDto;
import sk.tiborgrznar.task_app.service.TaskService;
import java.util.List;

/**
 * REST endpoints for managing the logged-in user's tasks. All operations are
 * scoped to the authenticated user — authentication.getName() returns their
 * email (set by JwtAuthFilter). Ownership checks happen in TaskService, not here.
 */
@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @GetMapping
    public ResponseEntity<List<TaskResponseDto>> getAll(Authentication authentication) {
        return ResponseEntity.ok(taskService.getAllForUser(authentication.getName()));
    }

    @PostMapping
    public ResponseEntity<TaskResponseDto> create(Authentication authentication,
                                                  @Valid @RequestBody TaskRequestDto request) {
        return ResponseEntity.ok(taskService.create(authentication.getName(), request));
    }

    @PatchMapping("/{id}/done")
    public ResponseEntity<TaskResponseDto> markDone(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(taskService.markDone(authentication.getName(), id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        taskService.delete(authentication.getName(), id);
        return ResponseEntity.noContent().build();
    }
}
