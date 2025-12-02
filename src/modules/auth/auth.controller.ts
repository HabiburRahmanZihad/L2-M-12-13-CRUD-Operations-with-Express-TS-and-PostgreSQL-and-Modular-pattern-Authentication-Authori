import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;


  try {
    const result = await authService.loginUser(email, password);
    console.log(result.user);
    res.status(201).json({
      success: true,
      message: 'User logged in successfully',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Error logging in user',
      error: error.message
    });
  }
}

export const authController = {
  loginUser
};