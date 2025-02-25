"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ConfirmDialogFn } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { DataTable } from "./data-table";
import { Category, columns as initialColumns } from "./columns";
import { Pencil, Trash2 } from "lucide-react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

interface IProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function CreateCategoryDialog({ onOpenChange, open = false }: IProps) {
  const [tableData, setTableData] = useState<Category[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const loadData = async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    setTableData(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createPost = async (name: string) => {
    const response = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success("目录创建成功");
  };

  const updateCate = async (id: string, name: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success("目录编辑成功");
  };

  const deleteCate = async (id: string) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success("目录删除成功");
  };

  const handleAddRow = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setTableData((prev) => [{ id: newId, name: "", isNew: true }, ...prev]);
    setInputValue("");
  }, []);

  const handleConfirm = useCallback(async () => {
    const name = inputValue;
    if (name === "") {
      toast.error("目录名称不能为空");
      return;
    }
    await createPost(name);
    await loadData();
  }, [inputValue]);

  const handleCancel = useCallback((id: string) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleEditStart = useCallback((row: Category) => {
    setEditingRowId(row.id);
  }, []);

  const handleEditConfirm = useCallback(
    async (id: string) => {
      const name = inputValue;
      if (name === "") {
        toast.error("目录名称不能为空");
        return;
      }
      await updateCate(id, name);
      await loadData();
      setEditingRowId(null);
    },
    [inputValue]
  );

  const handleEditCancel = useCallback(() => {
    setEditingRowId(null);
  }, []);

  const handleClickStart = async (row: Category) => {
    console.log("handleClickStart", row);
    ConfirmDialogFn({
      title: <span>删除目录</span>,
      content: <span>确定要删除该目录吗？</span>,
      onConfirm: async () => {
        await deleteCate(row.id);
        await loadData();
      },
      onCancel: () => {},
    });
  };

  const updateData = (rowIndex: number, columnId: string, value: string) => {
    setInputValue(value);
    setTableData((pre) => {
      const newTableData = [...pre];
      newTableData[rowIndex] = {
        ...newTableData[rowIndex],
        name: value,
      };
      return newTableData;
    });
  };

  const columns = initialColumns.map((col) => {
    if (col.id === "cateName") {
      col.cell = ({ row: { index, original }, column: { id }, table }) => {
        const initValue = original.name || "";
        const [value, setValue] = useState(initValue);
        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
          table.options.meta?.updateData(index, id, value);
        };
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
          setValue(initValue);
        }, [initValue]);

        let html = <span>{original.name}</span>;
        if (original.isNew || original.id === editingRowId) {
          html = (
            <Input
              name="cateName"
              value={value as string}
              placeholder="请输入目录名称"
              className="max-w-[200px] border border-['#e5e7eb']"
              onChange={(e) => {
                setValue(e.target.value);
              }}
              onBlur={onBlur}
            />
          );
        }
        return html;
      };
    }

    if (col.id === "actions") {
      col.cell = ({ row }) => {
        const isNew = row.original.isNew;
        const isEditing = row.original.id === editingRowId;
        let html = (
          <div className="flex space-x-2">
            <Pencil
              size={16}
              color="#666"
              className="cursor-pointer"
              onClick={() => handleEditStart(row.original)}
            />
            <Trash2
              size={16}
              color="#666"
              className="cursor-pointer"
              onClick={() => handleClickStart(row.original)}
            />
          </div>
        );
        if (isNew) {
          html = (
            <div className="flex space-x-3">
              <span
                className="text-[12px] text-blue-500 cursor-pointer"
                onClick={() => handleConfirm(row.original.id)}
              >
                确定
              </span>
              <span
                className="text-[12px] cursor-pointer"
                onClick={() => handleCancel(row.original.id)}
              >
                取消
              </span>
            </div>
          );
        }
        if (isEditing) {
          html = (
            <div className="flex space-x-3">
              <span
                className="text-[12px] text-blue-500 cursor-pointer"
                onClick={() => handleEditConfirm(row.original.id)}
              >
                保存
              </span>
              <span
                className="text-[12px] cursor-pointer"
                onClick={() => handleEditCancel()}
              >
                取消
              </span>
            </div>
          );
        }
        return html;
      };
    }

    return col;
  });

  const table = useReactTable({
    data: tableData,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    // Provide our updateData function to our table meta
    meta: {
      updateData,
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>目录列表</DialogTitle>
          <DialogDescription>{/* 不要删除，否则会有警告 */}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="mb-4">
            <Button
              size="sm"
              onClick={handleAddRow}
              className="bg-blue-600 hover:bg-blue-700"
            >
              新建目录
            </Button>
          </div>

          <DataTable table={table} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
