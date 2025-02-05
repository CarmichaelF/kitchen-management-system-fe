import { PropsWithChildren } from "react";
import { Toaster } from "sonner";
import "./globals.css";

export default function layout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
