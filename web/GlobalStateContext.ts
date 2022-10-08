import React from "react";
import { PasswordItem } from "./PasswordItemType";

export const defaultGlobalState = {
  masterPassword: "",
  setMasterPassword(value: string) {},
  passwordItems: [] as PasswordItem[],
  setPasswordItems(value: PasswordItem[], updateLocalStorage: boolean = true) {},
}

export const GlobalStateContext = React.createContext(defaultGlobalState);