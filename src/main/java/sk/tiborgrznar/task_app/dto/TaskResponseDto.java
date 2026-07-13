package sk.tiborgrznar.task_app.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class TaskResponseDto {

    private Long id;

    private String text;

    private boolean done;

    private LocalDateTime createdAt;
}
