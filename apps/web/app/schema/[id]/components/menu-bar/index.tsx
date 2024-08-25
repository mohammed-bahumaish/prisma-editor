"use client";

import { Menu } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar";

export const MenuBar = () => {
  return (
    <div className="flex justify-between bg-slate-100 p-4 dark:bg-[#1e1e1e]">
      <button className="h-9 w-9 rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        <Menu className="h-4 w-4" />
      </button>

      <div className="mx-auto max-w-lg">
        <Menubar className="border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
          <MenubarMenu>
            <MenubarTrigger>Add</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>Modal</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Enum</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
      <button className="flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
        Share
      </button>
    </div>
  );
};
