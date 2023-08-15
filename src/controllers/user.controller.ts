import { Request, Response } from "express";
import {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
} from "../services/user.service";
import { User } from "@prisma/client";

export async function getAllUsers(_, res: Response) {
  try {
    const users = await getAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
}

export async function getUserById(req: Request, res: Response) {
  const userId = req.query.id as string;
  try {
    const user = await getById(userId);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
}

export async function createUser(req: Request, res: Response) {
  const user: User = req.body;
  try {
    const createdUser: User = await create(user);
    res.status(201).json(createdUser);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
}

export async function updateUser(req: Request, res: Response) {
  const user: User = req.body;
  try {
    const updatedUser: User = await updateById(user);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  const userId = req.query.id as string;
  try {
    await deleteById(userId);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
