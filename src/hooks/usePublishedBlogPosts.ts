import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { resolveHomepageLocale } from "@/i18n/constants";
import { resolveBlogCms } from "@/lib/blogCms";
import { usePublishedSiteCms } from "@/hooks/usePublishedSiteCms";
import type { BlogPost } from "@/data/blog";

export function usePublishedBlogPosts(): {
  posts: BlogPost[];
  isLoading: boolean;
  isError: boolean;
} {
  const { i18n } = useTranslation();
  const locale = resolveHomepageLocale(i18n.language);
  const { data, isLoading, isError } = usePublishedSiteCms("blog");

  const posts = useMemo(() => resolveBlogCms(data ?? null, locale), [data, locale]);

  return { posts, isLoading, isError };
}

export function usePublishedBlogPost(slug: string | undefined): {
  post: BlogPost | undefined;
  posts: BlogPost[];
  isLoading: boolean;
} {
  const { posts, isLoading } = usePublishedBlogPosts();
  const post = useMemo(
    () => (slug ? posts.find((p) => p.slug === slug) : undefined),
    [posts, slug]
  );
  return { post, posts, isLoading };
}
