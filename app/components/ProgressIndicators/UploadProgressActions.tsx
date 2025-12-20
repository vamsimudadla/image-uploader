import { formatBytes } from "@/app/utils/common";
import Loader from "../common/Loader";
import { useUppy } from "@/app/context/Uppy";
import { memo, useMemo } from "react";

function UploadProgressActions() {
  const { state } = useUppy();

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

  return (
    <div className="flex items-center gap-4">
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
    </div>
  );
}

export default memo(UploadProgressActions);
