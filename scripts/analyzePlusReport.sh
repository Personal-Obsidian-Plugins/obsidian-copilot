#!/usr/bin/env bash

set -euo pipefail

REPORT_PATH="${1:-analysis/plus-reference-report.json}"

if [[ ! -f "$REPORT_PATH" ]]; then
  echo "Report not found at: $REPORT_PATH" >&2
  exit 1
fi

echo "== Plus Reference Report Snapshot =="
jq -r '
  "Generated: \(.metadata.generatedAt)",
  "Pattern: \(.metadata.pattern) (" + (.metadata.patternFlags // "gi") + ")",
  "",
  "Stats:",
  "  Symbols: \(.stats.symbolCount)",
  "  References: \(.stats.referenceCount)",
  "  Pattern Matches: \(.stats.patternMatchCount)",
  "  Impacted Files: \(.stats.impactedFileCount)"
' "$REPORT_PATH"

echo
echo "== Top Categories (by reference count) =="
jq -r '
  .categorySummary
  | sort_by(-.referenceCount, -.symbolCount)
  | .[0:10]
  | map("  - " + .category + ": refs=" + (.referenceCount|tostring) + ", symbols=" + (.symbolCount|tostring))
  | if length == 0 then ["  (none)"] else . end
  | .[]
' "$REPORT_PATH"

echo
echo "== Top Files (by combined impact) =="
jq -r '
  .fileSummary
  | sort_by((.symbolReferenceCount + .patternMatchCount)) | reverse
  | .[0:10]
  | map(
      "  - " + .file
      + ": refs=" + (.symbolReferenceCount|tostring)
      + ", patternMatches=" + (.patternMatchCount|tostring)
      + (if (.categories|length) > 0 then ", categories=" + (.categories|join(", ")) else "" end)
    )
  | if length == 0 then ["  (none)"] else . end
  | .[]
' "$REPORT_PATH"

echo
echo "== Top Symbols (by reference count) =="
jq -r '
  .symbols
  | map({
      name: .declaration.name,
      category: (.target.category // "uncategorized"),
      file: .declaration.location.file,
      refs: (.references | length)
    })
  | sort_by(-.refs, .name)
  | .[0:10]
  | map("  - " + .name + " [" + .category + "] refs=" + (.refs|tostring) + " (" + .file + ")")
  | if length == 0 then ["  (none)"] else . end
  | .[]
' "$REPORT_PATH"

echo
echo "== Missing Targets =="
jq -r '
  if (.missingTargets | length) == 0 then
    "  (none)"
  else
    .missingTargets
    | map("  - " + .text + " — " + (.location.file // "unknown"))
    | .[]
  end
' "$REPORT_PATH"
