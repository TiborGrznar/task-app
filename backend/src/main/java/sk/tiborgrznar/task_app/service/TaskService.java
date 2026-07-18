package sk.tiborgrznar.task_app.service;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import sk.tiborgrznar.task_app.dto.TaskRequestDto;
import sk.tiborgrznar.task_app.dto.TaskResponseDto;
import sk.tiborgrznar.task_app.entity.Task;
import sk.tiborgrznar.task_app.entity.User;
import sk.tiborgrznar.task_app.exception.ResourceNotFoundException;
import sk.tiborgrznar.task_app.repository.TaskRepository;
import sk.tiborgrznar.task_app.repository.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class TaskService {

    private final UserRepository userRepository;

    private final TaskRepository taskRepository;

    public List<TaskResponseDto> getAllForUser(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        List<Task> tasks = taskRepository.findAllByUserId(user.getId());

        return tasks.stream()
                .map(TaskResponseDto::new)
                .toList();
    }

    public TaskResponseDto create(String email, TaskRequestDto request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        Task task = new Task();
        task.setText(request.getText());
        task.setUser(user);

        Task savedTask = taskRepository.save(task);

        return new TaskResponseDto(savedTask);

    }

    public TaskResponseDto markDone(String email, Long taskId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found!"));

        task.setDone(true);

        Task savedTask = taskRepository.save(task);

        return new TaskResponseDto(savedTask);
    }

    public void delete(String email,Long taskId) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found!"));

        Task task = taskRepository.findByIdAndUserId(taskId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Task not found!"));

        taskRepository.delete(task);

    }

}
