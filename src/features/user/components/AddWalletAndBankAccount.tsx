import { Database, Pencil, CreditCard, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import {
  useFetchUserWalletMutation,
  useUpdateWalletNameMutation,
} from "@/services/apis/CommonApis";

interface Iwallet {
  id?: string;
  name: string;
  balance: number;
}
function AddWalletAndBankAccount() {
  const [activeTab, setActiveTab] = useState("wallet"); // "wallet", "bank",
  const user = useGetUser();
  const [wallet, setWallet] = useState<Iwallet | null>(null);
  const [walletName, setWalletName] = useState<string>("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [fetchWalletData] = useFetchUserWalletMutation();
  const [updateWalletName] = useUpdateWalletNameMutation();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response: IaxiosResponse = await fetchWalletData(user?.id);
      if (response.data) {
        setWallet(response.data);
        setWalletName(response.data.name);
      } else {
        console.error("Error fetching wallet:", response.error);
        setWallet(null);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handilChangeWalletName = async () => {
    try {
      const response: IaxiosResponse = await updateWalletName({
        id: wallet?.id as string,
        name: walletName,
      });
      if (response.data) {
        setWallet(response.data.updateData);
        setWalletName(response.data.updateData.name);
        setIsEditDialogOpen(false);
      } else {
        console.error("Error fetching wallet:", response.error);
        setWallet(null);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-6">
      {/* Tab Navigation - Filter button removed from here */}
      <div className="flex mb-4 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex-grow flex">
          <button
            onClick={() => setActiveTab("wallet")}
            className={`px-4 py-2 flex items-center text-sm font-medium ${
              activeTab === "wallet"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Wallet size={18} className="mr-2" />
            Wallets
          </button>
          <button
            onClick={() => setActiveTab("bank")}
            className={`px-4 py-2 flex items-center text-sm font-medium ${
              activeTab === "bank"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <Database size={18} className="mr-2" />
            Bank Accounts
          </button>
        </div>
      </div>

      {/* Content based on active tab */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "wallet" && (
          <>
            {/* Existing wallet item with improved styling */}
            <div className="w-full h-auto rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                  <Wallet size={20} className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">
                    {wallet?.name ? wallet.name : "User"}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    ₹ {wallet?.balance ? wallet.balance : 0}
                  </p>
                </div>
              </div>
              <Dialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
              >
                <DialogTrigger asChild>
                  <Pencil
                    size={18}
                    className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                    aria-label="Edit wallet"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Wallet Name</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label
                        htmlFor="name"
                        className="text-right text-sm font-medium"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        value={walletName}
                        onChange={(e) => setWalletName(e.target.value)}
                        className="col-span-3 flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400  rounded-md text-sm"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={async () => {
                        await handilChangeWalletName();
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white rounded-md text-sm"
                    >
                      Save
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Add new wallet button */}
            {/* <div
              className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
              role="button"
              aria-label="Add wallet"
            >
              <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                <Plus size={24} className="mb-2" />
                <span className="text-sm font-medium">Add New Wallet</span>
              </div>
            </div> */}
          </>
        )}

        {activeTab === "bank" && (
          <>
            <div
              className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
              // onClick={() => open()}
              role="button"
              aria-label="Connect bank account"
            >
              <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                <Database size={24} className="mb-2" />
                <span className="text-sm font-medium">
                  Connect Bank Account
                </span>
              </div>
            </div>
          </>
        )}

        {activeTab === "card" && (
          <div
            className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
            role="button"
            aria-label="Add credit card"
          >
            <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
              <CreditCard size={24} className="mb-2" />
              <span className="text-sm font-medium">Add Credit Card</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddWalletAndBankAccount;
