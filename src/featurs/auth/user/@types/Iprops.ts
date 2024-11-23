import { Dispatch, SetStateAction } from "react";

export interface IsignUpOptionProps {
    setIsFormVisible: Dispatch<SetStateAction<boolean>>;

}

export interface IsignUpFormPageProps{
    setIsFormVisible: Dispatch<SetStateAction<boolean>>;
}

export interface IsignUnFormProps {
    setIsFormFilled: React.Dispatch<React.SetStateAction<boolean>>;
  }