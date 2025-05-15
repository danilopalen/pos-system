"use client";
import { useEffect, useState } from "react";

export default function Calculator({ subtotal, onTotalChange }) {
  const [display, setDisplay] = useState("");
  const [adjustments, setAdjustments] = useState([]);

  useEffect(() => {
    if (!subtotal) {
      setDisplay("");
      setAdjustments([]);
    }
  }, [subtotal]);

  const handleNumber = (num) => {
    setDisplay((prev) => prev + num);
  };

  const handleClear = () => {
    setDisplay("");
  };

  const addAdjustment = (type) => {
    if (!display) return;

    const amount = parseFloat(display);
    if (isNaN(amount)) return;

    const newAdjustment = {
      type,
      amount: type === "discount" ? -amount : amount,
      id: Date.now(),
    };

    const newAdjustments = [...adjustments, newAdjustment];
    setAdjustments(newAdjustments);
    setDisplay("");

    // Calculate new total
    const total =
      subtotal + newAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
    onTotalChange({
      subtotal,
      adjustments: newAdjustments,
      total,
    });
  };

  const removeAdjustment = (id) => {
    const newAdjustments = adjustments.filter((adj) => adj.id !== id);
    setAdjustments(newAdjustments);

    // Recalculate total
    const total =
      subtotal + newAdjustments.reduce((sum, adj) => sum + adj.amount, 0);
    onTotalChange({
      subtotal,
      adjustments: newAdjustments,
      total,
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 border border-purple-100 mt-4">
      {/* Display */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <input
          type="text"
          value={display}
          placeholder="0.00"
          className="w-full text-2xl font-bold text-gray-800 bg-transparent border-none focus:outline-none text-right"
          readOnly
        />
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-3 gap-2">
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "⌫"].map(
          (btn, index) => (
            <button
              key={index}
              onClick={() => {
                if (btn === "⌫") {
                  setDisplay((prev) => prev.slice(0, -1));
                } else {
                  handleNumber(btn);
                }
              }}
              className="p-3 text-lg font-semibold bg-gray-50 rounded-lg hover:bg-gray-100"
            >
              {btn}
            </button>
          )
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mt-2">
        <button
          onClick={handleClear}
          className="p-3 text-sm font-semibold bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
        >
          Clear
        </button>
        <button
          onClick={() => addAdjustment("discount")}
          className="p-3 text-sm font-semibold bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
        >
          - Discount
        </button>
        <button
          onClick={() => addAdjustment("fee")}
          className="p-3 text-sm font-semibold bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200"
        >
          + Fee
        </button>
      </div>

      {/* Adjustments List */}
      {adjustments.length > 0 && (
        <div className="mt-4 space-y-2 border-t pt-4">
          {adjustments.map((adj) => (
            <div
              key={adj.id}
              className="flex justify-between items-center text-sm"
            >
              <span
                className={
                  adj.type === "discount" ? "text-green-600" : "text-orange-600"
                }
              >
                {adj.type === "discount" ? "Discount" : "Fee"}
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={
                    adj.type === "discount"
                      ? "text-green-600"
                      : "text-orange-600"
                  }
                >
                  {adj.type === "discount" ? "-" : "+"}$
                  {Math.abs(adj.amount).toFixed(2)}
                </span>
                <button
                  onClick={() => removeAdjustment(adj.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
