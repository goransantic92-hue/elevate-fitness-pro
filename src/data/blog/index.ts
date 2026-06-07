import { dadBodPost } from "./dad-bod";
import { fallenOffWagonPost } from "./fallen-off-wagon";
import { noTimeTooTiredPost } from "./no-time-too-tired";
import type { BlogPost } from "./types";

export type { BlogBlock, BlogPost } from "./types";

export const blogPosts: BlogPost[] = [noTimeTooTiredPost, fallenOffWagonPost, dadBodPost];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export { formatBlogDate } from "@/lib/formatBlogDate";
