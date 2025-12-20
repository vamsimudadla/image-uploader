import { Meta, UppyFile } from "@uppy/core";
import { memo, SyntheticEvent, useEffect, useMemo, useRef } from "react";
import CloseCircleIcon from "../icons/CloseCircleIcon";
import { useUppy } from "../context/Uppy";
import Loader from "./common/Loader";
import { formatBytes } from "../utils/common";
import CheckmarkIcon from "../icons/CheckMark";
import useIntersectionObserver from "../hooks/IntersectionObserver";

interface FileCardProps {
  file: UppyFile<Meta, Record<string, never>>;
}

const FileCard = memo(function FileCard({ file }: FileCardProps) {
  const { uppy, generateThumbnails, cancelThumbnailGeneration } = useUppy();
  const { preview } = file;

  const imageCardRef = useRef<HTMLDivElement | null>(null);
  const { observe, disconnect } = useIntersectionObserver({
    onVisibilityChange: handleVisibilityChange,
    options: {
      scrollMargin: "300px 0px 300px 0px",
    },
    debounceDelay: 150,
  });

  function handleVisibilityChange(itemId: string, isVisible: boolean) {
    if (file.preview) {
      disconnect();
    } else {
      if (isVisible) {
        generateThumbnails([file]);
      } else {
        cancelThumbnailGeneration(file);
      }
    }
  }

  function removeFile() {
    uppy?.removeFile(file.id);
  }

  useEffect(() => {
    if (!file.preview && imageCardRef.current) {
      observe(imageCardRef.current, file.id);
    }
    return () => {
      disconnect();
      if (file.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(file.preview);
      }
    };
  }, [file.preview]);

  const formattedFileSize = useMemo(() => {
    return formatBytes(file.size || 0);
  }, [file]);

  const isUploading = useMemo(() => {
    return (
      !file.error &&
      file.progress.uploadStarted &&
      !file.progress.uploadComplete
    );
  }, [file]);

  const isUploadCompleted = useMemo(() => {
    return file.progress.uploadComplete;
  }, [file]);

  const isUploadFailed = useMemo(() => {
    return file.error;
  }, [file]);

  const onImageLoaded = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const calculatedHeight = (e.target as HTMLImageElement).clientHeight;
    uppy?.setFileMeta(file.id, { thumbnailHeight: calculatedHeight });
  };

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
      return (
        <p className="text-xs text-red-500">
          Uploaded Failed: {formattedFileSize}
        </p>
      );
    }

    return <p className="text-xs text-gray-400">{formattedFileSize}</p>;
  };

  return (
    <div className="flex flex-col rounded-xl w-full gap-4" ref={imageCardRef}>
      <div
        className={`flex rounded-lg relative ${
          preview ? "" : "bg-gray-300 aspect-square"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            onLoad={onImageLoaded}
            alt={file.name}
            className="rounded-lg"
          />
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
