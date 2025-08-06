# Daytalog

React library for managing and displaying daytalog data.

## Installation

```bash
npm install daytalog
```

## Usage

```tsx
import { DaytalogProvider, useDaytalog } from "daytalog";

// Wrap your app with DaytalogProvider
function App() {
  return (
    <DaytalogProvider loading={<div>Loading...</div>}>
      <YourApp />
    </DaytalogProvider>
  );
}

// Use the data in any child component
function YourComponent() {
  const { projectName, logs, total } = useDaytalog();

  return (
    <div>
      <h1>{projectName}</h1>
      <h3>{total.dateRange()}</h3>
      <div>
        <h2>Totals:</h2>
        <p>Total Files: {total.ocf.files()}</p>
        <p>Total Size: {total.ocf.size()}</p>
        <p>Duration: {total.ocf.duration()}</p>
      </div>
      <div>
        <h2>Shooting days:</h2>
        {logs.map((log) => (
          <div key={log.id}>
            <p>Day: {log.day}</p>
            <p>Date: {log.date}</p>
            <p>Size: {log.ocf?.size()}</p>
            <p>Duration: {log.ocf?.duration()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Quick start

When using Daytalog in a browser environment, you first need to generate a data file from your project's YAML configuration.

1.  **Run the init command:**

    Use the Daytalog CLI to initialize your project. This sets up TypeScript, dependencies, and the recommended folder structure.

    ```bash
    npx daytalog init
    ```

2.  **Run the start command:**

    This will generate the necessary types and data files from your YAML config and logs. Run this whenever you update your config or logs.

    ```bash
    npx daytalog start
    ```

    This will create a `data.ts` file in your `daytalog/generated` directory. You can replace the mockdata in the project folder and regenerate the types.

3.  **Import and Initialize:**

    Wrap your client component in `DaytalogProvider` and use `useDaytalog` to retrieve data.

    ```tsx
    import { project, logs } from "@/daytalog/generated";

    function App() {
      return (
        <DaytalogProvider>
          <Rest />
        </DaytalogProvider>
      );
    }
    ```

    ```tsx
    import { useDaytalog } from "daytalog";

    function Component() {
      const { projectName, log } = useDaytalog();
      return <p>{log.id}</p>;
    }
    ```

**Note:** Whenever you update your `config.yaml` or any log files in `daytalog/project/logs`, you'll need to re-run `npx daytalog start` to update the data file.
