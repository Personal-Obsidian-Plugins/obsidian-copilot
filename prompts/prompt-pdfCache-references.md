# References: src/cache/pdfCache.ts

Generated: 2025-10-22T20:10:23.783Z

## Summary

- **Inbound References**: 7
- **Unique Files Using This**: 1
- **Inbound Symbols**: 5

- **Outbound References**: 67
- **Outbound Symbols**: 23
- **Note**: Standard library symbols excluded from outbound references

## Inbound References (Who Uses This)

### PDFCache

**3 references from 1 files**

- src/tools/FileParserManager.ts:3 — `import { PDFCache } from "@/cache/pdfCache";` (import)
- src/tools/FileParserManager.ts:26 — `private pdfCache: PDFCache;` (type-reference)
- src/tools/FileParserManager.ts:30 — `this.pdfCache = PDFCache.getInstance();` (property-access)

### getInstance

**1 references from 1 files**

- src/tools/FileParserManager.ts:30 — `this.pdfCache = PDFCache.getInstance();` (other)

### get

**1 references from 1 files**

- src/tools/FileParserManager.ts:38 — `const cachedResponse = await this.pdfCache.get(file);` (other)

### set

**1 references from 1 files**

- src/tools/FileParserManager.ts:48 — `await this.pdfCache.set(file, pdf4llmResponse);` (other)

### clear

**1 references from 1 files**

- src/tools/FileParserManager.ts:58 — `await this.pdfCache.clear();` (other)

## Outbound References (What This Uses)

### Pdf4llmResponse

**3 references**

- src/cache/pdfCache.ts:1 — `import { Pdf4llmResponse } from "@/LLMProviders/brevilabsClient";` (import)
- src/cache/pdfCache.ts:38 — `async get(file: TFile): Promise<Pdf4llmResponse \| null> {` (type-reference)
- src/cache/pdfCache.ts:56 — `async set(file: TFile, response: Pdf4llmResponse): Promise<void> {` (type-reference)

### logError

**4 references**

- src/cache/pdfCache.ts:2 — `import { logError, logInfo } from "@/logger";` (import)
- src/cache/pdfCache.ts:51 — `logError("Error reading from PDF cache:", error);` (function-call)
- src/cache/pdfCache.ts:64 — `logError("Error writing to PDF cache:", error);` (function-call)
- src/cache/pdfCache.ts:78 — `logError("Error clearing PDF cache:", error);` (function-call)

### logInfo

**7 references**

- src/cache/pdfCache.ts:2 — `import { logError, logInfo } from "@/logger";` (import)
- src/cache/pdfCache.ts:21 — `logInfo("Creating PDF cache directory:", this.cacheDir);` (function-call)
- src/cache/pdfCache.ts:30 — `logInfo("Generated cache key for PDF:", { path: file.path, key });` (function-call)
- src/cache/pdfCache.ts:44 — `logInfo("Cache hit for PDF:", file.path);` (function-call)
- src/cache/pdfCache.ts:48 — `logInfo("Cache miss for PDF:", file.path);` (function-call)
- src/cache/pdfCache.ts:61 — `logInfo("Caching PDF response for:", file.path);` (function-call)
- src/cache/pdfCache.ts:72 — `logInfo("Clearing PDF cache, removing files:", files.files.length);` (function-call)

### MD5

**2 references**

- src/cache/pdfCache.ts:3 — `import { MD5 } from "crypto-js";` (import)
- src/cache/pdfCache.ts:29 — `const key = MD5(metadata).toString();` (function-call)

### TFile

**4 references**

- src/cache/pdfCache.ts:4 — `import { TFile } from "obsidian";` (import)
- src/cache/pdfCache.ts:26 — `private getCacheKey(file: TFile): string {` (type-reference)
- src/cache/pdfCache.ts:38 — `async get(file: TFile): Promise<Pdf4llmResponse \| null> {` (type-reference)
- src/cache/pdfCache.ts:56 — `async set(file: TFile, response: Pdf4llmResponse): Promise<void> {` (type-reference)

### app

**8 references**

- src/cache/pdfCache.ts:20 — `if (!(await app.vault.adapter.exists(this.cacheDir))) {` (property-access)
- src/cache/pdfCache.ts:22 — `await app.vault.adapter.mkdir(this.cacheDir);` (property-access)
- src/cache/pdfCache.ts:43 — `if (await app.vault.adapter.exists(cachePath)) {` (property-access)
- src/cache/pdfCache.ts:45 — `const cacheContent = await app.vault.adapter.read(cachePath);` (property-access)
- src/cache/pdfCache.ts:62 — `await app.vault.adapter.write(cachePath, JSON.stringify(response));` (property-access)
- src/cache/pdfCache.ts:70 — `if (await app.vault.adapter.exists(this.cacheDir)) {` (property-access)
- src/cache/pdfCache.ts:71 — `const files = await app.vault.adapter.list(this.cacheDir);` (property-access)
- src/cache/pdfCache.ts:74 — `await app.vault.adapter.remove(file);` (property-access)

### vault

**8 references**

- src/cache/pdfCache.ts:20 — `if (!(await app.vault.adapter.exists(this.cacheDir))) {` (other)
- src/cache/pdfCache.ts:22 — `await app.vault.adapter.mkdir(this.cacheDir);` (other)
- src/cache/pdfCache.ts:43 — `if (await app.vault.adapter.exists(cachePath)) {` (other)
- src/cache/pdfCache.ts:45 — `const cacheContent = await app.vault.adapter.read(cachePath);` (other)
- src/cache/pdfCache.ts:62 — `await app.vault.adapter.write(cachePath, JSON.stringify(response));` (other)
- src/cache/pdfCache.ts:70 — `if (await app.vault.adapter.exists(this.cacheDir)) {` (other)
- src/cache/pdfCache.ts:71 — `const files = await app.vault.adapter.list(this.cacheDir);` (other)
- src/cache/pdfCache.ts:74 — `await app.vault.adapter.remove(file);` (other)

### adapter

**8 references**

- src/cache/pdfCache.ts:20 — `if (!(await app.vault.adapter.exists(this.cacheDir))) {` (other)
- src/cache/pdfCache.ts:22 — `await app.vault.adapter.mkdir(this.cacheDir);` (other)
- src/cache/pdfCache.ts:43 — `if (await app.vault.adapter.exists(cachePath)) {` (other)
- src/cache/pdfCache.ts:45 — `const cacheContent = await app.vault.adapter.read(cachePath);` (other)
- src/cache/pdfCache.ts:62 — `await app.vault.adapter.write(cachePath, JSON.stringify(response));` (other)
- src/cache/pdfCache.ts:70 — `if (await app.vault.adapter.exists(this.cacheDir)) {` (other)
- src/cache/pdfCache.ts:71 — `const files = await app.vault.adapter.list(this.cacheDir);` (other)
- src/cache/pdfCache.ts:74 — `await app.vault.adapter.remove(file);` (other)

### exists

**3 references**

- src/cache/pdfCache.ts:20 — `if (!(await app.vault.adapter.exists(this.cacheDir))) {` (other)
- src/cache/pdfCache.ts:43 — `if (await app.vault.adapter.exists(cachePath)) {` (other)
- src/cache/pdfCache.ts:70 — `if (await app.vault.adapter.exists(this.cacheDir)) {` (other)

### mkdir

**1 references**

- src/cache/pdfCache.ts:22 — `await app.vault.adapter.mkdir(this.cacheDir);` (other)

### path

**5 references**

- src/cache/pdfCache.ts:28 — `const metadata = \`${file.path}:${file.stat.size}:${file.stat.mtime}\`;` (other)
- src/cache/pdfCache.ts:30 — `logInfo("Generated cache key for PDF:", { path: file.path, key });` (other)
- src/cache/pdfCache.ts:44 — `logInfo("Cache hit for PDF:", file.path);` (other)
- src/cache/pdfCache.ts:48 — `logInfo("Cache miss for PDF:", file.path);` (other)
- src/cache/pdfCache.ts:61 — `logInfo("Caching PDF response for:", file.path);` (other)

### stat

**2 references**

- src/cache/pdfCache.ts:28 — `const metadata = \`${file.path}:${file.stat.size}:${file.stat.mtime}\`;` (other)
- src/cache/pdfCache.ts:28 — `const metadata = \`${file.path}:${file.stat.size}:${file.stat.mtime}\`;` (other)

### size

**1 references**

- src/cache/pdfCache.ts:28 — `const metadata = \`${file.path}:${file.stat.size}:${file.stat.mtime}\`;` (other)

### mtime

**1 references**

- src/cache/pdfCache.ts:28 — `const metadata = \`${file.path}:${file.stat.size}:${file.stat.mtime}\`;` (other)

### toString

**1 references**

- src/cache/pdfCache.ts:29 — `const key = MD5(metadata).toString();` (other)

### read

**1 references**

- src/cache/pdfCache.ts:45 — `const cacheContent = await app.vault.adapter.read(cachePath);` (other)

### parse

**1 references**

- src/cache/pdfCache.ts:46 — `return JSON.parse(cacheContent);` (other)

### write

**1 references**

- src/cache/pdfCache.ts:62 — `await app.vault.adapter.write(cachePath, JSON.stringify(response));` (other)

### stringify

**1 references**

- src/cache/pdfCache.ts:62 — `await app.vault.adapter.write(cachePath, JSON.stringify(response));` (other)

### list

**1 references**

- src/cache/pdfCache.ts:71 — `const files = await app.vault.adapter.list(this.cacheDir);` (other)

### files

**2 references**

- src/cache/pdfCache.ts:72 — `logInfo("Clearing PDF cache, removing files:", files.files.length);` (other)
- src/cache/pdfCache.ts:73 — `for (const file of files.files) {` (other)

### length

**1 references**

- src/cache/pdfCache.ts:72 — `logInfo("Clearing PDF cache, removing files:", files.files.length);` (other)

### remove

**1 references**

- src/cache/pdfCache.ts:74 — `await app.vault.adapter.remove(file);` (other)
