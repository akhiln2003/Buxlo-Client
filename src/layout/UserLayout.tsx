import { Outlet, useLocation } from 'react-router-dom';
import UserNavbar from '@/components/navbar/UserNavbar'; 

  function UserLayout() {
    const {pathname} = useLocation();
    console.log("Path name from userLayout:" , pathname);
    const routeWithoutNav = ['/signup' ,];
    const higeNavbar = routeWithoutNav.some(route => pathname.startsWith(route));
  return (
    <>
        {!higeNavbar && < UserNavbar /> }
        < Outlet />
    </>
  )
  }
  
  export default UserLayout