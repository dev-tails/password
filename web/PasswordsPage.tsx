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

  function handleSavePassword(updatedPasswordItem: PasswordItem) {
    const clonedItems = [...passwordItems];
    for (let i = 0; i < passwordItems.length; i++) {
      const oldPasswordItem = clonedItems[i];
      if (oldPasswordItem.id === updatedPasswordItem.id) {
        clonedItems[i] = updatedPasswordItem;
        break;
      }
    }

    setPasswordItems(clonedItems);
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
              <PasswordRow
                key={passwordItem.id}
                passwordItem={passwordItem}
                onSave={handleSavePassword}
              />
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
    setPassword("");
    setTitle("");
  }

  const actionTdStyle: React.CSSProperties = {
    width: 52,
  };

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
          type={"password"}
          value={password}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
        />
      </td>
      <td style={actionTdStyle}>
        <button onClick={handleGenPassClicked}>Gen</button>
      </td>
      <td style={actionTdStyle}>
        <button onClick={handleAddClicked}>Add</button>
      </td>
    </tr>
  );
};

type PasswordRowProps = {
  passwordItem: PasswordItem;
  onSave: (PasswordItem) => void;
};

const PasswordRow: React.FC<PasswordRowProps> = ({ passwordItem, onSave }) => {
  const { passwordItems, setPasswordItems } = useContext(GlobalStateContext);
  const [title, setTitle] = useState(passwordItem.title);
  const [password, setPassword] = useState(passwordItem.password);

  const [hidden, setHidden] = useState(true);
  const [editting, setEditting] = useState(false);

  function handleEdit() {
    setHidden(false);
    setEditting(!editting);
  }

  function handleCancel() {
    setTitle(passwordItem.title);
    setPassword(passwordItem.password);
    setEditting(false);
    setHidden(true);
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
      <td>
        <input
          type="text"
          value={title}
          readOnly={editting ? false : true}
          onChange={(e) => {
            setTitle(e.currentTarget.value);
          }}
        />
      </td>
      <td>
        <input
          type={hidden ? "password" : "text"}
          value={password}
          readOnly={editting ? false : true}
          onChange={(e) => {
            setPassword(e.currentTarget.value);
          }}
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

      {editting ? (
        <>
          <td>
            <button onClick={handleCancel}>Cancel</button>
          </td>
          <td>
            <button
              onClick={() => {
                onSave({ ...passwordItem, password, title });
              }}
            >
              Save
            </button>
          </td>
        </>
      ) : (
        <td>
          <button onClick={handleEdit}>Edit</button>
        </td>
      )}
      <td>
        <button onClick={handleDelete}>Del</button>
      </td>
    </tr>
  );
};
