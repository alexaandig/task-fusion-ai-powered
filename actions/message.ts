"use server";
import { prisma } from "@/lib/prisma";
import { checkUser } from "./user";

export const createMessage = async (
  sender: string,
  text: string,
  workspaceId: string
) => {
  const user = await checkUser();
  if (!user) return null;

  const newMessage = await prisma.message.create({
    data: {
      content: text,
      sender,
      clerkId: user.clerkId,
      workspaceId,
    },
  });
  return newMessage;
};

export const getMessages = async (workspaceId: string) => {
  const user = await checkUser();
  if (!user) return null;

  const messages = await prisma.message.findMany({
    where: { clerkId: user.clerkId, workspaceId },
    orderBy: { createdAt: "asc" },
  });
  return messages;
};
