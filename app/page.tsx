"use client";

import Dashboard from "./components/Dashboard";
import AppProviders from "./context";

export default function Home() {
  return (
    <AppProviders>
      <Dashboard />
    </AppProviders>
  );
}
