# References: src/processors/pdfProcessor.ts

Generated: 2025-10-22T20:25:57.959Z

## Summary

- **Inbound References**: 6
- **Unique Files Using This**: 1
- **Inbound Symbols**: 3

- **Outbound References**: 75
- **Outbound Symbols**: 35
- **Note**: Standard library symbols excluded from outbound references

## Inbound References (Who Uses This)

### PDFProcessor

**4 references from 1 files**

- src/tools/FileParserManager.ts:5 — `import { PDFProcessor } from "@/processors/pdfProcessor";` (import)
- src/tools/FileParserManager.ts:25 — `private pdfProcessor: PDFProcessor;` (type-reference)
- src/tools/FileParserManager.ts:27 — `constructor(pdfProcessor: PDFProcessor) {` (type-reference)
- src/tools/FileParserManager.ts:342 — `const pdfProcessor = new PDFProcessor(brevilabsClient);` (constructor)

### convertToMarkdown

**1 references from 1 files**

- src/tools/FileParserManager.ts:37 — `return await this.pdfProcessor.convertToMarkdown(file, vault);` (other)

### clearCache

**1 references from 1 files**

- src/tools/FileParserManager.ts:49 — `await this.pdfProcessor.clearCache();` (other)

## Outbound References (What This Uses)

### BrevilabsClient

**2 references**

- src/processors/pdfProcessor.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";` (import)
- src/processors/pdfProcessor.ts:20 — `private readonly brevilabsClient: BrevilabsClient,` (type-reference)

### LegacyPDFCacheEntry

**2 references**

- src/processors/pdfProcessor.ts:3 — `LegacyPDFCacheEntry,` (import)
- src/processors/pdfProcessor.ts:176 — `private isLegacyCacheEntry(payload: PDFCachePayload): payload is LegacyPDFCacheEntry {` (type-reference)

### PDFCache

**4 references**

- src/processors/pdfProcessor.ts:4 — `PDFCache,` (import)
- src/processors/pdfProcessor.ts:17 — `private readonly pdfCache: PDFCache;` (type-reference)
- src/processors/pdfProcessor.ts:21 — `pdfCache: PDFCache \| null = null` (type-reference)
- src/processors/pdfProcessor.ts:23 — `this.pdfCache = pdfCache ?? PDFCache.getInstance();` (property-access)

### PDFCacheEntry

**3 references**

- src/processors/pdfProcessor.ts:5 — `PDFCacheEntry,` (import)
- src/processors/pdfProcessor.ts:98 — `): PDFCacheEntry {` (type-reference)
- src/processors/pdfProcessor.ts:169 — `private isCacheEntry(payload: PDFCachePayload): payload is PDFCacheEntry {` (type-reference)

### PDFCachePayload

**4 references**

- src/processors/pdfProcessor.ts:6 — `PDFCachePayload,` (import)
- src/processors/pdfProcessor.ts:69 — `payload: PDFCachePayload` (type-reference)
- src/processors/pdfProcessor.ts:169 — `private isCacheEntry(payload: PDFCachePayload): payload is PDFCacheEntry {` (type-reference)
- src/processors/pdfProcessor.ts:176 — `private isLegacyCacheEntry(payload: PDFCachePayload): payload is LegacyPDFCacheEntry {` (type-reference)

### logError

**3 references**

- src/processors/pdfProcessor.ts:8 — `import { logError, logInfo } from "@/logger";` (import)
- src/processors/pdfProcessor.ts:82 — `logError("[PDFProcessor] Failed to upgrade legacy cache entry:", error);` (function-call)
- src/processors/pdfProcessor.ts:87 — `logError("[PDFProcessor] Encountered unknown cache payload shape for:", file.path);` (function-call)

### logInfo

**6 references**

- src/processors/pdfProcessor.ts:8 — `import { logError, logInfo } from "@/logger";` (import)
- src/processors/pdfProcessor.ts:30 — `logInfo("[PDFProcessor] Processing PDF file:", file.path);` (function-call)
- src/processors/pdfProcessor.ts:36 — `logInfo("[PDFProcessor] Cache hit for PDF:", file.path);` (function-call)
- src/processors/pdfProcessor.ts:39 — `logInfo("[PDFProcessor] Cache payload invalid, regenerating for:", file.path);` (function-call)
- src/processors/pdfProcessor.ts:41 — `logInfo("[PDFProcessor] Cache miss for PDF:", file.path);` (function-call)
- src/processors/pdfProcessor.ts:51 — `logInfo("[PDFProcessor] Cached converted PDF:", file.path);` (function-call)

### TFile

**3 references**

- src/processors/pdfProcessor.ts:9 — `import { TFile, Vault } from "obsidian";` (import)
- src/processors/pdfProcessor.ts:29 — `async convertToMarkdown(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/processors/pdfProcessor.ts:68 — `file: TFile,` (type-reference)

### Vault

**2 references**

- src/processors/pdfProcessor.ts:9 — `import { TFile, Vault } from "obsidian";` (import)
- src/processors/pdfProcessor.ts:29 — `async convertToMarkdown(file: TFile, vault: Vault): Promise<string> {` (type-reference)

### getInstance

**1 references**

- src/processors/pdfProcessor.ts:23 — `this.pdfCache = pdfCache ?? PDFCache.getInstance();` (other)

### path

**6 references**

- src/processors/pdfProcessor.ts:30 — `logInfo("[PDFProcessor] Processing PDF file:", file.path);` (other)
- src/processors/pdfProcessor.ts:36 — `logInfo("[PDFProcessor] Cache hit for PDF:", file.path);` (other)
- src/processors/pdfProcessor.ts:39 — `logInfo("[PDFProcessor] Cache payload invalid, regenerating for:", file.path);` (other)
- src/processors/pdfProcessor.ts:41 — `logInfo("[PDFProcessor] Cache miss for PDF:", file.path);` (other)
- src/processors/pdfProcessor.ts:51 — `logInfo("[PDFProcessor] Cached converted PDF:", file.path);` (other)
- src/processors/pdfProcessor.ts:87 — `logError("[PDFProcessor] Encountered unknown cache payload shape for:", file.path);` (other)

### get

**1 references**

- src/processors/pdfProcessor.ts:32 — `const cachedPayload = await this.pdfCache.get(file);` (other)

### readBinary

**1 references**

- src/processors/pdfProcessor.ts:44 — `const binaryContent = await vault.readBinary(file);` (other)

### pdf4llm

**1 references**

- src/processors/pdfProcessor.ts:45 — `const pdfResponse = await this.brevilabsClient.pdf4llm(binaryContent);` (other)

### response

**4 references**

- src/processors/pdfProcessor.ts:47 — `const markdown = this.extractMarkdown(pdfResponse?.response);` (other)
- src/processors/pdfProcessor.ts:48 — `const cacheEntry = this.buildCacheEntry(markdown, pdfResponse?.response, pdfResponse?.elapsed\_time\_ms);` (other)
- src/processors/pdfProcessor.ts:77 — `const markdown = this.extractMarkdown(payload.response);` (other)
- src/processors/pdfProcessor.ts:78 — `const upgradedEntry = this.buildCacheEntry(markdown, payload.response, payload.elapsed\_time\_ms);` (other)

### elapsed_time_ms

**2 references**

- src/processors/pdfProcessor.ts:48 — `const cacheEntry = this.buildCacheEntry(markdown, pdfResponse?.response, pdfResponse?.elapsed\_time\_ms);` (other)
- src/processors/pdfProcessor.ts:78 — `const upgradedEntry = this.buildCacheEntry(markdown, payload.response, payload.elapsed\_time\_ms);` (other)

### set

**2 references**

- src/processors/pdfProcessor.ts:50 — `await this.pdfCache.set(file, cacheEntry);` (other)
- src/processors/pdfProcessor.ts:79 — `await this.pdfCache.set(file, upgradedEntry);` (other)

### clear

**1 references**

- src/processors/pdfProcessor.ts:60 — `await this.pdfCache.clear();` (other)

### markdown

**2 references**

- src/processors/pdfProcessor.ts:72 — `return payload.markdown;` (other)
- src/processors/pdfProcessor.ts:101 — `markdown,` (other)

### version

**1 references**

- src/processors/pdfProcessor.ts:100 — `version: CACHE\_VERSION,` (other)

### rawResponse

**1 references**

- src/processors/pdfProcessor.ts:102 — `rawResponse,` (other)

### metadata

**1 references**

- src/processors/pdfProcessor.ts:103 — `metadata: elapsedTimeMs !== undefined ? { elapsedTimeMs } : undefined,` (other)

### elapsedTimeMs

**1 references**

- src/processors/pdfProcessor.ts:103 — `metadata: elapsedTimeMs !== undefined ? { elapsedTimeMs } : undefined,` (other)

### cachedAt

**1 references**

- src/processors/pdfProcessor.ts:104 — `cachedAt: new Date().toISOString(),` (other)

### toISOString

**1 references**

- src/processors/pdfProcessor.ts:104 — `cachedAt: new Date().toISOString(),` (other)

### isArray

**1 references**

- src/processors/pdfProcessor.ts:127 — `if (Array.isArray(source)) {` (other)

### map

**2 references**

- src/processors/pdfProcessor.ts:129 — `.map((item) => this.extractMarkdownInternal(item, seen))` (other)
- src/processors/pdfProcessor.ts:157 — `.map((value) => this.extractMarkdownInternal(value, seen))` (other)

### filter

**2 references**

- src/processors/pdfProcessor.ts:130 — `.filter((part) => part.trim().length > 0)` (other)
- src/processors/pdfProcessor.ts:158 — `.filter((value) => value.trim().length > 0);` (other)

### trim

**4 references**

- src/processors/pdfProcessor.ts:130 — `.filter((part) => part.trim().length > 0)` (other)
- src/processors/pdfProcessor.ts:144 — `if (typeof value === "string" && value.trim().length > 0) {` (other)
- src/processors/pdfProcessor.ts:150 — `if (nested.trim().length > 0) {` (other)
- src/processors/pdfProcessor.ts:158 — `.filter((value) => value.trim().length > 0);` (other)

### length

**4 references**

- src/processors/pdfProcessor.ts:130 — `.filter((part) => part.trim().length > 0)` (other)
- src/processors/pdfProcessor.ts:144 — `if (typeof value === "string" && value.trim().length > 0) {` (other)
- src/processors/pdfProcessor.ts:150 — `if (nested.trim().length > 0) {` (other)
- src/processors/pdfProcessor.ts:158 — `.filter((value) => value.trim().length > 0);` (other)

### join

**2 references**

- src/processors/pdfProcessor.ts:131 — `.join("\\n\\n");` (other)
- src/processors/pdfProcessor.ts:160 — `return aggregated.join("\\n\\n");` (other)

### Record

**1 references**

- src/processors/pdfProcessor.ts:135 — `const recordSource = source as Record<string, unknown>;` (type-reference)

### has

**1 references**

- src/processors/pdfProcessor.ts:136 — `if (seen.has(recordSource)) {` (other)

### add

**1 references**

- src/processors/pdfProcessor.ts:139 — `seen.add(recordSource);` (other)

### values

**1 references**

- src/processors/pdfProcessor.ts:156 — `const aggregated = Object.values(recordSource)` (other)
