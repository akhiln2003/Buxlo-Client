import { MentorUrl } from '@/@types/urlEnums/MentorUrl';
import MentorNavbar from '@/components/navbar/MentorNavvar';
import { Outlet, useLocation } from 'react-router-dom'

function MentorLayout() {
    const { pathname } = useLocation();
    const routeWithoutNav = [ MentorUrl.signIn , MentorUrl.signUp ];
    const higeNavbar = routeWithoutNav.some(route => pathname.startsWith(route));

  return (
    <>
        { !higeNavbar && < MentorNavbar />}
        <div className={ higeNavbar ? "":'pt-16'}>  < Outlet /></div>

    </>
  )
}

export default MentorLayout