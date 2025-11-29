/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Article, Restaurant } from "./types";

export const fetchRestaurantsData = async (): Promise<Restaurant[] | null> => {
  const catchedData = sessionStorage.getItem("restaurantsData");
  if (catchedData) {
    console.log("Loading restaurants from cache...");
    return JSON.parse(catchedData);
  }

  let rawResult: any = null;

  try {
    console.log("Fetching https...");
    const response = await fetch(
      "https://app.lemanh0902.id.vn:2025/restaurant/"
    );
    if (!response.ok) throw new Error("Direct link error");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      rawResult = await response.json();
    }
  } catch (e) {
    console.warn(
      "Direct fetch failed (likely unsafe/SSL error). Switching to fallback..."
    );

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/restaurant/`);
      if (!response.ok) throw new Error("Fallback link error");

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        rawResult = await response.json();
      }
    } catch (fE) {
      console.error("Both fetch attempts failed:", fE);
      return null;
    }
  }

  if (rawResult) {
    const dataArray = Array.isArray(rawResult)
      ? rawResult
      : rawResult.data || [];

    const safeData = dataArray.map((item: any) => ({
      ...item,
      categories: item.categories || [],
    }));

    sessionStorage.setItem("restaurantsData", JSON.stringify(safeData));

    return safeData;
  }

  return null;
};

const calculateReadTime = (content: string): string => {
  if (!content) return "~1 min read";

  // Split by regex \s+ to handle spaces, tabs, and newlines
  const words = content.trim().split(/\s+/).length;
  const wordsPerMinute = 200; // Average reading speed
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
};

export const fetchArticlesData = async (): Promise<Article[] | null> => {
  const catchedData = sessionStorage.getItem("articlesData");
  if (catchedData) {
    console.log("Loading articles from cache...");
    return JSON.parse(catchedData);
  }

  let rawResult: any = null;

  try {
    console.log("Fetching https...");
    const response = await fetch("https://app.lemanh0902.id.vn:2025/article/");
    if (!response.ok) throw new Error("Direct link error");

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      rawResult = await response.json();
    }
  } catch (e) {
    console.warn(
      "Direct fetch failed (likely unsafe/SSL error). Switching to fallback..."
    );

    try {
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/article/`);
      if (!response.ok) throw new Error("Fallback link error");

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        rawResult = await response.json();
      }
    } catch (fE) {
      console.error("Both fetch attempts failed:", fE);
      return null;
    }
  }

  if (rawResult) {
    const dataArray = Array.isArray(rawResult)
      ? rawResult
      : rawResult.data || [];

    const safeData = dataArray.map((item: any) => ({
      ...item,
      category: item.category || [],
      readTime: calculateReadTime(item.content || ""),
    }));

    sessionStorage.setItem("articlesData", JSON.stringify(safeData));

    return safeData;
  }

  return null;
};

export const apiRequest = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    // Attempt 1: Direct Port 2025
    const res = await fetch(
      `https://app.lemanh0902.id.vn:2025${path}`,
      options
    );
    return res;
  } catch (err) {
    console.warn(
      `Direct fetch failed for ${path}. Retrying with fallback...`,
      err
    );
    // Attempt 2: Fallback (Proxy/Env)
    const apiUrl = import.meta.env.VITE_API_URL || "/api";
    return fetch(`${apiUrl}${path}`, options);
  }
};