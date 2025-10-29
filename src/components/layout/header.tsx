'use client';

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddLinkDialog } from "@/components/link/add-link-dialog";
import { SearchInput } from "@/components/search-input";
import { APP_NAME } from "@/lib/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
      <SidebarTrigger className="md:hidden" />
      <h1 className="hidden text-xl font-bold tracking-tight font-headline md:block">{APP_NAME}</h1>
      <div className="flex w-full items-center justify-end gap-4">
        <div className="w-full max-w-sm">
          <SearchInput />
        </div>
        <AddLinkDialog />
      </div>
    </header>
  );
}
