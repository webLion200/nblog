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
}

export function CategorySelect({
  selectedId = "",
  onSelect,
}: CategorySelectProps) {
  const handleSelect = (categoryId: string) => {
    onSelect(categoryId);
  };

  const [categories, setCategories] = useState<Category[]>([]);

  // 加载目录列表
  const loadCategories = async () => {
    const response = await fetch("/api/categories");
    const data = await response.json();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      loadCategories();
    }
  };

  return (
    <Select
      onValueChange={handleSelect}
      defaultValue={selectedId}
      onOpenChange={handleOpenChange}
    >
      <SelectTrigger className="w-full rounded-md">
        <SelectValue placeholder="选择目录" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem key="0" value={"0"}>
            首页
          </SelectItem>
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
