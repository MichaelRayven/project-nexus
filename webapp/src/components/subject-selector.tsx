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
import { cn } from "@/lib/utils";
import { AddSubjectDialog } from "./add-subject-dialog";

interface Subject {
  id: string;
  name: string;
}

interface SubjectSelectorProps {
  subjects?: Subject[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
}

export function SubjectSelector({
  subjects,
  value,
  onValueChange,
  placeholder = "Выберите предмет...",
  searchPlaceholder = "Поиск предмета...",
}: SubjectSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedSubject = subjects?.find((s) => s.id === value);

  const handleSelect = (subjectId: string) => {
    onValueChange(subjectId);
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
          {selectedSubject ? selectedSubject.name : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} className="h-9" />
          <CommandList>
            <CommandEmpty>
              Предмет не найден.
              <AddSubjectDialog
                trigger={
                  <p className="underline underline-offset-4 cursor-pointer">
                    Добавить предмет?
                  </p>
                }
              />
            </CommandEmpty>
            <CommandGroup>
              {subjects?.map((subject) => (
                <CommandItem
                  value={subject.id}
                  key={subject.id}
                  onSelect={() => handleSelect(subject.id)}
                >
                  {subject.name}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      subject.id === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
              <AddSubjectDialog
                trigger={
                  <CommandItem className="cursor-pointer">
                    <PlusIcon className="mr-2 h-4 w-4" />
                    <span>Добавить предмет</span>
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
