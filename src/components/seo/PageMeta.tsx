import { Helmet } from "react-helmet-async";

type PageMetaProps = {
  title: string;
  description: string;
  path?: string;
};

const siteName = "BUSY STRONG 90";
const origin = typeof window !== "undefined" ? window.location.origin : "https://busystrong90.com";

export function PageMeta({ title, description, path = "" }: PageMetaProps) {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
  const url = `${origin}${path.startsWith("/") ? path : `/${path}`}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
}
