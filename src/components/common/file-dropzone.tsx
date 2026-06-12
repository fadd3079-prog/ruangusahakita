"use client";

import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { FileImage, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  accept?: string;
  className?: string;
  description?: string;
  disabled?: boolean;
  id: string;
  label: string;
  maxFiles?: number;
  multiple?: boolean;
  name: string;
  required?: boolean;
};

export function FileDropzone({
  accept,
  className,
  description,
  disabled = false,
  id,
  label,
  maxFiles,
  multiple = false,
  name,
  required = false,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileNames, setFileNames] = useState<readonly string[]>([]);

  function getLimitedFiles(files: FileList) {
    const selectedFiles = Array.from(files);
    const limit = multiple ? maxFiles ?? selectedFiles.length : 1;

    return selectedFiles.slice(0, limit);
  }

  function syncSelectedFiles(files: readonly File[]) {
    if (!inputRef.current) {
      return;
    }

    const transfer = new DataTransfer();

    files.forEach((file) => {
      transfer.items.add(file);
    });

    inputRef.current.files = transfer.files;
    setFileNames(files.map((file) => file.name));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const files = event.currentTarget.files;

    if (!files) {
      setFileNames([]);
      return;
    }

    setFileNames(getLimitedFiles(files).map((file) => file.name));
  }

  function handleDragOver(event: DragEvent<HTMLLabelElement>) {
    if (disabled) {
      return;
    }

    event.preventDefault();
    setIsDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLLabelElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    if (disabled) {
      return;
    }

    event.preventDefault();
    setIsDragging(false);
    syncSelectedFiles(getLimitedFiles(event.dataTransfer.files));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={id}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          "group grid min-h-36 cursor-pointer place-items-center rounded-2xl border border-dashed border-border/80 bg-background p-5 text-center transition-colors",
          "hover:border-primary/45 hover:bg-primary/5",
          isDragging && "border-primary bg-primary/10",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          ref={inputRef}
          id={id}
          name={name}
          type="file"
          accept={accept}
          multiple={multiple}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />
        <span className="flex flex-col items-center">
          <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <UploadCloud className="size-5" aria-hidden="true" />
          </span>
          <span className="mt-4 text-sm font-semibold text-foreground">
            {label}
          </span>
          <span className="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">
            {description ?? "Seret file ke sini atau klik untuk memilih dari perangkat."}
          </span>
        </span>
      </label>

      {fileNames.length > 0 ? (
        <div className="space-y-2 rounded-2xl border border-border/70 bg-muted/35 p-3">
          {fileNames.map((fileName) => (
            <div
              key={fileName}
              className="flex items-center gap-2 text-xs font-medium text-foreground"
            >
              <FileImage className="size-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{fileName}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
