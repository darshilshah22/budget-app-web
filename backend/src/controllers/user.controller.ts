import { Request, Response } from "express";
import { validationResult } from "express-validator";
import User, { IUser } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { generateToken } from "../utils/jwt";
import logger from "../utils/logger";

// Register user
export const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation error", errors.array()));
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiError(400, "User already exists"));
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id.toString());

    logger.info(`New user registered: ${user.email}`);

    res.status(201).json(
      new ApiResponse(201, "User registered successfully", {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation error", errors.array()));
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json(new ApiError(401, "Invalid email or password", null, "Invalid email or password"));
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json(new ApiError(401, "Invalid email or password", null, "Invalid email or password"));
    }

    // Generate token
    const token = generateToken(user._id.toString());

    logger.info(`User logged in: ${user.email}`);

    res.status(200).json(
      new ApiResponse(200, "Login successful", {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token,
      })
    );
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      console.log(error.message);
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Not authenticated"));
    }

    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    res
      .status(200)
      .json(new ApiResponse(200, "Profile retrieved successfully", user));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Not authenticated"));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation error", errors.array()));
    }

    const { firstName, lastName, email, currency, timezone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, email, currency, timezone },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    logger.info(`User profile updated: ${user.email}`);
    res
      .status(200)
      .json(new ApiResponse(200, "Profile updated successfully", user));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  }
};

// Update password
export const updatePassword = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json(new ApiError(401, "Not authenticated"));
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json(new ApiError(400, "Validation error", errors.array()));
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res
        .status(401)
        .json(new ApiError(401, "Current password is incorrect"));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, "Password updated successfully", null));
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json(new ApiError(400, error.message));
    } else {
      res.status(500).json(new ApiError(500, "Internal server error"));
    }
  }


};

// Logout user
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token");
    res.status(200).json(new ApiResponse(200, "Logged out successfully", null));
  } catch (error) {
    res.status(500).json(new ApiError(500, "Internal server error"));
  }
};
