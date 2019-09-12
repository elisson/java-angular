package com.barbosa.elissonApp.Tasks;

import model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import com.barbosa.elissonApp.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:4200", "http://127.0.0.1:4200"})
@RestController
public class TasksController {
    @Autowired(required = true)
    private TaskRepository taskRepository;

    @PostMapping("/tasks")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Task save(@RequestBody Task task
    ) {
        return taskRepository.save(
                new Task(task.title, task.description, task.status, 0)
        );
    }

    @GetMapping("/tasks")
    @ResponseBody
    public Iterable<Task> all() {
        return taskRepository.findAll();
    }

    @DeleteMapping("/tasks/{id}")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public void delete(@PathVariable Long id) {
        taskRepository.deleteById(id);
    }

    @PutMapping("/tasks/{id}")
    @ResponseBody
    @ResponseStatus(HttpStatus.OK)
    public Task update(@PathVariable Long id, @RequestBody Task task) {
        Task t = taskRepository.findById(id).orElse(null);
        t.status = task.status;
        t.title = task.title;
        t.sort = task.sort;
        taskRepository.save(t);
        return t;
    }

}