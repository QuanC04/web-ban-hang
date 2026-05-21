import { Link } from "@tanstack/react-router";
import { MessageCircle, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getConversations,
  getMessages,
  sendMessage as sendMessageRequest,
} from "../api/message";
import { getChatSocket } from "../lib/socket";
import type { ChatMessage, Conversation } from "../models";
import { useUserStore } from "../store/user";

const getDisplayName = (user?: { full_name?: string | null; username?: string | null }) =>
  user?.full_name || user?.username || "Người dùng";

const formatTime = (value?: string | null) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  }).format(new Date(value));
};

const getConversationFromUrl = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("conversationId");
};

const ChatPage = () => {
  const { user } = useUserStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(
    getConversationFromUrl(),
  );
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [content, setContent] = useState("");
  const [notice, setNotice] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        setSelectedConversationId((current) => current || data[0]?.id || null);
      } catch {
        setNotice("Không thể tải danh sách hội thoại.");
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        const data = await getMessages(selectedConversationId);
        setMessages(data);
      } catch {
        setNotice("Không thể tải tin nhắn.");
      }
    };

    fetchMessages();
  }, [selectedConversationId]);

  useEffect(() => {
    if (!user) return;

    const socket = getChatSocket();
    if (!socket) return;

    if (!socket.connected) socket.connect();

    const handleNewMessage = (message: ChatMessage) => {
      setConversations((current) =>
        current.map((conversation) =>
          conversation.id === message.conversation_id
            ? {
                ...conversation,
                last_message_text: message.content,
                last_message_at: message.created_at,
              }
            : conversation,
        ),
      );

      if (message.conversation_id !== selectedConversationId) return;

      setMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    };

    socket.on("message:new", handleNewMessage);

    return () => {
      socket.off("message:new", handleNewMessage);
    };
  }, [selectedConversationId, user]);

  useEffect(() => {
    if (!selectedConversationId) return;
    const socket = getChatSocket();
    socket?.emit("conversation:join", selectedConversationId);

    const nextUrl = `${window.location.pathname}?conversationId=${selectedConversationId}`;
    window.history.replaceState(null, "", nextUrl);
  }, [selectedConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.id === selectedConversationId,
  );

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedContent = content.trim();
    if (!selectedConversationId || !normalizedContent || isSending) return;

    setIsSending(true);
    setNotice("");

    const socket = getChatSocket();
    if (socket?.connected) {
      socket.emit(
        "message:send",
        { conversationId: selectedConversationId, content: normalizedContent },
        (response) => {
          setIsSending(false);
          if (!response.success) {
            setNotice(response.error || "Không thể gửi tin nhắn.");
            return;
          }
          setContent("");
        },
      );
      return;
    }

    try {
      const message = await sendMessageRequest(selectedConversationId, normalizedContent);
      setMessages((current) => [...current, message]);
      setContent("");
    } catch {
      setNotice("Không thể gửi tin nhắn.");
    } finally {
      setIsSending(false);
    }
  };

  if (!user) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-12">
        <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <MessageCircle className="mx-auto h-12 w-12 text-amber-500" />
          <h1 className="mt-4 text-2xl font-black text-slate-900">Đăng nhập để chat</h1>
          <p className="mt-2 text-slate-600">Bạn cần đăng nhập để nhắn tin với shop.</p>
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-slate-700">
            Đăng nhập
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto grid min-h-[75vh] max-w-7xl gap-4 px-4 py-6 md:grid-cols-[340px_1fr] md:py-8">
      <aside className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h1 className="text-2xl font-black text-slate-900">Tin nhắn</h1>
          <p className="mt-1 text-sm text-slate-500">Trao đổi trực tiếp với shop.</p>
        </div>

        <div className="max-h-[68vh] overflow-y-auto">
          {conversations.length === 0 ? (
            <p className="p-5 text-sm text-slate-500">Chưa có hội thoại nào.</p>
          ) : (
            conversations.map((conversation) => {
              const partner = conversation.buyer_id === user.id ? conversation.shop : conversation.buyer;
              const isActive = conversation.id === selectedConversationId;

              return (
                <button
                  key={conversation.id}
                  type="button"
                  onClick={() => setSelectedConversationId(conversation.id)}
                  className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition ${
                    isActive ? "bg-amber-50" : "hover:bg-slate-50"
                  }`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-slate-900 text-sm font-bold text-amber-300">
                    {getDisplayName(partner).charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-slate-900">
                      {getDisplayName(partner)}
                    </span>
                    <span className="mt-1 block truncate text-sm text-slate-500">
                      {conversation.last_message_text || "Bắt đầu hội thoại"}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-slate-400">
                    {formatTime(conversation.last_message_at)}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </aside>

      <section className="flex min-h-[70vh] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <header className="border-b border-slate-200 p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-600">
            Hội thoại
          </p>
          <h2 className="mt-1 text-xl font-black text-slate-900">
            {selectedConversation
              ? getDisplayName(
                  selectedConversation.buyer_id === user.id
                    ? selectedConversation.shop
                    : selectedConversation.buyer,
                )
              : "Chọn một hội thoại"}
          </h2>
        </header>

        {notice ? <p className="border-b border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">{notice}</p> : null}

        <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4 md:p-6">
          {!selectedConversationId ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Chọn hội thoại để bắt đầu nhắn tin.
            </div>
          ) : messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-slate-500">
              Chưa có tin nhắn. Hãy gửi lời chào đầu tiên.
            </div>
          ) : (
            messages.map((message) => {
              const isMine = message.sender_id === user.id;
              return (
                <div key={message.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[78%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                      isMine
                        ? "rounded-br-md bg-slate-900 text-white"
                        : "rounded-bl-md bg-white text-slate-800"
                    }`}>
                    <p className="whitespace-pre-line leading-relaxed">{message.content}</p>
                    <p className={`mt-1 text-xs ${isMine ? "text-slate-300" : "text-slate-400"}`}>
                      {formatTime(message.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-3 border-t border-slate-200 p-4">
          <input
            type="text"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={!selectedConversationId || isSending}
            placeholder="Nhập tin nhắn..."
            className="min-w-0 flex-1 rounded-full border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-slate-500 disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={!selectedConversationId || !content.trim() || isSending}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50">
            <Send className="h-4 w-4" />
            Gửi
          </button>
        </form>
      </section>
    </main>
  );
};

export default ChatPage;
