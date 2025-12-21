import { useUppy } from "@/app/context/Uppy";
import { memo } from "react";

function UploadStartActions() {
  const { uppy } = useUppy();

  function removeAll() {
    uppy?.emit("cancel-all");
    uppy?.clear();
  }

  function upload() {
    uppy?.upload();
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={upload}
        className="bg-orange-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
      >
        Upload
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

export default memo(UploadStartActions);
