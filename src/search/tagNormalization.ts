import { logWarn } from "@/logger";

/**
 * Canonical representation of an Obsidian tag path suitable for indexing and graph operations.
 */
export interface NormalizedTagPath {
  /** Hash-prefixed canonical tag path (e.g., `#economics/industrial-organization`). */
  canonical: string;
  /**
   * Ordered leaf-to-root segments without hash or separators. Segments are provided to establish
   * parent/child relationships but should not be treated as standalone tags.
   */
  segments: string[];
  /**
   * Hierarchical expansions from root to leaf, inclusive (e.g.,
   * [`#economics`, `#economics/industrial-organization`, `#economics/industrial-organization/cournot`]).
   */
  hierarchicalPaths: string[];
}

/**
 * Normalize a raw tag string into its canonical representation and derived hierarchy metadata.
 *
 * @param rawTagPath - Any string provided by the user or harvested from metadata.
 * @returns A normalized tag path descriptor, or `null` when the input does not contain segments.
 */
export function normalizeTagPath(rawTagPath: string): NormalizedTagPath | null {
  if (typeof rawTagPath !== "string") {
    return null;
  }

  const trimmed = rawTagPath.trim();
  if (trimmed.length === 0) {
    return null;
  }

  const withoutHash = trimmed.replace(/^#+/, "");
  const segments = withoutHash
    .split("/")
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    logWarn("normalizeTagPath received a tag without segments", { rawTagPath });
    return null;
  }

  const canonical = `#${segments.join("/")}`;
  const hierarchicalPaths = segments.map(
    (_, index) => `#${segments.slice(0, index + 1).join("/")}`
  );

  return {
    canonical,
    segments,
    hierarchicalPaths,
  };
}

/**
 * Normalize a collection of tag paths, filtering out invalid entries while deduplicating canonicals.
 *
 * @param rawTagPaths - Iterable of user-provided or metadata-derived tag strings.
 * @returns Array of normalized tag descriptors sorted by canonical path.
 */
export function normalizeTagPaths(rawTagPaths: Iterable<string>): NormalizedTagPath[] {
  const seenCanonicals = new Map<string, NormalizedTagPath>();

  for (const rawTagPath of rawTagPaths) {
    const normalized = normalizeTagPath(rawTagPath);
    if (normalized) {
      seenCanonicals.set(normalized.canonical, normalized);
    }
  }

  return Array.from(seenCanonicals.values()).sort((a, b) => a.canonical.localeCompare(b.canonical));
}

/**
 * Create canonical tag prefixes for each hierarchical level of a tag.
 * Useful for matching user-managed prefixes against incoming note metadata.
 *
 * @param canonicalTag - Canonical hash-prefixed tag path.
 * @returns Array of canonical prefixes from root to the full path.
 */
export function expandCanonicalPrefixes(canonicalTag: string): string[] {
  const normalized = normalizeTagPath(canonicalTag);
  if (!normalized) {
    return [];
  }

  return normalized.hierarchicalPaths;
}
