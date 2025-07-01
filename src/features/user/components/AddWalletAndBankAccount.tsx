import { Database, Pencil, Wallet, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import {
  useCreateWalletMutation,
  useFetchUserWalletMutation,
  useUpdateWalletNameMutation,
} from "@/services/apis/CommonApis";

interface Iwallet {
  id: string;
  name: string;
  balance: number;
}

interface InewWallet {
  name: string;
  balance: number;
  userId: string;
}

type IchangeWalletName = Omit<Iwallet, "balance">;

function AddWalletAndBankAccount() {
  const [activeTab, setActiveTab] = useState("wallet");
  const user = useGetUser();

  const [wallet, setWallet] = useState<Iwallet[] | null>(null);
  const [changeWalletName, setChangeWalletName] = useState<IchangeWalletName>({
    id: "",
    name: "",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWallet, setNewWallet] = useState<InewWallet>({
    name: "",
    userId: "",
    balance: 0,
  });

  const [fetchWalletData] = useFetchUserWalletMutation();
  const [updateWalletName] = useUpdateWalletNameMutation();
  const [createWallet] = useCreateWalletMutation();

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const response: IaxiosResponse = await fetchWalletData(user?.id);
      if (response.data) {
        setWallet(response.data);
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
      const response: IaxiosResponse = await updateWalletName(changeWalletName);
      if (response.data) {
        setWallet(
          (prev) =>
            prev?.map((w) =>
              w.id === changeWalletName.id
                ? { ...w, name: response.data.updateData.name }
                : w
            ) || []
        );
        setIsEditDialogOpen(false);
      } else {
        errorTost(
          "Something went wrong",
          response.error.data.error || [
            { message: `${response.error.data} please try again later` },
          ]
        );
      }
    } catch (error) {
      console.error("error:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handleCreateWallet = async () => {
    try {
      newWallet.userId = user?.id as string;
      const response: IaxiosResponse = await createWallet(newWallet);
      if (response.data) {
        setWallet((prev) => [...(prev || []), response.data]);
        setNewWallet({
          userId: "",
          name: "",
          balance: 0,
        });
        setIsCreateDialogOpen(false);
        fetchWallet();
      } else {
        console.error("Error creating wallet:", response.error);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 mb-6">
      {/* Tabs */}
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

      {/* Tab Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTab === "wallet" && (
          <>
            {/* Wallet Card */}
            {wallet?.map((w) => (
              <div
                key={w.id}
                className="w-full h-auto rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-between p-4"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Wallet size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium text-zinc-800 dark:text-zinc-200">
                      {w.name}
                    </p>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      ₹ {w.balance}
                    </p>
                  </div>
                </div>

                {/* Edit Dialog Per Wallet */}
                <Dialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Pencil
                      size={18}
                      className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                      aria-label="Edit wallet"
                      onClick={() => {
                        setChangeWalletName({ id: w.id, name: w.name });
                      }}
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
                        <Input
                          id="name"
                          value={changeWalletName.name}
                          onChange={(e) =>
                            setChangeWalletName((prev) => ({
                              ...prev,
                              name: e.target.value,
                            }))
                          }
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-md text-sm"
                        onClick={() => setIsEditDialogOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handilChangeWalletName}
                        className="px-4 py-2 bg-zinc-900 hover:bg-zinc-950 text-white rounded-md text-sm"
                      >
                        Save
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            ))}

            {/* Add Wallet Button with Create Modal */}
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
               {  wallet && wallet?.length < 5 && <div
                  className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
                  role="button"
                  aria-label="Add wallet"
                >
                  <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                    <Plus size={24} className="mb-2" />
                    <span className="text-sm font-medium">Add New Wallet</span>
                  </div>
                </div>}
              </DialogTrigger>

              <DialogContent className="sm:max-w-md w-full p-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900">
                <DialogHeader>
                  <DialogTitle className="text-lg font-semibold mb-1 text-zinc-900 dark:text-zinc-100">
                    Create New Wallet
                  </DialogTitle>
                  <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
                    Add a wallet name and starting amount to begin tracking.
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-4">
                  <div>
                    <label
                      htmlFor="wallet-name"
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Wallet Name
                    </label>
                    <Input
                      id="wallet-name"
                      value={newWallet?.name}
                      onChange={(e) =>
                        setNewWallet((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="e.g., Travel Wallet"
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="wallet-amount"
                      className="block mb-1 text-sm font-medium text-zinc-700 dark:text-zinc-300"
                    >
                      Initial Amount
                    </label>
                    <Input
                      id="wallet-amount"
                      type="number"
                      value={newWallet.balance}
                      onChange={(e) =>
                        setNewWallet((prev) => ({
                          ...prev,
                          balance: Number(e.target.value) || 0,
                        }))
                      }
                      placeholder="e.g., 1000"
                      className="w-full"
                    />
                  </div>
                </div>

                <DialogFooter className="mt-6 flex justify-end gap-2">
                  <button
                    className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-100"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateWallet}
                    className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Create Wallet
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </>
        )}

        {activeTab === "bank" && (
          <div
            className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
            role="button"
            aria-label="Connect bank account"
          >
            <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
              <Database size={24} className="mb-2" />
              <span className="text-sm font-medium">Connect Bank Account</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddWalletAndBankAccount;
