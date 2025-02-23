// components/tag-select.tsx
"use client";

import { useState, useMemo, KeyboardEvent } from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type Tag = {
  value: string;
  label: string;
};

interface TagSelectProps {
  availableTags: Tag[];
  selectedTags: Tag[];
  onSelectTag: (tags: Tag[]) => void;
}

export function TagSelect({
  availableTags = [],
  selectedTags = [],
  onSelectTag,
}: TagSelectProps) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  // 合并已选标签和可用标签（去重）
  const allTags = useMemo(() => {
    const selectedValues = new Set(selectedTags?.map((t) => t.value));
    return [
      ...selectedTags,
      ...availableTags?.filter((t) => !selectedValues.has(t.value)),
    ];
  }, [availableTags, selectedTags]);

  // 过滤逻辑
  const filteredTags = useMemo(() => {
    if (!inputValue) return allTags;
    return allTags.filter((tag) =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );
  }, [inputValue, allTags]);

  // 处理选择/取消选择
  const handleSelect = (tag: Tag) => {
    const isSelected = selectedTags?.some((t) => t.value === tag.value);
    const newTags = isSelected
      ? selectedTags?.filter((t) => t.value !== tag.value)
      : [...selectedTags, tag];
    onSelectTag(newTags);
    setInputValue(""); // 清空输入
  };

  // 回车创建新标签
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue?.trim()) {
      e.preventDefault();
      const newTag = {
        value: inputValue?.trim()?.toLowerCase(),
        label: inputValue?.trim(),
      };
      if (!selectedTags?.some((t) => t.value === newTag.value)) {
        onSelectTag([...selectedTags, newTag]);
      }
      setInputValue("");
    }
  };

  return (
    <div className="space-y-2">
      {/* 已选标签展示 */}
      {/* <div className="flex flex-wrap gap-2">
        {selectedTags?.map((tag) => (
          <Badge
            key={tag.value}
            variant="outline"
            className="cursor-pointer hover:bg-gray-100"
            onClick={() => handleSelect(tag)}
            title={tag.label}
          >
            <div className="w-[80px] overflow-hidden text-ellipsis">
              {tag.label}
            </div>

            <X className="ml-2 h-3 w-3" />
          </Badge>
        ))}
      </div> */}

      {/* 下拉选择器 */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between text-gray-400"
          >
            <div className="flex flex-wrap gap-1">
              {selectedTags?.map((tag) => (
                <Badge
                  key={tag.value}
                  variant="outline"
                  className="cursor-pointer py-0 px-1"
                  onClick={() => handleSelect(tag)}
                  title={tag.label}
                >
                  <div className="max-w-[60px] overflow-hidden text-ellipsis text-[0.6rem]">
                    {tag.label}
                  </div>

                  <X
                    className="ml-1 h-3 w-3 text-[0.5rem]"
                    size={16}
                    strokeWidth={1}
                  />
                </Badge>
              ))}
            </div>
            {selectedTags.length == 0 && "选择或输入标签..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent align="start" className="w-full p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="搜索标签..."
              value={inputValue}
              maxLength={20}
              onValueChange={setInputValue}
              onKeyDown={handleKeyDown}
            />
            <CommandList>
              <CommandEmpty>
                {inputValue ? `按回车创建 "${inputValue}"` : "无匹配标签"}
              </CommandEmpty>

              <CommandGroup className="max-h-60 overflow-auto">
                {filteredTags?.map((tag) => {
                  const isSelected = selectedTags?.some(
                    (t) => t.value === tag.value
                  );
                  return (
                    <CommandItem
                      key={tag.value}
                      value={tag.value}
                      onSelect={() => handleSelect(tag)}
                      className="cursor-pointer"
                    >
                      {tag.label}
                      <Check
                        className={cn(
                          "ml-2 h-4 w-4",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
