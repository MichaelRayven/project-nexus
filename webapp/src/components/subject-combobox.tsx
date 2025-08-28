"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { trpc } from "@/trpc/client";

export function SubjectCombobox() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const { data: subjects, isError } = trpc.subjectList.useQuery();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? subjects?.find((subject) => subject.id === value)?.name
            : "Выбирите предмет..."}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Поиск по предмету..." />
          <CommandList>
            <CommandEmpty>
              {isError ? "Ошибка, попробуйте позже" : "Ничего не найдено"}
            </CommandEmpty>
            <CommandGroup>
              {subjects?.map((subject) => (
                <CommandItem
                  key={subject.id}
                  value={subject.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === subject.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {subject.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
