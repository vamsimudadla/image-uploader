import useInfiniteScroll from "react-infinite-scroll-hook";
import { useUppy } from "../context/Uppy";
import FileCard from "./FileCard";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DEFAULT_DISPLAY_LIMIT } from "../utils/constants";

function FileList() {
  const { files, generateThumbnails, uppy } = useUppy();
  const [displayLimit, setDisplayLimit] = useState(() =>
    Math.min(DEFAULT_DISPLAY_LIMIT, files.length)
  );

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
        <div className="flex items-center gap-4">
          <button className="bg-orange-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer">
            Upload
          </button>
          <button
            onClick={removeAll}
            className="bg-white font-bold text-sm text-gray-700 px-6 py-1 rounded-lg cursor-pointer border"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default FileList;
