import { Request, Response } from "express";
import { userService } from "./user.service";

// Create a new user
const CreateUser = async (req: Request, res: Response) => {
  const { name, role, email, password } = req.body;

  try {
    const result = await userService.CreateUser({ name, role, email, password });
    console.log(result.rows[0]);
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error inserting data into the database',
      error: error.message
    });
  }

  // console.log(req.body);
}

// Get all users
const GetAllUsers = async (req: Request, res: Response) => {
  try {
    const result = await userService.GetAllUsers();
    res.status(200).json({
      success: true,
      users: result.rows
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users from the database',
      error: error.message
    });
  }
}

// Get a single user by ID
const GetUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await userService.GetUserById(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user from the database',
      error: error.message
    });
  }
}

//Update a user by ID
const UpdateUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  const { name, email } = req.body;
  try {
    const result = await userService.UpdateUserById(userId, name, email);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error updating user in the database',
      error: error.message
    });
  }
}

// Delete a user by ID
const DeleteUserById = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const result = await userService.DeleteUserById(userId);
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      user: result.rows[0]
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user from the database',
      error: error.message
    });
  }
}

export const userController = {
  CreateUser,
  GetAllUsers,
  GetUserById,
  UpdateUserById,
  DeleteUserById
};