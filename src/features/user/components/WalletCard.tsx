import { IAxiosResponse } from "@/@types/interface/IAxiosResponse";
import { errorTost } from "@/components/ui/tosastMessage";
import {
  useCreateWalletMutation,
  useFetchUserWalletMutation,
} from "@/services/apis/CommonApis";
import { WalletMinimal, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface Iwallet {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

interface InewWallet {
  name: string;
  balance: number;
  userId: string;
}

interface WalletCardProps {
  userId: string | undefined;
  isPremium: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({ userId, isPremium }) => {
  const [wallet, setWallet] = useState<Iwallet[] | null>(null);
  const [newWallet, setNewWallet] = useState<InewWallet>({
    name: "",
    userId: "",
    balance: 0,
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [fetchWalletData] = useFetchUserWalletMutation();
  const [createWallet] = useCreateWalletMutation();

  const fetchWallet = async () => {
    try {
      if (!userId) return;
      const response: IAxiosResponse = await fetchWalletData(userId);
      if (response.data) {
        setWallet(response.data);
      } else {
        console.error("Error fetching wallet:", response.error);
        setWallet(null);
        errorTost("Wallet Load Failed", [
          { message: response.error.data?.error || "Please try again later" },
        ]);
      }
    } catch (error) {
      console.error("Error fetching wallet:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  const handleCreateWallet = async () => {
    try {
      newWallet.userId = userId as string;
      const response: IAxiosResponse = await createWallet(newWallet);
      if (response.data) {

        setWallet((prev) => [...(prev || []), response.data.newWallet]);
        setNewWallet({
          userId: "",
          name: "",
          balance: 0,
        });
        setIsCreateDialogOpen(false);
        fetchWallet();
      } else {
        console.error("Error creating wallet:", response.error);
        errorTost("Something wrong", [
          { message: response.error.data?.error || "Please try again later" },
        ]);
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
      errorTost("Something wrong", [
        { message: "Something went wrong please try again" },
      ]);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, [userId]);

  return (
    <div className="bg-violet-50 dark:bg-zinc-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow min-h-[300px] flex flex-col">
      <div className="flex items-center mb-4">
        <WalletMinimal className="w-6 h-6 text-violet-600 dark:text-violet-300" />
        <h2 className="ml-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
          Buxlo Wallet
        </h2>
      </div>
      <div className="border-t border-violet-100 dark:border-zinc-600 pt-4 flex flex-col justify-between flex-grow">
        {wallet && wallet.length > 0 ? (
          <>
            <div className="flex flex-col  flex-grow space-y-5 ">
              {wallet.map((walletItem) => (
                <div
                  key={walletItem.id}
                  className="bg-white dark:bg-zinc-800 rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <WalletMinimal className="w-5 h-5 text-violet-600 dark:text-violet-300 mr-2" />
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {walletItem.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                        ₹{walletItem.balance.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {isPremium && wallet && wallet.length < 5 && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <button className="w-full py-3 border-2 border-dashed border-violet-200 dark:border-zinc-500 rounded-lg text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-zinc-600 transition-colors font-medium flex items-center justify-center mt-4">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Another Wallet
                  </button>
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
                        value={newWallet.name}
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
            )}
          </>
        ) : (
          <div className="flex flex-col justify-between flex-grow">
            <p className="text-center text-gray-500 dark:text-gray-400 flex-grow flex items-center justify-center">
              Wallet Not Added
            </p>
            {isPremium && (
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <button className="w-full py-3 border-2 border-dashed border-violet-200 dark:border-zinc-500 rounded-lg text-violet-500 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-zinc-600 transition-colors font-medium flex items-center justify-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add Wallet
                  </button>
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
                        value={newWallet.name}
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
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
