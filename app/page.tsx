"use client";

import ImageUploader from "./components/ImageUploader";
import AppProviders from "./context";

export default function Home() {
  return (
    <AppProviders>
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <ImageUploader />
      </div>
    </AppProviders>
  );
}
