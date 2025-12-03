import { Request, Response } from "express";
import { todoService } from "./todo.service";

//create a todo
const CreateTodo = async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await todoService.CreateTodo({ user_id, title });
    res.status(201).json({
      success: true,
      message: 'Todo created successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error inserting todo into the database',
      error: error.message
    });
  }
}


// Get all todos
const GetAllTodos = async (req: Request, res: Response) => {
  try {
    const result = await todoService.GetAllTodos();
    res.status(200).json({
      success: true,
      todos: result.rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todos from the database',
      error: error.message
    });
  }
}


// Get a single todo by ID
const GetTodoById = async (req: Request, res: Response) => {
  const todoId = req.params.id;
  try {
    const result = await  todoService.GetTodoById(Number(todoId));
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching todo from the database',
      error: error.message
    });
  }
}


// Update a todo by ID
const UpdateTodoById = async (req: Request, res: Response) => {
  const todoId = req.params.id;
  const { title, is_completed } = req.body;
  try {
    const result = await todoService.UpdateTodoById(Number(todoId), title, is_completed);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo updated successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating todo in the database',
      error: error.message
    });
  }
}

// Delete a todo by ID
const DeleteTodoById = async (req: Request, res: Response) => {
  const todoId = req.params.id;
  try {
    const result = await todoService.DeleteTodoById(Number(todoId));
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
      todo: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting todo from the database',
      error: error.message
    });
  }
}


// Exporting the controller functions
export const todoController = {
  CreateTodo,
  GetAllTodos,
  GetTodoById,
  UpdateTodoById,
  DeleteTodoById
};