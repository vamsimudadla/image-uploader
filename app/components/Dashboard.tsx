import { useUppy } from "../context/Uppy";
import FileList from "./FileList";
import ImageUploader from "./ImageUploader";

function Dashboard() {
  const { showFiles } = useUppy();
  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      {showFiles ? <FileList /> : <ImageUploader />}
    </div>
  );
}

export default Dashboard;
