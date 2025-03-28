"use client";
import { categoryItems } from "./categoryItems";

interface CategoryCarousalProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryCarousal({
  selectedCategory,
  onSelectCategory,
}: CategoryCarousalProps) {
  // Extract the labels from categoryItems
  const categories = categoryItems.map((item) => item.label);

  return (
    <div className="flex overflow-x-auto gap-4 py-4 mb-[5px]">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() =>
            onSelectCategory(
              selectedCategory === category ? null : category
            )
          }
          className={`px-4 py-2 rounded-full whitespace-nowrap ${
            selectedCategory === category
              ? "bg-blue-500 text-white"
              : "bg-gray-200"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}