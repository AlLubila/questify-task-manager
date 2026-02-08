package com.questify.tasks;

public class Task {
    private long id;
    private String title;
    private String status;

    public Task() {
    }

    public Task(long id, String title, String status) {
        this.id = id;
        this.title = title;
        this.status = status;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
