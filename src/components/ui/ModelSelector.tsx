import React, { useState } from "react";
import { Notice } from "obsidian";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ModelDisplay } from "@/components/ui/model-display";
import { useSettingsValue, getModelKeyFromModel } from "@/settings/model";
import { checkModelApiKey, err2String } from "@/utils";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelSelectorProps {
  disabled?: boolean;
  size?: "sm" | "fit" | "default" | "lg" | "icon";
  variant?: "default" | "destructive" | "secondary" | "ghost" | "ghost2" | "link" | "success";
  className?: string;
  // Always controlled
  value: string;
  onChange: (modelKey: string) => void;
}

export function ModelSelector({
  disabled = false,
  size = "fit",
  variant = "ghost2",
  className,
  value,
  onChange,
}: ModelSelectorProps) {
  const [modelError, setModelError] = useState<string | null>(null);
  const settings = useSettingsValue();

  const currentModel = settings.activeModels.find(
    (model) => model.enabled && getModelKeyFromModel(model) === value
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          disabled={disabled}
          className={cn(
            "tw-min-w-0 tw-justify-start tw-gap-2 tw-rounded-lg tw-border-none tw-px-3 tw-py-2 hover:tw-bg-interactive-hover",
            className
          )}
        >
          <div className="tw-flex tw-min-w-0 tw-flex-1 tw-items-center tw-gap-2 tw-truncate">
            {modelError ? (
              <span className="tw-truncate tw-text-sm tw-text-error">Model Load Failed</span>
            ) : currentModel ? (
              <ModelDisplay model={currentModel} iconSize={10} />
            ) : (
              <span className="tw-truncate tw-text-sm">Select Model</span>
            )}
          </div>
          {!disabled && <ChevronDown className="tw-size-4 tw-shrink-0 tw-text-muted" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="tw-min-w-[200px]">
        {settings.activeModels
          .filter((model) => model.enabled)
          .map((model) => {
            const { hasApiKey, errorNotice } = checkModelApiKey(model, settings);
            const isSelected = getModelKeyFromModel(model) === value;
            return (
              <DropdownMenuItem
                key={getModelKeyFromModel(model)}
                onSelect={async (event) => {
                  if (!hasApiKey && errorNotice) {
                    event.preventDefault();
                    new Notice(errorNotice);
                    return;
                  }

                  try {
                    setModelError(null);
                    onChange(getModelKeyFromModel(model));
                  } catch (error) {
                    const msg = `Model switch failed: ` + err2String(error);
                    setModelError(msg);
                    new Notice(msg);
                    // Restore to the last valid model
                    const lastValidModel = settings.activeModels.find(
                      (m) => m.enabled && getModelKeyFromModel(m) === value
                    );
                    if (lastValidModel) {
                      onChange(getModelKeyFromModel(lastValidModel));
                    }
                  }
                }}
                className={cn(
                  "tw-cursor-pointer tw-gap-2 tw-py-2.5",
                  !hasApiKey && "tw-cursor-not-allowed tw-opacity-50",
                  isSelected && "tw-bg-modifier-hover"
                )}
              >
                <ModelDisplay model={model} iconSize={12} />
                {isSelected && <Check className="tw-ml-auto tw-size-4 tw-text-accent" />}
              </DropdownMenuItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
