import { AppLayout } from '@/components/layout/app-layout';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { LinkList } from '@/components/link/link-list';
import { getLinks } from '@/lib/data';
import { Suspense } from 'react';
import { SidebarInset } from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home({ searchParams }: { searchParams?: { [key: string]: string | string[] | undefined } }) {
  const query = typeof searchParams?.q === 'string' ? searchParams.q : '';
  const category = typeof searchParams?.category === 'string' ? searchParams.category : 'all';

  return (
    <AppLayout>
      <Sidebar />
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6">
          <Suspense fallback={<LinkListSkeleton />}>
            <FilteredLinkList query={query} category={category} />
          </Suspense>
        </main>
      </SidebarInset>
    </AppLayout>
  );
}

async function FilteredLinkList({ query, category }: { query: string; category: string }) {
    const links = await getLinks({ query, category });
    return <LinkList links={links} />;
}

function LinkListSkeleton() {
  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col space-y-3">
          <Skeleton className="h-[175px] w-full rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      ))}
    </div>
  )
}
