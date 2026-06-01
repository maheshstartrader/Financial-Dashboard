import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },

    // SAFE DEFAULTS (add this for stability)
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,

    // 👇 ADD THIS
    defaultPreload: "intent",
  });

  return router;
};