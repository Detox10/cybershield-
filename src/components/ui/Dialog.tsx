"use client";

import React from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { AlertTriangle, Info, CheckCircle2 } from "lucide-react";

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  type?: "info" | "warning" | "destructive" | "success";
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  type = "warning",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
}) => {
  const iconMap = {
    info: <Info className="w-6 h-6 text-sky-500" />,
    warning: <AlertTriangle className="w-6 h-6 text-amber-500" />,
    destructive: <AlertTriangle className="w-6 h-6 text-red-500" />,
    success: <CheckCircle2 className="w-6 h-6 text-emerald-500" />,
  };

  const buttonVariantMap = {
    info: "primary" as const,
    warning: "primary" as const,
    destructive: "destructive" as const,
    success: "primary" as const,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="md">
      <div className="flex gap-4">
        <div className="p-3 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 h-fit">
          {iconMap[type]}
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={buttonVariantMap[type]}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};
