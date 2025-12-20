import { useUppy } from "@/app/context/Uppy";
import { memo } from "react";

function UploadFailedActions() {
  const { uppy } = useUppy();

  function removeAll() {
    uppy?.clear();
  }

  function retryFailed() {
    uppy?.retryAll();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={retryFailed}
        className="bg-red-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
      >
        Retry Failed
      </button>
      <button
        onClick={removeAll}
        className="bg-white font-bold text-sm text-gray-700 px-6 py-1 rounded-lg cursor-pointer border"
      >
        Cancel
      </button>
    </div>
  );
}

export default memo(UploadFailedActions);
