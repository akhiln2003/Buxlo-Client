import { Database, Pencil, Plus } from "lucide-react";

function AddWalletAndBankAccount() {
  return (
    <div className=" w-full h-24 bg-zinc-100 dark:bg-zinc-900 flex items-center pl-5 space-x-5">
      <div className="w-52 h-[3rem] rounded-sm  bg-zinc-800 flex space-x-5  font-cabinet text-sm text-zinc-400 cursor-default px-2 ">
        <div className="w-full h-full  flex items-center">
          <Database size={20} className="mr-2" /> Add Wallet
        </div>
        <Pencil size={20} className="mt-2 cursor-pointer" />
      </div>
      <div className="w-52 h-[3rem]  rounded-sm  bg-zinc-800 flex space-x-5  font-cabinet text-sm text-zinc-400 cursor-default px-2 ">
        <div className="w-full h-full flex items-center">
          <Database size={20} className="mr-2" /> Add Account
        </div>
        <Pencil size={20} className="mt-2 cursor-pointer" />
      </div>
      <div className="w-52 h-[3rem]   border-dotted border-2  rounded-sm  border-zinc-400 flex items-center justify-center font-cabinet text-sm text-zinc-400 cursor-pointer">
        <Plus size={20} /> Add Account
      </div>
    </div>
  );
}

export default AddWalletAndBankAccount;
