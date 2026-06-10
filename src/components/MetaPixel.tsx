import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, META_PIXEL_ID, trackPageView, trackViewContentForPath } from "@/lib/metaPixel";

/** Tracks PageView on SPA navigations + ViewContent (base PageView is in index.html). */
export function MetaPixel() {
  const location = useLocation();
  const isFirstView = useRef(true);

  useEffect(() => {
    if (!META_PIXEL_ID) return;
    initMetaPixel();
    trackViewContentForPath(location.pathname);
    if (isFirstView.current) {
      isFirstView.current = false;
      return;
    }
    trackPageView();
  }, [location.pathname, location.search]);

  return null;
}
