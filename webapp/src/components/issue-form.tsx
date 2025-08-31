"use client";

import { cn, getFullName } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  CalendarIcon,
  CheckIcon,
  ChevronsUpDown,
  PlusIcon,
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Textarea } from "./ui/textarea";
import { TwoSeventyRingWithBg as Spinner } from "react-svg-spinners";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

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
  duration: z.enum(["short", "medium", "long"]),
  category: z.enum(["homework", "labwork", "coursework", "other"]),
});

export function IssueForm({
  onIssueAdded = () => {},
}: {
  onIssueAdded?: () => void;
}) {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      teacher: "",
      resources: [],
      deadline: new Date(),
      duration: "medium",
      category: "homework",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "resources",
  });

  const { data: subjects, refetch: refetchSubjects } =
    trpc.subjectList.useQuery();
  const { data: teachers, refetch: refetchTeachers } =
    trpc.teacherList.useQuery();

  const mutation = trpc.issueAdd.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Задача добавлена");
      onIssueAdded();
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      ...values,
      deadline: format(values.deadline, "MM-dd-yyyy"),
    });
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

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Длительность выполнения</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите длительность" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="short">Короткая</SelectItem>
                        <SelectItem value="medium">Средняя</SelectItem>
                        <SelectItem value="long">Длинная</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Категория задачи</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="homework">
                          Домашнее задание
                        </SelectItem>
                        <SelectItem value="labwork">
                          Лабораторная работа
                        </SelectItem>
                        <SelectItem value="coursework">
                          Курсовая работа
                        </SelectItem>
                        <SelectItem value="other">Другое</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Описание</FormLabel>
              <FormDescription>Это поле поддерживает Markdown.</FormDescription>
              <FormControl>
                <Textarea
                  placeholder="Опишите задачу в деталях, чтобы выполняющие ее знали, что делать..."
                  maxLength={4096}
                  minLength={100}
                  className="min-h-48"
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
          render={({ field }) => (
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
                        ? getFullName(
                            teachers?.find((t) => t.id === field.value)!
                          )
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
                        {teachers?.map((teacher) => (
                          <CommandItem
                            value={teacher.id}
                            key={teacher.id}
                            onSelect={() => {
                              form.setValue("teacher", teacher.id);
                            }}
                          >
                            {getFullName(teacher)}
                            <CheckIcon
                              className={cn(
                                "ml-auto",
                                teacher.id === field.value
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
                    <FormField
                      control={form.control}
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
                      control={form.control}
                      name={`resources.${index}.url`}
                      render={({ field }) => (
                        <FormItem className="flex-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="https://example.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <XIcon />
                    </Button>
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

        <Button
          type="submit"
          className="w-[100px]"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? <Spinner color="white" /> : "Добавить"}
        </Button>
      </form>
    </Form>
  );
}
