import React, { useContext, useState } from "react";
import { GlobalStateContext } from "./GlobalStateContext";
import { PasswordItem } from "./PasswordItemType";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

export const PasswordsPage: React.FC = () => {
  const { masterPassword, passwordItems, setPasswordItems } = useContext(GlobalStateContext);

  function handleAddPassword(passwordItem: PasswordItem) {
    const newPasswordItems = [...passwordItems, passwordItem];

    const ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(newPasswordItems),
      masterPassword
    ).toString();

    localStorage.setItem("passwords", ciphertext);

    setPasswordItems(newPasswordItems);
  }

  return masterPassword ? (
    <table>
      <>
        <thead>
          <tr>
            <th>Title</th>
            <th>Password</th>
          </tr>
        </thead>
        <tbody>
          <AddPasswordRow onSave={handleAddPassword} />
          {passwordItems.map((passwordItem) => {
            return <PasswordRow passwordItem={passwordItem} />;
          })}
        </tbody>
      </>
    </table>
  ) : null;
};

type AddPasswordRowProps = {
  onSave: (passwordItem: PasswordItem) => void;
};

function generatePassword(
  length = 16,
  wishlist = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$"
) {
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join("");
}

const AddPasswordRow: React.FC<AddPasswordRowProps> = ({ onSave }) => {
  const [title, setTitle] = useState("");
  const [password, setPassword] = useState("");

  function handleGenPassClicked() {
    setPassword(generatePassword());
  }

  function handleAddClicked() {
    onSave({
      id: uuidv4(),
      title,
      password,
    });
  }

  return (
    <tr>
      <td>
        <input
          placeholder="title"
          value={title}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
      </td>
      <td>
        <input
          placeholder="password"
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </td>
      <td>
        <button onClick={handleGenPassClicked}>Gen</button>
      </td>
      <td>
        <button onClick={handleAddClicked}>Add</button>
      </td>
    </tr>
  );
};

const PasswordRow: React.FC<{ passwordItem: PasswordItem }> = ({
  passwordItem,
}) => {
  const [hidden, setHidden] = useState(true);

  return (
    <tr key={passwordItem.title}>
      <td>{passwordItem.title}</td>
      <td>
        <input
          type={hidden ? "password" : "text"}
          value={passwordItem.password}
        />
      </td>
      <td>
        <button
          onClick={() => {
            setHidden(!hidden);
          }}
        >
          {hidden ? "Show" : "Hide"}
        </button>
      </td>
    </tr>
  );
};
