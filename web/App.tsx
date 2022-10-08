import React, { useState } from "react";
import { MasterPasswordPage } from "./MasterPasswordPage";
import { PasswordsPage } from "./PasswordsPage";
import { GlobalStateContext } from "./GlobalStateContext";
import { PasswordItem } from "./PasswordItemType";

export const App: React.FC = () => {
  const [masterPassword, setMasterPassword] = useState("");
  const [passwordItems, setPasswordItems] = useState<PasswordItem[]>([]);

  return (
    <GlobalStateContext.Provider value={{
      masterPassword,
      setMasterPassword,
      passwordItems,
      setPasswordItems
    }}>
      <div id="app">
        <MasterPasswordPage />
        <PasswordsPage/>
      </div>
    </GlobalStateContext.Provider>
  );
};