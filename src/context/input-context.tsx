"use client";

import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFetchData } from "../hooks/useFetchData";

export type Unity = "kg" | "un";

export interface NameData {
  label: string;
  value: string;
}

export interface InputDTO {
  _id: string;
  name: string;
  unity: Unity;
  date: Date | undefined;
  costPerUnit: string;
  cost: number;
  initialQuantity: number;
  stockLimit: number;
}

interface InputContextData {
  names: NameData[];
  addItem: (item: NameData) => void;
  removeItem: (id: string) => void;
  fetchAndPopulateNames: () => Promise<void>;
}

export const InputContext = createContext<InputContextData>(
  {} as InputContextData
);

export const InputProvider = ({ children }: PropsWithChildren) => {
  const { getAll } = useFetchData({ path: "input" });
  const [names, setNames] = useState<NameData[]>([] as NameData[]);

  const addItem = (item: NameData) => {
    setNames((prevNames) => [...prevNames, item]);
  };

  const removeItem = (id: string) => {
    setNames((prevNames) => prevNames.filter((item) => item.value !== id));
  };

  const fetchAndPopulateNames = async () => {
    const response = await getAll<InputDTO[]>();
    setNames(
      response.data.map((item: InputDTO) => ({
        label: item.name,
        value: item._id,
      }))
    );
  };

  useEffect(() => {
    (async () => {
      await fetchAndPopulateNames();
    })();
  }, []);

  return (
    <InputContext.Provider
      value={{ names, addItem, removeItem, fetchAndPopulateNames }}
    >
      {children}
    </InputContext.Provider>
  );
};

export const useInputContext = () => {
  const context = useContext(InputContext);

  if (!context) {
    throw new Error("useInputContext must be used within an InputProvider");
  }

  return context;
};
