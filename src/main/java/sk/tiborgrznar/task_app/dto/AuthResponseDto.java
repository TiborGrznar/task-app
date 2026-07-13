package sk.tiborgrznar.task_app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AuthResponseDto {

    private String token;

    private String email;

    private String name;

}
