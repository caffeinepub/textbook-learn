import { Header } from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
import { LandingPage } from "@/pages/LandingPage";
import { StudyPage } from "@/pages/StudyPage";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";

// Route definitions
const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <div className="min-h-screen">
        <Header />
        <Outlet />
      </div>
      <Toaster position="top-right" richColors />
    </ThemeProvider>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

const studyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/study/$bookId",
  component: StudyPage,
});

const routeTree = rootRoute.addChildren([indexRoute, studyRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
