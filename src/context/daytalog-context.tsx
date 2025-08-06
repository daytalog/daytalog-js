/** @jsxImportSource react */
import { createContext, useContext, ReactNode } from "react";
import { Daytalog } from "../typegen/daytalog";

const DaytalogContext = createContext<Daytalog | null>(null);

interface InternalDaytalogProviderProps {
  children: ReactNode;
  value: Daytalog;
}

export function InternalDaytalogProvider({
  children,
  value,
}: InternalDaytalogProviderProps) {
  return (
    <DaytalogContext.Provider value={value}>
      {children}
    </DaytalogContext.Provider>
  );
}

export function useDaytalog() {
  const context = useContext(DaytalogContext);
  if (!context) {
    throw new Error("useDaytalog must be used within a DaytalogProvider");
  }
  return context;
}
