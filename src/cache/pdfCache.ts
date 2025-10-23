import { logError, logInfo } from "@/logger";
import { MD5 } from "crypto-js";
import { TFile } from "obsidian";

export type PdfParserSource = "llama-parse" | "pdf2md";

export interface PdfCachePage {
  pageNumber: number;
  content: string;
  headings: string[];
  images: string[];
  annotations: string[];
}

export interface PdfCacheEntry {
  version: number;
  source: PdfParserSource;
  markdown: string;
  pages: PdfCachePage[];
  meta: {
    pageCount: number;
    extractedAt: string;
    jobId?: string;
    warnings: string[];
  };
}

interface LegacyPdf4llmCacheEntry {
  response: unknown;
  elapsed_time_ms?: number;
}

export const PDF_CACHE_VERSION = 2;

export class PDFCache {
  private static instance: PDFCache;
  private cacheDir: string = ".copilot/pdf-cache";

  private constructor() {}

  static getInstance(): PDFCache {
    if (!PDFCache.instance) {
      PDFCache.instance = new PDFCache();
    }
    return PDFCache.instance;
  }

  private async ensureCacheDir() {
    if (!(await app.vault.adapter.exists(this.cacheDir))) {
      logInfo("Creating PDF cache directory:", this.cacheDir);
      await app.vault.adapter.mkdir(this.cacheDir);
    }
  }

  private getCacheKey(file: TFile): string {
    // Use file path, size and mtime for a unique but efficient cache key
    const metadata = `${file.path}:${file.stat.size}:${file.stat.mtime}`;
    const key = MD5(metadata).toString();
    logInfo("Generated cache key for PDF:", { path: file.path, key });
    return key;
  }

  private getCachePath(cacheKey: string): string {
    return `${this.cacheDir}/${cacheKey}.json`;
  }

  /**
   * Expose the internally generated cache key for a PDF file. This allows other
   * subsystems (e.g. vector stores) to reference the same stable identifier
   * without duplicating hashing logic.
   *
   * @param file - The PDF file for which to derive the cache key.
   * @returns Stable cache key derived from path, size, and modification time.
   */
  getCacheKeyForFile(file: TFile): string {
    return this.getCacheKey(file);
  }

  /**
   * Retrieve a cached PDF parsing result if it exists and matches the current schema.
   *
   * @param file - The Obsidian file to look up in the cache.
   * @returns The cached PDF entry or null when missing/legacy/invalid.
   */
  async get(file: TFile): Promise<PdfCacheEntry | null> {
    try {
      const cacheKey = this.getCacheKey(file);
      const cachePath = this.getCachePath(cacheKey);

      if (await app.vault.adapter.exists(cachePath)) {
        logInfo("Cache hit for PDF:", file.path);
        const cacheContent = await app.vault.adapter.read(cachePath);
        const parsed = JSON.parse(cacheContent) as PdfCacheEntry | LegacyPdf4llmCacheEntry;

        if (this.isLegacyEntry(parsed)) {
          logInfo("Removing legacy PDF cache entry for:", file.path);
          await app.vault.adapter.remove(cachePath);
          return null;
        }

        if (parsed.version !== PDF_CACHE_VERSION) {
          logInfo("Cache schema mismatch detected for PDF, ignoring entry:", file.path);
          await app.vault.adapter.remove(cachePath);
          return null;
        }

        return parsed;
      }
      logInfo("Cache miss for PDF:", file.path);
      return null;
    } catch (error) {
      logError("Error reading from PDF cache:", error);
      return null;
    }
  }

  /**
   * Persist a formatted PDF parsing result to the cache.
   *
   * @param file - The Obsidian file associated with the entry.
   * @param entry - The cache entry to store.
   */
  async set(file: TFile, entry: PdfCacheEntry): Promise<void> {
    try {
      await this.ensureCacheDir();
      const cacheKey = this.getCacheKey(file);
      const cachePath = this.getCachePath(cacheKey);
      logInfo("Caching PDF response for:", file.path);
      const payload: PdfCacheEntry = {
        ...entry,
        version: PDF_CACHE_VERSION,
      };
      await app.vault.adapter.write(cachePath, JSON.stringify(payload));
    } catch (error) {
      logError("Error writing to PDF cache:", error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (await app.vault.adapter.exists(this.cacheDir)) {
        const files = await app.vault.adapter.list(this.cacheDir);
        logInfo("Clearing PDF cache, removing files:", files.files.length);
        for (const file of files.files) {
          await app.vault.adapter.remove(file);
        }
      }
    } catch (error) {
      logError("Error clearing PDF cache:", error);
    }
  }

  /**
   * Determine whether the parsed JSON payload is a legacy Brevilabs cache entry.
   *
   * @param entry - Parsed JSON payload.
   * @returns True when the entry matches the deprecated schema.
   */
  private isLegacyEntry(
    entry: PdfCacheEntry | LegacyPdf4llmCacheEntry
  ): entry is LegacyPdf4llmCacheEntry {
    return (
      (entry as LegacyPdf4llmCacheEntry).response !== undefined &&
      (entry as PdfCacheEntry).version === undefined
    );
  }
}
