import { Router } from "express";
import { userController } from "./user.controller";
import auth from "../../middleware/auth";
import logger from "../../middleware/logger";

const router = Router();

// Create a new user
router.post("/", userController.CreateUser);

// Get all users
router.get('/', logger, auth('admin'), userController.GetAllUsers);

// Get a single user by ID
router.get('/:id', userController.GetUserById);

//Update a user by ID
router.put('/:id', userController.UpdateUserById);

// Delete a user by ID
router.delete('/:id', userController.DeleteUserById);

export const userRoutes = router;