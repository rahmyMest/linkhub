import type { Link } from './types';
import { placeholderImages } from './placeholder-images.json';

// In-memory "database"
let links: Link[] = [
  {
    id: '1',
    title: 'Introducing Next.js 15 Release Candidate',
    description: 'Next.js 15 is the next generation of Next.js, with a focus on developer experience and performance. It includes new features like improved caching, React 19 support, and more.',
    url: 'https://nextjs.org/blog/next-15-rc',
    category: 'Technology',
    tags: ['nextjs', 'react', 'webdev'],
    image: placeholderImages[0].imageUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: '2',
    title: 'Genkit: The open source framework for building with AI',
    description: 'Genkit is an open source framework from Google that helps you build, deploy, and monitor production-ready AI-powered features and applications.',
    url: 'https://firebase.google.com/docs/genkit',
    category: 'Technology',
    tags: ['ai', 'google', 'development', 'genkit'],
    image: placeholderImages[1].imageUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: '3',
    title: 'The Art of Cooking: A Beginner\'s Guide',
    description: 'Learn the fundamentals of cooking with this comprehensive guide. From knife skills to flavor pairings, we cover everything you need to know to become a confident home cook.',
    url: 'https://example.com/cooking-guide',
    category: 'Food',
    tags: ['cooking', 'recipes', 'kitchen'],
    image: placeholderImages[2].imageUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
  {
    id: '4',
    title: 'A Deep Dive into Quantum Computing',
    description: 'Quantum computing promises to revolutionize technology, science, and society. This article explains the basic principles of quantum mechanics and how they are applied in quantum computers.',
    url: 'https://example.com/quantum-computing',
    category: 'Science',
    tags: ['quantum', 'physics', 'computing'],
    image: placeholderImages[3].imageUrl,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
  },
];

// Simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const db = {
  links,
};

export async function getLinks(filters: { query?: string; category?: string } = {}): Promise<Link[]> {
  await delay(500);
  let filteredLinks = [...links];

  if (filters.category && filters.category !== 'all') {
    filteredLinks = filteredLinks.filter(link => link.category.toLowerCase() === filters.category!.toLowerCase());
  }

  if (filters.query) {
    const query = filters.query.toLowerCase();
    filteredLinks = filteredLinks.filter(link =>
      link.title.toLowerCase().includes(query) ||
      link.description.toLowerCase().includes(query) ||
      link.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  return filteredLinks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLinkById(id: string): Promise<Link | undefined> {
  await delay(100);
  return links.find(link => link.id === id);
}

export async function addLink(link: Omit<Link, 'id' | 'createdAt'>): Promise<Link> {
  await delay(200);
  const newLink: Link = {
    ...link,
    id: String(Date.now() + Math.random()),
    createdAt: new Date().toISOString(),
  };
  links = [newLink, ...links];
  return newLink;
}

export async function updateLink(id:string, updateData: Partial<Omit<Link, 'id' | 'createdAt'>>): Promise<Link | undefined> {
  await delay(200);
  let linkToUpdate = links.find(link => link.id === id);
  if (linkToUpdate) {
    linkToUpdate = { ...linkToUpdate, ...updateData };
    links = links.map(link => (link.id === id ? linkToUpdate! : link));
    return linkToUpdate;
  }
  return undefined;
}

export async function deleteLink(id: string): Promise<void> {
  await delay(200);
  links = links.filter(link => link.id !== id);
}
