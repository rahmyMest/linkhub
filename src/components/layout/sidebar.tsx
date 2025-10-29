'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Sidebar as SidebarPrimitive,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/icons';
import { cn } from '@/lib/utils';
import { CATEGORIES, APP_NAME } from '@/lib/constants';
import { BookMarked, Folder, Tag, Telescope } from 'lucide-react';
import type { Category } from '@/lib/types';

const sidebarCategories: { name: Category | 'All'; icon: React.ReactNode }[] = [
    { name: 'All', icon: <Telescope /> },
    { name: 'Technology', icon: <BookMarked /> },
    { name: 'Science', icon: <BookMarked /> },
    { name: 'News', icon: <BookMarked /> },
    { name: 'Personal Development', icon: <BookMarked /> },
    { name: 'Finance', icon: <BookMarked /> },
    { name: 'Health', icon: <BookMarked /> },
    { name: 'Entertainment', icon: <BookMarked /> },
    { name: 'Sports', icon: <BookMarked /> },
    { name: 'Travel', icon: <BookMarked /> },
    { name: 'Food', icon: <BookMarked /> },
    { name: 'Education', icon: <BookMarked /> },
    { name: 'Other', icon: <Folder /> },
];

export function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category')?.toLowerCase() || 'all';

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value.toLowerCase() === 'all') {
      params.delete(name)
    } else {
      params.set(name, value)
    }
    return params.toString()
  }

  return (
    <SidebarPrimitive>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Logo className="size-6 text-primary" />
          <span className="text-lg font-semibold font-headline">{APP_NAME}</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>
          <SidebarMenu>
            {sidebarCategories.map((item) => {
              const isActive = currentCategory === item.name.toLowerCase();
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className="justify-start"
                    tooltip={item.name}
                  >
                    <Link href={pathname + '?' + createQueryString('category', item.name)}>
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </SidebarPrimitive>
  );
}
