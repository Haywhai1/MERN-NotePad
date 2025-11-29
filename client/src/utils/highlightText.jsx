import React from "react";

export function highlightText(text, searchTerm) {
  if (!searchTerm) return text;

  const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedTerm})`, "gi");

  return text.split(regex).map((part, index) =>
    regex.test(part) ? (
      <span
        key={index}
        className="bg-yellow-500/40 text-yellow-300 font-semibold"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
}
