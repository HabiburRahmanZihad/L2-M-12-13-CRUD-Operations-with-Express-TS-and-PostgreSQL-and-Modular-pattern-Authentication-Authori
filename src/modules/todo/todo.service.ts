import { pool } from "../../config/db";

//create a todo
const CreateTodo = async (payload: Record<string, any>) => {
  const { user_id, title } = payload;
  const result = await pool.query(
    'INSERT INTO todos (user_id, title) VALUES ($1, $2) RETURNING *',
    [user_id, title]
  )
  return result;
}

// Get all todos
const GetAllTodos = async () => {
  const result = await pool.query('SELECT * FROM todos');
  return result;
}

// Get a single todo by ID
const GetTodoById = async (id: number) => {
  const result = await pool.query('SELECT * FROM todos WHERE id = $1', [id]);
  return result;
}

// Update a todo by ID
const UpdateTodoById = async (id: number, title: string, is_completed: boolean) => {
  const result = await pool.query(
      `UPDATE todos
        SET title = $1, is_completed = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *`,
      [title, is_completed, id]
    );
  return result;
}

// Delete a todo by ID
const DeleteTodoById = async (id: number) => {
  const result = await pool.query(
      'DELETE FROM todos WHERE id = $1 RETURNING *',
      [id]
    );
  return result;
}


export const todoService = {
  CreateTodo,
  GetAllTodos,
  GetTodoById,
  UpdateTodoById,
  DeleteTodoById
};