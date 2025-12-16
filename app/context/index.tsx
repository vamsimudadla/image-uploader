import { ProviderProps } from "./types";
import { UppyProvider } from "./Uppy";

const AppProviders = ({ children }: ProviderProps) => (
  <UppyProvider>{children}</UppyProvider>
);

export default AppProviders;
