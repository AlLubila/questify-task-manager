package com.questify.tasks;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/")
public class TaskController {
    private final List<Task> tasks = new ArrayList<>();
    private final AtomicLong sequence = new AtomicLong(1);

    @GetMapping("health")
    public Map<String, String> health() {
        return Map.of("status", "ok");
    }

    @GetMapping("tasks")
    public List<Task> listTasks() {
        return tasks;
    }

    @PostMapping("tasks")
    @ResponseStatus(HttpStatus.CREATED)
    public Task createTask(@RequestBody TaskRequest request) {
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        String status = request.getStatus() == null || request.getStatus().isBlank()
                ? "todo"
                : request.getStatus().trim();
        Task task = new Task(sequence.getAndIncrement(), request.getTitle().trim(), status);
        tasks.add(0, task);
        return task;
    }

    @DeleteMapping("tasks/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(@PathVariable long id) {
        boolean removed = tasks.removeIf(task -> task.getId() == id);
        if (!removed) {
            throw new TaskNotFoundException();
        }
    }
}
