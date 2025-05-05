import { Database, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  }, []);

  const onSuccess = useCallback(
    async (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
      console.log("Success :", public_token, metadata);

      await exchangePublicToken({
        publicToken: public_token,
        user,
      });
    },
    [user]
  );
  const config: PlaidLinkOptions = {
    token,
    onSuccess,
  };

  const { open, ready } = usePlaidLink(config);
  console.log(ready);

  return (
    <div className="w-full h-24 bg-zinc-100 dark:bg-zinc-900 flex items-center pl-5 space-x-5">
      <div className="w-52 h-[3rem] rounded-sm bg-zinc-800 flex space-x-5 font-cabinet text-sm text-zinc-400 cursor-default px-2">
        <div className="w-full h-full flex items-center">
          <Database size={20} className="mr-2" /> Add Wallet
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Pencil size={20} className="mt-2 cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      {ready && (
        <div
          className="w-52 h-[3rem] border-dotted border-2 rounded-sm border-zinc-400 flex items-center justify-center font-cabinet text-sm text-zinc-400 cursor-pointer"
          onClick={() => open()}
        >
          <Plus size={20} /> Add Account
        </div>
      )}
    </div>
  );
}

export default AddWalletAndBankAccount;
