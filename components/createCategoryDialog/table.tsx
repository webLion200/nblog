// components/categories-table.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

type Category = {
  id: string;
  name: string;
  isNew?: boolean;
  postCount?: number;
};

export function CategoriesTable() {
  const [data, setData] = useState<Category[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [newName, setNewName] = useState("");

  // █████████████████████ 列配置 █████████████████████
  const columns = useMemo<ColumnDef<Category>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={row.original.isNew} // 新增行不可选
          />
        ),
        size: 60,
      },
      {
        accessorKey: "index",
        header: "序号",
        cell: ({ row }) => row.index + 1,
        size: 80,
      },
      {
        accessorKey: "name",
        header: "目录名称",
        cell: ({ row }) =>
          row.original.isNew ? (
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="输入新目录名称"
              className="max-w-[200px]"
            />
          ) : (
            <span>{row.getValue("name")}</span>
          ),
      },
      {
        id: "actions",
        header: "操作",
        cell: ({ row }) => (
          <div className="flex gap-2">
            {row.original.isNew ? (
              <Button
                size="sm"
                onClick={handleCreate}
                disabled={!newName.trim()}
              >
                新增
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditStart(row.original.id)}
                >
                  编辑
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(row.original.id)}
                >
                  删除
                </Button>
              </>
            )}
          </div>
        ),
        size: 150,
      },
    ],
    [newName]
  );

  // █████████████████████ 表格实例 █████████████████████
  const table = useReactTable({
    data,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  // █████████████████████ 数据加载 █████████████████████
  const loadData = async () => {
    const res = await fetch("/api/categories");
    const json = await res.json();
    setData(json);
  };

  useEffect(() => {
    loadData();
  }, []);

  // █████████████████████ 新增目录 █████████████████████
  const handleAddRow = () => {
    setData((prev) => [
      { id: `new-${Date.now()}`, name: "", isNew: true },
      ...prev,
    ]);
    setNewName("");
  };

  // █████████████████████ 创建目录 █████████████████████
  const handleCreate = async () => {
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        body: JSON.stringify({ name: newName }),
      });

      if (!res.ok) throw new Error("创建失败");
      toast.success("目录创建成功");
      await loadData();
      setData((prev) => prev.filter((item) => !item.isNew));
    } catch (error) {
      toast.error(error.message);
    }
  };

  // █████████████████████ 删除目录 █████████████████████
  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/categories/${id}`, { method: "DELETE" });
      toast.success("目录删除成功");
      await loadData();
    } catch (error) {
      toast.error("删除失败");
    }
  };

  // █████████████████████ 批量删除 █████████████████████
  const handleBatchDelete = async () => {
    const selectedIds = table
      .getSelectedRowModel()
      .rows.map((row) => row.original.id);

    try {
      await Promise.all(
        selectedIds.map((id) =>
          fetch(`/api/categories/${id}`, { method: "DELETE" })
        )
      );
      toast.success(`已删除 ${selectedIds.length} 个目录`);
      await loadData();
      table.resetRowSelection();
    } catch (error) {
      toast.error("删除失败");
    }
  };

  return (
    <div className="space-y-4">
      {/* 操作栏 */}
      <div className="flex gap-2">
        <Button onClick={handleAddRow}>新增目录</Button>
        <Button
          variant="destructive"
          onClick={handleBatchDelete}
          disabled={!table.getSelectedRowModel().rows.length}
        >
          批量删除 ({table.getSelectedRowModel().rows.length})
        </Button>
      </div>

      {/* 表格 */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  暂无数据
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
