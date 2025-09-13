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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { trpc } from "@/trpc/client";
import { TwoSeventyRingWithBg as Spinner } from "react-svg-spinners";
import { toast } from "sonner";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Сокращенное название обязательно",
    })
    .max(150, {
      message: "Сокращенное название не может быть длиннее 150 символов",
    }),
  fullName: z
    .string()
    .min(1, {
      message: "Название обязательно",
    })
    .max(150, {
      message: "Название не может быть длиннее 150 символов",
    }),
});

export function AddSubjectDialog({
  trigger,
  onSubjectAdded = () => {},
}: {
  trigger?: ReactNode;
  onSubjectAdded?: () => void;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const utils = trpc.useUtils();
  const mutation = trpc.subjectAdd.useMutation({
    onSuccess: () => {
      form.reset();
      toast.success("Предмет добавлен");
      utils.subjectList.invalidate();
      onSubjectAdded();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Dialog>
      <DialogTrigger className="w-full">{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] w-auto">
        <DialogHeader>
          <DialogTitle>Добавить предмет</DialogTitle>
          <DialogDescription>
            Введите название предмета и нажмите сохранить.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="АиГ..." maxLength={150} {...field} />
                  </FormControl>
                  <FormDescription>
                    Отображаемое сокращенное название предмета.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Полное название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Алгебра и геометрия..."
                      maxLength={150}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Полное название предмета.</FormDescription>
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
