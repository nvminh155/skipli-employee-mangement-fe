// export const port = process.env.PORT ?? 3000;
// export const host = process.env.VERCEL_URL
//   ? `https://${process.env.VERCEL_URL}`
//   : `http://localhost:${port}`;

export const publicRoute = {
  "/": ["/"],
  "/login": ["/login"],
  "/verify": ["/verify"],
} as const;

export type TPublicRoute = typeof publicRoute;
export type TRoutePaths = keyof TPublicRoute;
