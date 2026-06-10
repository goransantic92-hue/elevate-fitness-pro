import { Helmet } from "react-helmet-async";

const SITE_ORIGIN = "https://busystrong90.com";
const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/og-image.jpg`;

type BlogPostingSchemaProps = {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  keywords?: string[];
};

export function BlogPostingSchema({
  title,
  description,
  slug,
  publishedAt,
  keywords = [],
}: BlogPostingSchemaProps) {
  const url = `${SITE_ORIGIN}/blog/${slug}`;
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
    inLanguage: "en",
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

export { DEFAULT_OG_IMAGE, SITE_ORIGIN };
