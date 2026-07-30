package sk.tiborgrznar.task_app.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sk.tiborgrznar.task_app.dto.TaskRequestDto;
import sk.tiborgrznar.task_app.dto.TaskResponseDto;
import sk.tiborgrznar.task_app.entity.Task;
import sk.tiborgrznar.task_app.entity.User;
import sk.tiborgrznar.task_app.exception.ResourceNotFoundException;
import sk.tiborgrznar.task_app.repository.TaskRepository;
import sk.tiborgrznar.task_app.repository.UserRepository;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TaskRepository taskRepository;

    @InjectMocks
    private TaskService taskService;

    @Test
    void getAllForUser_returnsTasks_whenUserExists() {
        // Arrange
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        Task task = new Task();
        task.setId(10L);
        task.setText("Buy groceries");
        task.setUser(user);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findAllByUserId(1L)).thenReturn(List.of(task));

        // Act
        List<TaskResponseDto> result = taskService.getAllForUser("test@test.com");

        // Assert
        assertEquals(1, result.size());
        assertEquals("Buy groceries", result.get(0).getText());
    }

    @Test
    void getAllForUser_throwsException_whenUserNotFound() {
        when(userRepository.findByEmail("missing@test.com")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.getAllForUser("missing@test.com"));
    }

    @Test
    void create_savesTaskWithCorrectUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        TaskRequestDto request = new TaskRequestDto();
        request.setText("New task");

        Task savedTask = new Task();
        savedTask.setId(5L);
        savedTask.setText("New task");
        savedTask.setUser(user);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.save(any(Task.class))).thenReturn(savedTask);

        TaskResponseDto response = taskService.create("test@test.com", request);

        assertEquals("New task", response.getText());
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void markDone_setsTaskDone_whenTaskExists() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        Task task = new Task();
        task.setId(10L);
        task.setText("Buy groceries");
        task.setUser(user);
        task.setDone(false);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDto response = taskService.markDone("test@test.com", 10L);

        assertTrue(response.isDone());
    }

    @Test
    void markDone_throwsException_whenTaskNotFound() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.markDone("test@test.com", 99L));
    }

    @Test
    void unmarkDone_setsTaskNotDone_whenTaskExists() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        Task task = new Task();
        task.setId(10L);
        task.setText("Buy groceries");
        task.setUser(user);
        task.setDone(true);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(task);

        TaskResponseDto response = taskService.unmarkDone("test@test.com", 10L);

        assertFalse(response.isDone());
    }

    @Test
    void delete_removesTask_whenTaskExists() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        Task task = new Task();
        task.setId(10L);
        task.setUser(user);

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(10L, 1L)).thenReturn(Optional.of(task));

        taskService.delete("test@test.com", 10L);

        verify(taskRepository).delete(task);
    }

    @Test
    void delete_throwsException_whenTaskNotFound() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@test.com");

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(taskRepository.findByIdAndUserId(99L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> taskService.delete("test@test.com", 99L));
    }
}