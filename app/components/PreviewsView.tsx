import PreviewsList from "./PreviewsList";
import ProgressIndicators from "./ProgressIndicators";

function PreviewsView() {
  return (
    <div className="flex flex-col flex-1">
      <PreviewsList />
      <ProgressIndicators />
    </div>
  );
}

export default PreviewsView;
