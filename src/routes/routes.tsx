import { MentorUrl } from "@/@types/urlEnums/MentorUrl";
import { UserUrls } from "@/@types/urlEnums/UserUrls";
import MentorLayout from "@/layout/MentorLayout";
import UserLayout from "@/layout/UserLayout";
import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";


      // User side  
const UserLandingPage = lazy(()=>import('@/pages/UserLandingPage'));
const UserSignIn = lazy(()=>import('@/features/auth/user/pages/SignIn'));
const UserSignUp = lazy(()=> import('@/features/auth/user/pages/SignUp'));
const UserOtpPage = lazy(()=>import('@/features/auth/user/pages/Otp'))


const MentorLandingPage = lazy(()=>import("@/pages/MentorLandingPage"))



const routes = createBrowserRouter([
  {
    path: UserUrls.home,
    element: < UserLayout />,
    children: [
      {
        path: UserUrls.home,
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            < UserLandingPage />
          </Suspense>
        ),
      },
      {
        path: UserUrls.signIn,
        element:(
          <Suspense fallback={ <div>Loading....</div> }>
            < UserSignIn />
          </Suspense>
        )
      },
      {
        path: UserUrls.signUp,
        element:(
          <Suspense fallback= { <div>Loading....</div>}>
            <UserSignUp/>
          </Suspense>
        )
      },
     {
      path: UserUrls.otp,
      element: (
        <Suspense fallback={ <div>Loading....</div> }>
          < UserOtpPage />
        </Suspense>
      )
     }
    ],
  },
  {
    path: MentorUrl.home,
    element: < MentorLayout />,
    children: [
      {
        path: MentorUrl.home,
        element: (
          < Suspense fallback={ <div>Loading....</div> }>
              < MentorLandingPage />
          </Suspense>
        )
      }
    ]
  }
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
