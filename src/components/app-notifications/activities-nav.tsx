import { trimString } from "@/utils";
import { Separator } from "../ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Fragment } from "react";

export function ActivitiesNav() {
  const notifications = [
    {
      title: "Produto X foi cadastrado por [Usuário]",
      subtitle: "Agora",
      avatar: "https://github.com/shadcn.png",
    },
    {
      title: "Estoque do produto Y atualizado por [Usuário].",
      subtitle: "59 minutos atrás",
      avatar: "https://github.com/shadcn.png",
    },
    {
      title: "Produto X foi cadastrado por [Usuário]",
      subtitle: "3 dias atrás",
      avatar: "https://github.com/shadcn.png",
    },
  ];

  return (
    <>
      <span className="ml-2">Notificações</span>
      <div>
        {notifications.map(({ title, subtitle }, index) => (
          <Fragment key={index}>
            <div className="flex py-2 gap-2 items-center">
              <div className="p-2 rounded flex items-center h-8">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                    className=""
                  />
                  <AvatarFallback>title</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span className="text-sm">{trimString(title)}</span>
                <span className="text-xs text-gray-400">{subtitle}</span>
              </div>
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </>
  );
}
