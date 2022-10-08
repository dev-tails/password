import React, { useContext, useState } from "react";
import CryptoJS from "crypto-js";
import { GlobalStateContext } from "./GlobalStateContext";

export const MasterPasswordPage: React.FC = () => {
  const { masterPassword, setMasterPassword, setPasswordItems } =
    useContext(GlobalStateContext);
  const [password, setPassword] = useState("");

  function handleSubmit() {
    try {
      const passwordsDataLocalStorage = localStorage.getItem("passwords");
      if (passwordsDataLocalStorage) {
        const deciphered = CryptoJS.AES.decrypt(
          passwordsDataLocalStorage,
          password
        ).toString(CryptoJS.enc.Utf8);

        const passwordItems = JSON.parse(deciphered);
        setPasswordItems(passwordItems);
      }

      setMasterPassword(password);
    } catch (err) {
      alert(err.message);
    }
  }

  return masterPassword ? null : (
    <div>
      <input
        placeholder="Master Password"
        value={password}
        onChange={(e) => {
          setPassword(e.currentTarget.value);
        }}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};
