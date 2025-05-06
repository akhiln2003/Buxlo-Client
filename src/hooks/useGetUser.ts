import { IuserDB } from "@/@types/interface/IdataBase";
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export const useGetUser=()=>{
    const { user }:{user:IuserDB | null} = useSelector((state: RootState) => state.userAuth);
    return user
}