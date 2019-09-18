package com.barbosa.todo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.barbosa.todo.repository")
@EntityScan("model")
public class AppBootstrap {
	public static void main(String[] args) {
		SpringApplication.run(AppBootstrap.class, args);
	}
}
