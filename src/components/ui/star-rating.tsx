"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function StarRating({ value, onChange, disabled }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`text-2xl transition-colors ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          }`}
          onClick={() => !disabled && onChange(star)}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => !disabled && setHoverValue(0)}
          disabled={disabled}
        >
          <Star
            className={`h-6 w-6 ${
              (hoverValue || value) >= star
                ? "fill-yellow-500 text-yellow-500"
                : "fill-none text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
