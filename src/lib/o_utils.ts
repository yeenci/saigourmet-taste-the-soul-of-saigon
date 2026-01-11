/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Article, Restaurant } from "./types";

const getBaseUrl = () => {
  return import.meta.env.DEV ? "/api" : "https://app.lemanh0902.id.vn:2025";
};

export const fetchRestaurantsData = async (): Promise<Restaurant[] | null> => {
  // 1. Check Cache
  const catchedData = sessionStorage.getItem("restaurantsData");

  if (catchedData) {
    try {
      const parsed = JSON.parse(catchedData);

      const isValidCache =
        Array.isArray(parsed) &&
        (parsed.length === 0 || parsed[0].restaurantId !== undefined);

      if (isValidCache) {
        console.log("Loading restaurants from cache...");
        return parsed;
      } else {
        console.warn(
          "Cached data is missing 'restaurantId'. Clearing cache and refetching..."
        );
        sessionStorage.removeItem("restaurantsData");
      }
    } catch (e) {
      console.error("Error parsing cache:", e);
      sessionStorage.removeItem("restaurantsData");
    }
  }

  try {
    console.log("Fetching Restaurant Data...");
    const response = await fetch(`${getBaseUrl()}/restaurant/`);
    if (!response.ok) throw new Error("Failed to fetch restaurants");

    const rawResult = await response.json();
    const dataArray = Array.isArray(rawResult)
      ? rawResult
      : rawResult.data || [];

    const safeData = dataArray.map((item: any) => ({
      ...item,
      restaurantId:
      item.restaurantId || item.id || item.restaurant_id || item._id,
      categories: item.categories || [],
    }));

    sessionStorage.setItem("restaurantsData", JSON.stringify(safeData));
    return safeData;
  } catch (error) {
    console.error("Restaurant fetch error:", error);
    return null;
  }
};

const calculateReadTime = (content: string): string => {
  if (!content) return "< 1 min read";
  const words = content.trim().split(/\s+/).length;
  return `${Math.ceil(words / 200)} min read`;
};

export const fetchArticlesData = async (): Promise<Article[] | null> => {
  const catchedData = sessionStorage.getItem("articlesData");
  if (catchedData) {
    return JSON.parse(catchedData);
  }

  try {
    const response = await fetch(`${getBaseUrl()}/article/`);
    if (!response.ok) throw new Error("Failed to fetch articles");

    const rawResult = await response.json();
    const dataArray = Array.isArray(rawResult)
      ? rawResult
      : rawResult.data || [];

    const safeData = dataArray.map((item: any) => ({
      ...item,
      articleId:
      item.articleId || item.id || item.article_id || item._id,
      category: item.category || [],
      readTime: calculateReadTime(item.content || ""),
    }));

    sessionStorage.setItem("articlesData", JSON.stringify(safeData));
    return safeData;
  } catch (error) {
    console.error("Article fetch error:", error);
    return null;
  }
};

export const apiRequest = async (
  endpoint: string,
  options?: RequestInit
): Promise<Response> => {
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${getBaseUrl()}${path}`;
  return fetch(url, options);
};
