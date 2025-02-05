import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lista de páginas públicas (que não exigem autenticação)
const publicPaths = ["/auth/login", "/auth/register", "/api/public"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Se o usuário estiver acessando uma rota pública, permite
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Obtem o token do cookie (supondo que você o tenha armazenado em um cookie)
  const token = request.cookies.get("token")?.value;
  if (!token) {
    // Redireciona para a página de login
    const loginUrl = new URL("/auth/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Configura para que o middleware seja executado para todas as rotas protegidas
export const config = {
  matcher: ["/((?!_next|favicon.ico|static|public|auth).*)"],
};