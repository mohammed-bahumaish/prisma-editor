/* eslint-disable @next/next/no-img-element */
"use client";

import { type Message } from "app/multiplayer/multiplayer-state";

const visibleUsers = 5;
const MultiplayerAvatars = ({ users }: { users: Message["sender"][] }) => {
  const firstFiveUsers = users?.slice(0, visibleUsers);

  return (
    <div className="flex -space-x-1 overflow-hidden">
      {firstFiveUsers?.map((user) => (
        <img
          key={user.name}
          className="inline-block h-6 w-6 rounded-full border border-slate-300 dark:border-slate-700"
          src={user.image || "/images/placeholder.jpg"}
          title={user.name || "Anonymous"}
          alt=""
        />
      ))}
      {users.length > visibleUsers && (
        <p className="px-2">+{users.length - visibleUsers}</p>
      )}
    </div>
  );
};

export default MultiplayerAvatars;
