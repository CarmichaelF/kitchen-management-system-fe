"use client";

import { Status } from "@/app/dashboard/order/board/page";
import { Card, CardContent, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatBrazilianDate } from "@/utils";
import { useEffect, useState } from "react";
import { api } from "@/service/axios";

interface Order {
  id: string;
  createdDate: Date;
  dueDate: Date;
  status: Status;
}

export function OrdersTable() {
  const [orders, setOrders] = useState([] as Order[]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get<
        {
          _id: string;
          date: Date;
          dueDate: Date;
          status: Status;
        }[]
      >("/order");
      setOrders(
        data.map((order) => {
          return {
            createdDate: order.date,
            dueDate: order.dueDate,
            id: order._id,
            status: order.status,
          };
        })
      );
    })();
  }, []);
  return (
    <Card className="p-6">
      <CardTitle className="text-sm font-semibold">Ordens de Serviço</CardTitle>
      <CardContent className="mt-1 -ml-1.5">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Ordem</TableHead>
              <TableHead className="w-[200px]">Data de Criação</TableHead>
              <TableHead className="w-[200px]">Data Limite</TableHead>
              {/* <TableHead className="w-[200px]">Responsável</TableHead> */}
              <TableHead className="w-[200px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              return (
                <TableRow key={order.id}>
                  <TableCell>#{order.id.slice(-4)}</TableCell>
                  <TableCell>
                    {formatBrazilianDate(order.createdDate)}
                  </TableCell>
                  <TableCell>
                    {formatBrazilianDate(order.dueDate, "dd/MM/yyyy")}
                  </TableCell>
                  {/* <TableCell>João</TableCell> */}
                  <TableCell className="text-yellow-600">
                    {order.status}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
