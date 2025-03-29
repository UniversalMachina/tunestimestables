"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const GameDashboard = () => {
  const router = useRouter();
  const multiplicationTables = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center mb-8">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={300}
            height={300}
            className="object-contain"
          />
        </div>

        <div className="grid gap-6">
          {/* Regular Games */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => router.push("/game_one")}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-xl p-6 text-2xl font-bold shadow-lg transition-transform transform hover:scale-105"
            >
              Game One
            </button>
            <button
              onClick={() => router.push("/game_two")}
              className="bg-green-500 hover:bg-green-600 text-white rounded-xl p-6 text-2xl font-bold shadow-lg transition-transform transform hover:scale-105"
            >
              Game Two
            </button>
            <button
              onClick={() => router.push("/game_three")}
              className="bg-purple-500 hover:bg-purple-600 text-white rounded-xl p-6 text-2xl font-bold shadow-lg transition-transform transform hover:scale-105"
            >
              Game Three
            </button>
          </div>

          {/* Game Four Multiplication Tables */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Game Four - Multiplication Tables
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {multiplicationTables.map((number) => (
                <button
                  key={number}
                  onClick={() => router.push(`/game_four/${number}`)}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-4 text-xl font-bold shadow-lg transition-transform transform hover:scale-105"
                >
                  {number} Times Table
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDashboard;
