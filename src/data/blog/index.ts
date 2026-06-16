import { dadBodPost } from "./dad-bod";
import { fallenOffWagonPost } from "./fallen-off-wagon";
import { fiveFoodsBodybuildingPost } from "./five-foods-bodybuilding";
import { fourMistakesArmsPost } from "./four-mistakes-training-arms";
import { healthFitnessSupplementsPost } from "./health-fitness-supplements";
import { noTimeTooTiredPost } from "./no-time-too-tired";
import { tipsMuscleGrowthPost } from "./tips-muscle-growth";
import type { BlogPost } from "./types";

export type { BlogBlock, BlogPost } from "./types";

export const blogPosts: BlogPost[] = [
  tipsMuscleGrowthPost,
  fiveFoodsBodybuildingPost,
  fourMistakesArmsPost,
  healthFitnessSupplementsPost,
  noTimeTooTiredPost,
  fallenOffWagonPost,
  dadBodPost,
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getHomepageFeaturedPosts(limit = 3): BlogPost[] {
  return blogPosts.filter((post) => post.featuredOnHomepage).slice(0, limit);
}

export { formatBlogDate } from "@/lib/formatBlogDate";
