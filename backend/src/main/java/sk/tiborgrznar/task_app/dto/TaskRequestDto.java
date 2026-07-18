package sk.tiborgrznar.task_app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TaskRequestDto {

    @NotBlank
    private String text;
}
