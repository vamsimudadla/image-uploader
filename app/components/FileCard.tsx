import { Meta, UppyFile } from "@uppy/core";
import { memo, useMemo } from "react";
import CloseCircleIcon from "../icons/CloseCircleIcon";
import { useUppy } from "../context/Uppy";
import Loader from "./common/Loader";
import { formatBytes } from "../utils/common";
import CheckmarkIcon from "../icons/CheckMark";

interface FileCardProps {
  file: UppyFile<Meta, Record<string, never>>;
}

const FileCard = memo(function FileCard({ file }: FileCardProps) {
  const { uppy } = useUppy();

  const preview = useMemo(() => {
    return file.preview;
  }, [file]);

  function removeFile() {
    uppy?.removeFile(file.id);
  }

  const formattedFileSize = useMemo(() => {
    return formatBytes(file.size || 0);
  }, [file]);

  const isUploading = useMemo(() => {
    return !file.response && file.progress.uploadStarted;
  }, [file]);

  const isUploadCompleted = useMemo(() => {
    return file.progress.uploadComplete && file.response?.status === 200;
  }, [file]);

  const isUploadFailed = useMemo(() => {
    return file.response && file.response.status !== 200;
  }, [file]);

  const statusIcon = useMemo(() => {
    if (isUploading) {
      return <Loader />;
    }

    if (isUploadCompleted) {
      return <CheckmarkIcon stroke="#5FB88E" />;
    }

    return (
      <button
        onClick={removeFile}
        className="flex items-center justify-center rounded-full bg-zinc-50 cursor-pointer outline-0 shadow-2xl"
      >
        <CloseCircleIcon width={16} height={16} />
      </button>
    );
  }, [isUploading, isUploadCompleted, isUploadFailed]);

  const statusText = () => {
    if (isUploading) {
      return (
        <p className="text-xs text-gray-400">
          Uploading: {formatBytes(file.progress.bytesUploaded || 0)} of{" "}
          {formattedFileSize}
        </p>
      );
    }

    if (isUploadCompleted) {
      return (
        <p className="text-xs text-green-500">Uploaded: {formattedFileSize}</p>
      );
    }

    if (isUploadFailed) {
      return <p className="text-xs text-red-500">Uploaded Failed</p>;
    }

    return <p className="text-xs text-gray-400">{formattedFileSize}</p>;
  };

  return (
    <div className="flex flex-col p-2.5 bg-white shadow-2xl rounded-xl w-52 gap-4">
      <div
        className={`flex rounded-lg relative ${
          preview ? "" : "bg-gray-300 aspect-square"
        }`}
      >
        {preview ? (
          <img src={preview} alt={file.name} className="rounded-lg" />
        ) : null}

        <div className="flex items-center justify-center rounded-full absolute top-0.5 right-0.5 w-5 h-5 bg-zinc-50">
          {statusIcon}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm">
          {file.name}
        </p>
        {statusText()}
      </div>
    </div>
  );
});

export default FileCard;
