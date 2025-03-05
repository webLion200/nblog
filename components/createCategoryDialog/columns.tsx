/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { ColumnDef, TableMeta } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Input } from "../ui/input";
import React from "react";

export type Category = {
  id: string;
  name: string;
  isNew?: boolean;
  isEdit?: boolean;
};

declare module "@tanstack/react-table" {
  interface TableMeta<TData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

export const columns: ColumnDef<Category>[] = [
  {
    id: "index",
    header: "序号",
    size: 40,
    cell: ({ row }) => <span className="text-zinc-500">{row.index + 1}</span>,
  },
  {
    id: "cateName",
    header: "目录名称",
    enableHiding: false,
    cell: ({ getValue, row, column: { id }, table }) => {
      const initialValue = getValue();
      // We need to keep and update the state of the cell normally
      const [value, setValue] = React.useState(initialValue);

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(row.index, id, value);
      };

      // If the initialValue is changed external, sync it up with our state
      // React.useEffect(() => {
      //   setValue(initialValue);
      // }, [initialValue]);

      return (
        <Input
          value={value as string}
          onChange={(e) => setValue(e.target.value)}
          onBlur={onBlur}
        />
      );
    },
  },
  {
    id: "actions",
    header: "操作",
    size: 60,
    cell: ({ row }) => {
      const isnNew = row.original.isNew;
      return isnNew ? (
        <div className="flex space-x-3">
          <span className="text-[12px] text-blue-500 cursor-pointer">确定</span>
          <span className="text-[12px] cursor-pointer">取消</span>
        </div>
      ) : (
        <div className="flex space-x-2">
          <Pencil size={16} color="#666" className="cursor-pointer" />
          <Trash2 size={16} color="#666" className="cursor-pointer" />
        </div>
      );
    },
  },
];
