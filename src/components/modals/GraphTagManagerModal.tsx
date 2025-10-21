import React, { useCallback, useMemo, useState } from "react";
import { App, Modal } from "obsidian";
import { createRoot, Root } from "react-dom/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X, Hash } from "lucide-react";
import { normalizeTagPath } from "@/search/tagNormalization";

interface GraphTagManagerModalProps {
  initialTags: string[];
  initialIndexAllTags: boolean;
  onCancel: () => void;
  onConfirm: (payload: { tags: string[]; indexAllTags: boolean }) => void;
}

function GraphTagManagerModalContent({
  initialTags,
  initialIndexAllTags,
  onCancel,
  onConfirm,
}: GraphTagManagerModalProps) {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(() => [...initialTags].sort());
  const [indexAllTags, setIndexAllTags] = useState<boolean>(initialIndexAllTags);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const sortedTags = useMemo(() => [...tags].sort((a, b) => a.localeCompare(b)), [tags]);

  const handleAddTag = useCallback(() => {
    if (indexAllTags) {
      return;
    }

    const canonicalCandidate = tagInput.startsWith("#") ? tagInput : `#${tagInput}`;
    const normalized = normalizeTagPath(canonicalCandidate);
    if (!normalized) {
      setErrorMessage("Enter a valid tag path, for example #topic or #topic/subtopic.");
      return;
    }

    if (tags.includes(normalized.canonical)) {
      setErrorMessage("Tag is already included.");
      return;
    }

    setTags((prev) => [...prev, normalized.canonical]);
    setTagInput("");
    setErrorMessage(null);
  }, [indexAllTags, tagInput, tags]);

  const handleRemoveTag = useCallback((tag: string) => {
    setTags((prev) => prev.filter((candidate) => candidate !== tag));
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleAddTag();
    },
    [handleAddTag]
  );

  return (
    <div className="tw-flex tw-flex-col tw-gap-4">
      <div className="tw-space-y-1">
        <h2 className="tw-text-lg tw-font-semibold">Graph Tag Manager</h2>
        <p className="tw-text-sm tw-text-muted">
          Choose which tags should populate the Neo4j graph. Multilevel tags remain single entries;
          prefixes are expanded automatically during indexing.
        </p>
      </div>

      <label className="tw-flex tw-items-center tw-gap-2">
        <input
          type="checkbox"
          className="tw-size-4"
          checked={indexAllTags}
          onChange={(event) => {
            setIndexAllTags(event.target.checked);
            if (event.target.checked) {
              setErrorMessage(null);
            }
          }}
        />
        <span className="tw-text-sm">Index all tags (disable manual curation)</span>
      </label>

      <form onSubmit={handleSubmit} className="tw-flex tw-flex-col tw-gap-2">
        <label className="tw-flex tw-flex-col tw-gap-1">
          <span className="tw-text-sm tw-font-medium">Add tag prefix</span>
          <div className="tw-flex tw-gap-2">
            <div className="tw-flex tw-items-center tw-gap-1 tw-rounded-md tw-border tw-border-border tw-bg-secondary tw-px-2">
              <Hash className="tw-size-4 tw-text-muted" />
              <Input
                className="!tw-border-none !tw-bg-transparent !tw-px-0"
                placeholder="economics/industrial-organization"
                value={tagInput}
                onChange={(event) => {
                  setTagInput(event.target.value.trimStart());
                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                disabled={indexAllTags}
              />
            </div>
            <Button type="submit" disabled={indexAllTags}>
              Add
            </Button>
          </div>
        </label>
        {errorMessage && <span className="tw-text-sm tw-text-error">{errorMessage}</span>}
      </form>

      <div className="tw-space-y-2">
        <div className="tw-text-sm tw-font-medium">Included tags</div>
        <div className="tw-flex tw-flex-wrap tw-gap-2 tw-rounded-md tw-border tw-border-dashed tw-border-border tw-p-3">
          {indexAllTags ? (
            <span className="tw-text-sm tw-text-muted">All tags will be indexed.</span>
          ) : sortedTags.length === 0 ? (
            <span className="tw-text-sm tw-text-muted">No tags selected yet.</span>
          ) : (
            sortedTags.map((tag) => (
              <Badge key={tag} className="tw-flex tw-items-center tw-gap-1">
                {tag}
                <button
                  type="button"
                  className="tw-ml-1 tw-rounded-full tw-p-0.5 hover:tw-bg-modifier-hover"
                  onClick={() => handleRemoveTag(tag)}
                  aria-label={`Remove ${tag}`}
                >
                  <X className="tw-size-3.5" />
                </button>
              </Badge>
            ))
          )}
        </div>
      </div>

      <div className="tw-flex tw-justify-end tw-gap-2">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() => onConfirm({ tags: sortedTags, indexAllTags })}
          disabled={!indexAllTags && sortedTags.length === 0}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

interface GraphTagManagerModalOptions {
  initialTags: string[];
  indexAllTags: boolean;
  onSave: (payload: { tags: string[]; indexAllTags: boolean }) => void;
}

/**
 * Modal for managing graph tag prefixes used during Neo4j indexing.
 */
export class GraphTagManagerModal extends Modal {
  private root: Root | null = null;

  constructor(
    app: App,
    private readonly options: GraphTagManagerModalOptions
  ) {
    super(app);
    this.modalEl.addClass("copilot-modal");
  }

  onOpen(): void {
    const { initialTags, indexAllTags, onSave } = this.options;
    const container = this.contentEl.createDiv();
    this.root = createRoot(container);
    this.root.render(
      <GraphTagManagerModalContent
        initialTags={initialTags}
        initialIndexAllTags={indexAllTags}
        onCancel={() => this.close()}
        onConfirm={(payload) => {
          onSave(payload);
          this.close();
        }}
      />
    );
  }

  onClose(): void {
    if (this.root) {
      this.root.unmount();
      this.root = null;
    }
    this.contentEl.empty();
  }
}
