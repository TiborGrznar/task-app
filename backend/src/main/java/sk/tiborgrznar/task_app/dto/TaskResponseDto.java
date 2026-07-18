package sk.tiborgrznar.task_app.dto;

import lombok.Getter;
import lombok.Setter;
import sk.tiborgrznar.task_app.entity.Task;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskResponseDto {

    private Long id;

    private String text;

    private boolean done;

    private LocalDateTime createdAt;

    public TaskResponseDto(Task task) {
        this.id = task.getId();
        this.text = task.getText();
        this.done = task.isDone();
        this.createdAt = task.getCreatedAt();
    }
}
