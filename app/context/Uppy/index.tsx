import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Uppy, { Meta, State, UppyFile } from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { v4 as uuidv4 } from "uuid";
import { ProviderProps } from "../types";
import ThumbnailGenerator from "@uppy/thumbnail-generator";

interface UppyContextValue {
  uppy: Uppy<Meta, Record<string, never>> | null;
  state: State<Meta, Record<string, never>> | null;
  files: UppyFile<Meta, Record<string, never>>[];
  showFiles: boolean;
  generateThumbnails: (files: UppyFile<Meta, Record<string, never>>[]) => void;
}

const UppyContext = createContext<UppyContextValue>({
  uppy: null,
  state: null,
  files: [],
  showFiles: false,
  generateThumbnails: () => {},
});

export function UppyProvider({ children }: ProviderProps) {
  const uppy = useProviderUppy();
  return <UppyContext.Provider value={uppy}>{children}</UppyContext.Provider>;
}

export const useUppy = () => {
  return useContext(UppyContext);
};

export const useProviderUppy = () => {
  const uppyRef = useRef<Uppy>(
    new Uppy({
      restrictions: {
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
      },
      autoProceed: false,
      onBeforeFileAdded: (currentFile, files) => {
        if (Object.hasOwn(files, currentFile.id)) {
          currentFile.id = `${currentFile.id}-${uuidv4()}`;
          return true;
        }
        return !Object.hasOwn(files, currentFile.id);
      },
    }).use(XHRUpload, {
      endpoint: "/api/upload",
      method: "POST",
      formData: true,
      fieldName: "files",
    })
  );

  useEffect(() => {
    uppyRef.current.use(ThumbnailGenerator, {
      thumbnailWidth: 300,
      thumbnailType: "image/webp",
      lazy: true,
    });
  }, []);

  const generateThumbnails = useCallback(
    (files: UppyFile<Meta, Record<string, never>>[]) => {
      files.forEach((file) => {
        const thumbnailGenerator =
          uppyRef.current?.getPlugin("ThumbnailGenerator");
        if (!thumbnailGenerator?.queue?.some((fileId) => fileId === file.id)) {
          uppyRef.current?.emit("thumbnail:request", file);
        }
      });
    },
    []
  );

  const subscribe = useMemo(
    () => uppyRef.current.store.subscribe.bind(uppyRef.current.store),
    [uppyRef.current.store]
  );

  const getSnapshot = useCallback(
    () => uppyRef.current.store.getState(),
    [uppyRef.current.store]
  );

  const getServerSnapshot = useCallback(() => null, []);

  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const allFiles = useMemo(() => {
    return state?.files ? Object.values(state.files) : [];
  }, [state]);

  return {
    uppy: uppyRef.current,
    files: allFiles,
    showFiles: state?.files ? Object.values(state.files).length > 0 : false,
    state,
    generateThumbnails,
  };
};
