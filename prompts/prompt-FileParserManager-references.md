# References: src/tools/FileParserManager.ts

Generated: 2025-10-23T16:34:12.402Z

## Summary

- **Inbound References**: 31
- **Unique Files Using This**: 9
- **Inbound Symbols**: 6

- **Outbound References**: 110
- **Outbound Symbols**: 36
- **Note**: Standard library symbols excluded from outbound references

## Inbound References (Who Uses This)

### Docs4LLMParser

**2 references from 1 files**

- src/components/chat-components/ChatControls.tsx:13 — `import { Docs4LLMParser } from "@/tools/FileParserManager";` (import)
- src/components/chat-components/ChatControls.tsx:135 — `Docs4LLMParser.resetRateLimitNoticeTimer();` (property-access)

### resetRateLimitNoticeTimer

**1 references from 1 files**

- src/components/chat-components/ChatControls.tsx:135 — `Docs4LLMParser.resetRateLimitNoticeTimer();` (other)

### FileParserManager

**20 references from 7 files**

- src/contextProcessor.ts:4 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/contextProcessor.ts:29 — `fileParserManager: FileParserManager` (type-reference)
- src/contextProcessor.ts:237 — `fileParserManager: FileParserManager,` (type-reference)
- src/core/ContextManager.ts:7 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/core/ContextManager.ts:45 — `fileParserManager: FileParserManager,` (type-reference)
- src/core/ContextManager.ts:191 — `fileParserManager: FileParserManager,` (type-reference)
- src/core/ChatManager.ts:5 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/core/ChatManager.ts:33 — `private fileParserManager: FileParserManager,` (type-reference)
- src/main.ts:34 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/main.ts:58 — `fileParserManager: FileParserManager;` (type-reference)
- src/main.ts:98 — `this.fileParserManager = new FileParserManager(this.brevilabsClient, this.app.vault);` (constructor)
- src/components/Chat.tsx:39 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/components/Chat.tsx:54 — `fileParserManager: FileParserManager;` (type-reference)
- src/components/CopilotView.tsx:6 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/components/CopilotView.tsx:17 — `private fileParserManager: FileParserManager;` (type-reference)
- src/LLMProviders/projectManager.ts:20 — `import { FileParserManager } from "@/tools/FileParserManager";` (import)
- src/LLMProviders/projectManager.ts:35 — `private fileParserManager: FileParserManager;` (type-reference)
- src/LLMProviders/projectManager.ts:44 — `this.fileParserManager = new FileParserManager(` (constructor)
- src/LLMProviders/projectManager.ts:160 — `this.fileParserManager = new FileParserManager(` (constructor)
- src/LLMProviders/projectManager.ts:743 — `this.fileParserManager = new FileParserManager(` (constructor)

### parseFile

**4 references from 2 files**

- src/contextProcessor.ts:40 — `const pdfContent = await fileParserManager.parseFile(pdfFile, vault);` (other)
- src/contextProcessor.ts:274 — `let content = await fileParserManager.parseFile(note, vault);` (other)
- src/LLMProviders/projectManager.ts:768 — `await this.fileParserManager.parseFile(file, this.app.vault);` (other)
- src/LLMProviders/projectManager.ts:902 — `return this.fileParserManager.parseFile(file, this.app.vault);` (other)

### supportsExtension

**3 references from 2 files**

- src/contextProcessor.ts:259 — `if (!fileParserManager.supportsExtension(note.extension)) {` (other)
- src/LLMProviders/projectManager.ts:754 — `if (this.fileParserManager.supportsExtension(file.extension)) {` (other)
- src/LLMProviders/projectManager.ts:896 — `if (!this.fileParserManager.supportsExtension(file.extension)) {` (other)

### clearPDFCache

**1 references from 1 files**

- src/commands/index.ts:317 — `await plugin.fileParserManager.clearPDFCache();` (other)

## Outbound References (What This Uses)

### BrevilabsClient

**4 references**

- src/tools/FileParserManager.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";` (import)
- src/tools/FileParserManager.ts:170 — `private brevilabsClient: BrevilabsClient;` (type-reference)
- src/tools/FileParserManager.ts:179 — `constructor(brevilabsClient: BrevilabsClient, project: ProjectConfig \| null = null) {` (type-reference)
- src/tools/FileParserManager.ts:318 — `brevilabsClient: BrevilabsClient,` (type-reference)

### ProjectConfig

**5 references**

- src/tools/FileParserManager.ts:2 — `import { ProjectConfig } from "@/aiParams";` (import)
- src/tools/FileParserManager.ts:172 — `private currentProject: ProjectConfig \| null;` (type-reference)
- src/tools/FileParserManager.ts:179 — `constructor(brevilabsClient: BrevilabsClient, project: ProjectConfig \| null = null) {` (type-reference)
- src/tools/FileParserManager.ts:315 — `private currentProject: ProjectConfig \| null;` (type-reference)
- src/tools/FileParserManager.ts:321 — `project: ProjectConfig \| null = null` (type-reference)

### ProjectContextCache

**3 references**

- src/tools/FileParserManager.ts:3 — `import { ProjectContextCache } from "@/cache/projectContextCache";` (import)
- src/tools/FileParserManager.ts:171 — `private projectContextCache: ProjectContextCache;` (type-reference)
- src/tools/FileParserManager.ts:181 — `this.projectContextCache = ProjectContextCache.getInstance();` (property-access)

### logError

**5 references**

- src/tools/FileParserManager.ts:4 — `import { logError, logInfo } from "@/logger";` (import)
- src/tools/FileParserManager.ts:34 — `logError(\`Error extracting content from PDF ${file.path}:\`, error);` (function-call)
- src/tools/FileParserManager.ts:57 — `logError(\`Error parsing Canvas file ${file.path}:\`, error);` (function-call)
- src/tools/FileParserManager.ts:192 — `logError("[Docs4LLMParser] No project context for parsing file: ", file.path);` (function-call)
- src/tools/FileParserManager.ts:263 — `logError(` (function-call)

### logInfo

**10 references**

- src/tools/FileParserManager.ts:4 — `import { logError, logInfo } from "@/logger";` (import)
- src/tools/FileParserManager.ts:29 — `logInfo("Parsing PDF file:", file.path);` (function-call)
- src/tools/FileParserManager.ts:40 — `logInfo("Clearing PDF cache");` (function-call)
- src/tools/FileParserManager.ts:50 — `logInfo("Parsing Canvas file:", file.path);` (function-call)
- src/tools/FileParserManager.ts:187 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:201 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:206 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:212 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:258 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:297 — `logInfo("Cache clearing is now handled at the project level");` (function-call)

### LocalPdfProcessor

**2 references**

- src/tools/FileParserManager.ts:5 — `import { LocalPdfProcessor } from "@/processors/pdfProcessor";` (import)
- src/tools/FileParserManager.ts:25 — `constructor(private readonly pdfProcessor: LocalPdfProcessor) {}` (type-reference)

### extractRetryTime

**2 references**

- src/tools/FileParserManager.ts:6 — `import { extractRetryTime, isRateLimitError } from "@/utils/rateLimitUtils";` (import)
- src/tools/FileParserManager.ts:287 — `const retryTime = extractRetryTime(error);` (function-call)

### isRateLimitError

**2 references**

- src/tools/FileParserManager.ts:6 — `import { extractRetryTime, isRateLimitError } from "@/utils/rateLimitUtils";` (import)
- src/tools/FileParserManager.ts:269 — `if (isRateLimitError(error)) {` (function-call)

### Notice

**1 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)

### TFile

**7 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)
- src/tools/FileParserManager.ts:12 — `parseFile: (file: TFile, vault: Vault) => Promise<string>;` (type-reference)
- src/tools/FileParserManager.ts:18 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:27 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:48 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:185 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:347 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)

### Vault

**8 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)
- src/tools/FileParserManager.ts:12 — `parseFile: (file: TFile, vault: Vault) => Promise<string>;` (type-reference)
- src/tools/FileParserManager.ts:18 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:27 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:48 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:185 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:319 — `vault: Vault,` (type-reference)
- src/tools/FileParserManager.ts:347 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)

### CanvasLoader

**1 references**

- src/tools/FileParserManager.ts:8 — `import { CanvasLoader } from "./CanvasLoader";` (import)

### read

**1 references**

- src/tools/FileParserManager.ts:19 — `return await vault.read(file);` (other)

### path

**13 references**

- src/tools/FileParserManager.ts:29 — `logInfo("Parsing PDF file:", file.path);` (other)
- src/tools/FileParserManager.ts:34 — `logError(\`Error extracting content from PDF ${file.path}:\`, error);` (other)
- src/tools/FileParserManager.ts:50 — `logInfo("Parsing Canvas file:", file.path);` (other)
- src/tools/FileParserManager.ts:57 — `logError(\`Error parsing Canvas file ${file.path}:\`, error);` (other)
- src/tools/FileParserManager.ts:188 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:192 — `logError("[Docs4LLMParser] No project context for parsing file: ", file.path);` (other)
- src/tools/FileParserManager.ts:198 — `file.path` (other)
- src/tools/FileParserManager.ts:202 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Using cached content for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:207 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Cache miss for: ${file.path}. Proceeding to API call.\`` (other)
- src/tools/FileParserManager.ts:213 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Calling docs4llm API for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:256 — `await this.projectContextCache.setFileContext(this.currentProject, file.path, content);` (other)
- src/tools/FileParserManager.ts:259 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Successfully processed and cached: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:264 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Error processing file ${file.path}:\`,` (other)

### parseToMarkdown

**1 references**

- src/tools/FileParserManager.ts:31 — `const entry = await this.pdfProcessor.parseToMarkdown(file, vault);` (other)

### markdown

**1 references**

- src/tools/FileParserManager.ts:32 — `return entry.markdown;` (other)

### basename

**2 references**

- src/tools/FileParserManager.ts:35 — `return \`[Error: Could not extract content from PDF ${file.basename}]\`;` (other)
- src/tools/FileParserManager.ts:58 — `return \`[Error: Could not parse Canvas file ${file.basename}]\`;` (other)

### clearCache

**1 references**

- src/tools/FileParserManager.ts:41 — `await this.pdfProcessor.clearCache();` (other)

### load

**1 references**

- src/tools/FileParserManager.ts:52 — `const canvasData = await canvasLoader.load(file);` (other)

### buildPrompt

**1 references**

- src/tools/FileParserManager.ts:55 — `return canvasLoader.buildPrompt(canvasData);` (other)

### getInstance

**1 references**

- src/tools/FileParserManager.ts:181 — `this.projectContextCache = ProjectContextCache.getInstance();` (other)

### name

**6 references**

- src/tools/FileParserManager.ts:188 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:202 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Using cached content for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:207 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Cache miss for: ${file.path}. Proceeding to API call.\`` (other)
- src/tools/FileParserManager.ts:213 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Calling docs4llm API for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:259 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Successfully processed and cached: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:264 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Error processing file ${file.path}:\`,` (other)

### extension

**4 references**

- src/tools/FileParserManager.ts:188 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:215 — `const docs4llmResponse = await this.brevilabsClient.docs4llm(binaryContent, file.extension);` (other)
- src/tools/FileParserManager.ts:348 — `const parser = this.parsers.get(file.extension);` (other)
- src/tools/FileParserManager.ts:350 — `throw new Error(\`No parser found for file type: ${file.extension}\`);` (other)

### getOrReuseFileContext

**1 references**

- src/tools/FileParserManager.ts:196 — `const cachedContent = await this.projectContextCache.getOrReuseFileContext(` (other)

### readBinary

**1 references**

- src/tools/FileParserManager.ts:210 — `const binaryContent = await vault.readBinary(file);` (other)

### docs4llm

**1 references**

- src/tools/FileParserManager.ts:215 — `const docs4llmResponse = await this.brevilabsClient.docs4llm(binaryContent, file.extension);` (other)

### response

**14 references**

- src/tools/FileParserManager.ts:217 — `if (!docs4llmResponse \|\| !docs4llmResponse.response) {` (other)
- src/tools/FileParserManager.ts:223 — `if (typeof docs4llmResponse.response === "string") {` (other)
- src/tools/FileParserManager.ts:224 — `content = docs4llmResponse.response;` (other)
- src/tools/FileParserManager.ts:225 — `} else if (Array.isArray(docs4llmResponse.response)) {` (other)
- src/tools/FileParserManager.ts:228 — `for (const doc of docs4llmResponse.response) {` (other)
- src/tools/FileParserManager.ts:239 — `} else if (typeof docs4llmResponse.response === "object") {` (other)
- src/tools/FileParserManager.ts:241 — `if (docs4llmResponse.response.md) {` (other)
- src/tools/FileParserManager.ts:242 — `content = docs4llmResponse.response.md;` (other)
- src/tools/FileParserManager.ts:243 — `} else if (docs4llmResponse.response.text) {` (other)
- src/tools/FileParserManager.ts:244 — `content = docs4llmResponse.response.text;` (other)
- src/tools/FileParserManager.ts:245 — `} else if (docs4llmResponse.response.content) {` (other)
- src/tools/FileParserManager.ts:246 — `content = docs4llmResponse.response.content;` (other)
- src/tools/FileParserManager.ts:249 — `content = JSON.stringify(docs4llmResponse.response, null, 2);` (other)
- src/tools/FileParserManager.ts:252 — `content = String(docs4llmResponse.response);` (other)

### isArray

**1 references**

- src/tools/FileParserManager.ts:225 — `} else if (Array.isArray(docs4llmResponse.response)) {` (other)

### push

**2 references**

- src/tools/FileParserManager.ts:232 — `markdownParts.push(doc.content.md);` (other)
- src/tools/FileParserManager.ts:234 — `markdownParts.push(doc.content.text);` (other)

### join

**1 references**

- src/tools/FileParserManager.ts:238 — `content = markdownParts.join("\\n\\n");` (other)

### stringify

**1 references**

- src/tools/FileParserManager.ts:249 — `content = JSON.stringify(docs4llmResponse.response, null, 2);` (other)

### setFileContext

**1 references**

- src/tools/FileParserManager.ts:256 — `await this.projectContextCache.setFileContext(this.currentProject, file.path, content);` (other)

### now

**1 references**

- src/tools/FileParserManager.ts:278 — `const now = Date.now();` (other)

### set

**1 references**

- src/tools/FileParserManager.ts:343 — `this.parsers.set(ext, parser);` (other)

### get

**2 references**

- src/tools/FileParserManager.ts:348 — `const parser = this.parsers.get(file.extension);` (other)
- src/tools/FileParserManager.ts:360 — `const pdfParser = this.parsers.get("pdf");` (other)

### has

**1 references**

- src/tools/FileParserManager.ts:356 — `return this.parsers.has(extension);` (other)
