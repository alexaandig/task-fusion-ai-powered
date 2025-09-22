"use server";
import { prisma } from "@/lib/prisma";
import { checkUser } from "./user";
import { auth } from "@clerk/nextjs/server";

export const createTask = async (
  task: string,
  priority: string,
  description: string,
  workspaceId: string
) => {
  const user = await checkUser();
  if (!user) return null;

  const newTask = await prisma.task.create({
    data: {
      task,
      priority,
      description,
      clerkId: user.clerkId,
      workspaceId,
    },
  });
  return newTask;
};

export const getTasks = async (workspaceId: string) => {
  const user = await checkUser();
  if (!user) return null;

  const tasks = await prisma.task.findMany({
    where: { clerkId: user.clerkId, workspaceId },
    orderBy: { createdAt: "desc" },
  });
  return tasks;
};

export const updateTask = async (
  id: string,
  task: string,
  priority: string,
  description: string,
  completed?: boolean
) => {
  const user = await checkUser();
  if (!user) return null;

  const updateData: any = { task, priority, description };
  if (completed !== undefined) {
    updateData.completed = completed;
  }

  const updatedTask = await prisma.task.update({
    where: { id, clerkId: user.clerkId },
    data: updateData,
  });
  return updatedTask;
};

export const deleteTask = async (id: string) => {
  const user = await checkUser();
  if (!user) return null;

  const deletedTask = await prisma.task.delete({
    where: { id, clerkId: user.clerkId },
  });
  return deletedTask;
};

export const toggleTaskCompletion = async (id: string, completed: boolean) => {
  const user = await checkUser();
  if (!user) return null;

  const updatedTask = await prisma.task.update({
    where: { id, clerkId: user.clerkId },
    data: { completed },
  });
  return updatedTask;
};
