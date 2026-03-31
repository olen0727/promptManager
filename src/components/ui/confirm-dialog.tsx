"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "確定",
  cancelText = "取消",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      confirmRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !mounted) return null;

  const isDanger = variant === "danger";

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Scrim */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: backdrop click handler */}
      <div className="scrim absolute inset-0" onClick={onCancel} />

      {/* Dialog */}
      <div className="dialog relative w-full max-w-md mx-4 scale-in">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${isDanger ? "bg-md-error/15" : "bg-[hsl(45_100%_50%/0.15)]"}`}
          >
            <AlertTriangle
              className={`w-5 h-5 ${isDanger ? "text-md-error" : "text-[hsl(45_100%_40%)]"}`}
            />
          </div>
          <div className="flex-1">
            <h3 className="text-title-large mb-2 text-md-on-surface">{title}</h3>
            <p className="text-body-medium leading-relaxed text-md-on-surface-variant">{message}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button type="button" onClick={onCancel} className="btn-outlined flex-1">
            {cancelText}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`flex-1 py-3 font-medium text-label-large rounded-full transition-all duration-200 ${isDanger ? "bg-md-error text-md-on-error" : "bg-[hsl(45_100%_45%)] text-[hsl(45_100%_10%)]"}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
