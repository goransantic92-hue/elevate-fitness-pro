import { Helmet } from "react-helmet-async";
import { localePath } from "@/i18n/localePaths";
import type { AppLanguage } from "@/i18n/constants";

const SITE_ORIGIN = "https://busystrong90.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

type BlogPostingSchemaProps = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  keywords?: string[];
  locale?: AppLanguage;
};

export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  keywords = [],
  locale = "en",
}: BlogPostingSchemaProps) {
  const url = `${SITE_ORIGIN}${localePath(`/blog/${slug}`, locale)}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: publishedAt,
    dateModified: publishedAt,
    author: {
      "@type": "Person",
      name: "Coach Milos",
      url: "https://www.instagram.com/_coachmilos/",
    },
    publisher: {
      "@type": "Organization",
      name: "BUSY STRONG 90",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_ORIGIN}/pwa-512.png`,
      },
    },
    image: DEFAULT_OG_IMAGE,
    keywords: keywords.join(", "),
    inLanguage: locale === "sr" ? "sr-RS" : locale === "ar" ? "ar-AE" : "en-GB",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export { DEFAULT_OG_IMAGE, SITE_ORIGIN };
