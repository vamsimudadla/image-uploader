import { useUppy } from "@/app/context/Uppy";
import { ChangeEvent, memo, useEffect, useMemo, useState } from "react";
import Modal from "../common/Modal";

function UploadStartActions() {
  const { uppy } = useUppy();
  const [cloudDetails, setCloudDetails] = useState<{
    cloudName: string;
    uploadPreset: string;
  }>({ cloudName: "", uploadPreset: "" });
  const [showCloudDetailsModal, setShowCloudDetailsModal] = useState(false);

  useEffect(() => {
    const cloudName = localStorage.getItem("cloud-name");
    const uploadPreset = localStorage.getItem("upload-preset");
    if (cloudName && uploadPreset) {
      setCloudDetails({
        cloudName,
        uploadPreset,
      });
    } else {
      setShowCloudDetailsModal(true);
    }
  }, []);

  function removeAll() {
    uppy?.emit("cancel-all");
    uppy?.clear();
  }

  function upload() {
    const name = cloudDetails?.cloudName.trim();
    const preset = cloudDetails.uploadPreset.trim();
    if (name && preset) {
      const uploadPlugin = uppy?.getPlugin("XHRUpload");
      if (uploadPlugin) {
        uploadPlugin.setOptions({
          endpoint: `https://api.cloudinary.com/v1_1/${name}/upload`,
        });
        uppy?.setMeta({
          resource_type: "auto",
          upload_preset: preset,
        });
        uppy?.upload();
      }
    } else {
      setShowCloudDetailsModal(true);
    }
  }

  function onChangeCloudName(e: ChangeEvent<HTMLInputElement>) {
    setCloudDetails((prev) => ({ ...prev, cloudName: e.target.value }));
  }

  function onChangeUploadPreset(e: ChangeEvent<HTMLInputElement>) {
    setCloudDetails((prev) => ({ ...prev, uploadPreset: e.target.value }));
  }

  function onClickLater() {
    setShowCloudDetailsModal(false);
  }

  function onClickAdd() {
    if (cloudDetails.cloudName.trim() && cloudDetails.uploadPreset.trim()) {
      localStorage.setItem("cloud-name", cloudDetails.cloudName.trim());
      localStorage.setItem("upload-preset", cloudDetails.uploadPreset.trim());
      setShowCloudDetailsModal(false);
    }
  }

  const isAddDisabled = useMemo(() => {
    return !(cloudDetails.cloudName.trim() && cloudDetails.uploadPreset.trim());
  }, [cloudDetails.cloudName, cloudDetails.uploadPreset]);

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={upload}
          className="bg-orange-500 text-sm font-bold text-white px-6 py-1 rounded-lg cursor-pointer"
        >
          Upload
        </button>
        <button
          onClick={removeAll}
          className="bg-white font-bold text-sm text-gray-700 px-6 py-1 rounded-lg cursor-pointer border"
        >
          Cancel
        </button>
      </div>
      <div className="flex flex-col gap-0.5 items-end">
        {!isAddDisabled ? (
          <>
            <p className="text-[10px] text-gray-700">
              Cloud Name: {cloudDetails.cloudName}
            </p>
            <p className="text-[10px] text-gray-700">
              Upload Preset: {cloudDetails.uploadPreset}
            </p>
          </>
        ) : null}
        <p className="text-[10px] text-gray-700">
          {isAddDisabled ? "Add" : "Update"} Cloudinary Details:{" "}
          <span
            onClick={() => {
              setShowCloudDetailsModal(true);
            }}
            className="underline decoration-1 cursor-pointer text-blue-500"
          >
            click here
          </span>
        </p>
      </div>
      <Modal open={showCloudDetailsModal}>
        <div className="flex flex-col p-4 gap-4">
          <div>
            <p className="text-md text-gray-700">Add Cloud details to Upload</p>
            <p className="text-xs text-gray-700 mt-0.5">
              For Cloudinary setup instructions:{" "}
              <a
                href="https://github.com/vamsimudadla/image-uploader/blob/main/cloudinary-setup.md"
                target="_blank"
                className="underline decoration-1 cursor-pointer text-blue-500"
              >
                click here
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm text-black">Cloud Name</p>
            <input
              className="text-xs w-full border px-1 py-1.5 border-gray-400 outline-0 rounded-md mt-1"
              placeholder="Enter your cloud name"
              value={cloudDetails?.cloudName}
              onChange={onChangeCloudName}
            />
          </div>
          <div>
            <p className="text-sm text-black">Upload Preset</p>
            <input
              className="text-xs w-full border px-1 py-1.5 border-gray-400 outline-0 rounded-md mt-1"
              placeholder="Enter your upload preset"
              value={cloudDetails.uploadPreset}
              onChange={onChangeUploadPreset}
            />
          </div>
          <div className="flex items-center justify-end gap-4">
            <button
              onClick={onClickLater}
              className="bg-white font-bold text-sm text-gray-700 px-6 py-1 rounded-lg cursor-pointer border"
            >
              Cancel
            </button>
            <button
              onClick={onClickAdd}
              disabled={isAddDisabled}
              className={`bg-orange-500 text-sm font-bold text-white px-6 py-1 rounded-lg ${
                isAddDisabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default memo(UploadStartActions);
