import { useUppy } from "@/app/context/Uppy";
import { memo } from "react";

function UploadCompletedActions() {
  const { uppy } = useUppy();

  function removeAll() {
    uppy?.clear();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={removeAll}
        className="bg-green-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
      >
        Done
      </button>
    </div>
  );
}

export default memo(UploadCompletedActions);
