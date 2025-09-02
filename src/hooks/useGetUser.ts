import { IUserDB } from "@/@types/interface/IDataBase";
import { RootState } from "@/redux/store"
import { useSelector } from "react-redux"

export const useGetUser=()=>{
    const { user }:{user:IUserDB | null} = useSelector((state: RootState) => state.userAuth);
    return user
}