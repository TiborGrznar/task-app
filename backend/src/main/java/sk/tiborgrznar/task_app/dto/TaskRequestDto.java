package sk.tiborgrznar.task_app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequestDto {

    @NotBlank(message = "Task text cannot be empty")
    private String text;
}
