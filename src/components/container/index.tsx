import { PropsWithChildren } from "react";

export function Container({ children }: PropsWithChildren) {
  return <div className="container mx-auto w-full">{children}</div>
}
