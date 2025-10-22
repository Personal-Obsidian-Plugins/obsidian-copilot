# References: src/tools/FileParserManager.ts

Generated: 2025-10-22T20:06:05.521Z

## Summary

- **Inbound References**: 31
- **Unique Files Using This**: 9
- **Inbound Symbols**: 6

- **Outbound References**: 122
- **Outbound Symbols**: 35
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
- src/contextProcessor.ts:276 — `let content = await fileParserManager.parseFile(note, vault);` (other)
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

**6 references**

- src/tools/FileParserManager.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";` (import)
- src/tools/FileParserManager.ts:25 — `private brevilabsClient: BrevilabsClient;` (type-reference)
- src/tools/FileParserManager.ts:28 — `constructor(brevilabsClient: BrevilabsClient) {` (type-reference)
- src/tools/FileParserManager.ts:187 — `private brevilabsClient: BrevilabsClient;` (type-reference)
- src/tools/FileParserManager.ts:196 — `constructor(brevilabsClient: BrevilabsClient, project: ProjectConfig \| null = null) {` (type-reference)
- src/tools/FileParserManager.ts:335 — `brevilabsClient: BrevilabsClient,` (type-reference)

### ProjectConfig

**5 references**

- src/tools/FileParserManager.ts:2 — `import { ProjectConfig } from "@/aiParams";` (import)
- src/tools/FileParserManager.ts:189 — `private currentProject: ProjectConfig \| null;` (type-reference)
- src/tools/FileParserManager.ts:196 — `constructor(brevilabsClient: BrevilabsClient, project: ProjectConfig \| null = null) {` (type-reference)
- src/tools/FileParserManager.ts:332 — `private currentProject: ProjectConfig \| null;` (type-reference)
- src/tools/FileParserManager.ts:338 — `project: ProjectConfig \| null = null` (type-reference)

### PDFCache

**3 references**

- src/tools/FileParserManager.ts:3 — `import { PDFCache } from "@/cache/pdfCache";` (import)
- src/tools/FileParserManager.ts:26 — `private pdfCache: PDFCache;` (type-reference)
- src/tools/FileParserManager.ts:30 — `this.pdfCache = PDFCache.getInstance();` (property-access)

### ProjectContextCache

**3 references**

- src/tools/FileParserManager.ts:4 — `import { ProjectContextCache } from "@/cache/projectContextCache";` (import)
- src/tools/FileParserManager.ts:188 — `private projectContextCache: ProjectContextCache;` (type-reference)
- src/tools/FileParserManager.ts:198 — `this.projectContextCache = ProjectContextCache.getInstance();` (property-access)

### logError

**5 references**

- src/tools/FileParserManager.ts:5 — `import { logError, logInfo } from "@/logger";` (import)
- src/tools/FileParserManager.ts:51 — `logError(\`Error extracting content from PDF ${file.path}:\`, error);` (function-call)
- src/tools/FileParserManager.ts:74 — `logError(\`Error parsing Canvas file ${file.path}:\`, error);` (function-call)
- src/tools/FileParserManager.ts:209 — `logError("[Docs4LLMParser] No project context for parsing file: ", file.path);` (function-call)
- src/tools/FileParserManager.ts:280 — `logError(` (function-call)

### logInfo

**12 references**

- src/tools/FileParserManager.ts:5 — `import { logError, logInfo } from "@/logger";` (import)
- src/tools/FileParserManager.ts:35 — `logInfo("Parsing PDF file:", file.path);` (function-call)
- src/tools/FileParserManager.ts:40 — `logInfo("Using cached PDF content for:", file.path);` (function-call)
- src/tools/FileParserManager.ts:46 — `logInfo("Calling pdf4llm API for:", file.path);` (function-call)
- src/tools/FileParserManager.ts:57 — `logInfo("Clearing PDF cache");` (function-call)
- src/tools/FileParserManager.ts:67 — `logInfo("Parsing Canvas file:", file.path);` (function-call)
- src/tools/FileParserManager.ts:204 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:218 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:223 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:229 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:275 — `logInfo(` (function-call)
- src/tools/FileParserManager.ts:314 — `logInfo("Cache clearing is now handled at the project level");` (function-call)

### extractRetryTime

**2 references**

- src/tools/FileParserManager.ts:6 — `import { extractRetryTime, isRateLimitError } from "@/utils/rateLimitUtils";` (import)
- src/tools/FileParserManager.ts:304 — `const retryTime = extractRetryTime(error);` (function-call)

### isRateLimitError

**2 references**

- src/tools/FileParserManager.ts:6 — `import { extractRetryTime, isRateLimitError } from "@/utils/rateLimitUtils";` (import)
- src/tools/FileParserManager.ts:286 — `if (isRateLimitError(error)) {` (function-call)

### Notice

**1 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)

### TFile

**7 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)
- src/tools/FileParserManager.ts:12 — `parseFile: (file: TFile, vault: Vault) => Promise<string>;` (type-reference)
- src/tools/FileParserManager.ts:18 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:33 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:65 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:202 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:363 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)

### Vault

**8 references**

- src/tools/FileParserManager.ts:7 — `import { Notice, TFile, Vault } from "obsidian";` (import)
- src/tools/FileParserManager.ts:12 — `parseFile: (file: TFile, vault: Vault) => Promise<string>;` (type-reference)
- src/tools/FileParserManager.ts:18 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:33 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:65 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:202 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)
- src/tools/FileParserManager.ts:336 — `vault: Vault,` (type-reference)
- src/tools/FileParserManager.ts:363 — `async parseFile(file: TFile, vault: Vault): Promise<string> {` (type-reference)

### CanvasLoader

**1 references**

- src/tools/FileParserManager.ts:8 — `import { CanvasLoader } from "./CanvasLoader";` (import)

### read

**1 references**

- src/tools/FileParserManager.ts:19 — `return await vault.read(file);` (other)

### getInstance

**2 references**

- src/tools/FileParserManager.ts:30 — `this.pdfCache = PDFCache.getInstance();` (other)
- src/tools/FileParserManager.ts:198 — `this.projectContextCache = ProjectContextCache.getInstance();` (other)

### path

**15 references**

- src/tools/FileParserManager.ts:35 — `logInfo("Parsing PDF file:", file.path);` (other)
- src/tools/FileParserManager.ts:40 — `logInfo("Using cached PDF content for:", file.path);` (other)
- src/tools/FileParserManager.ts:46 — `logInfo("Calling pdf4llm API for:", file.path);` (other)
- src/tools/FileParserManager.ts:51 — `logError(\`Error extracting content from PDF ${file.path}:\`, error);` (other)
- src/tools/FileParserManager.ts:67 — `logInfo("Parsing Canvas file:", file.path);` (other)
- src/tools/FileParserManager.ts:74 — `logError(\`Error parsing Canvas file ${file.path}:\`, error);` (other)
- src/tools/FileParserManager.ts:205 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:209 — `logError("[Docs4LLMParser] No project context for parsing file: ", file.path);` (other)
- src/tools/FileParserManager.ts:215 — `file.path` (other)
- src/tools/FileParserManager.ts:219 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Using cached content for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:224 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Cache miss for: ${file.path}. Proceeding to API call.\`` (other)
- src/tools/FileParserManager.ts:230 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Calling docs4llm API for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:273 — `await this.projectContextCache.setFileContext(this.currentProject, file.path, content);` (other)
- src/tools/FileParserManager.ts:276 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Successfully processed and cached: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:281 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Error processing file ${file.path}:\`,` (other)

### get

**3 references**

- src/tools/FileParserManager.ts:38 — `const cachedResponse = await this.pdfCache.get(file);` (other)
- src/tools/FileParserManager.ts:364 — `const parser = this.parsers.get(file.extension);` (other)
- src/tools/FileParserManager.ts:376 — `const pdfParser = this.parsers.get("pdf");` (other)

### response

**16 references**

- src/tools/FileParserManager.ts:41 — `return cachedResponse.response;` (other)
- src/tools/FileParserManager.ts:49 — `return pdf4llmResponse.response;` (other)
- src/tools/FileParserManager.ts:234 — `if (!docs4llmResponse \|\| !docs4llmResponse.response) {` (other)
- src/tools/FileParserManager.ts:240 — `if (typeof docs4llmResponse.response === "string") {` (other)
- src/tools/FileParserManager.ts:241 — `content = docs4llmResponse.response;` (other)
- src/tools/FileParserManager.ts:242 — `} else if (Array.isArray(docs4llmResponse.response)) {` (other)
- src/tools/FileParserManager.ts:245 — `for (const doc of docs4llmResponse.response) {` (other)
- src/tools/FileParserManager.ts:256 — `} else if (typeof docs4llmResponse.response === "object") {` (other)
- src/tools/FileParserManager.ts:258 — `if (docs4llmResponse.response.md) {` (other)
- src/tools/FileParserManager.ts:259 — `content = docs4llmResponse.response.md;` (other)
- src/tools/FileParserManager.ts:260 — `} else if (docs4llmResponse.response.text) {` (other)
- src/tools/FileParserManager.ts:261 — `content = docs4llmResponse.response.text;` (other)
- src/tools/FileParserManager.ts:262 — `} else if (docs4llmResponse.response.content) {` (other)
- src/tools/FileParserManager.ts:263 — `content = docs4llmResponse.response.content;` (other)
- src/tools/FileParserManager.ts:266 — `content = JSON.stringify(docs4llmResponse.response, null, 2);` (other)
- src/tools/FileParserManager.ts:269 — `content = String(docs4llmResponse.response);` (other)

### readBinary

**2 references**

- src/tools/FileParserManager.ts:45 — `const binaryContent = await vault.readBinary(file);` (other)
- src/tools/FileParserManager.ts:227 — `const binaryContent = await vault.readBinary(file);` (other)

### pdf4llm

**1 references**

- src/tools/FileParserManager.ts:47 — `const pdf4llmResponse = await this.brevilabsClient.pdf4llm(binaryContent);` (other)

### set

**2 references**

- src/tools/FileParserManager.ts:48 — `await this.pdfCache.set(file, pdf4llmResponse);` (other)
- src/tools/FileParserManager.ts:359 — `this.parsers.set(ext, parser);` (other)

### basename

**2 references**

- src/tools/FileParserManager.ts:52 — `return \`[Error: Could not extract content from PDF ${file.basename}]\`;` (other)
- src/tools/FileParserManager.ts:75 — `return \`[Error: Could not parse Canvas file ${file.basename}]\`;` (other)

### clear

**1 references**

- src/tools/FileParserManager.ts:58 — `await this.pdfCache.clear();` (other)

### load

**1 references**

- src/tools/FileParserManager.ts:69 — `const canvasData = await canvasLoader.load(file);` (other)

### buildPrompt

**1 references**

- src/tools/FileParserManager.ts:72 — `return canvasLoader.buildPrompt(canvasData);` (other)

### name

**6 references**

- src/tools/FileParserManager.ts:205 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:219 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Using cached content for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:224 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Cache miss for: ${file.path}. Proceeding to API call.\`` (other)
- src/tools/FileParserManager.ts:230 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Calling docs4llm API for: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:276 — `\`[Docs4LLMParser] Project ${this.currentProject.name}: Successfully processed and cached: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:281 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Error processing file ${file.path}:\`,` (other)

### extension

**4 references**

- src/tools/FileParserManager.ts:205 — `\`[Docs4LLMParser] Project ${this.currentProject?.name}: Parsing ${file.extension} file: ${file.path}\`` (other)
- src/tools/FileParserManager.ts:232 — `const docs4llmResponse = await this.brevilabsClient.docs4llm(binaryContent, file.extension);` (other)
- src/tools/FileParserManager.ts:364 — `const parser = this.parsers.get(file.extension);` (other)
- src/tools/FileParserManager.ts:366 — `throw new Error(\`No parser found for file type: ${file.extension}\`);` (other)

### getOrReuseFileContext

**1 references**

- src/tools/FileParserManager.ts:213 — `const cachedContent = await this.projectContextCache.getOrReuseFileContext(` (other)

### docs4llm

**1 references**

- src/tools/FileParserManager.ts:232 — `const docs4llmResponse = await this.brevilabsClient.docs4llm(binaryContent, file.extension);` (other)

### isArray

**1 references**

- src/tools/FileParserManager.ts:242 — `} else if (Array.isArray(docs4llmResponse.response)) {` (other)

### push

**2 references**

- src/tools/FileParserManager.ts:249 — `markdownParts.push(doc.content.md);` (other)
- src/tools/FileParserManager.ts:251 — `markdownParts.push(doc.content.text);` (other)

### join

**1 references**

- src/tools/FileParserManager.ts:255 — `content = markdownParts.join("\\n\\n");` (other)

### stringify

**1 references**

- src/tools/FileParserManager.ts:266 — `content = JSON.stringify(docs4llmResponse.response, null, 2);` (other)

### setFileContext

**1 references**

- src/tools/FileParserManager.ts:273 — `await this.projectContextCache.setFileContext(this.currentProject, file.path, content);` (other)

### now

**1 references**

- src/tools/FileParserManager.ts:295 — `const now = Date.now();` (other)

### has

**1 references**

- src/tools/FileParserManager.ts:372 — `return this.parsers.has(extension);` (other)
