"use client";
import { formatRelativeTime } from "@/utils";
import { api } from "@/service/axios";
import { trimString } from "@/utils";
import { LucideProps, ShoppingBag } from "lucide-react";
import {
  ForwardRefExoticComponent,
  RefAttributes,
  useEffect,
  useState,
} from "react";
import Cookies from "universal-cookie";
import Link from "next/link";

interface Notifications {
  title: string;
  timestamp: Date;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  messageType: string; // Adicionando o campo messageType para identificar a notificação
  orderId?: string; // Opcional, para armazenar o ID do pedido
}

export function NotificationsNav() {
  const [notifications, setNotifications] = useState<Notifications[]>([]);

  const fetchNotifications = async () => {
    const { data } = await api.get<
      {
        content: string;
        messageType: string;
        senderId: string;
        timestamp: Date;
        _id: string;
        orderId?: string;
      }[]
    >("/notifications");

    setNotifications(
      data.map((notification) => {
        return {
          title: notification.content,
          timestamp: new Date(notification.timestamp),
          icon: ShoppingBag,
          messageType: notification.messageType,
          orderId: notification.orderId,
        };
      })
    );
  };

  useEffect(() => {
    const cookies = new Cookies();
    const token = cookies.get("token");

    // Verifica se o token existe e é válido
    if (!token) {
      console.error("Token não encontrado ou inválido");
      return;
    }

    // Cria uma nova conexão WebSocket
    const socket = new WebSocket(`ws://localhost:3333/ws?token=${token}`);

    socket.onopen = () => {
      console.log("Conexão WebSocket aberta!");
    };

    socket.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      // Verifica se a mensagem é do tipo "notification-update"
      if (message.data.type! !== "notifications-update") {
        // Adiciona a nova notificação ao estado
        const newNotification = {
          ...message.data,
          timestamp: new Date(),
        };

        if (newNotification && newNotification.message) {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              title: newNotification.message,
              timestamp: new Date(newNotification.timestamp),
              icon: ShoppingBag,
              messageType: newNotification.data.type,
              orderId: newNotification.data.orderID,
            },
          ]);
        }
      }
      await fetchNotifications(); // Busca as notificações atualizadas
    };

    socket.onclose = () => {
      console.log("Conexão WebSocket fechada!");
    };

    socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    // Fecha a conexão WebSocket quando o componente for desmontado
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <>
      <span className="ml-2">Notificações</span>
      <div>
        {notifications.map(
          ({ title, timestamp, icon: Icon, messageType, orderId }, index) => {
            return (
              <Link
                key={index}
                href={
                  messageType === "order"
                    ? `/dashboard/order/board/${orderId}`
                    : ""
                }
              >
                <div className="flex p-2 gap-2 items-center">
                  <div className="bg-[#E6F1FD] p-2 rounded flex items-center h-8">
                    <Icon width={"100%"} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm">{trimString(title)}</span>
                    <span className="text-xs text-gray-400">
                      {formatRelativeTime(timestamp)}
                    </span>
                  </div>
                </div>
              </Link>
            );
          }
        )}
      </div>
    </>
  );
}
