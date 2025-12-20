import { useUppy } from "../context/Uppy";
import ImageUploader from "./ImageUploader";
import PreviewsView from "./PreviewsView";

function Dashboard() {
  const { showFiles } = useUppy();
  return (
    <div className="flex h-screen bg-zinc-50 font-sans">
      {showFiles ? <PreviewsView /> : <ImageUploader />}
    </div>
  );
}

export default Dashboard;
