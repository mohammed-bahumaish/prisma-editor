"use client";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const MultiplayerChat = ({ children }: { children: React.ReactNode }) => {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent className="!w-96">
        <ChatComponent />
      </PopoverContent>
    </Popover>
  );
};

export default MultiplayerChat;

import React, { useState } from "react";

const ChatComponent = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Mohammed Bahumaish",
      text: "Chatting is coming soon!",
      timestamp: "10:00 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        text: newMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex max-h-[600px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                message.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <p className="font-bold">{message.sender}</p>
              <p>{message.text}</p>
              <p className="mt-1 text-right text-xs opacity-70">
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-2">
        <div className="flex space-x-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit">Send</Button>
        </div>
      </form>
    </div>
  );
};
