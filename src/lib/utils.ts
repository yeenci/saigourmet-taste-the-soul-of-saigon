/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Article, Restaurant } from "./types";
import { MOCK_USERS, MOCK_RESTAURANTS, MOCK_ARTICLES } from "../data/mockData";

const KEY_USERS = "mock_users";
const KEY_RESTAURANTS = "mock_restaurants";
const KEY_BOOKINGS = "mock_bookings";

(function initializeMockData() {
  if (typeof window !== "undefined") {
    if (!localStorage.getItem(KEY_USERS)) {
      localStorage.setItem(KEY_USERS, JSON.stringify(MOCK_USERS));
    }
    if (!localStorage.getItem(KEY_RESTAURANTS)) {
      localStorage.setItem(KEY_RESTAURANTS, JSON.stringify(MOCK_RESTAURANTS));
    }
    if (!localStorage.getItem(KEY_BOOKINGS)) {
      localStorage.setItem(KEY_BOOKINGS, JSON.stringify([]));
    }
  }
})();

// Helper to create a fake JWT
const createMockJwt = (user: any) => {
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(
    JSON.stringify({
      sub: user.email,
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
    })
  );
  return `${header}.${payload}.fakesignature`;
};

const getLS = (key: string) => JSON.parse(localStorage.getItem(key) || "[]");
const setLS = (key: string, data: any) =>
  localStorage.setItem(key, JSON.stringify(data));

export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  console.log(`[MOCK API] ${options.method || "GET"} ${endpoint}`);

  await new Promise((resolve) => setTimeout(resolve, 600));

  const method = options.method || "GET";

  let body: any = {};
  if (options.body) {
    try {
      body = JSON.parse(options.body as string);
    } catch (e) {
      body = {};
    }
  }

  let status = 200;
  let responseData: any = {};

  if (endpoint.includes("/auth/login")) {
    const users = getLS(KEY_USERS);
    const params = new URLSearchParams(options.body as string);
    const username = params.get("username");
    const password = params.get("password");

    const user = users.find(
      (u: any) => u.email === username && u.password === password
    );

    if (user) {
      responseData = { access_token: createMockJwt(user) };
    } else {
      status = 401;
      responseData = { detail: "Invalid credentials" };
    }
  }

  // 2. AUTH: REGISTER
  else if (endpoint.includes("/user/register")) {
    const users = getLS(KEY_USERS);
    if (users.find((u: any) => u.email === body.email)) {
      status = 400;
      responseData = { code: -1, message: "Email already exists" };
    } else {
      const newUser = {
        id: `user-${Date.now()}`,
        ...body,
        isAdmin: false,
      };
      users.push(newUser);
      setLS(KEY_USERS, users);
      status = 201;
      responseData = { message: "User registered" };
    }
  }

  // 3. AUTH: USER PROFILE
  else if (endpoint.includes("/user/me")) {
    const token = (options.headers as any)?.Authorization?.split(" ")[1];
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const users = getLS(KEY_USERS);
        const user = users.find((u: any) => u.email === payload.email);
        if (user) {
          responseData = { data: user };
        } else {
          status = 401;
        }
      } catch (e) {
        status = 401;
      }
    } else {
      status = 401;
    }
  }

  // 4. AUTH: OTP (Mock)
  else if (endpoint.includes("/auth/request-otp")) {
    responseData = { session_id: "mock-session-id", message: "OTP Sent" };
  } else if (endpoint.includes("/auth/verify-otp")) {
    if (body.otp === "123456") {
      responseData = { code: 1, message: "Verified" };
    } else {
      status = 400;
      responseData = { detail: "Invalid OTP" };
    }
  } else if (endpoint.includes("/auth/reset-password")) {
    responseData = { code: 1, message: "Password Reset" };
  }

  // 5. DATA: RESTAURANTS
  else if (endpoint === "/restaurant/" || endpoint === "/admin/restaurants") {
    responseData = getLS(KEY_RESTAURANTS);
  }

  // 6. ADMIN: CREATE RESTAURANT
  else if (endpoint.includes("/admin/restaurant/create")) {
    const restaurants = getLS(KEY_RESTAURANTS);
    const newRest = {
      ...body,
      restaurantId: `r-${Date.now()}`,
      rating: Number(body.rating),
      categories: body.categories || [],
    };
    restaurants.push(newRest);
    setLS(KEY_RESTAURANTS, restaurants);
    responseData = { message: "Created" };
  }

  // 7. ADMIN: UPDATE/DELETE RESTAURANT
  else if (endpoint.includes("/admin/restaurant/") && method === "PUT") {
    const id = endpoint.split("/").pop();
    const restaurants = getLS(KEY_RESTAURANTS);
    const index = restaurants.findIndex((r: any) => r.restaurantId === id);
    if (index !== -1) {
      restaurants[index] = { ...restaurants[index], ...body };
      setLS(KEY_RESTAURANTS, restaurants);
      responseData = { message: "Updated" };
    }
  } else if (endpoint.includes("/admin/restaurant/") && method === "DELETE") {
    const id = endpoint.split("/").pop();
    const restaurants = getLS(KEY_RESTAURANTS);
    const filtered = restaurants.filter((r: any) => r.restaurantId !== id);
    setLS(KEY_RESTAURANTS, filtered);
    responseData = { message: "Deleted" };
  }

  // 8. DATA: ARTICLES
  else if (endpoint.includes("/article/")) {
    responseData = MOCK_ARTICLES;
  }

  // 9. BOOKING: CREATE
  else if (endpoint.includes("/user/booking") && method === "POST") {
    const bookings = getLS(KEY_BOOKINGS);
    const newBooking = {
      booking_id: `b-${Date.now()}`,
      user_id: "current-user",
      booking_status: -1, // Pending
      ...body,
    };
    bookings.push(newBooking);
    setLS(KEY_BOOKINGS, bookings);
    responseData = { message: "Booking Created" };
  }

  // 10. BOOKING: GET USER HISTORY
  else if (endpoint.includes("/user/booking") && method === "GET") {
    responseData = getLS(KEY_BOOKINGS);
  }

  // 11. BOOKING: ADMIN GET LIST
  else if (
    endpoint.includes("/admin/restaurant/") &&
    endpoint.includes("/booking")
  ) {
    const bookings = getLS(KEY_BOOKINGS);
    const restId = endpoint.split("/")[3];
    const filtered = bookings.filter((b: any) => b.restaurant_id === restId);
    responseData = filtered;
  }

  // 12. BOOKING: ADMIN ACCEPT/REJECT
  else if (endpoint.includes("/admin/booking/")) {
    const parts = endpoint.split("/");
    const id = parts[3];
    const action = parts[4];

    const bookings = getLS(KEY_BOOKINGS);
    const index = bookings.findIndex((b: any) => b.booking_id === id);

    if (index !== -1) {
      bookings[index].booking_status = action === "accept" ? 1 : 0;
      setLS(KEY_BOOKINGS, bookings);
      responseData = { message: `Booking ${action}ed` };
    } else {
      status = 404;
    }
  }
  // 13. BOOKING: USER DELETE/CANCEL
  else if (endpoint.includes("/user/booking/") && method === "DELETE") {
    const id = endpoint.split("/").pop();
    const bookings = getLS(KEY_BOOKINGS);
    const filtered = bookings.filter((b: any) => b.booking_id !== id);
    setLS(KEY_BOOKINGS, filtered);
  }

  return new Response(JSON.stringify(responseData), {
    status: status,
    statusText: status === 200 ? "OK" : "Error",
    headers: { "Content-Type": "application/json" },
  });
};

export const fetchRestaurantsData = async (): Promise<Restaurant[] | null> => {
  const res = await apiRequest("/restaurant/");
  return res.json();
};

export const fetchArticlesData = async (): Promise<Article[] | null> => {
  return MOCK_ARTICLES;
};
