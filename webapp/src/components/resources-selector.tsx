"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Link2Icon, PlusIcon, Trash2Icon, UploadIcon } from "lucide-react";
import { useRef } from "react";
import { Control, useFieldArray } from "react-hook-form";
import { TwoSeventyRingWithBg as Spinner } from "react-svg-spinners";
import { toast } from "sonner";

interface ResourcesSelectorProps {
  addButtonText?: string;
  className?: string;
  control: Control<any>;
}

export function ResourcesSelector({
  addButtonText = "Добавить ресурс",
  className,
  control,
}: ResourcesSelectorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "resources",
  });

  const uploadUrlMutation = trpc.getUploadUrl.useMutation();

  const uploadMutation = useMutation({
    mutationFn: ({ url, file }: { url: string; key: string; file: File }) => {
      return fetch(url, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });
    },
    onSuccess: (_, { key, file }) => {
      toast.success("Файл загружен успешно");
      const fileUrl = `${process.env.NEXT_PUBLIC_S3_OBJECT}/${process.env.NEXT_PUBLIC_S3_FILE_BUCKET_NAME}/${key}`;
      append({ name: file.name, url: fileUrl });
    },
    onError: (error: any) => {
      toast.error(`Ошибка загрузки: ${error.message}`);
    },
  });

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { url, key } = await uploadUrlMutation.mutateAsync({
        name: file.name,
        type: file.type,
      });
      uploadMutation.mutate({ url, key, file });
    } catch (error: any) {
      console.error("Upload error:", error);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const uploading = uploadMutation.isPending || uploadUrlMutation.isPending;

  return (
    <div className="space-y-4">
      <div className={cn(`space-y-4 overflow-y-auto max-h-32 p-2`, className)}>
        {fields.map((resource, index) => (
          <div key={resource.id} className="flex gap-2">
            <div className="flex-1 flex flex-col md:flex-row gap-2">
              <FormField
                control={control}
                name={`resources.${index}.name`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input {...field} placeholder="Название ресурса" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name={`resources.${index}.url`}
                render={({ field }) => (
                  <FormItem className="flex-2">
                    <FormControl>
                      <Input {...field} placeholder="https://example.com" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => remove(index)}
            >
              <Trash2Icon />
            </Button>
          </div>
        ))}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", url: "" })}
            className="w-full"
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Spinner color="white" />
                Загрузка...
              </>
            ) : (
              <>
                <PlusIcon />
                {addButtonText}
              </>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[300px]" align="center">
          <DropdownMenuLabel>Тип ресурса</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => append({ name: "", url: "" })}
              role="button"
              aria-description="Добавить ссылку"
              disabled={uploading}
            >
              <Link2Icon />
              Добавить ссылку
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleUpload()}
              role="button"
              aria-description="Загрузить файл"
              disabled={uploading}
            >
              <UploadIcon />
              Загрузить файл
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Hidden file input */}
      <input
        type="file"
        hidden
        aria-hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept="image/*,application/pdf"
      />
    </div>
  );
}
