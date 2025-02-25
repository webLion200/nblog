"use client";

import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  title: React.ReactNode;
  content: React.ReactNode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  content,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={onConfirm}>确认</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function ConfirmDialogFn({
  title,
  content,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const container = document.createElement("div");
  document.body.appendChild(container);

  const handleConfirm = () => {
    onConfirm();
    cleanup();
  };

  const handleCancel = () => {
    onCancel();
    cleanup();
  };

  const cleanup = () => {
    root.unmount();
    document.body.removeChild(container);
  };

  const root = createRoot(container);
  root.render(
    <ConfirmDialog
      title={title}
      content={content}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
