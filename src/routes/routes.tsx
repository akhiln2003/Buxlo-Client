import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import UserLayout from "@/layout/UserLayout";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import MentorLayout from "@/layout/MentorLayout";
import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import AdminLayout from "@/layout/AdminLayout";
import { AdminUrls } from "@/@types/urlEnums/AdminUrl";
import RedirectSignInAdmin from "./protected/RedirectSignInAdmin";
import RedirectSignInUser from "./protected/RedirectSignInUser";
import AdminProtected from "./protected/AdminProtected";
import RedirectSignInMentor from "./protected/RedirectSignInMentor";
import ErrorPage404 from "@/components/error/ErrorPage404";
import ErrorPage500 from "@/components/error/ErrorPage500";

////////////////////////--User side--/////////////////////
const UserLandingPage = lazy(() => import("@/pages/UserLandingPage"));
const UserSignIn = lazy(() => import("@/features/auth/user/pages/SignIn"));
const UserSignUp = lazy(() => import("@/features/auth/user/pages/SignUp"));
const UserOtpPage = lazy(() => import("@/features/auth/user/pages/Otp"));
const UserForgotPasswordPage = lazy(
  () => import("@/features/auth/user/pages/forgotPassword")
);
const UserSetNewPassword = lazy(
  () => import("@/features/auth/user/pages/newPassword")
);
const UserDashbordPage = lazy(()=> import('@/features/user/pages/dashBord'));




////////////////////////--Mentor side--/////////////////////
const MentorLandingPage = lazy(() => import("@/pages/MentorLandingPage"));
const MentorSignIn = lazy(() => import("@/features/auth/mentor/pages/singIn"));
const MentorSignUp = lazy(() => import("@/features/auth/mentor/pages/signUp"));
const MentorOtpPage = lazy(() => import("@/features/auth/mentor/pages/otp"));
const MentorForgotPasswordPage = lazy(
  () => import("@/features/auth/mentor/pages/forgotPassword")
);
const MentorSetNewPassword = lazy(
  () => import("@/features/auth/mentor/pages/newPassword")
);



////////////////////////--Admin side--/////////////////////
const AdminSignInPage = lazy(
  () => import("@/features/auth/admin/pages/SignIn")
);
const AdminDashbordPage = lazy(
  () => import("@/features/auth/admin/pages/Dashbord")
);
const AdminUserManagementPage = lazy(
  () => import("@/features/auth/admin/pages/UserManagement")
);

const AdminMentorManagementPage = lazy(
  () => import("@/features/auth/admin/pages/MentorManagement")
);

const routes = createBrowserRouter(
  [
    ////////////////--User--/////////////////////
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
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading....</div>}>
                <UserSignIn />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: UserUrls.signUp,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading....</div>}>
                <UserSignUp />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: UserUrls.otp,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading....</div>}>
                <UserOtpPage />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: UserUrls.forgotPassword,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading...</div>}>
                <UserForgotPasswordPage />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: UserUrls.setNewPassword,
          element: (
            <RedirectSignInUser>
              <Suspense fallback={<div>Loading...</div>}>
                <UserSetNewPassword />
              </Suspense>
            </RedirectSignInUser>
          ),
        },
        {
          path: UserUrls.dashbord,
          element: (
            <Suspense fallback={<div>Loading....</div>}>
              <UserDashbordPage />
            </Suspense>
          )
        }
      ],
    },

    ////////////////--User end--///////////////////

    ////////////////--Mentor--/////////////////////

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
        {
          path: MentorUrl.signIn,
          element: (
            <RedirectSignInMentor>
              <Suspense fallback={<div>Loading....</div>}>
                <MentorSignIn />
              </Suspense>
            </RedirectSignInMentor>
          ),
        },
        {
          path: MentorUrl.signUp,
          element: (
            <RedirectSignInMentor>
              <Suspense fallback={<div>Loading....</div>}>
                <MentorSignUp />
              </Suspense>
            </RedirectSignInMentor>
          ),
        },
        {
          path: MentorUrl.otp,
          element: (
            <RedirectSignInMentor>
              <Suspense fallback={<div>Loading....</div>}>
                <MentorOtpPage />
              </Suspense>
            </RedirectSignInMentor>
          ),
        },
        {
          path: MentorUrl.forgotPassword,
          element: (
            <RedirectSignInMentor>
              <Suspense fallback={<div>Loading...</div>}>
                <MentorForgotPasswordPage />
              </Suspense>
            </RedirectSignInMentor>
          ),
        },
        {
          path: MentorUrl.setNewPassword,
          element: (
            <RedirectSignInMentor>
              <Suspense fallback={<div>Loading...</div>}>
                <MentorSetNewPassword />
              </Suspense>
            </RedirectSignInMentor>
          ),
        },
      ],
    },

    ////////////////--Mentor end--///////////////////

    /////////////////--Admin--//////////////////////

    {
      path: AdminUrls.home,
      element: <AdminLayout />,
      children: [
        {
          path: AdminUrls.home,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading....</div>}>
                <AdminDashbordPage />
              </Suspense>
            </AdminProtected>
          ),
        },
        {
          path: AdminUrls.signIn,
          element: (
            <RedirectSignInAdmin>
              <Suspense fallback={<div>Loading....</div>}>
                <AdminSignInPage />
              </Suspense>
            </RedirectSignInAdmin>
          ),
        },
        {
          path: AdminUrls.dashbord,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading....</div>}>
                <AdminDashbordPage />
              </Suspense>
            </AdminProtected>
          ),
        },
        {
          path: AdminUrls.userManagement,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading.....</div>}>
                <AdminUserManagementPage />
              </Suspense>
            </AdminProtected>
          ),
        },
        {
          path: AdminUrls.mentorManagement,
          element: (
            <AdminProtected>
              <Suspense fallback={<div>Loading.....</div>}>
                <AdminMentorManagementPage />
              </Suspense>
            </AdminProtected>
          ),
        },
      ],
    },
    {path:'/servererror', element: <ErrorPage500/>},
    { path: "*", element: < ErrorPage404 /> },
    ////////////////--Admin end--///////////////////
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
