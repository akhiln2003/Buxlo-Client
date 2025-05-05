import { Iuser } from "@/@types/interface/Iuser";
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export const useGetUser=()=>{
    const { user }:{user:Iuser | null} = useSelector((state: RootState) => state.userAuth);
    return user
}