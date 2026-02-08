from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Training API", version="1.0.0")


class Task(BaseModel):
    title: str
    description: str | None = None
    status: str = "todo"


class TaskOut(Task):
    id: int


tasks: list[TaskOut] = []
next_id = 1


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/tasks", response_model=list[TaskOut])
def list_tasks():
    return tasks


@app.post("/tasks", response_model=TaskOut, status_code=201)
def create_task(task: Task):
    global next_id
    item = TaskOut(id=next_id, **task.model_dump())
    next_id += 1
    tasks.append(item)
    return item


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    global tasks
    for item in tasks:
        if item.id == task_id:
            tasks = [t for t in tasks if t.id != task_id]
            return
    raise HTTPException(status_code=404, detail="Task not found")
