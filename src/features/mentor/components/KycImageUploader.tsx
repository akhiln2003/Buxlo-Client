import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ImageIcon, X } from "lucide-react";
import React from "react";

export const KycImageUploader = ({
  preview,
  onUpload,
  onRemove,
  label,
  error,
}: {
  preview: string | null;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  label: string;
  error?: string;
}) => (
  <FormItem className="space-y-2">
    <FormLabel className="text-gray-700 dark:text-gray-300">{label}</FormLabel>
    <FormControl>
      <div className="relative w-full h-48 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-lg flex items-center justify-center overflow-hidden">
        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
            <ImageIcon className="h-12 w-12 mb-2" />
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              id={`${label.toLowerCase().replace(" ", "-")}-upload`}
              onChange={onUpload}
            />
            <label
              htmlFor={`${label.toLowerCase().replace(" ", "-")}-upload`}
              className="cursor-pointer text-blue-500 hover:underline"
            >
              Upload {label}
            </label>
          </div>
        )}
      </div>
    </FormControl>
    {error && <FormMessage>{error}</FormMessage>}
  </FormItem>
);
