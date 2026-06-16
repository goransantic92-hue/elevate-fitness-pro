import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock } from "lucide-react";
import { getHomepageFeaturedPosts } from "@/data/blog";
import { formatBlogDate } from "@/lib/formatBlogDate";

export function HomeBlogSection() {
  const { t, i18n } = useTranslation("blog");
  const posts = getHomepageFeaturedPosts(3);

  if (posts.length === 0) return null;

  return (
    <section className="section-padding border-t border-border/60 bg-background">
      <div className="container mx-auto max-w-[1100px] px-6">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-primary">{t("home.eyebrow")}</p>
        <h2 className="font-display mt-2 text-balance text-center text-[clamp(2rem,5vw,3rem)] text-foreground">
          {t("home.headline")} <span className="text-primary">{t("home.headlineHighlight")}</span>
        </h2>
        <p className="mx-auto mt-2 max-w-[560px] text-center text-pretty text-muted-foreground">{t("home.subhead")}</p>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card/50 transition-colors hover:border-primary/40"
            >
              {post.coverImage && (
                <Link to={`/blog/${post.slug}`} className="block aspect-[16/10] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.coverImageAlt ?? t(`posts.${post.slug}.title`)}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                </Link>
              )}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, i18n.language)}</time>
                  <span aria-hidden>·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {t("index.minRead", { minutes: post.readingTimeMinutes })}
                  </span>
                </div>
                <h3 className="font-display mt-3 text-xl leading-snug text-foreground">
                  <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                    {t(`posts.${post.slug}.title`)}
                  </Link>
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t(`posts.${post.slug}.excerpt`)}
                </p>
                <Link
                  to={`/blog/${post.slug}`}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/90"
                >
                  {t("index.readArticle")}
                  <ArrowRight className="icon-directional h-4 w-4" aria-hidden />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/90"
          >
            {t("home.viewAll")}
            <ArrowRight className="icon-directional h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
