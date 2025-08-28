"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { LogInIcon } from "lucide-react";

export function LogInButton() {
  const handleClick = async () => {
    await authClient.signIn.social({
      provider: "github",
      callbackURL: "/",
      errorCallbackURL: "/error",
      newUserCallbackURL: "/welcome",
    });
  };

  return (
    <Button onClick={handleClick}>
      <LogInIcon /> Login
    </Button>
  );
}
