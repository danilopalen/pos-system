// app/orders/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Orders() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    console.log("🚀 ~ useEffect ~ useEffect:");
    const user = localStorage.getItem("user");
    if (!user) {
      //   router.push("/login");
      //   return;
    }

    const savedOrders = localStorage.getItem("orders");
    console.log("🚀 ~ useEffect ~ savedOrders:", savedOrders);
    if (savedOrders) {
      const parsedOrders = JSON.parse(savedOrders).map((order) => ({
        ...order,
        status: order.status || "pending", // Add default status if not present
      }));
      setOrders(parsedOrders);
    }
  }, []);

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      preparing: "bg-blue-100 text-blue-800",
      ready: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || colors.pending;
  };

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Orders Management
        </h1>
        <div className="flex gap-4">
          <Link
            href="/pos"
            className="px-6 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all text-indigo-600 font-semibold border border-purple-100"
          >
            Back to POS
          </Link>
        </div>
      </header>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-purple-100">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "all"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("preparing")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "preparing"
                ? "bg-blue-600 text-white"
                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
            }`}
          >
            Preparing
          </button>
          <button
            onClick={() => setFilter("ready")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "ready"
                ? "bg-green-600 text-white"
                : "bg-green-100 text-green-800 hover:bg-green-200"
            }`}
          >
            Ready
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-4 py-2 rounded-lg transition-all ${
              filter === "completed"
                ? "bg-gray-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 border border-purple-100 text-center text-gray-500">
            No orders found
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-lg p-6 border border-purple-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Order #{order.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(order.date).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Order Items */}
              <div className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-2 border-b border-gray-100"
                  >
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">
                        x{item.quantity}
                      </span>
                    </div>
                    <span className="text-indigo-600 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="flex justify-between items-center text-lg font-semibold mb-4">
                <span>Total:</span>
                <span className="text-indigo-600">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
                  >
                    Mark as Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "completed")}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
                  >
                    Complete Order
                  </button>
                )}
                {["pending", "preparing"].includes(order.status) && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "cancelled")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
