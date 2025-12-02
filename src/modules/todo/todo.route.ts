import { Router } from "express";
import { todoController } from "./todo.controller";

const router = Router();

//create a todo
router.post("/",  todoController.CreateTodo)

// Get all todos
router.get('/', todoController.GetAllTodos);

// Get a single todo by ID
router.get('/:id', todoController.GetTodoById);

// Update a todo by ID
router.put('/:id', todoController.UpdateTodoById);

// Delete a todo by ID
router.delete('/:id', todoController.DeleteTodoById);

export const todoRoutes = router;