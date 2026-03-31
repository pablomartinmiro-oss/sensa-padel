"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AtlasChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "¡Hola! Soy Atlas, tu asistente de IA para Sensa Padel. Puedo ayudarte con análisis de ingresos, seguimiento de leads, gestión de socios y optimización del club. ¿En qué puedo ayudarte hoy?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.text || "Error en la respuesta." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Lo siento, hubo un error. Inténtalo de nuevo." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
          <Bot size={18} className="text-green-400" />
        </div>
        <div>
          <div className="font-semibold text-sm">Atlas AI</div>
          <div className="text-xs text-gray-400">Asistente de Sensa Padel</div>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs text-gray-400">En línea</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === "user" ? "bg-blue-600" : "bg-green-500/20"}`}>
              {msg.role === "user" ? <User size={14} /> : <Bot size={14} className="text-green-400" />}
            </div>
            <div className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.role === "user" ? "bg-blue-600 text-white rounded-br-sm" : "bg-gray-800 text-gray-100 rounded-bl-sm"}`}>
              <div className="whitespace-pre-wrap">{msg.content}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <Bot size={14} className="text-green-400" />
            </div>
            <div className="bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-gray-400" />
              <span className="text-sm text-gray-400">Pensando...</span>
            </div>
          </div>
        )}
      </div>

      {/* Suggested prompts (shown only at start) */}
      {messages.length === 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {[
            "¿Cuáles son mis leads más calientes?",
            "Resumen de ingresos de hoy",
            "¿Cómo puedo aumentar la ocupación de pistas?",
            "Estrategias para convertir leads en socios",
          ].map((prompt) => (
            <button
              key={prompt}
              onClick={() => { setInput(prompt); }}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 transition-colors border border-gray-700"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Escribe tu pregunta sobre Sensa Padel..."
            disabled={loading}
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 placeholder-gray-500 disabled:opacity-50"
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-500 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-gray-600 text-center">Atlas puede cometer errores · Powered by Claude</p>
      </div>
    </div>
  );
}
