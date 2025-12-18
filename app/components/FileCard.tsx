import { Meta, UppyFile } from "@uppy/core";
import { memo, useMemo } from "react";

interface FileCardProps {
  file: UppyFile<Meta, Record<string, never>>;
}

const FileCard = memo(function FileCard(props: FileCardProps) {
  const preview = useMemo(() => {
    return props.file.preview;
  }, [props.file]);

  return (
    <div className="flex flex-col p-2.5 bg-white shadow-2xl rounded-xl w-52 gap-4">
      <div
        className={`flex rounded-lg ${
          preview ? "" : "bg-gray-300 aspect-square"
        }`}
      >
        {preview ? (
          <img src={preview} alt={props.file.name} className="rounded-lg" />
        ) : null}
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
