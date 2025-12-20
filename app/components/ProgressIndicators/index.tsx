import { useMemo } from "react";
import { useUppy } from "../../context/Uppy";
import UploadProgressActions from "./UploadProgressActions";
import UploadFailedActions from "./UploadFailedActions";
import UploadStartActions from "./UploadStartActions";
import UploadCompletedActions from "./UploadCompletedActions";

function ProgressIndicators() {
  const { state } = useUppy();

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
  }, [state?.currentUploads, state?.totalProgress, state?.error]);

  const actionButtons = useMemo(() => {
    return totalStatus.isUploading ? (
      <UploadProgressActions />
    ) : totalStatus.isCompleted ? (
      <UploadCompletedActions />
    ) : totalStatus.isErrored ? (
      <UploadFailedActions />
    ) : (
      <UploadStartActions />
    );
  }, [totalStatus]);

  return (
    <div className="flex items-center justify-center h-14 shadow-2xl bg-white z-10 px-4 md:justify-between">
      {actionButtons}
    </div>
  );
}

export default ProgressIndicators;
