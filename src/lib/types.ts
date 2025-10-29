import { CATEGORIES } from './constants';

export type Category = typeof CATEGORIES[number];

export type Link = {
  id: string;
  url: string;
  title: string;
  description: string;
  image?: string | null;
  category: Category;
  tags: string[];
  createdAt: string; // ISO 8601 date string
};
