import { trimString } from "@/utils";
import { Bug, AccessibilityIcon, AlarmClockMinus } from "lucide-react";

export function NotificationsNav() {
  const notifications = [
    { title: "Você adicionou um novo insumo.", subtitle: "Agora", icon: Bug },
    { title: "Você modificou um item do estoque", subtitle: "59 minutos atrás", icon: AccessibilityIcon },
    { title: "Você adicionou um novo insumo.", subtitle: "3 dias atrás", icon: AlarmClockMinus },
  ];

  return (
    <>
      <span className="ml-2">Notificações</span>
      <div>
        {notifications.map(({ title, subtitle, icon: Icon }, index) => (
          <div className="flex p-2 gap-2 items-center" key={index}>
            <div className="bg-[#E6F1FD] p-2 rounded flex items-center h-8">
              <Icon width={"100%"} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm">{trimString(title)}</span>
              <span className="text-xs text-gray-400">{subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
