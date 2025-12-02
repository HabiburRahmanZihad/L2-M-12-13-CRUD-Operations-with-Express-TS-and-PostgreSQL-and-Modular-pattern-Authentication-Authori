import { Router } from "express";
import { userController } from "./user.controller";

const router = Router();

// Create a new user
router.post("/", userController.CreateUser);

// Get all users
router.get('/', userController.GetAllUsers);

// Get a single user by ID
router.get('/:id', userController.GetUserById);

//Update a user by ID
router.put('/:id', userController.UpdateUserById);

// Delete a user by ID
router.delete('/:id', userController.DeleteUserById);

export const userRoutes = router;