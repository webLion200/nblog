"use client";
import { cn } from "@/lib/utils";
import { FileText, Folders } from "lucide-react";
import React, { useState } from "react";

interface Item {
  id: string;
  title: string;
  type: "folder" | "file";
  children?: Item[];
}

interface TreeProps {
  data: Item[];
}

const Item: React.FC<{ item: Item }> = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <li className="py-1">
      <div
        className={cn(
          `cursor-pointer flex items-center  ${
            item.type === "folder"
              ? "text-[1rem]"
              : "text-[0.9rem] text-gray-600"
          }`
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {item.type === "folder" && <Folders strokeWidth={1} size={10} />}
          {item.type === "file" && <FileText strokeWidth={1} size={10} />}
        </span>
        <span className="truncate">{item.title}</span>
      </div>
      {isOpen && item.children && (
        <ul className="pl-2">
          {item.children.map((child) => (
            <>
              <Item key={child.id} item={child} />
            </>
          ))}
        </ul>
      )}
    </li>
  );
};

const Tree: React.FC<TreeProps> = ({ data }) => {
  return (
    <nav>
      <ul>
        {data.map((item) => (
          <Item key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
};

export default Tree;
