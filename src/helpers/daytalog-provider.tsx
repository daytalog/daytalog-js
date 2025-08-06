/** @jsxImportSource react */
import { ReactNode, useEffect, useState, ReactElement } from "react";
import { InternalDaytalogProvider } from "../context/daytalog-context";
import { Daytalog } from "../typegen/daytalog";
import { initializeDaytalog } from "./init-daytalog";

export type DaytalogProviderProps = {
  children: ReactNode;
  onError?: (error: Error) => void;
  loading?: ReactNode;
  selection?: string[];
  message?: string;
};

/**
 * A React component that provides Daytalog context with automatic initialization for browser environments.
 *
 * @example
 * ```tsx
 * // Browser usage
 * function App() {
 *   return (
 *     <DaytalogProvider
 *       loading={<LoadingSpinner />}
 *     >
 *       <YourApp />
 *     </DaytalogProvider>
 *   );
 * }
 *
 * // Node.js usage (e.g., in Next.js with server-side rendering)
 * function HomePage({ daytalog }) {
 *   return (
 *     <DaytalogProvider>
 *       <YourApp />
 *     </DaytalogProvider>
 *   );
 * }
 * ```
 */
export function DaytalogProvider({
  children,
  onError,
  loading,
  selection,
  message,
}: DaytalogProviderProps) {
  const [daytalog, setDaytalog] = useState<Daytalog | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const instance = await initializeDaytalog({ selection, message });
        if (mounted) {
          setDaytalog(instance);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        if (mounted) {
          setError(error);
          onError?.(error);
        }
      }
    }

    init();

    return () => {
      mounted = false;
    };
  }, [selection, message]);

  if (error) {
    return null; // Or you could return an error component
  }

  if (!daytalog) {
    return (loading as ReactElement) || null;
  }

  return (
    <InternalDaytalogProvider value={daytalog}>
      {children}
    </InternalDaytalogProvider>
  );
}
