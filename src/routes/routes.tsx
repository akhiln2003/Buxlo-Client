import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import MentorLayout from "@/layout/MentorLayout";
import UserLayout from "@/layout/UserLayout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import RedirectLoggedIn from "./protected/RedirectLoggedIn";

// User side
const UserLandingPage = lazy(() => import("@/pages/UserLandingPage"));
const UserSignIn = lazy(() => import("@/features/auth/user/pages/SignIn"));
const UserSignUp = lazy(() => import("@/features/auth/user/pages/SignUp"));
const UserOtpPage = lazy(() => import("@/features/auth/user/pages/Otp"));
const UserForgotPasswordPage = lazy(
  () => import("@/features/auth/user/pages/forgotPassword")
);
const UserSetNewPassword = lazy(()=>import('@/features/auth/user/pages/newPassword'));

const MentorLandingPage = lazy(() => import("@/pages/MentorLandingPage"));

const routes = createBrowserRouter(
  [
    {
      path: UserUrls.home,
      element: <UserLayout />,
      children: [
        {
          path: UserUrls.home,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
              <UserLandingPage />
            </Suspense>
          ),
        },
        {
          path: UserUrls.signIn,
          element: (
            <RedirectLoggedIn>
              <Suspense fallback={<div>Loading....</div>}>
                <UserSignIn />
              </Suspense>
            </RedirectLoggedIn>
          ),
        },
        {
          path: UserUrls.signUp,
          element: (
            <RedirectLoggedIn>
              <Suspense fallback={<div>Loading....</div>}>
                <UserSignUp />
              </Suspense>
            </RedirectLoggedIn>
          ),
        },
        {
          path: UserUrls.otp,
          element: (
            <RedirectLoggedIn>
              <Suspense fallback={<div>Loading....</div>}>
                <UserOtpPage />
              </Suspense>
            </RedirectLoggedIn>
          ),
        },
        {
          path: UserUrls.forgotPassword,
          element: (
            <RedirectLoggedIn>
              <Suspense fallback={<div>Loading...</div>}>
              <UserForgotPasswordPage />
              </Suspense>
            </RedirectLoggedIn>
          ),
        },
        {
          path: UserUrls.setNewPassword,
          element: (
            <Suspense fallback={<div>Loading...</div>}>
            < UserSetNewPassword />
            </Suspense>
          )
        },
      ],
    },
    {
      path: MentorUrl.home,
      element: <MentorLayout />,
      children: [
        {
          path: MentorUrl.home,
          element: (
            <Suspense fallback={<div>Loading....</div>}>
              <MentorLandingPage />
            </Suspense>
          ),
        },
      ],
    },
  ],
  {
    future: {
      // v7_startTransition: true,
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  }
);

export default routes;
