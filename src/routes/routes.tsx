import UserLayout from "@/layout/UserLayout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const LandingPage = lazy(()=>import('@/pages/UserLandingPage')) 

// @ts-ignore
const routes = createBrowserRouter([
  {
    path: '/',
    element: < UserLayout />,
    children: [
      {
        path: '',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <LandingPage />
          </Suspense>
        ),
      },
    ],
  },
], {
  future: {
    // v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export default routes;
