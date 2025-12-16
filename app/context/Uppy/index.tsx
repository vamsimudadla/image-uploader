import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";
import Uppy, { Meta, State } from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import { v4 as uuidv4 } from "uuid";
import { ProviderProps } from "../types";

interface UppyContextValue {
  uppy: Uppy<Meta, Record<string, never>> | null;
  state: State<Meta, Record<string, never>> | null;
}

const UppyContext = createContext<UppyContextValue>({
  uppy: null,
  state: null,
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

  return { uppy: uppyRef.current, state };
};
