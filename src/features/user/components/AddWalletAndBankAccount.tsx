"use client";

import { Database, Pencil, Plus, CreditCard, Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOptions,
  usePlaidLink,
} from "react-plaid-link";
import { useCallback, useEffect, useState } from "react";
import { useGetUser } from "@/hooks/useGetUser";
import {
  useCreatelinktokenMutation,
  useExchangePublicTokenMutation,
} from "@/services/apis/UserApis";
import { IaxiosResponse } from "@/@types/interface/IaxiosResponse";

function AddWalletAndBankAccount() {
  const [token, setToken] = useState("");
  const [activeTab, setActiveTab] = useState("wallet"); // "wallet", "bank", "card"
  const user = useGetUser();
  const [createLinkToken] = useCreatelinktokenMutation();
  const [exchangePublicToken] = useExchangePublicTokenMutation();

  useEffect(() => {
    const getLinkToken = async (
      id: string | undefined,
      name: string | undefined
    ) => {
      const response: IaxiosResponse = await createLinkToken({ id, name });
      if (response.data) {
        setToken(response.data.linkToken);
      }
    };

    getLinkToken(user?.id, user?.name);
  }, [user, createLinkToken]);

  const onSuccess = useCallback(
    async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      console.log("Success :", public_token, metadata);
      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
    },
    [user, exchangePublicToken]
  );

  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);

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
          <button
            onClick={() => setActiveTab("card")}
            className={`px-4 py-2 flex items-center text-sm font-medium ${
              activeTab === "card"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            <CreditCard size={18} className="mr-2" />
            Cards
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
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">Main Wallet</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">$1,250.00</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Pencil
                    size={18}
                    className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 cursor-pointer"
                    aria-label="Edit wallet"
                  />
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Edit Wallet</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="name" className="text-right text-sm font-medium">
                        Name
                      </label>
                      <input
                        id="name"
                        defaultValue="Main Wallet"
                        className="col-span-3 flex h-10 w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm">
                      Delete
                    </button>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm">
                      Save
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Add new wallet button */}
            <div
              className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
              role="button"
              aria-label="Add wallet"
            >
              <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                <Plus size={24} className="mb-2" />
                <span className="text-sm font-medium">Add New Wallet</span>
              </div>
            </div>
          </>
        )}

        {activeTab === "bank" && (
          <>
            {ready && (
              <div
                className="w-full h-auto border-dashed border-2 border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-center p-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800/70 transition-colors"
                onClick={() => open()}
                role="button"
                aria-label="Connect bank account"
              >
                <div className="flex flex-col items-center text-zinc-500 dark:text-zinc-400">
                  <Database size={24} className="mb-2" />
                  <span className="text-sm font-medium">Connect Bank Account</span>
                </div>
              </div>
            )}
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