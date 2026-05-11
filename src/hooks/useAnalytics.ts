import { useEffect } from "react";
import { trackEvent } from "@/lib/appwrite";

export function usePageView(page: string) {
  useEffect(() => {
    trackEvent({ type: "page_view", page });
  }, [page]);
}
