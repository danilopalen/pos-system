"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { db, deleteUserData, writeUserData } from "../firebase";
import { ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import LoadingSpinner from "../components/LoadingSpinner";
import Banner from "../components/Banner";

export default function Inventory() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // This code only runs in the browser after component mount
    const user = localStorage.getItem("user");
    setUser(user || null);
  }, []);
  const [snapshots, loading, error] = useList(
    ref(db, JSON.parse(user || "{}")?.uid + "-INV")
  );
  const [inventory, setInventory] = useState([]);
  const [newItem, setNewItem] = useState({ name: "", price: "", stock: "" });
  const [deletedItem, setDeletedItem] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (snapshots) {
      const parsedInventory = snapshots.map((snapshot) => ({
        id: snapshot.key,
        name: snapshot.val().name,
        price: snapshot.val().price,
        // stock: snapshot.val().stock,
      }));
      console.log("🚀 ~ parsedInventory ~ parsedInventory:", parsedInventory);
      setInventory(parsedInventory);
    }
  }, [snapshots]);

  const addItem = async (e) => {
    e.preventDefault();
    if (!newItem.name || !newItem.price) return;
    const res = await writeUserData({
      data: newItem,
      id: Date.now(),
      account: JSON.parse(user || "{}")?.uid + "-INV",
    });
    console.log("🚀 ~ addItem ~ res:", res);
    if (res) {
      setIsAdded(true);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <header className="flex justify-center items-center mb-8">
          <LoadingSpinner size="large" />
        </header>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Management
          </h1>
          <Link
            href="/pos"
            className="px-6 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-indigo-600 font-semibold border border-purple-100"
          >
            Back to POS
          </Link>
        </header>

        <form
          onSubmit={addItem}
          className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Item name"
              value={newItem.name}
              className="px-4 py-2 rounded-lg border border-purple-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            />
            <input
              type="number"
              placeholder="Price"
              value={newItem.price}
              className="px-4 py-2 rounded-lg border border-purple-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
              onChange={(e) =>
                setNewItem({ ...newItem, price: e.target.value })
              }
            />
            {/* <input
            type="number"
            placeholder="Stock"
            value={newItem.stock}
            className="px-4 py-2 rounded-lg border border-purple-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
          /> */}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Add Item
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-xl shadow-md border border-purple-100"
            >
              <h3 className="text-lg font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-2xl font-bold text-indigo-600 mt-2">
                ${item.price}
              </p>
              {/* <p className="text-sm text-gray-600 mt-1">Stock: {item.stock}</p> */}
              <button
                onClick={async () => {
                  const res = await deleteUserData({
                    id: item.id,
                    account: JSON.parse(user || "{}")?.uid + "-INV",
                  });
                  setDeletedItem(item.name);
                  if (res) setIsDeleted(true);
                  // if (!res) return;
                  // setInventory(inventory.filter((i) => i.id !== item.id));
                }}
                className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
      {isAdded && (
        <Banner
          message={`${newItem.name} added.`}
          handleFinish={() => {
            setIsAdded(false);
            setNewItem({ name: "", price: "", stock: "" });
          }}
        />
      )}
      {isDeleted && (
        <Banner
          message={`${deletedItem} deleted.`}
          handleFinish={() => setIsAdded(false)}
        />
      )}
    </>
  );
}
