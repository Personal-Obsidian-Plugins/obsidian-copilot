# Code Analysis Report: src/tools/FileParserManager.ts

Generated: 2025-10-22T20:06:05.518Z

## Quick Reference

**Top Symbols (by importance):**

1. **FileParserManager** (score: 90) - 20 refs, 7 files, 53 LOC
2. **parseFile** (score: 48) - 4 refs, 2 files, 91 LOC
3. **parseFile** (score: 37) - 4 refs, 2 files, 22 LOC
4. **Docs4LLMParser** (score: 34) - 2 refs, 1 files, 237 LOC
5. **parseFile** (score: 33) - 4 refs, 2 files, 13 LOC

**Dependencies:** 9 files depend on this target

## Summary

- **Target**: `src/tools/FileParserManager.ts`
- **Exclude Stdlib**: true
- **Target Symbols**: 37
- **Inbound References**: 31
- **Outbound References**: 122
- **Function Calls**: 38

## Target Symbols (Ranked by Importance)

| Rank | Name                      | Kind                 | Score | Refs | Files | LOC | Locations                                                                                                                                                                       |
| ---- | ------------------------- | -------------------- | ----- | ---- | ----- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | FileParserManager         | ClassDeclaration     | 90    | 20   | 7     | 53  | src/tools/FileParserManager.ts:329                                                                                                                                              |
| 2    | parseFile                 | MethodDeclaration    | 48    | 4    | 2     | 91  | src/tools/FileParserManager.ts:202, src/tools/FileParserManager.ts:33, src/tools/FileParserManager.ts:65, src/tools/FileParserManager.ts:363, src/tools/FileParserManager.ts:18 |
| 3    | Docs4LLMParser            | ClassDeclaration     | 34    | 2    | 1     | 237 | src/tools/FileParserManager.ts:80                                                                                                                                               |
| 4    | supportsExtension         | MethodDeclaration    | 25    | 3    | 2     | 3   | src/tools/FileParserManager.ts:371                                                                                                                                              |
| 5    | resetRateLimitNoticeTimer | MethodDeclaration    | 21    | 1    | 1     | 3   | src/tools/FileParserManager.ts:192                                                                                                                                              |
| 6    | PDFParser                 | ClassDeclaration     | 15    | 0    | 0     | 38  | src/tools/FileParserManager.ts:23                                                                                                                                               |
| 7    | clearPDFCache             | MethodDeclaration    | 12    | 1    | 1     | 6   | src/tools/FileParserManager.ts:375                                                                                                                                              |
| 8    | CanvasParser              | ClassDeclaration     | 7     | 0    | 0     | 17  | src/tools/FileParserManager.ts:62                                                                                                                                               |
| 9    | showRateLimitNotice       | MethodDeclaration    | 7     | 0    | 0     | 17  | src/tools/FileParserManager.ts:294                                                                                                                                              |
| 10   | MarkdownParser            | ClassDeclaration     | 3     | 0    | 0     | 7   | src/tools/FileParserManager.ts:15                                                                                                                                               |
| 11   | FileParser                | InterfaceDeclaration | 2     | 0    | 0     | 4   | src/tools/FileParserManager.ts:10                                                                                                                                               |
| 12   | clearCache                | MethodDeclaration    | 2     | 0    | 0     | 4   | src/tools/FileParserManager.ts:56, src/tools/FileParserManager.ts:312                                                                                                           |
| 13   | cachedContent             | VariableDeclaration  | 2     | 0    | 0     | 4   | src/tools/FileParserManager.ts:213                                                                                                                                              |
| 14   | registerParser            | MethodDeclaration    | 2     | 0    | 0     | 5   | src/tools/FileParserManager.ts:357                                                                                                                                              |
| 15   | cachedResponse            | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:38                                                                                                                                               |
| 16   | binaryContent             | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:45, src/tools/FileParserManager.ts:227                                                                                                           |
| 17   | pdf4llmResponse           | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:47                                                                                                                                               |
| 18   | error                     | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:50, src/tools/FileParserManager.ts:73, src/tools/FileParserManager.ts:279                                                                        |
| 19   | canvasLoader              | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:68                                                                                                                                               |
| 20   | canvasData                | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:69                                                                                                                                               |
| 21   | docs4llmResponse          | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:232                                                                                                                                              |
| 22   | content                   | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:239                                                                                                                                              |
| 23   | markdownParts             | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:244                                                                                                                                              |
| 24   | doc                       | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:245                                                                                                                                              |
| 25   | now                       | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:295                                                                                                                                              |
| 26   | retryTime                 | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:304                                                                                                                                              |
| 27   | ext                       | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:358                                                                                                                                              |
| 28   | parser                    | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:364                                                                                                                                              |
| 29   | pdfParser                 | VariableDeclaration  | 0     | 0    | 0     | 1   | src/tools/FileParserManager.ts:376                                                                                                                                              |

## Target-Level Dependencies

High-level view of files that depend on the target and files the target depends on.

```mermaid
graph LR
    Target["Target: FileParserManager.ts"]
    style Target fill:#e1f5ff,stroke:#01579b,stroke-width:3px
    N0["projectManager.ts"]
    N0 -->|uses| Target
    N1["index.ts"]
    N1 -->|uses| Target
    N2["Chat.tsx"]
    N2 -->|uses| Target
    N3["CopilotView.tsx"]
    N3 -->|uses| Target
    N4["ChatControls.tsx"]
    N4 -->|uses| Target
    N5["contextProcessor.ts"]
    N5 -->|uses| Target
    N6["ChatManager.ts"]
    N6 -->|uses| Target
    N7["ContextManager.ts"]
    N7 -->|uses| Target
    N8["main.ts"]
    N8 -->|uses| Target
```

## Detailed Dependency Map

Detailed symbol-level dependencies (simplified to avoid redundant edges).

```mermaid
graph LR
    N0["Target"]
    style N0 fill:#e1f5ff,stroke:#01579b,stroke-width:2px
    N1["FileParserManager.ts"]
    N2["projectManager.ts"]
    N3["contextProcessor.ts"]
    N4["ChatControls.tsx"]
    N5["ContextManager.ts"]
    N6["main.ts"]
    N7["ChatManager.ts"]
    N8["Chat.tsx"]
    N9["CopilotView.tsx"]
    N10["index.ts"]
    N0 -->|"has"| N1
    N2 -->|"FileParserManager, parseFile"| N0
    N3 -->|"FileParserManager, parseFile"| N0
    N4 -->|"Docs4LLMParser, resetRateLimitNoticeTimer"| N0
    N5 -->|"FileParserManager"| N0
    N6 -->|"FileParserManager"| N0
    N7 -->|"FileParserManager"| N0
    N8 -->|"FileParserManager"| N0
    N9 -->|"FileParserManager"| N0
    N10 -->|"clearPDFCache"| N0
```

## Call Hierarchy

```mermaid
graph TD
    F0["parseFile"]
    F1["read"]
    F2["anonymous"]
    F3["getInstance"]
    F4["logInfo"]
    F5["readBinary"]
    F6["pdf4llm"]
    F7["logError"]
    F8["clearCache"]
    F9["load"]
    F10["buildPrompt"]
    F11["getOrReuseFileContext"]
    F12["docs4llm"]
    F13["isArray"]
    F14["String"]
    F15["setFileContext"]
    F16["isRateLimitError"]
    F17["showRateLimitNotice"]
    F18["now"]
    F19["extractRetryTime"]
    F20["registerParser"]
    F21["clearPDFCache"]
    F0 --> F1
    F2 --> F3
    F0 --> F4
    F0 --> F4
    F0 --> F5
    F0 --> F4
    F0 --> F6
    F0 --> F7
    F8 --> F4
    F0 --> F4
    F0 --> F9
    F0 --> F10
    F0 --> F7
    F2 --> F3
    F0 --> F4
    F0 --> F7
    F0 --> F11
    F0 --> F4
    F0 --> F4
    F0 --> F5
    F0 --> F4
    F0 --> F12
    F0 --> F13
    F0 --> F14
    F0 --> F15
    F0 --> F4
    F0 --> F7
    F0 --> F16
    F0 --> F17
    F17 --> F18
    F17 --> F19
    F8 --> F4
    F2 --> F20
    F2 --> F20
    F2 --> F20
    F2 --> F20
    F0 --> F0
    F21 --> F8
```

## References

Detailed inbound and outbound references have been written to a separate file.

**→ [View Detailed References](prompt-FileParserManager-references.md)**
