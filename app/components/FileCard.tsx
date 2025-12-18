import { Meta, UppyFile } from "@uppy/core";
import { memo, useMemo } from "react";
import CloseCircleIcon from "../icons/CloseCircleIcon";
import { useUppy } from "../context/Uppy";

interface FileCardProps {
  file: UppyFile<Meta, Record<string, never>>;
}

const FileCard = memo(function FileCard(props: FileCardProps) {
  const { uppy } = useUppy();

  const preview = useMemo(() => {
    return props.file.preview;
  }, [props.file]);

  function removeFile() {
    uppy?.removeFile(props.file.id);
  }

  return (
    <div className="flex flex-col p-2.5 bg-white shadow-2xl rounded-xl w-52 gap-4">
      <div
        className={`flex rounded-lg relative ${
          preview ? "" : "bg-gray-300 aspect-square"
        }`}
      >
        {preview ? (
          <img src={preview} alt={props.file.name} className="rounded-lg" />
        ) : null}

        <button
          onClick={removeFile}
          className="flex items-center justify-center absolute top-0.5 right-0.5 p-0.5 rounded-full bg-zinc-50 cursor-pointer outline-0 shadow-2xl"
        >
          <CloseCircleIcon width={16} height={16} />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {props.file.name}
        </p>
      </div>
    </div>
  );
});

export default FileCard;
