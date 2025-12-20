import { useUppy } from "../context/Uppy";
import FileCard from "./FileCard";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { UppyFile, Meta } from "@uppy/core";
import {
  DEFAULT_DISPLAY_LIMIT,
  COLUMN_WIDTH,
  COLUMN_GAP,
  CARD_PADDING,
  DEFAULT_THUMBNAIL_HEIGHT,
} from "../utils/constants";
import Loader from "./common/Loader";
import { formatBytes } from "../utils/common";
import useIntersectionObserver from "../hooks/IntersectionObserver";

function FileList() {
  const { files, uppy, state } = useUppy();

  const [displayLimit, setDisplayLimit] = useState(() =>
    Math.min(DEFAULT_DISPLAY_LIMIT, files.length)
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

  const totalStatus = useMemo(() => {
    const currentUploadsCount = Object.keys(state?.currentUploads || {}).length;
    return {
      isUploading: currentUploadsCount > 0,
      isCompleted:
        currentUploadsCount === 0 &&
        state?.totalProgress === 100 &&
        !state.error,
      isErrored: currentUploadsCount === 0 && state?.error,
    };
  }, [state]);

  const totalUploadBytes = useMemo(() => {
    const currentUploadFileIds = Object.values(state?.currentUploads || {})?.[0]
      ?.fileIDs;
    if (currentUploadFileIds?.length > 0) {
      const totalBytes = currentUploadFileIds.reduce(
        (acc, fileId) => acc + (state?.files?.[fileId]?.size || 0),
        0
      );
      return totalBytes;
    }
    return 0;
  }, [state]);

  const uploadedBytes = useMemo(() => {
    return (totalUploadBytes * (state?.totalProgress || 0)) / 100;
  }, [state]);

  const totalUploadFilesCount = useMemo(() => {
    const currentUploadFileIds = Object.values(state?.currentUploads || {})?.[0]
      ?.fileIDs;
    return currentUploadFileIds?.length || 0;
  }, [state]);

  const currentUploadedFilesCount = useMemo(() => {
    const currentUploadFileIds = Object.values(state?.currentUploads || {})?.[0]
      ?.fileIDs;
    if (currentUploadFileIds?.length > 0) {
      const uploadedFilesCount = currentUploadFileIds.reduce(
        (acc, fileId) =>
          acc + (state?.files?.[fileId]?.progress?.uploadComplete ? 1 : 0),
        0
      );
      return uploadedFilesCount;
    }
    return 0;
  }, [state]);

  const displayFiles = useMemo(() => {
    return files.slice(0, displayLimit);
  }, [files, displayLimit]);

  const loadMoreFiles = useCallback(
    (limit: number = DEFAULT_DISPLAY_LIMIT) => {
      setDisplayLimit((prevLimit) => Math.min(prevLimit + limit, files.length));
    },
    [displayLimit, files]
  );

  const hasNextPage = useMemo(() => {
    return displayFiles.length < files.length;
  }, [displayFiles, files]);

  function handleVisibilityChange(id: string, isVisible: boolean) {
    if (isVisible) {
      loadMoreFiles();
    }
  }

  const { observe, disconnect } = useIntersectionObserver({
    onVisibilityChange: handleVisibilityChange,
    options: {
      scrollMargin: "0px 0px 400px 0px",
    },
    debounceDelay: 150,
  });

  useEffect(() => {
    if (hasNextPage && paginationRef.current) {
      observe(paginationRef.current, "pagination-element");
    }
    return () => {
      disconnect();
    };
  }, [hasNextPage]);

  function removeAll() {
    uppy?.clear();
  }

  function upload() {
    uppy?.upload();
  }

  function retryFailed() {
    uppy?.retryAll();
  }

  const actionButtons = useMemo(() => {
    return totalStatus.isUploading ? (
      <>
        <Loader />
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-gray-400">Uploading...</p>
          <div className="text-xs text-gray-400">
            <span>
              {formatBytes(uploadedBytes)} of {formatBytes(totalUploadBytes)}
            </span>
            <span className="mx-2">.</span>
            <span>
              {currentUploadedFilesCount} of {totalUploadFilesCount}{" "}
              {totalUploadFilesCount === 1 ? "file" : "files"}
            </span>
          </div>
        </div>
      </>
    ) : totalStatus.isCompleted ? (
      <button
        onClick={removeAll}
        className="bg-green-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
      >
        Done
      </button>
    ) : (
      <>
        {totalStatus.isErrored ? (
          <button
            onClick={retryFailed}
            className="bg-red-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
          >
            Retry Failed
          </button>
        ) : (
          <button
            onClick={upload}
            className="bg-orange-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
          >
            Upload
          </button>
        )}
        <button
          onClick={removeAll}
          className="bg-white font-bold text-sm text-gray-700 px-6 py-1 rounded-lg cursor-pointer border"
        >
          Cancel
        </button>
      </>
    );
  }, [totalStatus]);

  // Calculate columns based on container width
  const columns = useMemo(() => {
    if (containerWidth === 0) return 1;
    const cols = Math.floor(containerWidth / (COLUMN_WIDTH + COLUMN_GAP));
    return Math.max(1, cols);
  }, [containerWidth]);

  // Calculate masonry layout (memoized for performance)
  const layout = useMemo(() => {
    const columnHeights = new Array(columns).fill(0);
    const positionedItems: {
      file: UppyFile<Meta, Record<string, never>>;
      column: number;
      left: number;
      top: number;
    }[] = [];

    displayFiles.forEach((file) => {
      const shortestCol = columnHeights.indexOf(Math.min(...columnHeights));
      const left = shortestCol * (COLUMN_WIDTH + COLUMN_GAP);
      const top = columnHeights[shortestCol];

      positionedItems.push({
        file,
        column: shortestCol,
        left,
        top,
      });

      columnHeights[shortestCol] +=
        ((file.meta?.thumbnailHeight as number) || DEFAULT_THUMBNAIL_HEIGHT) +
        80 +
        COLUMN_GAP;
    });

    return {
      items: positionedItems,
      containerHeight: Math.max(...columnHeights),
    };
  }, [displayFiles, columns]);

  // Handle container resize
  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 overflow-auto p-2.5">
        <div>
          <div
            ref={containerRef}
            style={{ height: layout.containerHeight }}
            className="relative"
          >
            {layout.items.map((item) => (
              <div
                style={{
                  position: "absolute",
                  left: item.left,
                  top: item.top,
                  transition: "top 0.1s ease",
                  contain: "layout style paint",
                  width: COLUMN_WIDTH,
                  padding: CARD_PADDING,
                }}
                key={item.file.id}
                className="shadow-2xl rounded-xl bg-white"
              >
                <FileCard file={item.file} />
              </div>
            ))}
          </div>
        </div>
        {hasNextPage && <div ref={paginationRef} className="flex"></div>}
      </div>
      <div className="flex items-center justify-between h-14 shadow-2xl bg-white z-10 px-4">
        <div className="flex items-center gap-4">{actionButtons}</div>
      </div>
    </div>
  );
}

export default FileList;
