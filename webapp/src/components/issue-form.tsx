"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDown,
  CrossIcon,
  PlusIcon,
  TrashIcon,
  XIcon,
} from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { AddSubjectDialog } from "./add-subject-dialog";
import { AddTeacherDialog } from "./add-teacher-dialog";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Название обязательно",
    })
    .max(150, {
      message: "Название не может быть длиннее 150 символов",
    }),
  description: z
    .string()
    .min(100, {
      message: "Описание не может быть короче 100 символов",
    })
    .max(4096, {
      message: "Описание не может быть длиннее 4096 символов",
    }),
  subject: z.string().min(1, { message: "Предмет обязателен" }),
  teacher: z.string().min(1, { message: "Преподаватель обязателен" }),
  deadline: z.date(),
  resources: z.array(
    z.object({
      name: z.string().min(1, { message: "Название обязательно" }),
      url: z.url({ message: "Неверный URL" }),
    })
  ),
});

export function IssueForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      teacher: "",
      resources: [{ name: "", url: "" }],
      deadline: new Date(),
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const { data: subjects } = trpc.subjectList.useQuery();
  const { data: teachers } = trpc.teacherList.useQuery();

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название</FormLabel>
              <FormControl>
                <Input
                  placeholder="СиАОД Лаб. 6, вариант 1..."
                  maxLength={150}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Опишите задачу в деталях, чтобы выполняющие ее знали, что делать..."
                  maxLength={4096}
                  minLength={100}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field, fieldState }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Предмет</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? subjects?.find(
                            (subject) => subject.id === field.value
                          )?.name
                        : "Выберите предмет..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Поиск предмета..."
                      className="h-9"
                    />
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
                            onSelect={() => {
                              form.setValue("subject", subject.id);
                            }}
                          >
                            {subject.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto",
                                subject.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                        <AddSubjectDialog
                          trigger={
                            <CommandItem className="cursor-pointer">
                              <PlusIcon />
                              <span>Добавить предмет</span>
                            </CommandItem>
                          }
                        />
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="teacher"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Преподаватель</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? teachers?.find((t) => t.id === field.value)?.name
                        : "Выберите преподавателя..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput
                      placeholder="Поиск преподавателя..."
                      className="h-9"
                    />
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
                        {teachers?.map((t) => (
                          <CommandItem
                            value={t.id}
                            key={t.id}
                            onSelect={() => {
                              form.setValue("teacher", t.id);
                            }}
                          >
                            {t.name}
                            <CheckIcon
                              className={cn(
                                "ml-auto",
                                t.id === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                        <AddTeacherDialog
                          trigger={
                            <CommandItem className="cursor-pointer">
                              <PlusIcon />
                              <span>Добавить преподавателя</span>
                            </CommandItem>
                          }
                        />
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Дедлайн</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP", { locale: ru })
                      ) : (
                        <span>Выберите дату</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    locale={ru}
                    disabled={(date) => date < new Date()}
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="resources"
          render={() => (
            <FormItem className="flex flex-col">
              <FormLabel>Ресурсы</FormLabel>
              <div className="space-y-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-2">
                    <FormControl className="flex-1">
                      <Input
                        placeholder="Название"
                        {...form.register(`resources.${index}.name` as const, {
                          required: "Обязательно",
                        })}
                      />
                    </FormControl>
                    <FormControl className="flex-2">
                      <Input
                        placeholder="https://example.com"
                        {...form.register(`resources.${index}.url` as const, {
                          required: "Обязательно",
                        })}
                      />
                    </FormControl>
                    {index > 0 && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <XIcon />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  type="button"
                  onClick={() => append({ name: "", url: "" })}
                >
                  <PlusIcon />
                  Добавить ресурс
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Добавить</Button>
      </form>
    </Form>
  );
}
