import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, META_PIXEL_ID, trackPageView, trackViewContentForPath } from "@/lib/metaPixel";

/** Tracks PageView + ViewContent on route changes for the Meta Pixel SPA. */
export function MetaPixel() {
  const location = useLocation();

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    initMetaPixel();
    trackPageView();
    trackViewContentForPath(location.pathname);
  }, [location.pathname, location.search]);

  if (!META_PIXEL_ID) return null;

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}
