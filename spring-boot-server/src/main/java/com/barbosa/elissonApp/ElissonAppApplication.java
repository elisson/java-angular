package com.barbosa.elissonApp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableJpaRepositories("com.barbosa.elissonApp.repository")
@EntityScan("model")
public class ElissonAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(ElissonAppApplication.class, args);
	}

}
