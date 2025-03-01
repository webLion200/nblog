// components/category-select.tsx
"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
}

interface CategorySelectProps {
  selectedId: string;
  onSelect: (id: string) => void;
  formField: any;
}

export function CategorySelect({
  selectedId = "",
  onSelect,
  formField,
}: CategorySelectProps) {
  const handleSelect = (categoryId: string) => {
    onSelect(categoryId);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  // 加载目录列表
  const loadCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    console.log("categoryId", selectedId);
    console.log("data", data);
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      loadCategories();
    }
  };

  return (
    <Select
      {...formField}
      onValueChange={handleSelect}
      defaultValue={selectedId}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full rounded-md">
        <SelectValue placeholder="选择目录" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {categories.map((cate) => (
            <SelectItem
              value={cate.id}
              key={cate.id}
              className="flex items-center justify-between"
            >
              {cate.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
