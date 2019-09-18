package com.barbosa.todo.controllers;

import model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import com.barbosa.todo.repository.TaskRepository;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RestController
@RequestMapping("/tasks")
public class TasksController extends BaseController{
    @Autowired(required = true)
    private TaskRepository taskRepository;

    @PostMapping
    public Task save(@RequestBody Task task
    ) {
        return taskRepository.save(
                new Task(task.title, task.description, task.status, 0)
        );
    }

    @GetMapping
    public Iterable<Task> all() {
        return taskRepository.findAll();
    }

    @DeleteMapping("{id}")
    public void delete(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    @PutMapping("{id}")
    public Task update(@PathVariable Long id, @RequestBody Task task) {
        Task t = taskRepository.findById(id).orElse(null);
        t.status = task.status;
        t.title = task.title;
        t.sort = task.sort;
        taskRepository.save(t);
        return t;
    }

}