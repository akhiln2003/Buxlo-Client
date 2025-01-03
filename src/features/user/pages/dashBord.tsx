import AddWalletAndBankAccount from "../components/AddWalletAndBankAccount";
import { Component } from "../components/Component";

function dashBord() {
  return (
    <div className="w-full flex flex-col">
      < AddWalletAndBankAccount />
     <div className="w-3/6"> <Component /></div>
    </div>
  );
}

export default dashBord;
