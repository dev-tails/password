import React, { useContext, useState } from "react";
import { GlobalStateContext } from "./GlobalStateContext";
import { PasswordItem } from "./PasswordItemType";
import { v4 as uuidv4 } from "uuid";

export const PasswordsPage: React.FC = () => {
  const { masterPassword, passwordItems, setPasswordItems } =
    useContext(GlobalStateContext);

  function handleAddPassword(passwordItem: PasswordItem) {
    const newPasswordItems = [...passwordItems, passwordItem];

    setPasswordItems(newPasswordItems);
  }

  const thStyle: React.CSSProperties = {
    textAlign: "left",
  };

  return masterPassword ? (
    <table>
      <>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Password</th>
          </tr>
        </thead>
        <tbody>
          <AddPasswordRow onSave={handleAddPassword} />
          {passwordItems.map((passwordItem) => {
            return (
              <PasswordRow key={passwordItem.id} passwordItem={passwordItem} />
            );
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
  const { passwordItems, setPasswordItems } = useContext(GlobalStateContext);

  const [hidden, setHidden] = useState(true);
  const [editting, setEditting] = useState(true);

  function handleEdit() {
    setEditting(!editting);
  }

  function handleDelete() {
    if (
      confirm(`Are you sure you would like to delete ${passwordItem.title}?`)
    ) {
      setPasswordItems(
        passwordItems.filter((p) => {
          return p.id != passwordItem.id;
        })
      );
    }
  }

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
      <td>
        <button onClick={handleEdit}>Edit</button>
      </td>
      <td>
        <button onClick={handleDelete}>Del</button>
      </td>
    </tr>
  );
};
