import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { allLocaleAlternates, localePath } from "@/i18n/localePaths";
import { DEFAULT_LANGUAGE, type AppLanguage } from "@/i18n/constants";
import { DEFAULT_OG_IMAGE, SITE_ORIGIN } from "./BlogPostingSchema";

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  keywords?: string[];
  locale?: AppLanguage;
};

const siteName = "BUSY STRONG 90";

export function PageMeta({
  title,
  description,
  path = "",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  keywords,
  locale,
}: PageMetaProps) {
  const { i18n } = useTranslation();
  const activeLocale = locale ?? ((i18n.language?.split("-")[0] ?? DEFAULT_LANGUAGE) as AppLanguage);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const canonical = `${SITE_ORIGIN}${localePath(normalizedPath, activeLocale)}`;
  const alternates = allLocaleAlternates(normalizedPath, SITE_ORIGIN);

  return (
    <Helmet>
      <html lang={activeLocale} />
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && <meta name="keywords" content={keywords.join(", ")} />}
      <link rel="canonical" href={canonical} />
      {alternates.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hrefLang={hreflang} href={href} />
      ))}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:locale" content={activeLocale === "sr" ? "sr_RS" : activeLocale === "ar" ? "ar_AE" : "en_GB"} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteName} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
