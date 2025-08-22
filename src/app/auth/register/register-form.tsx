"use client";

import { cn } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "@/service/axios";
import Cookies from "universal-cookie";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function RegisterForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [role, setRole] = useState<"user" | "admin">("user");

  const { push } = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast("As senhas não coincidem");
      return;
    }

    try {
      const response = await api.post(
        "/auth/register",
        {
          name,
          email,
          password,
          role,
        },
        {
          headers: {
            "x-admin-secret": adminSecret, // Envia o header
          },
        }
      );

      toast("Cadastro realizado com sucesso!");
      const cookies = new Cookies();
      cookies.set("token", response.data.token, {
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      // Redireciona para login
      push("/auth/login");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast(error.response.data.message || "Erro ao cadastrar");
      } else {
        toast("Erro ao cadastrar");
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl pb-2">Cadastro</CardTitle>
          <CardDescription className="pb-6">
            Preencha os campos abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha *</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Função *</Label>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <Input
                      id="role"
                      type="radio"
                      value="user"
                      checked={role === "user"}
                      onChange={() => setRole("user")}
                    />
                    <Label htmlFor="role" className="ml-2">
                      Usuário
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <Input
                      id="role"
                      type="radio"
                      value="admin"
                      checked={role === "admin"}
                      onChange={() => setRole("admin")}
                    />
                    <Label htmlFor="role" className="ml-2">
                      Admin
                    </Label>
                  </div>
                </div>
              </div>
              {role === "admin" && (
                <div className="grid gap-2">
                  <Label htmlFor="adminSecret">Admin Secret</Label>
                  <Input
                    id="adminSecret"
                    type="text"
                    placeholder="Chave secreta do admin"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                  />
                </div>
              )}
              <Button type="submit" className="w-full">
                Criar Conta
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Já tem uma conta?
              <Link
                href="/auth/login"
                className="underline underline-offset-4 ml-1"
              >
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
