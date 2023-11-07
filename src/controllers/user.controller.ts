import { Request, Response } from "express";
import {
  getAllApproved,
  getById,
  create,
  updateById,
  deleteById,
  getAllUnapproved,
  approveById,
  toggleActive,
  rejectById,
  updateUserInfo,
} from "../services/user.service";
import { User } from "@prisma/client";
import {
  UserIdDto,
  UserInfoUpdateDto,
  UserUpdateDto,
} from "../validation/user.schema";
import bcrypt from "bcrypt";

export async function getAllUsers(_, res: Response) {
  try {
    const users = await getAllApproved();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching users",
    });
  }
}

export async function getUserById(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).id;
  try {
    const user = await getById(userId);
    if (user) {
      res.status(200).json({
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        confirmed: user.confirmed,
        is_active: user.is_active,
        is_approved: user.UserRole.every((role) => role.is_approved === true),
      });
    } else {
      res.status(404).json({ error: "Not Found", message: "User not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Error fetching user" });
  }
}

export async function getAllUnapprovedUsers(_, res: Response) {
  try {
    const users = await getAllUnapproved();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error fetching unapproved users",
    });
  }
}

export async function createUser(req: Request, res: Response) {
  const user: User = req.body;
  try {
    const createdUser = await create(user);
    res.status(201).json(createdUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Error creating user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const user = req.body as UserUpdateDto;
  try {
    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }
    const updatedUser: User = await updateById(user);
    res.status(200).json(updatedUser);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: "Error updating user" });
  }
}

export async function updateUserInformation(req: Request, res: Response) {
  const { id, email, first_name, last_name, roles, markets } =
    req.body as UserInfoUpdateDto;
  try {
    await updateUserInfo(id, email, first_name, last_name, roles, markets);
    res.status(200).json({ message: "Successful" });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Error updating user info",
    });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).id;
  try {
    await deleteById(userId);
    res.status(204).send();
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error.message });
  }
}

export async function approveUser(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).id;
  try {
    await approveById(userId);
    res.status(200).json({ approved: true });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to approve user",
    });
  }
}

export async function rejectUser(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).id;
  try {
    await rejectById(userId);
    res.status(200).json({ approved: true });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to reject user",
    });
  }
}

export async function toggleActiveStatus(req: Request, res: Response) {
  const userId = (req.query as UserIdDto).id;
  try {
    const updatedUser = await toggleActive(userId);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to toggle active status of user",
    });
  }
}
