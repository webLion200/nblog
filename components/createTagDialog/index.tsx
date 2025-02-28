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
import { Tag, columns as initialColumns } from "./columns";
import { Pencil, Trash2 } from "lucide-react";
import {
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { tagSchema } from "@/lib/validation";

interface IProps {
  onOpenChange?: (open: boolean) => void;
  open?: boolean;
}

export function CreateTagDialog({ onOpenChange, open = false }: IProps) {
  const [tableData, setTableData] = useState<Tag[]>([]);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  const loadData = async () => {
    const res = await fetch("/api/tags");
    const json = await res.json();
    setTableData(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  const createTag = async () => {
    try {
      const newTag = {
        value: inputValue?.trim()?.toLowerCase(),
        label: inputValue?.trim(),
      };

      const validation = tagSchema.safeParse(newTag);
      if (!validation.success) {
        toast.warning(validation?.error?.errors?.[0]?.message);
        return;
      }

      const response = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTag),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }
      toast.success("标签创建成功");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const updateTag = async (id: string) => {
    const newTag = {
      value: inputValue?.trim()?.toLowerCase(),
      label: inputValue?.trim(),
    };

    const validation = tagSchema.safeParse(newTag);
    if (!validation.success) {
      toast.warning(validation?.error?.errors?.[0]?.message);
      return;
    }

    const response = await fetch(`/api/tags/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTag),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success("标签编辑成功");
  };

  const deleteTag = async (id: string) => {
    const response = await fetch(`/api/tags/${id}`, {
      method: "DELETE",
    });
    debugger;
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error);
    }
    toast.success("标签删除成功");
  };

  const handleAddRow = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setTableData((prev) => [{ id: newId, name: "", isNew: true }, ...prev]);
    setInputValue("");
  }, []);

  const handleAddConfirm = async () => {
    if (inputValue === "") {
      toast.error("标签名称不能为空");
      return;
    }
    await createTag();
    await loadData();
  };

  const handleCancel = useCallback((id: string) => {
    setTableData((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleEditStart = useCallback((row: Tag) => {
    setEditingRowId(row.id);
  }, []);

  const handleEditConfirm = useCallback(
    async (id: string) => {
      if (inputValue === "") {
        toast.error("标签名称不能为空");
        return;
      }
      await updateTag(id);
      await loadData();
      setEditingRowId(null);
    },
    [inputValue]
  );

  const handleEditCancel = useCallback(() => {
    setEditingRowId(null);
  }, []);

  const handleClickStart = async (row: Tag) => {
    ConfirmDialogFn({
      title: <span>删除标签</span>,
      content: <span>确定要删除该标签吗？</span>,
      onConfirm: async () => {
        await deleteTag(row.id);
        await loadData();
      },
      onCancel: () => {},
    });
  };

  const updateData = (rowIndex: number, value: string) => {
    setInputValue(value);
    setTableData((pre) => {
      const newTableData = [...pre];
      newTableData[rowIndex] = {
        ...newTableData[rowIndex],
        label: value,
      };
      return newTableData;
    });
  };

  const columns = initialColumns.map((col) => {
    if (col.id === "label") {
      col.cell = ({ row: { index, original }, table }) => {
        const initValue = original.label || "";
        const [value, setValue] = useState(initValue);
        // When the input is blurred, we'll call our table meta's updateData function
        const onBlur = () => {
          table.options.meta?.updateData(index, value);
        };
        // If the initialValue is changed external, sync it up with our state
        useEffect(() => {
          setValue(initValue);
        }, [initValue]);

        let html = <span>{original.label}</span>;
        if (original.isNew || original.id === editingRowId) {
          html = (
            <Input
              name="label"
              value={value as string}
              placeholder="请输入标签名称"
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
                onClick={() => handleAddConfirm()}
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
          <DialogTitle>标签列表</DialogTitle>
          <DialogDescription>{/* 不要删除，否则会有警告 */}</DialogDescription>
        </DialogHeader>
        <div>
          <div className="mb-4">
            <Button
              size="sm"
              onClick={handleAddRow}
              className="bg-blue-600 hover:bg-blue-700"
            >
              新建标签
            </Button>
          </div>

          <DataTable table={table} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
