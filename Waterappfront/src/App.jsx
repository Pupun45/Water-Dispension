import React, { useState } from "react";
import WaterJar from "./Components/Waterjar";

const App = () => {
  const PRICE_PER_LITER = 5;
  const TANK_CAPACITY = 500;
  const PRESET_LITERS = [1, 2, 5, 10, 15, 20];

  const [liters, setLiters] = useState(0);
  const [money, setMoney] = useState(0);
  const [litersInput, setLitersInput] = useState("");
  const [moneyInput, setMoneyInput] = useState("");
  const [tankRemaining, setTankRemaining] = useState(TANK_CAPACITY);
  const [showDropdown, setShowDropdown] = useState(false);

  const calculateFromLiters = (value) => {
    if (value > tankRemaining) {
      alert(`Water not available! Only ${tankRemaining}L left in tank.`);
      setLiters(0);
      setMoney(0);
      setLitersInput("");
      setMoneyInput("");
    } else {
      setLiters(value);
      const cost = value * PRICE_PER_LITER;
      setLitersInput(value.toString());
      setMoney(cost);
      setMoneyInput(cost.toString());
      setShowDropdown(false);
    }
  };

  const calculateFromMoney = (value) => {
    const literValue = value / PRICE_PER_LITER;
    if (literValue > tankRemaining) {
      alert(`Water not available! Only ${tankRemaining}L left in tank.`);
      setLiters(0);
      setMoney(0);
      setLitersInput("");
      setMoneyInput("");
    } else {
      setLiters(literValue);
      setMoney(value);
      setLitersInput(literValue.toString());
      setMoneyInput(value.toString());
    }
  };

  const handlePayNow = () => {
    if (liters === 0 || money === 0) {
      alert("Please enter liters or money first.");
      return;
    }
    if (liters > tankRemaining) {
      alert(`Water not available! Only ${tankRemaining}L left in tank.`);
      return;
    }
    const newTank = tankRemaining - liters;
    setTankRemaining(newTank);
    alert(
      `Payment successful!\nPurchased: ${liters}L\nTotal: ₹${money}\nRemaining in tank: ${newTank}L`
    );
    setLiters(0);
    setLitersInput("");
    setMoney(0);
    setMoneyInput("");
  };

  return (
    <div className="bg-blue-200 min-h-screen flex items-center justify-center p-4 font-inter">
      <div className="flex flex-col md:flex-row items-center justify-center gap-5 p-8 bg-white rounded-xl shadow-lg w-full max-w-4xl">
        {/* Tank Section */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <WaterJar remaining={tankRemaining} tankCapacity={TANK_CAPACITY} />
        </div>
        {/* Form Section */}
        <div className="w-full md:w-1/2 p-6 bg-gray-100 rounded-lg shadow-inner">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Water Dispensation
          </h1>
          <form className="space-y-6">
            {/* Liters Input + Dropdown */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                How many liters of water do you want?
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter liters"
                value={litersInput}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setLitersInput(e.target.value);
                  if (!isNaN(val) && val >= 0) calculateFromLiters(val);
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {showDropdown && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                  {PRESET_LITERS.map((option) => (
                    <li
                      key={option}
                      className="px-3 py-2 cursor-pointer hover:bg-blue-500 hover:text-white"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent input blur
                        calculateFromLiters(option); // select option
                      }}
                    >
                      {option} Liter{option > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Money Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Cost
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">₹</span>
                <input
                  type="text"
                  placeholder="0"
                  value={moneyInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9.]/g, "");
                    setMoneyInput(val);
                    const num = parseFloat(val);
                    if (!isNaN(num) && num >= 0) calculateFromMoney(num);
                  }}
                  className="w-full border border-gray-300 rounded-md pl-7 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={handlePayNow}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
            >
              Pay Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default App;
