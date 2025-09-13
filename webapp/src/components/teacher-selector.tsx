"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDown, PlusIcon } from "lucide-react";
import { cn, getFullName } from "@/lib/utils";
import { AddTeacherDialog } from "./add-teacher-dialog";

interface Teacher {
  id: string;
  name: string;
  surname: string;
  paternal: string;
}

interface TeacherSelectorProps {
  teachers?: Teacher[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function TeacherSelector({
  teachers,
  value,
  onValueChange,
  placeholder = "Выберите преподавателя...",
  searchPlaceholder = "Поиск преподавателя...",
}: TeacherSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedTeacher = teachers?.find((t) => t.id === value);

  const handleSelect = (teacherId: string) => {
    onValueChange(teacherId);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between w-full",
            !value && "text-muted-foreground"
          )}
        >
          {selectedTeacher ? getFullName(selectedTeacher) : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>
              Преподаватель не найден.
              <AddTeacherDialog
                trigger={
                  <p className="underline underline-offset-4 cursor-pointer">
                    Добавить преподавателя?
                  </p>
                }
              />
            </CommandEmpty>
            <CommandGroup>
              {teachers?.map((teacher) => (
                <CommandItem
                  value={teacher.id}
                  key={teacher.id}
                  onSelect={() => handleSelect(teacher.id)}
                >
                  {getFullName(teacher)}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      teacher.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              <AddTeacherDialog
                trigger={
                  <CommandItem className="cursor-pointer">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>Добавить преподавателя</span>
                  </CommandItem>
                }
              />
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
