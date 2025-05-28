"use client"

import React, { useState, useRef, useEffect } from "react";
import AppSidebar from "@/layout/AppSidebar";

export default function PesanChat() {
    const [messages, setMessages] = useState([
        { id: 1, sender: "them", text: "Halo! Ada yang bisa saya bantu?" },
        { id: 2, sender: "me", text: "Hai, saya ingin tahu lebih banyak tentang produk Anda." },
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages update
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function handleSend() {
        if (input.trim() === "") return;
        setMessages((prev) => [
            ...prev,
            { id: prev.length + 1, sender: "me", text: input.trim() },
        ]);
        setInput("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <AppSidebar />
            <div className="flex flex-col flex-1 max-w-screen mx-auto w-full border-2 border-gray-700">
                {/* Chat header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800">
                    <h2 className="text-xl font-semibold">Pesan Chat</h2>
                    <div className="text-sm text-gray-400">Online</div>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-900">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`max-w-xs md:max-w-md break-words rounded-lg px-4 py-2 ${msg.sender === "me"
                                ? "bg-blue-600 ml-auto text-white"
                                : "bg-gray-800 text-gray-200"
                                }`}
                        >
                            {msg.text}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input area */}
                <div className="px-6 py-4 border-t border-gray-700 bg-gray-800">
                    <textarea
                        className="w-full resize-none rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-2"
                        rows={2}
                        placeholder="Ketik pesan anda..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={handleSend}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={input.trim() === ""}
                        >
                            Kirim
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

