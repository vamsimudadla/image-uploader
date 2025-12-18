import useInfiniteScroll from "react-infinite-scroll-hook";
import { useUppy } from "../context/Uppy";
import FileCard from "./FileCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_DISPLAY_LIMIT } from "../utils/constants";
import Loader from "./common/Loader";

function FileList() {
  const { files, generateThumbnails, uppy, state } = useUppy();
  console.log(state);
  const [displayLimit, setDisplayLimit] = useState(() =>
    Math.min(DEFAULT_DISPLAY_LIMIT, files.length)
  );

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

  const uploadedProgress = useMemo(() => {
    return state?.totalProgress || 0;
  }, [state?.totalProgress]);

  const displayFiles = useMemo(() => {
    return files.slice(0, displayLimit);
  }, [files, displayLimit]);

  const loadMoreFiles = useCallback(
    (limit: number = DEFAULT_DISPLAY_LIMIT) => {
      setDisplayLimit(Math.min(displayLimit + limit, files.length));
    },
    [displayLimit, files]
  );

  useEffect(() => {
    const nonPreviewFiles = displayFiles.filter((file) => !file.preview);
    generateThumbnails(nonPreviewFiles);
  }, [displayFiles]);

  const hasNextPage = useMemo(() => {
    return displayFiles.length < files.length;
  }, [displayFiles, files]);

  const [infiniteRef, { rootRef }] = useInfiniteScroll({
    loading: false,
    hasNextPage: hasNextPage,
    onLoadMore: loadMoreFiles,
    rootMargin: "0px 0px 400px 0px",
  });

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
          <p className="text-xs text-gray-400">{uploadedProgress}% of 100%</p>
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

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col flex-1 overflow-auto p-2.5" ref={rootRef}>
        <div className="flex flex-wrap gap-2.5 items-start">
          {displayFiles.map((file) => (
            <FileCard key={file.id} file={file} />
          ))}
        </div>
        {hasNextPage && <div ref={infiniteRef}></div>}
      </div>
      <div className="flex items-center justify-between h-14 shadow-2xl bg-white z-10 px-4">
        <div className="flex items-center gap-4">{actionButtons}</div>
      </div>
    </div>
  );
}

export default FileList;
