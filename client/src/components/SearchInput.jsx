import React from "react";

export default function SearchInput({ value, onChange, placeholder }) {
  return (
    <div className="w-full mb-4 ">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || "Search notes..."}
        className=" w-full p-3 rounded-lg bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
      />
    </div>
  );
}
