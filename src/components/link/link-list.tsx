import type { Link } from '@/lib/types';
import { LinkCard } from './link-card';
import { Card, CardContent } from '../ui/card';
import { Telescope } from 'lucide-react';

interface LinkListProps {
  links: Link[];
}

export function LinkList({ links }: LinkListProps) {
  if (links.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-card text-center p-12 min-h-[400px]">
            <Telescope className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold font-headline tracking-tight">No Links Found</h2>
            <p className="text-muted-foreground mt-2">
            It looks like there are no links matching your search. <br/> Try adding a new link or adjusting your filters.
            </p>
        </div>
    );
  }

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {links.map((link) => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
