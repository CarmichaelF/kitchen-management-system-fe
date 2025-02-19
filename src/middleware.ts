import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { api } from "./service/axios";
import { AxiosError } from "axios";

const publicPaths = ["/auth/login", "/auth/register", "/api/public"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🚀 Se for uma rota pública, permite acesso direto
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 🔍 Obtém o token do cookie
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // ✅ Verifica se o token é válido chamando a API de validação
  try {
    const response = await api.post(
      "/auth/validate",
      {}, // Corpo da requisição (vazio)
      { headers: { Authorization: `Bearer ${token}` } } // Headers corretamente posicionados
    );

    if (response.data.valid) return NextResponse.next();
  } catch (error) {
    console.error("❌ Erro ao validar o token:", error);

    if (error instanceof AxiosError) {
      console.error("🔴 Erro do Axios:", error.message);
    }

    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // 🚨 Se a validação falhar, força o redirecionamento
  return NextResponse.redirect(new URL("/auth/login", request.url));
}

// 🔧 Configuração do middleware para todas as rotas, exceto as públicas
export const config = {
  matcher: ["/((?!_next|favicon.ico|static|public|auth).*)"],
};
