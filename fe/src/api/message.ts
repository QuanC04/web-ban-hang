import { privateClient } from "./client";
import type { ChatMessage, Conversation } from "../models";

export const getConversations = async () => {
  const response = await privateClient.get("/message/conversations");
  const payload = response.data?.data;
  return Array.isArray(payload) ? (payload as Conversation[]) : [];
};

export const startConversation = async (shopId: string) => {
  const response = await privateClient.post("/message/conversations", { shopId });
  return response.data?.data as Conversation;
};

export const getMessages = async (conversationId: string) => {
  const response = await privateClient.get(
    `/message/conversations/${conversationId}/messages`,
  );
  const payload = response.data?.data;
  return Array.isArray(payload) ? (payload as ChatMessage[]) : [];
};

export const sendMessage = async (conversationId: string, content: string) => {
  const response = await privateClient.post(
    `/message/conversations/${conversationId}/messages`,
    { content },
  );
  return response.data?.data as ChatMessage;
};
