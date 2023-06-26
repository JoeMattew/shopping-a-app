import React, { useRef, useState, useEffect } from "react";
import cart from './assets/cart.png';
import "typeface-open-sans";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

export default function App() {
  const appSettings = {
    databaseURL: "https://realtimedb-73085-default-rtdb.asia-southeast1.firebasedatabase.app"
  };
  const app = initializeApp(appSettings);
  const database = getDatabase(app);
  const shoppingListInDB = ref(database, "shoppingList");

  const inputFieldEl = useRef(null);
  const [shoppingList, setShoppingList] = useState([]);

  useEffect(() => {
    const shoppingListRef = ref(database, "shoppingList");
    onValue(shoppingListRef, (snapshot) => {
      const data = snapshot.val();
      const itemsArray = data ? Object.entries(data) : [];
      setShoppingList(itemsArray);
    });
  }, [database]);

  function addToTheCart() {
    const inputValue = inputFieldEl.current.value;
    push(shoppingListInDB, inputValue);

    clearInputFieldEl();
  }

  function deleteItem(id) {
    const itemRef = ref(database, `shoppingList/${id}`);
    remove(itemRef);
  }

  function clearInputFieldEl() {
    inputFieldEl.current.value = "";
  }

  return (
    <div className="container">
      <img className="cartImg" src={cart} alt="" />
      <input className="input" type="text" id="input-field" placeholder="Bread" ref={inputFieldEl} />
      <button className="addButton" id="add-button" onClick={addToTheCart}>Add to cart</button>
      <ul className="shopping-list" id="shopping-list">
        {shoppingList.length === 0 ? (
          <p>Your list is empty</p>
        ) : (
          shoppingList.map(([id, item]) => (
            <li className="shoppingListItems" key={id} onClick={() => deleteItem(id)}>
              {item}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}