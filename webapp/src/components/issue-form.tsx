"use client";

import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { TIMEZONE } from "@/lib/utils";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { ru } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Markdown from "react-markdown";
import { TwoSeventyRingWithBg as Spinner } from "react-svg-spinners";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { toast } from "sonner";
import { z } from "zod";
import { ResourcesSelector } from "./resources-selector";
import { SubjectSelector } from "./subject-selector";
import { TeacherSelector } from "./teacher-selector";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import remarkGfm from "remark-gfm";

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
      type: z.enum(["link", "image"]),
    })
  ),
  duration: z.enum(["short", "medium", "long"]),
  category: z.enum(["homework", "labwork", "coursework", "other"]),
});

export function IssueForm({
  onIssueAdded = () => {},
  initialDeadline = new Date(),
}: {
  onIssueAdded?: () => void;
  initialDeadline?: Date;
}) {
  // Wizard state
  const [step, setStep] = useState(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      teacher: "",
      resources: [],
      deadline: initialDeadline,
      duration: "short",
      category: "homework",
    },
  });

  const resources = form.watch("resources");

  const { data: subjects } = trpc.subjectList.useQuery();
  const { data: teachers } = trpc.teacherList.useQuery();
  const utils = trpc.useUtils();
  const mutation = trpc.issueAdd.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      form.reset();
      toast.success("Задача добавлена");
      utils.issueListWeek.invalidate();
      onIssueAdded();
    },
  });

  function handleNext() {
    form
      .trigger([
        "title",
        "subject",
        "teacher",
        "deadline",
        "duration",
        "category",
      ])
      .then((valid) => {
        if (valid) setStep(2);
      });
  }

  function handlePrev() {
    setStep(1);
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate({
      ...values,
      deadline: formatInTimeZone(values.deadline, TIMEZONE, "MM-dd-yyyy"),
    });
  }

  function getPreviewBody(value: string) {
    let previewBody = value;
    if (resources.length > 0) {
      previewBody += `\n\nРесурсы:\n${resources
        .map((res) =>
          res.type === "link"
            ? `- [${res.name}](${res.url})`
            : `- ![${res.name}](${res.url || "null"})`
        )
        .join("\n")}`;
    }
    previewBody += `\n\n---\n*Перед тем как начать выполнять задание, не забудьте назначить себя исполнителем.*`;
    return previewBody;
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-8"
      >
        {step === 1 && (
          <>
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
            <div className="flex gap-y-8 gap-x-4 flex-col md:flex-row">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Длительность выполнения</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
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
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Предмет</FormLabel>
                  <FormControl>
                    <SubjectSelector
                      subjects={subjects}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
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
                  <FormControl>
                    <TeacherSelector
                      teachers={teachers}
                      value={field.value}
                      onValueChange={field.onChange}
                    />
                  </FormControl>
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
                            formatInTimeZone(field.value, TIMEZONE, "PPP", {
                              locale: ru,
                            })
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
                        disabled={(date) =>
                          date < toZonedTime(new Date(), TIMEZONE)
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="default" onClick={handleNext}>
                Далее
              </Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => {
                const [preview, setPreview] = useState(false);
                return (
                  <FormItem>
                    <FormLabel className="flex justify-between">
                      Описание
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setPreview((v) => !v)}
                      >
                        {preview ? "Редактировать" : "Предпросмотр"}
                      </Button>
                    </FormLabel>
                    <FormDescription>
                      Это поле поддерживает Markdown.
                    </FormDescription>
                    <FormControl>
                      {preview ? (
                        <div className="border rounded min-h-48 max-h-96 h-0 sm:max-h-[50dvh] p-4 bg-muted/30 prose dark:prose-invert prose-sm resize-y overflow-y-auto">
                          <Markdown
                            rehypePlugins={[rehypeKatex]}
                            remarkPlugins={[remarkGfm, remarkMath]}
                          >
                            {getPreviewBody(field.value)}
                          </Markdown>
                        </div>
                      ) : (
                        <Textarea
                          placeholder="Опишите задачу в деталях, чтобы выполняющие ее знали, что делать..."
                          maxLength={4096}
                          minLength={100}
                          className="min-h-48 max-h-96 sm:max-h-[50dvh]"
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="resources"
              render={() => (
                <FormItem className="flex flex-col">
                  <FormLabel>Ресурсы</FormLabel>
                  <ResourcesSelector control={form.control} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-between gap-2">
              <Button type="button" variant="outline" onClick={handlePrev}>
                Назад
              </Button>
              <Button
                type="submit"
                className="w-[100px]"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Spinner color="white" /> : "Добавить"}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  );
}
