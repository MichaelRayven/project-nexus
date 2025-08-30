"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { trpc } from "@/trpc/client";
import { TwoSeventyRingWithBg as Spinner } from "react-svg-spinners";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Имя обязательно",
  }),
  surname: z.string().min(1, {
    message: "Фамилия обязательна",
  }),
  paternal: z.string().min(1, {
    message: "Отчество обязательно",
  }),
  email: z.string().email({
    message: "Неверный формат электронной почты",
  }),
});

export function AddTeacherDialog({ trigger }: { trigger?: ReactNode }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      surname: "",
      paternal: "",
      email: "",
    },
  });

  const mutation = trpc.teacherAdd.useMutation();

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-auto">
        <DialogHeader>
          <DialogTitle>Добавить преподавателя</DialogTitle>
          <DialogDescription>
            Введите данные преподавателя и нажмите сохранить.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            id="add-teacher"
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="surname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Фамилия</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванов" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Имя</FormLabel>
                  <FormControl>
                    <Input placeholder="Иван" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="paternal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Отчество</FormLabel>
                  <FormControl>
                    <Input placeholder="Иванович" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Электронная почта</FormLabel>
                  <FormControl>
                    <Input placeholder="teacher@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Отмена</Button>
              </DialogClose>
              <Button
                type="submit"
                form="add-teacher"
                className="w-[100px] items-center justify-center"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Spinner color="white" /> : "Сохранить"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
