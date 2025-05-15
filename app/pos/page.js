"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Calculator from ".././components/calculator";
import { ref } from "firebase/database";
import { useList } from "react-firebase-hooks/database";
import { app, db } from "../firebase";
import { getAuth } from "firebase/auth";
import LoadingSpinner from "../components/LoadingSpinner";
const auth = getAuth(app);

export default function POS() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    // This code only runs in the browser after component mount
    const user = localStorage.getItem("user");
    setUser(user || null);
  }, []);
  const [snapshots, loading, error] = useList(
    ref(db, JSON.parse(user || "{}")?.uid + "-INV")
  );
  const router = useRouter();

  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState([]);
  const [adjustments, setAdjustments] = useState({
    subtotal: 0,
    adjustments: [],
    total: 0,
  });

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

  useEffect(() => {
    if (cart?.length === 0) {
      setAdjustments({
        subtotal: 0,
        adjustments: [],
        total: 0,
      });
    }
  }, [cart]);

  const checkout = () => {
    const order = {
      id: Date.now(),
      items: cart,
      ...adjustments,
      date: new Date().toISOString(),
      status: "pending",
    };

    const existingOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const updatedOrders = [...existingOrders, order];
    localStorage.setItem("orders", JSON.stringify(updatedOrders));

    setCart([]);
    setAdjustments({
      subtotal: 0,
      discounts: [],
      fees: [],
      total: 0,
    });
  };

  const addToCart = (item) => {
    const existingItem = cart.find((i) => i.id === item.id);
    if (existingItem) {
      setCart(
        cart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
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
    <div className="p-6 max-w-7xl mx-auto ">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          POS System
        </h1>
        <div className="flex gap-4">
          <Link
            href="/orders"
            className="px-6 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-indigo-600 font-semibold border border-purple-100"
          >
            Orders
          </Link>
          <Link
            href="/inventory"
            className="px-6 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-indigo-600 font-semibold border border-purple-100"
          >
            Inventory
          </Link>
          <button
            onClick={() => {
              auth.signOut().then(() => {
                localStorage.removeItem("user");
                router.push("/login");
              });
            }}
            className="px-6 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all font-semibold"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Available Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {inventory.map((item) => (
              <div
                key={item.id}
                onClick={() => addToCart(item)}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border border-purple-100"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.name}
                </h3>
                <p className="text-2xl font-bold text-indigo-600">
                  ${item.price}
                </p>
                {/* <p className="text-sm text-gray-600">Stock: {item.stock}</p> */}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100 h-fit">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Cart</h2>
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">x{item.quantity}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-indigo-600">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal:</span>
                <span>
                  $
                  {cart
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    .toFixed(2)}
                </span>
              </div>

              {adjustments.adjustments?.map((adj, index) => (
                <div
                  key={index}
                  className={`flex justify-between items-center ${
                    adj.type === "discount"
                      ? "text-green-600"
                      : "text-orange-600"
                  }`}
                >
                  <span>{adj.type === "discount" ? "Discount" : "Fee"}:</span>
                  <span>
                    {adj.type === "discount" ? "-" : "+"}$
                    {Math.abs(adj.amount).toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="flex justify-between items-center text-xl font-bold text-indigo-600 pt-2 border-t">
                <span>Total:</span>
                <span>
                  $
                  {cart?.length > 0
                    ? adjustments.total?.toFixed(2) ||
                      cart
                        .reduce(
                          (sum, item) => sum + item.price * item.quantity,
                          0
                        )
                        .toFixed(2)
                    : 0}
                </span>
              </div>
            </div>

            <Calculator
              subtotal={cart.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              )}
              onTotalChange={setAdjustments}
            />

            <button
              onClick={checkout}
              disabled={cart.length === 0}
              className="w-full mt-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
