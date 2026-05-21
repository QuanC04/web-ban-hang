import { io, type Socket } from "socket.io-client";
import Cookies from "js-cookie";
import type { ChatMessage } from "../models";

interface ServerToClientEvents {
  "message:new": (message: ChatMessage) => void;
}

interface ClientToServerEvents {
  "conversation:join": (conversationId: string) => void;
  "message:send": (
    payload: { conversationId: string; content: string },
    ack?: (response: {
      success: boolean;
      message?: ChatMessage;
      error?: string;
    }) => void,
  ) => void;
}

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

const getSocketUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
  return apiUrl.replace(/\/api\/?$/, "");
};

export const getChatSocket = () => {
  const token = Cookies.get("token");
  if (!token) return null;

  if (!socket) {
    socket = io(getSocketUrl(), {
      autoConnect: false,
      auth: { token },
      withCredentials: true,
    });
  }

  socket.auth = { token };
  return socket;
};

export const disconnectChatSocket = () => {
  socket?.disconnect();
  socket = null;
};
