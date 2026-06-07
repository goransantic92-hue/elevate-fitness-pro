import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Clock } from "lucide-react";
import { PageMeta } from "@/components/seo/PageMeta";
import { blogPosts } from "@/data/blog";
import { formatBlogDate } from "@/lib/formatBlogDate";

const BlogIndexPage = () => {
  const { t, i18n } = useTranslation("blog");
  const keywords = t("meta.keywords", { returnObjects: true }) as string[];

  return (
    <div className="font-sans">
      <PageMeta title={t("meta.title")} description={t("meta.description")} path="/blog" keywords={keywords} />

      <section className="pt-8 pb-12 md:pt-12 md:pb-16">
        <div className="container mx-auto max-w-3xl px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t("index.eyebrow")}</p>
          <h1 className="font-display mt-2 text-balance text-[clamp(2rem,5vw,3rem)] text-foreground">
            {t("index.headline")} <span className="text-primary">{t("index.headlineHighlight")}</span>
          </h1>
          <p className="mt-3 text-pretty text-muted-foreground">{t("index.subhead")}</p>
        </div>
      </section>

      <section className="pb-20 md:pb-28 px-6">
        <div className="container mx-auto max-w-3xl">
          <ul className="flex flex-col gap-8">
            {blogPosts.map((post) => (
              <li key={post.slug}>
                <article className="rounded-xl border border-border bg-card/50 p-6 transition-colors hover:border-primary/40 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt, i18n.language)}</time>
                    <span aria-hidden>·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      {t("index.minRead", { minutes: post.readingTimeMinutes })}
                    </span>
                  </div>
                  <h2 className="font-display mt-3 text-2xl leading-tight text-foreground md:text-3xl">
                    <Link to={`/blog/${post.slug}`} className="hover:text-primary transition-colors">
                      {t(`posts.${post.slug}.title`)}
                    </Link>
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {t(`posts.${post.slug}.excerpt`)}
                  </p>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary/90"
                  >
                    {t("index.readArticle")}
                    <ArrowRight className="icon-directional h-4 w-4" aria-hidden />
                  </Link>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default BlogIndexPage;
