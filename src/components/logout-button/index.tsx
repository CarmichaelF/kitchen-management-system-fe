"use client";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import Cookies from "universal-cookie";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const cookies = new Cookies();

  const handleLogout = () => {
    // Remove o token dos cookies
    cookies.remove("token", { path: "/" });

    // Redireciona o usuário para a tela de login
    router.push("/auth/login");

    // Opcional: Recarregar a página para garantir que o middleware detecte a mudança
    router.refresh();
  };

  return (
    <Button onClick={handleLogout} variant="ghost">
      <LogOut />
    </Button>
  );
}
