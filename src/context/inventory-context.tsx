"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetchData } from "../hooks/useFetchData";
import { InputDTO, Unity } from "./input-context";

export interface InventoryData {
  label: string;
  value: string;
  unity: Unity;
}

export interface InventoryDTO {
  _id: string;
  input: InputDTO;
  name: string;
  quantity: number;
  date: Date;
  unity: Unity;
}

interface InventoryContextData {
  allInventory: InventoryData[];
  addItem: (item: InventoryData) => void;
  removeItem: (id: string) => void;
  fetchAndPopulateInventory: () => Promise<void>;
}

export const InventoryContext = createContext<InventoryContextData>(
  {} as InventoryContextData
);

export const InventoryProvider = ({ children }: PropsWithChildren) => {
  const { getAll } = useFetchData({ path: "inventory" });
  const [allInventory, setInventory] = useState<InventoryData[]>(
    [] as InventoryData[]
  );

  const addItem = (item: InventoryData) => {
    setInventory((prevNames) => [...prevNames, item]);
  };

  const removeItem = (id: string) => {
    setInventory((prevNames) => prevNames.filter((item) => item.value !== id));
  };

  const fetchAndPopulateInventory = async () => {
    const response = await getAll<InventoryDTO[]>();
    setInventory(
      response.data.map((item: InventoryDTO) => ({
        label: item.input.name,
        value: item._id,
        unity: item.unity,
      }))
    );
  };

  useEffect(() => {
    (async () => {
      await fetchAndPopulateInventory();
    })();
  }, []);

  return (
    <InventoryContext.Provider
      value={{ allInventory, addItem, removeItem, fetchAndPopulateInventory }}
    >
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventoryContext = () => {
  const context = useContext(InventoryContext);

  if (!context) {
    throw new Error(
      "useInventoryContext must be used within an InventoryProvider"
    );
  }

  return context;
};
