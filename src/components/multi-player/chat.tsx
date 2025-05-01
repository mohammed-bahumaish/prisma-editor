/* eslint-disable @next/next/no-img-element */
"use client";

import {
  type Message,
  multiplayerState,
} from "app/multiplayer/multiplayer-state";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import React, { useState } from "react";
import { useSnapshot } from "valtio";
import { useSession } from "next-auth/react";
import { format, isSameDay, isValid } from "date-fns";
import { useYDoc } from "app/multiplayer/ydoc-context";

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

const ChatComponent = () => {
  const session = useSession();
  const snap = useSnapshot(multiplayerState);
  const messages = snap.messages;
  const { madeChangesState } = useYDoc();
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newMessage.trim() !== "") {
      const newMsg: Message = {
        text: newMessage.trim(),
        sender: {
          name: session.data?.user.name || "Anonymous",
          image: session.data?.user.image || "/images/placeholder.jpg",
          id: session.data?.user.id || "",
        },
        timestamp: new Date().toISOString(),
      };
      multiplayerState.messages = [...multiplayerState.messages, newMsg];
      madeChangesState[1](true);
      setNewMessage("");
    }
  };

  return (
    <div className="flex max-h-[600px] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-2">
        {messages.map((message) => (
          <div
            key={message.text}
            className={`flex ${
              message.sender.id === session.data?.user.id
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs rounded-lg px-4 py-2 lg:max-w-md ${
                message.sender.id === session.data?.user.id
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  key={message.sender.name}
                  className="inline-block h-6 w-6 rounded-full border border-slate-300 dark:border-slate-700"
                  src={message.sender.image || "/images/placeholder.jpg"}
                  title={message.sender.name || "Anonymous"}
                  alt=""
                />
                <p className="font-bold">{message.sender.name}</p>
              </div>
              <p>{message.text}</p>
              <p className="mt-1 text-right text-xs opacity-70">
                {isValid(new Date(message.timestamp))
                  ? isSameDay(new Date(message.timestamp), new Date())
                    ? format(new Date(message.timestamp), "HH:mm")
                    : format(new Date(message.timestamp), "dd-MM-yyyy HH:mm")
                  : ""}
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
