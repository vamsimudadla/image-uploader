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
import useIntersectionObserver from "../hooks/IntersectionObserver";

function PreviewsList() {
  const { files } = useUppy();

  const [displayLimit, setDisplayLimit] = useState(() =>
    Math.min(DEFAULT_DISPLAY_LIMIT, files.length)
  );
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const paginationRef = useRef<HTMLDivElement | null>(null);

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

  const columns = useMemo(() => {
    if (containerWidth === 0) return 1;
    const cols = Math.floor(containerWidth / (COLUMN_WIDTH + COLUMN_GAP));
    return Math.max(1, cols);
  }, [containerWidth]);

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
    <div
      className="flex flex-col flex-1 overflow-y-auto p-2.5"
      ref={containerRef}
    >
      <div
        style={{
          marginLeft: Math.floor(
            (containerWidth - (COLUMN_WIDTH + COLUMN_GAP) * columns) / 2
          ),
        }}
      >
        <div style={{ height: layout.containerHeight }} className="relative">
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
  );
}

export default PreviewsList;
