package sk.tiborgrznar.task_app.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sk.tiborgrznar.task_app.entity.Task;
import sk.tiborgrznar.task_app.entity.User;

import java.util.List;
import java.util.Optional;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findAllByUserId(Long userId);

    Optional<Task> findByIdAndUserId(Long taskId, Long userId);
}
