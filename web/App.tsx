import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { MasterPasswordPage } from "./MasterPasswordPage";
import { PasswordsPage } from "./PasswordsPage";
import { GlobalStateContext } from "./GlobalStateContext";
import { PasswordItem } from "./PasswordItemType";

export const App: React.FC = () => {
  const [masterPassword, setMasterPassword] = useState("password");
  const [passwordItems, setPasswordItemsState] = useState<PasswordItem[]>([]);

  function setPasswordItems(
    passwordItems: PasswordItem[],
    updateLocalStorage = false
  ) {
    if (updateLocalStorage) {
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(passwordItems),
        masterPassword
      ).toString();

      localStorage.setItem("passwords", ciphertext);
    }

    setPasswordItemsState(passwordItems);
  }

  return (
    <GlobalStateContext.Provider
      value={{
        masterPassword,
        setMasterPassword,
        passwordItems,
        setPasswordItems,
      }}
    >
      <div id="app">
        <MasterPasswordPage />
        <PasswordsPage />
      </div>
    </GlobalStateContext.Provider>
  );
};
