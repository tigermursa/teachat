import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.services";
import { CustomError } from "../../errors/CustomError";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { email, password } = req.body;

    // Find user by email
    const validUser = await AuthService.findUserByEmail(email);
    if (!validUser) {
      throw new CustomError("User not found", 404);
    }

    // Check if the password matches
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      throw new CustomError("Wrong credentials", 401);
    }

    // Generate JWT token with expiration
    const token = jwt.sign(
      { id: validUser._id },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.EXPIRES_IN }
    );

    // Set HTTP-only, Secure,
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: true, // Set 'secure' to true in production
        sameSite: "none",
        maxAge: 1000 * 60 * 60 * 24,
      })
      .status(200)
      .json({
        message: "User logged in successfully!",
        _id: validUser._id,
        username: validUser.username,
        email: validUser.email,
        userImage: validUser.userImage,
      });
  } catch (error) {
    next(error);
  }
}
