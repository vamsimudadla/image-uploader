import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { useUppy } from "../context/Uppy";

function ImageUploader() {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uppy } = useUppy();

  useEffect(() => {
    const preventDefaultDragDrop = (e: DragEvent) => {
      if (e.dataTransfer?.types.includes("Files")) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    window.addEventListener("dragover", preventDefaultDragDrop, false);
    window.addEventListener("drop", preventDefaultDragDrop, false);

    return () => {
      window.removeEventListener("dragover", preventDefaultDragDrop, false);
      window.removeEventListener("drop", preventDefaultDragDrop, false);
    };
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    addFilesToUppy(droppedFiles);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || []);
      addFilesToUppy(selectedFiles);
      e.target.value = ""; // Reset input
    },
    []
  );

  const addFilesToUppy = useCallback((fileList: File[]) => {
    if (!uppy) return;

    fileList.forEach((file) => {
      try {
        uppy.addFile({
          name: file.name,
          type: file.type,
          data: file,
          source: "Local",
          meta: {
            relativePath: (file as any).webkitRelativePath || null,
          },
        });
      } catch (error: any) {
        if (error.isRestriction) {
          alert(`File rejected: ${error.message}`);
        } else {
          console.error("Error adding file:", error);
        }
      }
    });
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <div
        className={`
          flex flex-col items-center justify-center m-4 p-8 w-full 
          max-w-lg sm:mx-auto bg-white border-2 border-dashed rounded-xl gap-4 
          cursor-pointer transition-all duration-300
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 hover:border-gray-400 hover:bg-blue-50"
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.gif,.webp"
          onChange={handleFileInput}
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <Image
            src="/file.svg"
            alt="file"
            width={50}
            height={20}
            priority
            className="transition-transform duration-300"
          />
          <div className="text-center space-y-2">
            {isDragging ? (
              <p>Drop images here...</p>
            ) : (
              <>
                <button className="block sm:hidden border bg-orange-500 text-white font-bold px-4 py-2 rounded-lg">
                  Upload from Gallery
                </button>
                <p className="hidden sm:block text-lg font-medium text-gray-800">
                  Drag and drop images here
                </p>
                <p className="hidden sm:block text-gray-600">
                  or choose from your device
                </p>
              </>
            )}
          </div>

          <p className="text-sm text-gray-500 text-center">
            JPG, JPEG, PNG, GIF, WEBP. Max file size: 10MB.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ImageUploader;
