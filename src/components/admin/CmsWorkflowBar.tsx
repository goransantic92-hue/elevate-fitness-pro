import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type CmsWorkflowBarProps = {
  saving: boolean;
  onSaveDraft: () => void;
  onRequestReview: () => void;
  onPublish: () => void;
  onResetPublished?: () => void;
  onResetDefaults?: () => void;
};

export function CmsWorkflowBar({
  saving,
  onSaveDraft,
  onRequestReview,
  onPublish,
  onResetPublished,
  onResetDefaults,
}: CmsWorkflowBarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Button type="button" variant="outline" disabled={saving} onClick={onSaveDraft}>
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        <span className={saving ? "ms-2" : ""}>Save draft</span>
      </Button>
      <Button type="button" variant="secondary" disabled={saving} onClick={onRequestReview}>
        Ready — notify for review
      </Button>
      <Button
        type="button"
        className="bg-amber-500 text-black font-bold hover:bg-amber-400"
        disabled={saving}
        onClick={onPublish}
      >
        Publish now
      </Button>
      {onResetPublished && (
        <Button type="button" variant="ghost" disabled={saving} onClick={onResetPublished}>
          Reset form to published
        </Button>
      )}
      {onResetDefaults && (
        <Button type="button" variant="ghost" disabled={saving} onClick={onResetDefaults}>
          Reset form to defaults
        </Button>
      )}
    </div>
  );
}
