/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Article, Restaurant } from "./types";

export const fetchRestaurantsData = async (): Promise<Restaurant[] | null> => {
  const catchedData = sessionStorage.getItem("restaurantsData");
  if (catchedData) {
    console.log("Loading from cache...");
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

    sessionStorage.setItem("restaurantData", JSON.stringify(safeData));

    return safeData;
  }

  return null;
};

export const fetchArticlesData = async (): Promise<Article[] | null> => {
  const catchedData = sessionStorage.getItem("articlesData");
  if (catchedData) {
    console.log("Loading from cache...");
    return JSON.parse(catchedData);
  }

  let rawResult: any = null;

  try {
    console.log("Fetching https...");
    const response = await fetch(
      "https://app.lemanh0902.id.vn:2025/article/"
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
      categories: item.categories || [],
    }));

    sessionStorage.setItem("articlesData", JSON.stringify(safeData));

    return safeData;
  }

  return null;
};
