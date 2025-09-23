"use server";
import { prisma } from "@/lib/prisma";
import { checkUser } from "./user";

export const createMessage = async (
  workspaceId: string,
  sender: string,
  text: string
) => {
  const user = await checkUser();
  if (!user) return null;

  const newMessage = await prisma.message.create({
    data: {
      workspaceId,
      content: text,
      sender,
      userId: user.id,
    },
  });
  return newMessage;
};

export const getMessages = async (workspaceId: string) => {
  const user = await checkUser();
  if (!user) return null;

  const messages = await prisma.message.findMany({
    where: { workspaceId },
    orderBy: { createdAt: "asc" },
  });
  return messages;
};
