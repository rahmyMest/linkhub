'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import type { Link } from '@/lib/types';
import { EditLinkDialog } from './edit-link-dialog';
import { DeleteLinkAlert } from './delete-link-alert';

interface LinkCardProps {
  link: Link;
}

export function LinkCard({ link }: LinkCardProps) {
  const [isEditOpen, setEditOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  return (
    <>
      <Card className="flex flex-col overflow-hidden h-full group">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <Image
              src={link.image || `https://picsum.photos/seed/${link.id}/600/400`}
              alt={link.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint="website screenshot"
            />
          </div>
        </a>
        <CardHeader className="relative flex-grow">
          <div className="absolute top-4 right-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditOpen(true)}>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setDeleteOpen(true)} className="text-destructive focus:text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <a href={link.url} target="_blank" rel="noopener noreferrer" className="block">
            <CardTitle className="font-headline pr-8 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {link.title}
            </CardTitle>
          </a>
          <CardDescription className="pt-2 line-clamp-3">
            {link.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {link.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      <EditLinkDialog link={link} open={isEditOpen} onOpenChange={setEditOpen} />
      <DeleteLinkAlert link={link} open={isDeleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}
