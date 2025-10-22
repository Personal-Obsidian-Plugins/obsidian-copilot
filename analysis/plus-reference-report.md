# Plus Reference Report

- Generated: 2025-10-21T23:59:10.481Z
- Pattern: `copilot\\s\*plus\|plusLicense\|isPlus\|ChainType\\.COPILOT\_PLUS\_CHAIN\|ChainType\\.PROJECT\_CHAIN\|CopilotPlus\|PlusUtm\|plusOnly\|PlusChain\|PLUS\_` (gi)
- Symbol Entries: 24
- Total References: 107
- Pattern Matches: 357
- Impacted Files: 62

## File Impact Summary

| File                                                              | Symbol References | Pattern Matches | Symbols                                                                                                                                                                                                                                                                                               | Categories                                                 |
| ----------------------------------------------------------------- | ----------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| src/plusUtils.ts                                                  | 9                 | 34              | BrevilabsClient, DEFAULT_COPILOT_PLUS_CHAT_MODEL, DEFAULT_COPILOT_PLUS_CHAT_MODEL_KEY, DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL, DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL_KEY, applyPlusSettings, checkIsPlusUser, createPlusPageUrl, isPlusModel, navigateToPlusPage, turnOffPlus, turnOnPlus, useIsPlusUser | licensing, marketing, model-selection                      |
| src/LLMProviders/brevilabsClient.ts                               | 23                | 6               | AutocompleteResponse, BrevilabsClient, BrocaResponse, Docs4llmResponse, LicenseResponse, Pdf4llmResponse, RerankResponse, ToolCall, Url4llmResponse, WebSearchResponse, WordCompleteResponse, Youtube4llmResponse, turnOffPlus, turnOnPlus                                                            | autocomplete, context, integrations, licensing, pdf, tools |
| src/components/chat-components/ChatInput.tsx                      | 0                 | 26              | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/settings/v2/components/PlusSettings.tsx                       | 6                 | 18              | checkIsPlusUser, navigateToPlusPage, useIsPlusUser                                                                                                                                                                                                                                                    | licensing, marketing                                       |
| src/components/chat-components/ChatControls.tsx                   | 5                 | 18              | navigateToPlusPage, useIsPlusUser                                                                                                                                                                                                                                                                     | licensing, marketing                                       |
| src/constants.ts                                                  | 0                 | 23              | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/modals/CopilotPlusWelcomeModal.tsx                 | 8                 | 13              | DEFAULT_COPILOT_PLUS_CHAT_MODEL, DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL, DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL_KEY, applyPlusSettings                                                                                                                                                                    | licensing, model-selection                                 |
| src/components/Chat.tsx                                           | 2                 | 18              | useIsPlusUser                                                                                                                                                                                                                                                                                         | licensing                                                  |
| src/components/modals/CopilotPlusExpiredModal.tsx                 | 5                 | 12              | isPlusModel, navigateToPlusPage                                                                                                                                                                                                                                                                       | marketing, model-selection                                 |
| src/LLMProviders/chainRunner/utils/toolExecution.test.ts          | 3                 | 13              | checkIsPlusUser                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/LLMProviders/chainManager.ts                                  | 0                 | 11              | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/SuggestedPrompts.tsx               | 0                 | 10              | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts        | 2                 | 8               | checkIsPlusUser                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts            | 2                 | 8               | checkIsPlusUser                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/LLMProviders/embeddingManager.ts                              | 2                 | 8               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/utils.ts                                                      | 0                 | 10              | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/ChatToolControls.tsx               | 0                 | 9               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/commands/index.ts                                             | 2                 | 6               | checkIsPlusUser                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/LLMProviders/chainRunner/utils/toolExecution.ts               | 2                 | 6               | checkIsPlusUser                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/settings/v2/components/BasicSettings.tsx                      | 2                 | 6               | createPlusPageUrl                                                                                                                                                                                                                                                                                     | marketing                                                  |
| src/components/chat-components/hooks/useAtMentionCategories.tsx   | 0                 | 7               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/main.ts                                                       | 5                 | 2               | BrevilabsClient, checkIsPlusUser                                                                                                                                                                                                                                                                      | licensing                                                  |
| src/components/chat-components/ChatContextMenu.tsx                | 0                 | 6               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/LexicalEditor.tsx                  | 0                 | 6               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/projectManager.ts                                | 5                 | 1               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/tools/FileParserManager.ts                                    | 6                 | 0               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/components/chat-components/hooks/useAllNotes.ts               | 0                 | 5               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/mentions/Mention.ts                                           | 5                 | 0               | BrevilabsClient, Url4llmResponse                                                                                                                                                                                                                                                                      | licensing, tools                                           |
| src/components/chat-components/AtMentionTypeahead.tsx             | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/hooks/useAtMentionSearch.ts        | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/hooks/useNoteSearch.ts             | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/chat-components/plugins/AtMentionCommandPlugin.tsx | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/contextProcessor.ts                                           | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/integration_tests/AgentPrompt.test.ts                         | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/tools/SimpleTool.ts                                           | 0                 | 4               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/cache/pdfCache.ts                                             | 3                 | 0               | Pdf4llmResponse                                                                                                                                                                                                                                                                                       | pdf                                                        |
| src/components/chat-components/plugins/NoteCommandPlugin.tsx      | 0                 | 3               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/core/ContextManager.ts                                        | 0                 | 3               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chainRunner/ProjectChainRunner.ts                | 0                 | 3               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/intentAnalyzer.ts                                | 2                 | 1               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/search/indexEventHandler.ts                                   | 0                 | 3               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/settings/v2/SettingsMainV2.tsx                                | 0                 | 3               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/tools/SearchTools.ts                                          | 2                 | 1               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/tools/YoutubeTools.ts                                         | 2                 | 1               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/components/modals/YoutubeTranscriptModal.tsx                  | 2                 | 0               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/core/ChatManager.test.ts                                      | 0                 | 2               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chainRunner/index.ts                             | 0                 | 2               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chainRunner/utils/modelAdapter.ts                | 0                 | 2               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chatModelManager.ts                              | 0                 | 2               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/search/hybridRetriever.ts                                     | 2                 | 0               | BrevilabsClient                                                                                                                                                                                                                                                                                       | licensing                                                  |
| src/settings/model.ts                                             | 0                 | 2               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/aiParams.ts                                                   | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/chainFactory.ts                                               | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/modals/AddContextNoteModal.tsx                     | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/components/modals/BaseNoteModal.tsx                           | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/contextProcessor.dataview.test.ts                             | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/encryptionService.ts                                          | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/hooks/useProjectContextStatus.ts                              | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/LLMProviders/chainRunner/BaseChainRunner.ts                   | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/settings/v2/components/CopilotPlusSettings.tsx                | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/settings/v2/components/ModelAddDialog.tsx                     | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |
| src/tests/projectContextCache.test.ts                             | 0                 | 1               | –                                                                                                                                                                                                                                                                                                     | –                                                          |

## Category Summary

| Category        | Symbols | References |
| --------------- | ------- | ---------- |
| licensing       | 7       | 61         |
| model-selection | 5       | 13         |
| tools           | 5       | 10         |
| marketing       | 2       | 10         |
| pdf             | 1       | 5          |
| autocomplete    | 2       | 4          |
| context         | 1       | 2          |
| integrations    | 1       | 2          |

## Symbol Details

### AutocompleteResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:84

- Target: exact `AutocompleteResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: autocomplete
- Tags: remove
- Declaration: `export interface AutocompleteResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:424 — `): Promise<AutocompleteResponse> {`
  - src/LLMProviders/brevilabsClient.ts:425 — `const { data, error } = await this.makeRequest<AutocompleteResponse>("/autocomplete", {`

### WordCompleteResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:91

- Target: exact `WordCompleteResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: autocomplete
- Tags: remove
- Declaration: `export interface WordCompleteResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:444 — `): Promise<WordCompleteResponse> {`
  - src/LLMProviders/brevilabsClient.ts:445 — `const { data, error } = await this.makeRequest<WordCompleteResponse>("/wordcomplete", {`

### Docs4llmResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:53

- Target: exact `Docs4llmResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: context
- Tags: remove
- Declaration: `export interface Docs4llmResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:325 — `async docs4llm(binaryContent: ArrayBuffer, fileType: string): Promise<Docs4llmResponse> {`
  - src/LLMProviders/brevilabsClient.ts:343 — `const { data, error } = await this.makeFormDataRequest<Docs4llmResponse>("/docs4llm", formData);`

### Youtube4llmResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:72

- Target: exact `Youtube4llmResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: integrations
- Tags: remove
- Declaration: `export interface Youtube4llmResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:408 — `async youtube4llm(url: string): Promise<Youtube4llmResponse> {`
  - src/LLMProviders/brevilabsClient.ts:409 — `const { data, error } = await this.makeRequest<Youtube4llmResponse>("/youtube4llm", { url });`

### BrevilabsClient (ClassDeclaration) — src/LLMProviders/brevilabsClient.ts:98

- Target: exact `BrevilabsClient` from `src/LLMProviders/brevilabsClient.ts`
- Category: licensing
- Tags: client, remove
- Declaration: `export class BrevilabsClient {`
- Usage Summary:
  - static-method-call — getInstance (14)
  - import — specifier (11)
  - type-reference — property (4)
  - type-reference — parameter (3)
- References (32):
  - src/plusUtils.ts:12 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/plusUtils.ts:45 — `const brevilabsClient = BrevilabsClient.getInstance();`
  - src/plusUtils.ts:55 — `const brevilabsClient = BrevilabsClient.getInstance();`
  - src/LLMProviders/embeddingManager.ts:14 — `import { BrevilabsClient } from "./brevilabsClient";`
  - src/LLMProviders/embeddingManager.ts:153 — `const brevilabsClient = BrevilabsClient.getInstance();`
  - src/tools/FileParserManager.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/tools/FileParserManager.ts:25 — `private brevilabsClient: BrevilabsClient;`
  - src/tools/FileParserManager.ts:28 — `constructor(brevilabsClient: BrevilabsClient) {`
  - src/tools/FileParserManager.ts:187 — `private brevilabsClient: BrevilabsClient;`
  - src/tools/FileParserManager.ts:196 — `constructor(brevilabsClient: BrevilabsClient, project: ProjectConfig \| null = null) {`
  - src/tools/FileParserManager.ts:335 — `brevilabsClient: BrevilabsClient,`
  - src/components/modals/YoutubeTranscriptModal.tsx:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/components/modals/YoutubeTranscriptModal.tsx:64 — `const response = await BrevilabsClient.getInstance().youtube4llm(url);`
  - src/mentions/Mention.ts:2 — `import { BrevilabsClient, Url4llmResponse } from "@/LLMProviders/brevilabsClient";`
  - src/mentions/Mention.ts:16 — `private brevilabsClient: BrevilabsClient;`
  - src/mentions/Mention.ts:20 — `this.brevilabsClient = BrevilabsClient.getInstance();`
  - src/tools/SearchTools.ts:3 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/tools/SearchTools.ts:288 — `const response = await BrevilabsClient.getInstance().webSearch(standaloneQuestion);`
  - src/tools/YoutubeTools.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/tools/YoutubeTools.ts:53 — `const response = await BrevilabsClient.getInstance().youtube4llm(url);`
  - src/LLMProviders/intentAnalyzer.ts:15 — `import { BrevilabsClient } from "./brevilabsClient";`
  - src/LLMProviders/intentAnalyzer.ts:44 — `const brocaResponse = await BrevilabsClient.getInstance().broca(`
  - src/main.ts:1 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/main.ts:55 — `brevilabsClient: BrevilabsClient;`
  - src/main.ts:82 — `this.brevilabsClient = BrevilabsClient.getInstance();`
  - src/LLMProviders/projectManager.ts:24 — `import { BrevilabsClient } from "./brevilabsClient";`
  - src/LLMProviders/projectManager.ts:45 — `BrevilabsClient.getInstance(),`
  - src/LLMProviders/projectManager.ts:161 — `BrevilabsClient.getInstance(),`
  - src/LLMProviders/projectManager.ts:715 — `return BrevilabsClient.getInstance().youtube4llm(youtubeUrl);`
  - src/LLMProviders/projectManager.ts:744 — `BrevilabsClient.getInstance(),`
  - src/search/hybridRetriever.ts:3 — `import { BrevilabsClient } from "@/LLMProviders/brevilabsClient";`
  - src/search/hybridRetriever.ts:100 — `const rerankResponse = await BrevilabsClient.getInstance().rerank(`

### checkIsPlusUser (FunctionDeclaration) — src/plusUtils.ts:40

- Target: exact `checkIsPlusUser` from `src/plusUtils.ts`
- Category: licensing
- Tags: validation
- Declaration: `export async function checkIsPlusUser(context?: Record<string, any>): Promise<boolean \| undefined> {`
- Usage Summary:
  - import — specifier (7)
  - direct-call — checkIsPlusUser (6)
  - other — AsExpression (1)
  - other — TypeQuery (1)
- References (15):
  - src/commands/index.ts:18 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/commands/index.ts:433 — `const isPlusUser = await checkIsPlusUser();`
  - src/settings/v2/components/PlusSettings.tsx:6 — `import { checkIsPlusUser, navigateToPlusPage, useIsPlusUser } from "@/plusUtils";`
  - src/settings/v2/components/PlusSettings.tsx:60 — `const result = await checkIsPlusUser();`
  - src/LLMProviders/chainRunner/utils/toolExecution.ts:2 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/LLMProviders/chainRunner/utils/toolExecution.ts:53 — `const isPlusUser = await checkIsPlusUser();`
  - src/main.ts:22 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/main.ts:84 — `checkIsPlusUser();`
  - src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:17 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:385 — `const isPlusUser = await checkIsPlusUser({`
  - src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:4 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:254 — `const isPlusUser = await checkIsPlusUser({`
  - src/LLMProviders/chainRunner/utils/toolExecution.test.ts:22 — `import { checkIsPlusUser } from "@/plusUtils";`
  - src/LLMProviders/chainRunner/utils/toolExecution.test.ts:26 — `const mockCheckIsPlusUser = checkIsPlusUser as jest.MockedFunction<typeof checkIsPlusUser>;`
  - src/LLMProviders/chainRunner/utils/toolExecution.test.ts:26 — `const mockCheckIsPlusUser = checkIsPlusUser as jest.MockedFunction<typeof checkIsPlusUser>;`

### useIsPlusUser (FunctionDeclaration) — src/plusUtils.ts:34

- Target: exact `useIsPlusUser` from `src/plusUtils.ts`
- Category: licensing
- Tags: hooks
- Declaration: `export function useIsPlusUser(): boolean \| undefined {`
- Usage Summary:
  - direct-call — useIsPlusUser (3)
  - import — specifier (3)
- References (6):
  - src/components/chat-components/ChatControls.tsx:11 — `import { navigateToPlusPage, useIsPlusUser } from "@/plusUtils";`
  - src/components/chat-components/ChatControls.tsx:200 — `const isPlusUser = useIsPlusUser();`
  - src/settings/v2/components/PlusSettings.tsx:6 — `import { checkIsPlusUser, navigateToPlusPage, useIsPlusUser } from "@/plusUtils";`
  - src/settings/v2/components/PlusSettings.tsx:15 — `const isPlusUser = useIsPlusUser();`
  - src/components/Chat.tsx:36 — `import { useIsPlusUser } from "@/plusUtils";`
  - src/components/Chat.tsx:155 — `const isPlusUser = useIsPlusUser();`

### turnOffPlus (FunctionDeclaration) — src/plusUtils.ts:120

- Target: exact `turnOffPlus` from `src/plusUtils.ts`
- Category: licensing
- Tags: status, settings
- Declaration: `export function turnOffPlus(): void {`
- Usage Summary:
  - direct-call — turnOffPlus (2)
  - import — specifier (1)
- References (3):
  - src/plusUtils.ts:42 — `turnOffPlus();`
  - src/LLMProviders/brevilabsClient.ts:4 — `import { turnOffPlus, turnOnPlus } from "@/plusUtils";`
  - src/LLMProviders/brevilabsClient.ts:255 — `turnOffPlus();`

### applyPlusSettings (FunctionDeclaration) — src/plusUtils.ts:65

- Target: exact `applyPlusSettings` from `src/plusUtils.ts`
- Category: licensing
- Tags: settings, side-effects
- Declaration: `export function applyPlusSettings(): void {`
- Usage Summary:
  - direct-call — applyPlusSettings (1)
  - import — specifier (1)
- References (2):
  - src/components/modals/CopilotPlusWelcomeModal.tsx:10 — `applyPlusSettings,`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:83 — `applyPlusSettings();`

### turnOnPlus (FunctionDeclaration) — src/plusUtils.ts:110

- Target: exact `turnOnPlus` from `src/plusUtils.ts`
- Category: licensing
- Tags: status, settings
- Declaration: `export function turnOnPlus(): void {`
- Usage Summary:
  - direct-call — turnOnPlus (1)
  - import — specifier (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:4 — `import { turnOffPlus, turnOnPlus } from "@/plusUtils";`
  - src/LLMProviders/brevilabsClient.ts:261 — `turnOnPlus();`

### LicenseResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:79

- Target: exact `LicenseResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: licensing
- Tags: status
- Declaration: `export interface LicenseResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
- References (1):
  - src/LLMProviders/brevilabsClient.ts:245 — `const { data, error } = await this.makeRequest<LicenseResponse>(`

### navigateToPlusPage (FunctionDeclaration) — src/plusUtils.ts:106

- Target: exact `navigateToPlusPage` from `src/plusUtils.ts`
- Category: marketing
- Tags: ui, navigation
- Declaration: `export function navigateToPlusPage(medium: PlusUtmMedium): void {`
- Usage Summary:
  - direct-call — navigateToPlusPage (4)
  - import — specifier (3)
- References (7):
  - src/components/modals/CopilotPlusExpiredModal.tsx:6 — `import { isPlusModel, navigateToPlusPage } from "@/plusUtils";`
  - src/components/modals/CopilotPlusExpiredModal.tsx:37 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.EXPIRED\_MODAL);`
  - src/components/chat-components/ChatControls.tsx:11 — `import { navigateToPlusPage, useIsPlusUser } from "@/plusUtils";`
  - src/components/chat-components/ChatControls.tsx:258 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.CHAT\_MODE\_SELECT);`
  - src/components/chat-components/ChatControls.tsx:280 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.CHAT\_MODE\_SELECT);`
  - src/settings/v2/components/PlusSettings.tsx:6 — `import { checkIsPlusUser, navigateToPlusPage, useIsPlusUser } from "@/plusUtils";`
  - src/settings/v2/components/PlusSettings.tsx:76 — `onClick={() => navigateToPlusPage(PLUS\_UTM\_MEDIUMS.SETTINGS)}`

### createPlusPageUrl (FunctionDeclaration) — src/plusUtils.ts:102

- Target: exact `createPlusPageUrl` from `src/plusUtils.ts`
- Category: marketing
- Tags: urls
- Declaration: `export function createPlusPageUrl(medium: PlusUtmMedium): string {`
- Usage Summary:
  - direct-call — createPlusPageUrl (2)
  - import — specifier (1)
- References (3):
  - src/plusUtils.ts:107 — `window.open(createPlusPageUrl(medium), "\_blank");`
  - src/settings/v2/components/BasicSettings.tsx:9 — `import { createPlusPageUrl } from "@/plusUtils";`
  - src/settings/v2/components/BasicSettings.tsx:202 — `href={createPlusPageUrl(PLUS\_UTM\_MEDIUMS.MODE\_SELECT\_TOOLTIP)}`

### DEFAULT_COPILOT_PLUS_CHAT_MODEL (VariableDeclaration) — src/plusUtils.ts:17

- Target: prefix `DEFAULT\_COPILOT\_PLUS\_` from `src/plusUtils.ts`
- Category: model-selection
- Tags: defaults
- Note: Covers all default model constants for Plus users.
- Declaration: `export const DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL = ChatModels.COPILOT\_PLUS\_FLASH;`
- Usage Summary:
  - import — specifier (1)
  - other — BinaryExpression (1)
  - other — JsxExpression (1)
- References (3):
  - src/plusUtils.ts:19 — `DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL + "\|" + ChatModelProviders.COPILOT\_PLUS;`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:7 — `DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL,`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:40 — `Chat model: <b className="tw-text-accent">{DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL}</b>`

### DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL (VariableDeclaration) — src/plusUtils.ts:20

- Target: prefix `DEFAULT\_COPILOT\_PLUS\_` from `src/plusUtils.ts`
- Category: model-selection
- Tags: defaults
- Note: Covers all default model constants for Plus users.
- Declaration: `export const DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL = EmbeddingModels.COPILOT\_PLUS\_SMALL;`
- Usage Summary:
  - import — specifier (1)
  - other — BinaryExpression (1)
  - other — JsxExpression (1)
- References (3):
  - src/plusUtils.ts:22 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL + "\|" + EmbeddingModelProviders.COPILOT\_PLUS;`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:8 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL,`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:45 — `<b className="tw-text-accent">{DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL}</b>`

### DEFAULT_COPILOT_PLUS_EMBEDDING_MODEL_KEY (VariableDeclaration) — src/plusUtils.ts:21

- Target: prefix `DEFAULT\_COPILOT\_PLUS\_` from `src/plusUtils.ts`
- Category: model-selection
- Tags: defaults
- Note: Covers all default model constants for Plus users.
- Declaration: `export const DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY =`
- Usage Summary:
  - import — specifier (1)
  - other — BinaryExpression (1)
  - other — VariableDeclaration (1)
- References (3):
  - src/plusUtils.ts:67 — `const embeddingModelKey = DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY;`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:9 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY,`
  - src/components/modals/CopilotPlusWelcomeModal.tsx:47 — `{settings.embeddingModelKey !== DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY && (`

### isPlusModel (FunctionDeclaration) — src/plusUtils.ts:29

- Target: exact `isPlusModel` from `src/plusUtils.ts`
- Category: model-selection
- Tags: models
- Declaration: `export function isPlusModel(modelKey: string): boolean {`
- Usage Summary:
  - direct-call — isPlusModel (2)
  - import — specifier (1)
- References (3):
  - src/components/modals/CopilotPlusExpiredModal.tsx:6 — `import { isPlusModel, navigateToPlusPage } from "@/plusUtils";`
  - src/components/modals/CopilotPlusExpiredModal.tsx:14 — `isPlusModel(settings.defaultModelKey) && isPlusModel(settings.embeddingModelKey);`
  - src/components/modals/CopilotPlusExpiredModal.tsx:14 — `isPlusModel(settings.defaultModelKey) && isPlusModel(settings.embeddingModelKey);`

### DEFAULT_COPILOT_PLUS_CHAT_MODEL_KEY (VariableDeclaration) — src/plusUtils.ts:18

- Target: prefix `DEFAULT\_COPILOT\_PLUS\_` from `src/plusUtils.ts`
- Category: model-selection
- Tags: defaults
- Note: Covers all default model constants for Plus users.
- Declaration: `export const DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL\_KEY =`
- Usage Summary:
  - other — VariableDeclaration (1)
- References (1):
  - src/plusUtils.ts:66 — `const defaultModelKey = DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL\_KEY;`

### Pdf4llmResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:48

- Target: exact `Pdf4llmResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: pdf
- Tags: migrate
- Declaration: `export interface Pdf4llmResponse {`
- Usage Summary:
  - import — specifier (1)
  - type-reference — CallExpression (1)
  - type-reference — parameter (1)
  - type-reference — TypeReference (1)
  - type-reference — UnionType (1)
- References (5):
  - src/LLMProviders/brevilabsClient.ts:308 — `async pdf4llm(binaryContent: ArrayBuffer): Promise<Pdf4llmResponse> {`
  - src/LLMProviders/brevilabsClient.ts:312 — `const { data, error } = await this.makeRequest<Pdf4llmResponse>("/pdf4llm", {`
  - src/cache/pdfCache.ts:1 — `import { Pdf4llmResponse } from "@/LLMProviders/brevilabsClient";`
  - src/cache/pdfCache.ts:38 — `async get(file: TFile): Promise<Pdf4llmResponse \| null> {`
  - src/cache/pdfCache.ts:56 — `async set(file: TFile, response: Pdf4llmResponse): Promise<void> {`

### Url4llmResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:43

- Target: exact `Url4llmResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: tools
- Tags: remove
- Declaration: `export interface Url4llmResponse {`
- Usage Summary:
  - import — specifier (1)
  - type-reference — CallExpression (1)
  - type-reference — IntersectionType (1)
  - type-reference — TypeReference (1)
- References (4):
  - src/LLMProviders/brevilabsClient.ts:296 — `async url4llm(url: string): Promise<Url4llmResponse> {`
  - src/LLMProviders/brevilabsClient.ts:297 — `const { data, error } = await this.makeRequest<Url4llmResponse>("/url4llm", { url });`
  - src/mentions/Mention.ts:2 — `import { BrevilabsClient, Url4llmResponse } from "@/LLMProviders/brevilabsClient";`
  - src/mentions/Mention.ts:45 — `async processUrl(url: string): Promise<Url4llmResponse & { error?: string }> {`

### BrocaResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:9

- Target: exact `BrocaResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: tools
- Tags: remove
- Declaration: `export interface BrocaResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:265 — `async broca(userMessage: string, isProjectMode: boolean): Promise<BrocaResponse> {`
  - src/LLMProviders/brevilabsClient.ts:266 — `const { data, error } = await this.makeRequest<BrocaResponse>("/broca", {`

### RerankResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:23

- Target: exact `RerankResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: tools
- Tags: remove
- Declaration: `export interface RerankResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:280 — `async rerank(query: string, documents: string[]): Promise<RerankResponse> {`
  - src/LLMProviders/brevilabsClient.ts:281 — `const { data, error } = await this.makeRequest<RerankResponse>("/rerank", {`

### WebSearchResponse (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:58

- Target: exact `WebSearchResponse` from `src/LLMProviders/brevilabsClient.ts`
- Category: tools
- Tags: remove
- Declaration: `export interface WebSearchResponse {`
- Usage Summary:
  - type-reference — CallExpression (1)
  - type-reference — TypeReference (1)
- References (2):
  - src/LLMProviders/brevilabsClient.ts:396 — `async webSearch(query: string): Promise<WebSearchResponse> {`
  - src/LLMProviders/brevilabsClient.ts:397 — `const { data, error } = await this.makeRequest<WebSearchResponse>("/websearch", { query });`

### ToolCall (InterfaceDeclaration) — src/LLMProviders/brevilabsClient.ts:38

- Target: exact `ToolCall` from `src/LLMProviders/brevilabsClient.ts`
- Category: tools
- Tags: remove
- Declaration: `export interface ToolCall {`
- References (0):
  - None

## Pattern Matches

- src/aiParams.ts:233 — `return getChainType() === ChainType.PROJECT\_CHAIN;` (match: `ChainType.PROJECT\_CHAIN`)
- src/chainFactory.ts:59 — `COPILOT\_PLUS\_CHAIN = "copilot\_plus",` (match: `PLUS\_`)
- src/commands/index.ts:18 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/commands/index.ts:431 — `// Add command to download YouTube script (Copilot Plus only)` (match: `Copilot Plus`)
- src/commands/index.ts:433 — `const isPlusUser = await checkIsPlusUser();` (match: `isPlus`)
- src/commands/index.ts:433 — `const isPlusUser = await checkIsPlusUser();` (match: `IsPlus`)
- src/commands/index.ts:434 — `if (!isPlusUser) {` (match: `isPlus`)
- src/commands/index.ts:435 — `new Notice("Download YouTube Script (plus) is a Copilot Plus feature");` (match: `Copilot Plus`)
- src/components/chat-components/AtMentionTypeahead.tsx:16 — `isCopilotPlus?: boolean;` (match: `CopilotPlus`)
- src/components/chat-components/AtMentionTypeahead.tsx:33 — `isCopilotPlus = false,` (match: `CopilotPlus`)
- src/components/chat-components/AtMentionTypeahead.tsx:45 — `const availableCategoryOptions = useAtMentionCategories(isCopilotPlus);` (match: `CopilotPlus`)
- src/components/chat-components/AtMentionTypeahead.tsx:52 — `isCopilotPlus,` (match: `CopilotPlus`)
- src/components/chat-components/ChatContextMenu.tsx:17 — `import { isPlusChain } from "@/utils";` (match: `isPlus`)
- src/components/chat-components/ChatContextMenu.tsx:81 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `CopilotPlus`)
- src/components/chat-components/ChatContextMenu.tsx:81 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `isPlus`)
- src/components/chat-components/ChatContextMenu.tsx:148 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/ChatContextMenu.tsx:148 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/ChatContextMenu.tsx:187 — `{currentChain === ChainType.PROJECT\_CHAIN && (` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:9 — `import { PLUS\_UTM\_MEDIUMS } from "@/constants";` (match: `PLUS\_`)
- src/components/chat-components/ChatControls.tsx:11 — `import { navigateToPlusPage, useIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/components/chat-components/ChatControls.tsx:200 — `const isPlusUser = useIsPlusUser();` (match: `isPlus`)
- src/components/chat-components/ChatControls.tsx:200 — `const isPlusUser = useIsPlusUser();` (match: `IsPlus`)
- src/components/chat-components/ChatControls.tsx:205 — `if (chainType !== ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:219 — `{selectedChain === ChainType.COPILOT\_PLUS\_CHAIN && (` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:222 — `copilot plus` (match: `copilot plus`)
- src/components/chat-components/ChatControls.tsx:225 — `{selectedChain === ChainType.PROJECT\_CHAIN && "projects (alpha)"}` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:244 — `{isPlusUser ? (` (match: `isPlus`)
- src/components/chat-components/ChatControls.tsx:247 — `handleModeChange(ChainType.COPILOT\_PLUS\_CHAIN);` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:252 — `copilot plus` (match: `copilot plus`)
- src/components/chat-components/ChatControls.tsx:258 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.CHAT\_MODE\_SELECT);` (match: `PLUS\_`)
- src/components/chat-components/ChatControls.tsx:262 — `copilot plus` (match: `copilot plus`)
- src/components/chat-components/ChatControls.tsx:267 — `{isPlusUser ? (` (match: `isPlus`)
- src/components/chat-components/ChatControls.tsx:271 — `handleModeChange(ChainType.PROJECT\_CHAIN);` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatControls.tsx:280 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.CHAT\_MODE\_SELECT);` (match: `PLUS\_`)
- src/components/chat-components/ChatControls.tsx:284 — `copilot plus` (match: `copilot plus`)
- src/components/chat-components/ChatControls.tsx:363 — `{selectedChain === ChainType.PROJECT\_CHAIN ? (` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatInput.tsx:15 — `import { isPlusChain } from "@/utils";` (match: `isPlus`)
- src/components/chat-components/ChatInput.tsx:115 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:115 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `isPlus`)
- src/components/chat-components/ChatInput.tsx:133 — `if (currentChain === ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatInput.tsx:143 — `if (currentChain === ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatInput.tsx:171 — `currentChain === ChainType.PROJECT\_CHAIN &&` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatInput.tsx:190 — `if (!isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:250 — `if (!isCopilotPlus \|\| autonomousAgentToggle) return;` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:271 — `if (!isCopilotPlus \|\| autonomousAgentToggle) return;` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:281 — `}, [toolsFromPills, isCopilotPlus, autonomousAgentToggle]);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:465 — `if (isPlusChain(currentChain)) {` (match: `isPlus`)
- src/components/chat-components/ChatInput.tsx:561 — `if (lexicalEditorRef.current && isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:566 — `}, [isCopilotPlus]);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:569 — `if (lexicalEditorRef.current && isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:575 — `}, [isCopilotPlus]);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:578 — `if (lexicalEditorRef.current && isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:583 — `}, [isCopilotPlus]);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:596 — `if (isCopilotPlus && !autonomousAgentToggle && !vaultToggle) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:600 — `}, [isCopilotPlus, autonomousAgentToggle, vaultToggle]);` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:658 — `onURLsChange={isCopilotPlus ? setUrlsFromPills : undefined}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:659 — `onURLsRemoved={isCopilotPlus ? handleURLPillsRemoved : undefined}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:660 — `onToolsChange={isCopilotPlus ? setToolsFromPills : undefined}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:661 — `onToolsRemoved={isCopilotPlus ? handleToolPillsRemoved : undefined}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:669 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:669 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/ChatInput.tsx:698 — `if (currentChain !== ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatToolControls.tsx:14 — `import { isPlusChain } from "@/utils";` (match: `isPlus`)
- src/components/chat-components/ChatToolControls.tsx:50 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `CopilotPlus`)
- src/components/chat-components/ChatToolControls.tsx:50 — `const isCopilotPlus = isPlusChain(currentChain);` (match: `isPlus`)
- src/components/chat-components/ChatToolControls.tsx:51 — `const showAutonomousAgent = isCopilotPlus && currentChain !== ChainType.PROJECT\_CHAIN;` (match: `CopilotPlus`)
- src/components/chat-components/ChatToolControls.tsx:51 — `const showAutonomousAgent = isCopilotPlus && currentChain !== ChainType.PROJECT\_CHAIN;` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/ChatToolControls.tsx:86 — `// If not Copilot Plus, don't show any tools` (match: `Copilot Plus`)
- src/components/chat-components/ChatToolControls.tsx:87 — `if (!isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/ChatToolControls.tsx:95 — `{/\* Autonomous Agent button - only show in Copilot Plus mode and NOT in Projects mode \*/}` (match: `Copilot Plus`)
- src/components/chat-components/ChatToolControls.tsx:186 — `{/\* Autonomous Agent option - only show in Copilot Plus mode and NOT in Projects mode \*/}` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useAllNotes.ts:9 — `\* Includes PDF files when in Copilot Plus mode.` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useAllNotes.ts:18 — `\* @param isCopilotPlus - Whether to include PDF files (Plus feature)` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAllNotes.ts:21 — `export function useAllNotes(isCopilotPlus: boolean = false): TFile[] {` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAllNotes.ts:27 — `if (isCopilotPlus) {` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAllNotes.ts:37 — `}, [allNotes, isCopilotPlus]);` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:43 — `\* Hook that provides available @ mention categories based on Copilot Plus status.` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:46 — `\* @param isCopilotPlus - Whether Copilot Plus features are enabled` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:46 — `\* @param isCopilotPlus - Whether Copilot Plus features are enabled` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:49 — `export function useAtMentionCategories(isCopilotPlus: boolean = false): CategoryOption[] {` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:50 — `// Filter category options based on Copilot Plus status` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:54 — `return isCopilotPlus;` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionCategories.tsx:58 — `}, [isCopilotPlus]);` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionSearch.ts:22 — `isCopilotPlus: boolean,` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionSearch.ts:27 — `const allNotes = useAllNotes(isCopilotPlus);` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionSearch.ts:48 — `isCopilotPlus` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useAtMentionSearch.ts:59 — `[isCopilotPlus]` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useNoteSearch.ts:35 — `\* @param isCopilotPlus - Whether Copilot Plus features are enabled (includes PDFs)` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useNoteSearch.ts:35 — `\* @param isCopilotPlus - Whether Copilot Plus features are enabled (includes PDFs)` (match: `Copilot Plus`)
- src/components/chat-components/hooks/useNoteSearch.ts:42 — `isCopilotPlus: boolean = false,` (match: `CopilotPlus`)
- src/components/chat-components/hooks/useNoteSearch.ts:47 — `const allNotes = useAllNotes(isCopilotPlus);` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:55 — `isCopilotPlus?: boolean;` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:80 — `isCopilotPlus = false,` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:181 — `<NoteCommandPlugin isCopilotPlus={isCopilotPlus} currentActiveFile={currentActiveFile} />` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:181 — `<NoteCommandPlugin isCopilotPlus={isCopilotPlus} currentActiveFile={currentActiveFile} />` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:186 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/LexicalEditor.tsx:186 — `isCopilotPlus={isCopilotPlus}` (match: `CopilotPlus`)
- src/components/chat-components/plugins/AtMentionCommandPlugin.tsx:19 — `isCopilotPlus?: boolean;` (match: `CopilotPlus`)
- src/components/chat-components/plugins/AtMentionCommandPlugin.tsx:24 — `isCopilotPlus = false,` (match: `CopilotPlus`)
- src/components/chat-components/plugins/AtMentionCommandPlugin.tsx:39 — `const availableCategoryOptions = useAtMentionCategories(isCopilotPlus);` (match: `CopilotPlus`)
- src/components/chat-components/plugins/AtMentionCommandPlugin.tsx:71 — `isCopilotPlus,` (match: `CopilotPlus`)
- src/components/chat-components/plugins/NoteCommandPlugin.tsx:17 — `isCopilotPlus?: boolean;` (match: `CopilotPlus`)
- src/components/chat-components/plugins/NoteCommandPlugin.tsx:22 — `isCopilotPlus = false,` (match: `CopilotPlus`)
- src/components/chat-components/plugins/NoteCommandPlugin.tsx:57 — `const searchResults = useNoteSearch(currentQuery, isCopilotPlus, {}, currentActiveFile);` (match: `CopilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:51 — `copilotPlus: {` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:52 — `title: "Copilot Plus",` (match: `Copilot Plus`)
- src/components/chat-components/SuggestedPrompts.tsx:68 — `[ChainType.COPILOT\_PLUS\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/chat-components/SuggestedPrompts.tsx:68 — `[ChainType.COPILOT\_PLUS\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:68 — `[ChainType.COPILOT\_PLUS\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:68 — `[ChainType.COPILOT\_PLUS\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:69 — `[ChainType.PROJECT\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/chat-components/SuggestedPrompts.tsx:69 — `[ChainType.PROJECT\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:69 — `[ChainType.PROJECT\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/chat-components/SuggestedPrompts.tsx:69 — `[ChainType.PROJECT\_CHAIN]: ["copilotPlus", "copilotPlus", "copilotPlus"],` (match: `copilotPlus`)
- src/components/Chat.tsx:36 — `import { useIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/components/Chat.tsx:41 — `import { err2String, isPlusChain } from "@/utils";` (match: `isPlus`)
- src/components/Chat.tsx:130 — `if (selectedChain !== ChainType.PROJECT\_CHAIN) return false;` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:155 — `const isPlusUser = useIsPlusUser();` (match: `isPlus`)
- src/components/Chat.tsx:155 — `const isPlusUser = useIsPlusUser();` (match: `IsPlus`)
- src/components/Chat.tsx:178 — `if (hasUrlsInContext && !isPlusChain(currentChain)) {` (match: `isPlus`)
- src/components/Chat.tsx:224 — `urls: isPlusChain(currentChain) ? urls \|\| [] : [],` (match: `isPlus`)
- src/components/Chat.tsx:590 — `if (selectedChain === ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:689 — `if (selectedChain === ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:714 — `showHelperComponents={selectedChain !== ChainType.PROJECT\_CHAIN}` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:747 — `if (newMode === ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:772 — `disableModelSwitch={selectedChain === ChainType.PROJECT\_CHAIN}` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:789 — `{selectedChain === ChainType.PROJECT\_CHAIN && (` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:790 — `<div className={\`${selectedChain === ChainType.PROJECT_CHAIN ? "tw-z-modal" : ""}\`}>`(match:`ChainType.PROJECT_CHAIN`)
- src/components/Chat.tsx:805 — `isPlusUser ? ChainType.COPILOT\_PLUS\_CHAIN : ChainType.LLM\_CHAIN` (match: `isPlus`)
- src/components/Chat.tsx:805 — `isPlusUser ? ChainType.COPILOT\_PLUS\_CHAIN : ChainType.LLM\_CHAIN` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/Chat.tsx:816 — `{(selectedChain !== ChainType.PROJECT\_CHAIN \|\|` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/Chat.tsx:817 — `(selectedChain === ChainType.PROJECT\_CHAIN && showChatUI)) &&` (match: `ChainType.PROJECT\_CHAIN`)
- src/components/modals/AddContextNoteModal.tsx:24 — `chainType = ChainType.COPILOT\_PLUS\_CHAIN,` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/modals/BaseNoteModal.tsx:10 — `constructor(app: App, chainType: ChainType = ChainType.COPILOT\_PLUS\_CHAIN) {` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/components/modals/CopilotPlusExpiredModal.tsx:6 — `import { isPlusModel, navigateToPlusPage } from "@/plusUtils";` (match: `isPlus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:7 — `import { PLUS\_UTM\_MEDIUMS } from "@/constants";` (match: `PLUS\_`)
- src/components/modals/CopilotPlusExpiredModal.tsx:11 — `function CopilotPlusExpiredModalContent({ onCancel }: { onCancel: () => void }) {` (match: `CopilotPlus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:14 — `isPlusModel(settings.defaultModelKey) && isPlusModel(settings.embeddingModelKey);` (match: `isPlus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:14 — `isPlusModel(settings.defaultModelKey) && isPlusModel(settings.embeddingModelKey);` (match: `isPlus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:20 — `Your Copilot Plus license key is no longer valid. Please renew your subscription to` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:21 — `continue using Copilot Plus.` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:25 — `The Copilot Plus exclusive models will stop working. You can switch to the default` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:37 — `navigateToPlusPage(PLUS\_UTM\_MEDIUMS.EXPIRED\_MODAL);` (match: `PLUS\_`)
- src/components/modals/CopilotPlusExpiredModal.tsx:47 — `export class CopilotPlusExpiredModal extends Modal {` (match: `CopilotPlus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:54 — `this.setTitle("Thanks for being a Copilot Plus user 👋");` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusExpiredModal.tsx:65 — `this.root.render(<CopilotPlusExpiredModalContent onCancel={handleCancel} />);` (match: `CopilotPlus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:7 — `DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL,` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:8 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL,` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:9 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY,` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:15 — `function CopilotPlusWelcomeModalContent({` (match: `CopilotPlus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:27 — `Thanks for purchasing <b>Copilot Plus</b>! You have unlocked the full power of Copilot,` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:32 — `Would you like to apply the Copilot Plus settings now? You can always change this later in` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:37 — `Default mode: <b className="tw-text-accent">Copilot Plus</b>` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:40 — `Chat model: <b className="tw-text-accent">{DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL}</b>` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:45 — `<b className="tw-text-accent">{DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL}</b>` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:47 — `{settings.embeddingModelKey !== DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY && (` (match: `PLUS\_`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:68 — `export class CopilotPlusWelcomeModal extends Modal {` (match: `CopilotPlus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:75 — `this.setTitle("Welcome to Copilot Plus 🚀");` (match: `Copilot Plus`)
- src/components/modals/CopilotPlusWelcomeModal.tsx:92 — `<CopilotPlusWelcomeModalContent onConfirm={handleConfirm} onCancel={handleCancel} />` (match: `CopilotPlus`)
- src/constants.ts:122 — `export const PLUS\_UTM\_MEDIUMS = {` (match: `PLUS\_`)
- src/constants.ts:128 — `export type PlusUtmMedium = (typeof PLUS\_UTM\_MEDIUMS)[keyof typeof PLUS\_UTM\_MEDIUMS];` (match: `PlusUtm`)
- src/constants.ts:128 — `export type PlusUtmMedium = (typeof PLUS\_UTM\_MEDIUMS)[keyof typeof PLUS\_UTM\_MEDIUMS];` (match: `PLUS\_`)
- src/constants.ts:128 — `export type PlusUtmMedium = (typeof PLUS\_UTM\_MEDIUMS)[keyof typeof PLUS\_UTM\_MEDIUMS];` (match: `PLUS\_`)
- src/constants.ts:138 — `COPILOT\_PLUS\_FLASH = "copilot-plus-flash",` (match: `PLUS\_`)
- src/constants.ts:203 — `name: ChatModels.COPILOT\_PLUS\_FLASH,` (match: `PLUS\_`)
- src/constants.ts:394 — `COPILOT\_PLUS\_JINA = "copilot-plus-jina",` (match: `PLUS\_`)
- src/constants.ts:405 — `COPILOT\_PLUS\_SMALL = "copilot-plus-small",` (match: `PLUS\_`)
- src/constants.ts:406 — `COPILOT\_PLUS\_LARGE = "copilot-plus-large",` (match: `PLUS\_`)
- src/constants.ts:407 — `COPILOT\_PLUS\_MULTILINGUAL = "copilot-plus-multilingual",` (match: `PLUS\_`)
- src/constants.ts:412 — `name: EmbeddingModels.COPILOT\_PLUS\_SMALL,` (match: `PLUS\_`)
- src/constants.ts:421 — `name: EmbeddingModels.COPILOT\_PLUS\_LARGE,` (match: `PLUS\_`)
- src/constants.ts:422 — `provider: EmbeddingModelProviders.COPILOT\_PLUS\_JINA,` (match: `PLUS\_`)
- src/constants.ts:432 — `name: EmbeddingModels.COPILOT\_PLUS\_MULTILINGUAL,` (match: `PLUS\_`)
- src/constants.ts:433 — `provider: EmbeddingModelProviders.COPILOT\_PLUS\_JINA,` (match: `PLUS\_`)
- src/constants.ts:600 — `label: "Copilot Plus",` (match: `Copilot Plus`)
- src/constants.ts:605 — `[EmbeddingModelProviders.COPILOT\_PLUS\_JINA]: {` (match: `PLUS\_`)
- src/constants.ts:606 — `label: "Copilot Plus",` (match: `Copilot Plus`)
- src/constants.ts:623 — `"copilot-plus": "plusLicenseKey",` (match: `plusLicense`)
- src/constants.ts:711 — `"Non-markdown files are only available in Copilot Plus mode. Please upgrade to access this file type.",` (match: `Copilot Plus`)
- src/constants.ts:713 — `"URL processing is only available in Copilot Plus mode. URLs will not be processed for context.",` (match: `Copilot Plus`)
- src/constants.ts:720 — `isPlusUser: false,` (match: `isPlus`)
- src/constants.ts:721 — `plusLicenseKey: "",` (match: `plusLicense`)
- src/contextProcessor.dataview.test.ts:6 — `COPILOT\_PLUS\_CHAIN: "copilot\_plus",` (match: `PLUS\_`)
- src/contextProcessor.ts:5 — `import { isPlusChain } from "@/utils";` (match: `isPlus`)
- src/contextProcessor.ts:265 — `if (!isPlusChain(currentChain) && note.extension !== "md" && note.extension !== "canvas") {` (match: `isPlus`)
- src/contextProcessor.ts:268 — `\`File type ${note.extension} requires Copilot Plus mode for context processing.\``(match:`Copilot Plus`)
- src/contextProcessor.ts:281 — `if (isPlusChain(currentChain)) {` (match: `isPlus`)
- src/core/ChatManager.test.ts:15 — `COPILOT\_PLUS\_CHAIN: "copilot\_plus\_chain",` (match: `PLUS\_`)
- src/core/ChatManager.test.ts:15 — `COPILOT\_PLUS\_CHAIN: "copilot\_plus\_chain",` (match: `plus\_`)
- src/core/ContextManager.ts:64 — `// 2. Extract URLs and process them (for Copilot Plus chain)` (match: `Copilot Plus`)
- src/core/ContextManager.ts:70 — `chainType === ChainType.COPILOT\_PLUS\_CHAIN` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/core/ContextManager.ts:83 — `chainType !== ChainType.PROJECT\_CHAIN &&` (match: `ChainType.PROJECT\_CHAIN`)
- src/encryptionService.ts:44 — `(key) => key.toLowerCase().includes("apikey") \|\| key === "plusLicenseKey"` (match: `plusLicense`)
- src/hooks/useProjectContextStatus.ts:24 — `if (currentChain !== ChainType.PROJECT\_CHAIN) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/integration_tests/AgentPrompt.test.ts:30 — `jest.mock("@/components/modals/CopilotPlusExpiredModal", () => ({` (match: `CopilotPlus`)
- src/integration_tests/AgentPrompt.test.ts:31 — `CopilotPlusExpiredModal: class CopilotPlusExpiredModal {` (match: `CopilotPlus`)
- src/integration_tests/AgentPrompt.test.ts:31 — `CopilotPlusExpiredModal: class CopilotPlusExpiredModal {` (match: `CopilotPlus`)
- src/integration_tests/AgentPrompt.test.ts:80 — `COPILOT\_PLUS\_CHAIN: "copilot\_plus",` (match: `PLUS\_`)
- src/LLMProviders/brevilabsClient.ts:110 — `if (!getSettings().plusLicenseKey) {` (match: `plusLicense`)
- src/LLMProviders/brevilabsClient.ts:112 — `"Copilot Plus license key not found. Please enter your license key in the settings."` (match: `Copilot Plus`)
- src/LLMProviders/brevilabsClient.ts:147 — `Authorization: \`Bearer ${await getDecryptedKey(getSettings().plusLicenseKey)}\`,`(match:`plusLicense`)
- src/LLMProviders/brevilabsClient.ts:188 — `Authorization: \`Bearer ${await getDecryptedKey(getSettings().plusLicenseKey)}\`,`(match:`plusLicense`)
- src/LLMProviders/brevilabsClient.ts:213 — `\* Validate the license key and update the isPlusUser setting.` (match: `isPlus`)
- src/LLMProviders/brevilabsClient.ts:223 — `license\_key: await getDecryptedKey(getSettings().plusLicenseKey),` (match: `plusLicense`)
- src/LLMProviders/chainManager.ts:13 — `CopilotPlusChainRunner,` (match: `CopilotPlus`)
- src/LLMProviders/chainManager.ts:119 — `if (chainType === ChainType.PROJECT\_CHAIN && !currentProject) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainManager.ts:124 — `chainType === ChainType.PROJECT\_CHAIN ? currentProject?.projectModelKey : getModelKey();` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainManager.ts:142 — `if (chainType === ChainType.PROJECT\_CHAIN && !customModel.projectEnabled) {` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainManager.ts:248 — `case ChainType.COPILOT\_PLUS\_CHAIN: {` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/LLMProviders/chainManager.ts:258 — `setChainType(ChainType.COPILOT\_PLUS\_CHAIN);` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/LLMProviders/chainManager.ts:262 — `case ChainType.PROJECT\_CHAIN: {` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainManager.ts:271 — `setChainType(ChainType.PROJECT\_CHAIN);` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainManager.ts:290 — `case ChainType.COPILOT\_PLUS\_CHAIN:` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/LLMProviders/chainManager.ts:295 — `return new CopilotPlusChainRunner(this);` (match: `CopilotPlus`)
- src/LLMProviders/chainManager.ts:296 — `case ChainType.PROJECT\_CHAIN:` (match: `ChainType.PROJECT\_CHAIN`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:4 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:14 — `import { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:14 — `import { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:113 — `export class AutonomousAgentChainRunner extends CopilotPlusChainRunner {` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:254 — `const isPlusUser = await checkIsPlusUser({` (match: `isPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:254 — `const isPlusUser = await checkIsPlusUser({` (match: `IsPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:257 — `if (!isPlusUser) {` (match: `isPlus`)
- src/LLMProviders/chainRunner/AutonomousAgentChainRunner.ts:288 — `const fallbackRunner = new CopilotPlusChainRunner(this.chainManager);` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/BaseChainRunner.ts:138 — `errorMessage = "Invalid Copilot Plus license key. Please check your license key in settings.";` (match: `Copilot Plus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:17 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:54 — `export class CopilotPlusChainRunner extends BaseChainRunner {` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:349 — `logInfo("CopilotPlus multimodal stream iteration aborted", {` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:385 — `const isPlusUser = await checkIsPlusUser({` (match: `isPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:385 — `const isPlusUser = await checkIsPlusUser({` (match: `IsPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:386 — `isCopilotPlus: true,` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:388 — `if (!isPlusUser) {` (match: `isPlus`)
- src/LLMProviders/chainRunner/CopilotPlusChainRunner.ts:495 — `logInfo("CopilotPlus stream aborted by user", { reason: abortController.signal.reason });` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/index.ts:6 — `export { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/index.ts:6 — `export { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/ProjectChainRunner.ts:4 — `import { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/ProjectChainRunner.ts:4 — `import { CopilotPlusChainRunner } from "./CopilotPlusChainRunner";` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/ProjectChainRunner.ts:6 — `export class ProjectChainRunner extends CopilotPlusChainRunner {` (match: `CopilotPlus`)
- src/LLMProviders/chainRunner/utils/modelAdapter.ts:865 — `// Copilot Plus models` (match: `Copilot Plus`)
- src/LLMProviders/chainRunner/utils/modelAdapter.ts:867 — `logInfo("Using BaseModelAdapter for Copilot Plus");` (match: `Copilot Plus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:7 — `checkIsPlusUser: jest.fn(),` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:22 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:26 — `const mockCheckIsPlusUser = checkIsPlusUser as jest.MockedFunction<typeof checkIsPlusUser>;` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:26 — `const mockCheckIsPlusUser = checkIsPlusUser as jest.MockedFunction<typeof checkIsPlusUser>;` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:26 — `const mockCheckIsPlusUser = checkIsPlusUser as jest.MockedFunction<typeof checkIsPlusUser>;` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:34 — `it("should execute tools without isPlusOnly flag", async () => {` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:54 — `expect(mockCheckIsPlusUser).not.toHaveBeenCalled();` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:63 — `isPlusOnly: true,` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:66 — `mockCheckIsPlusUser.mockResolvedValueOnce(false);` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:72 — `result: "Error: plusTool requires a Copilot Plus subscription",` (match: `Copilot Plus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:84 — `isPlusOnly: true,` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:87 — `mockCheckIsPlusUser.mockResolvedValueOnce(true);` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.test.ts:97 — `expect(mockCheckIsPlusUser).toHaveBeenCalled();` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:2 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:52 — `if (tool.isPlusOnly) {` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:53 — `const isPlusUser = await checkIsPlusUser();` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:53 — `const isPlusUser = await checkIsPlusUser();` (match: `IsPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:54 — `if (!isPlusUser) {` (match: `isPlus`)
- src/LLMProviders/chainRunner/utils/toolExecution.ts:57 — `result: \`Error: ${getToolDisplayName(toolCall.name)} requires a Copilot Plus subscription\`,`(match:`Copilot Plus`)
- src/LLMProviders/chatModelManager.ts:83 — `[ChatModelProviders.COPILOT\_PLUS]: () => getSettings().plusLicenseKey,` (match: `plusLicense`)
- src/LLMProviders/chatModelManager.ts:285 — `apiKey: await getDecryptedKey(settings.plusLicenseKey),` (match: `plusLicense`)
- src/LLMProviders/embeddingManager.ts:22 — `[EmbeddingModelProviders.COPILOT\_PLUS\_JINA]: CustomJinaEmbeddings,` (match: `PLUS\_`)
- src/LLMProviders/embeddingManager.ts:48 — `[EmbeddingModelProviders.COPILOT\_PLUS]: () => getSettings().plusLicenseKey,` (match: `plusLicense`)
- src/LLMProviders/embeddingManager.ts:49 — `[EmbeddingModelProviders.COPILOT\_PLUS\_JINA]: () => getSettings().plusLicenseKey,` (match: `PLUS\_`)
- src/LLMProviders/embeddingManager.ts:49 — `[EmbeddingModelProviders.COPILOT\_PLUS\_JINA]: () => getSettings().plusLicenseKey,` (match: `plusLicense`)
- src/LLMProviders/embeddingManager.ts:146 — `if (customModel.plusExclusive && !getSettings().isPlusUser) {` (match: `isPlus`)
- src/LLMProviders/embeddingManager.ts:209 — `apiKey: await getDecryptedKey(settings.plusLicenseKey),` (match: `plusLicense`)
- src/LLMProviders/embeddingManager.ts:217 — `[EmbeddingModelProviders.COPILOT\_PLUS\_JINA]: {` (match: `PLUS\_`)
- src/LLMProviders/embeddingManager.ts:219 — `apiKey: await getDecryptedKey(settings.plusLicenseKey),` (match: `plusLicense`)
- src/LLMProviders/intentAnalyzer.ts:88 — `throw error; // Re-throw the error to be caught by CopilotPlusChainRunner` (match: `CopilotPlus`)
- src/LLMProviders/projectManager.ts:67 — `getChainType() === ChainType.COPILOT\_PLUS\_CHAIN);` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/main.ts:22 — `import { checkIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/main.ts:84 — `checkIsPlusUser();` (match: `IsPlus`)
- src/plusUtils.ts:3 — `import { CopilotPlusExpiredModal } from "@/components/modals/CopilotPlusExpiredModal";` (match: `CopilotPlus`)
- src/plusUtils.ts:3 — `import { CopilotPlusExpiredModal } from "@/components/modals/CopilotPlusExpiredModal";` (match: `CopilotPlus`)
- src/plusUtils.ts:10 — `PlusUtmMedium,` (match: `PlusUtm`)
- src/plusUtils.ts:17 — `export const DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL = ChatModels.COPILOT\_PLUS\_FLASH;` (match: `PLUS\_`)
- src/plusUtils.ts:17 — `export const DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL = ChatModels.COPILOT\_PLUS\_FLASH;` (match: `PLUS\_`)
- src/plusUtils.ts:18 — `export const DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL\_KEY =` (match: `PLUS\_`)
- src/plusUtils.ts:19 — `DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL + "\|" + ChatModelProviders.COPILOT\_PLUS;` (match: `PLUS\_`)
- src/plusUtils.ts:20 — `export const DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL = EmbeddingModels.COPILOT\_PLUS\_SMALL;` (match: `PLUS\_`)
- src/plusUtils.ts:20 — `export const DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL = EmbeddingModels.COPILOT\_PLUS\_SMALL;` (match: `PLUS\_`)
- src/plusUtils.ts:21 — `export const DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY =` (match: `PLUS\_`)
- src/plusUtils.ts:22 — `DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL + "\|" + EmbeddingModelProviders.COPILOT\_PLUS;` (match: `PLUS\_`)
- src/plusUtils.ts:28 — `/\*\* Check if the model key is a Copilot Plus model. \*/` (match: `Copilot Plus`)
- src/plusUtils.ts:29 — `export function isPlusModel(modelKey: string): boolean {` (match: `isPlus`)
- src/plusUtils.ts:33 — `/\*\* Hook to get the isPlusUser setting. \*/` (match: `isPlus`)
- src/plusUtils.ts:34 — `export function useIsPlusUser(): boolean \| undefined {` (match: `IsPlus`)
- src/plusUtils.ts:36 — `return settings.isPlusUser;` (match: `isPlus`)
- src/plusUtils.ts:40 — `export async function checkIsPlusUser(context?: Record<string, any>): Promise<boolean \| undefined> {` (match: `IsPlus`)
- src/plusUtils.ts:41 — `if (!getSettings().plusLicenseKey) {` (match: `plusLicense`)
- src/plusUtils.ts:52 — `if (!getSettings().plusLicenseKey) {` (match: `plusLicense`)
- src/plusUtils.ts:61 — `\* Apply the Copilot Plus settings.` (match: `Copilot Plus`)
- src/plusUtils.ts:66 — `const defaultModelKey = DEFAULT\_COPILOT\_PLUS\_CHAT\_MODEL\_KEY;` (match: `PLUS\_`)
- src/plusUtils.ts:67 — `const embeddingModelKey = DEFAULT\_COPILOT\_PLUS\_EMBEDDING\_MODEL\_KEY;` (match: `PLUS\_`)
- src/plusUtils.ts:77 — `setChainType(ChainType.COPILOT\_PLUS\_CHAIN);` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/plusUtils.ts:81 — `defaultChainType: ChainType.COPILOT\_PLUS\_CHAIN,` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/plusUtils.ts:102 — `export function createPlusPageUrl(medium: PlusUtmMedium): string {` (match: `PlusUtm`)
- src/plusUtils.ts:106 — `export function navigateToPlusPage(medium: PlusUtmMedium): void {` (match: `PlusUtm`)
- src/plusUtils.ts:111 — `updateSetting("isPlusUser", true);` (match: `isPlus`)
- src/plusUtils.ts:116 — `\* IMPORTANT: This is called on every plugin start for users without a Plus license key (see checkIsPlusUser).` (match: `IsPlus`)
- src/plusUtils.ts:118 — `\* Only update the isPlusUser flag.` (match: `isPlus`)
- src/plusUtils.ts:121 — `const previousIsPlusUser = getSettings().isPlusUser;` (match: `IsPlus`)
- src/plusUtils.ts:121 — `const previousIsPlusUser = getSettings().isPlusUser;` (match: `isPlus`)
- src/plusUtils.ts:122 — `updateSetting("isPlusUser", false);` (match: `isPlus`)
- src/plusUtils.ts:123 — `if (previousIsPlusUser) {` (match: `IsPlus`)
- src/plusUtils.ts:124 — `new CopilotPlusExpiredModal(app).open();` (match: `CopilotPlus`)
- src/search/indexEventHandler.ts:44 — `logInfo("Copilot Plus: Initializing semantic index event listeners");` (match: `Copilot Plus`)
- src/search/indexEventHandler.ts:80 — `if (currentChainType !== ChainType.COPILOT\_PLUS\_CHAIN) {` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/search/indexEventHandler.ts:127 — `console.log("Copilot Plus: Triggering reindex for file ", file.path);` (match: `Copilot Plus`)
- src/settings/model.ts:51 — `plusLicenseKey: string;` (match: `plusLicense`)
- src/settings/model.ts:136 — `isPlusUser: boolean \| undefined;` (match: `isPlus`)
- src/settings/v2/components/BasicSettings.tsx:7 — `import { DEFAULT\_OPEN\_AREA, PLUS\_UTM\_MEDIUMS } from "@/constants";` (match: `PLUS\_`)
- src/settings/v2/components/BasicSettings.tsx:21 — `[ChainType.COPILOT\_PLUS\_CHAIN]: "Copilot Plus",` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/settings/v2/components/BasicSettings.tsx:21 — `[ChainType.COPILOT\_PLUS\_CHAIN]: "Copilot Plus",` (match: `Copilot Plus`)
- src/settings/v2/components/BasicSettings.tsx:22 — `[ChainType.PROJECT\_CHAIN]: "Projects (alpha)",` (match: `ChainType.PROJECT\_CHAIN`)
- src/settings/v2/components/BasicSettings.tsx:198 — `<strong>Copilot Plus:</strong> Covers all features of the 2 free modes,` (match: `Copilot Plus`)
- src/settings/v2/components/BasicSettings.tsx:202 — `href={createPlusPageUrl(PLUS\_UTM\_MEDIUMS.MODE\_SELECT\_TOOLTIP)}` (match: `PLUS\_`)
- src/settings/v2/components/CopilotPlusSettings.tsx:7 — `export const CopilotPlusSettings: React.FC = () => {` (match: `CopilotPlus`)
- src/settings/v2/components/ModelAddDialog.tsx:462 — `? omit(EmbeddingModelProviders, ["COPILOT\_PLUS", "COPILOT\_PLUS\_JINA"])` (match: `PLUS\_`)
- src/settings/v2/components/PlusSettings.tsx:1 — `import { CopilotPlusWelcomeModal } from "@/components/modals/CopilotPlusWelcomeModal";` (match: `CopilotPlus`)
- src/settings/v2/components/PlusSettings.tsx:1 — `import { CopilotPlusWelcomeModal } from "@/components/modals/CopilotPlusWelcomeModal";` (match: `CopilotPlus`)
- src/settings/v2/components/PlusSettings.tsx:5 — `import { PLUS\_UTM\_MEDIUMS } from "@/constants";` (match: `PLUS\_`)
- src/settings/v2/components/PlusSettings.tsx:6 — `import { checkIsPlusUser, navigateToPlusPage, useIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/settings/v2/components/PlusSettings.tsx:6 — `import { checkIsPlusUser, navigateToPlusPage, useIsPlusUser } from "@/plusUtils";` (match: `IsPlus`)
- src/settings/v2/components/PlusSettings.tsx:15 — `const isPlusUser = useIsPlusUser();` (match: `isPlus`)
- src/settings/v2/components/PlusSettings.tsx:15 — `const isPlusUser = useIsPlusUser();` (match: `IsPlus`)
- src/settings/v2/components/PlusSettings.tsx:16 — `const [localLicenseKey, setLocalLicenseKey] = useState(settings.plusLicenseKey);` (match: `plusLicense`)
- src/settings/v2/components/PlusSettings.tsx:18 — `setLocalLicenseKey(settings.plusLicenseKey);` (match: `plusLicense`)
- src/settings/v2/components/PlusSettings.tsx:19 — `}, [settings.plusLicenseKey]);` (match: `plusLicense`)
- src/settings/v2/components/PlusSettings.tsx:24 — `<span>Copilot Plus</span>` (match: `Copilot Plus`)
- src/settings/v2/components/PlusSettings.tsx:25 — `{isPlusUser && (` (match: `isPlus`)
- src/settings/v2/components/PlusSettings.tsx:33 — `Copilot Plus takes your Obsidian experience to the next level with cutting-edge AI` (match: `Copilot Plus`)
- src/settings/v2/components/PlusSettings.tsx:42 — `Copilot Plus is evolving fast, with new features and improvements rolling out regularly.` (match: `Copilot Plus`)
- src/settings/v2/components/PlusSettings.tsx:58 — `updateSetting("plusLicenseKey", localLicenseKey);` (match: `plusLicense`)
- src/settings/v2/components/PlusSettings.tsx:60 — `const result = await checkIsPlusUser();` (match: `IsPlus`)
- src/settings/v2/components/PlusSettings.tsx:66 — `new CopilotPlusWelcomeModal(app).open();` (match: `CopilotPlus`)
- src/settings/v2/components/PlusSettings.tsx:76 — `onClick={() => navigateToPlusPage(PLUS\_UTM\_MEDIUMS.SETTINGS)}` (match: `PLUS\_`)
- src/settings/v2/SettingsMainV2.tsx:13 — `import { CopilotPlusSettings } from "./components/CopilotPlusSettings";` (match: `CopilotPlus`)
- src/settings/v2/SettingsMainV2.tsx:13 — `import { CopilotPlusSettings } from "./components/CopilotPlusSettings";` (match: `CopilotPlus`)
- src/settings/v2/SettingsMainV2.tsx:36 — `plus: () => <CopilotPlusSettings />,` (match: `CopilotPlus`)
- src/tests/projectContextCache.test.ts:48 — `useIsPlusUser: jest.fn(),` (match: `IsPlus`)
- src/tools/SearchTools.ts:282 — `isPlusOnly: true,` (match: `isPlus`)
- src/tools/SimpleTool.ts:27 — `isPlusOnly?: boolean; // If true, tool requires Plus subscription` (match: `isPlus`)
- src/tools/SimpleTool.ts:42 — `isPlusOnly?: boolean;` (match: `isPlus`)
- src/tools/SimpleTool.ts:103 — `isPlusOnly: options.isPlusOnly,` (match: `isPlus`)
- src/tools/SimpleTool.ts:103 — `isPlusOnly: options.isPlusOnly,` (match: `isPlus`)
- src/tools/YoutubeTools.ts:17 — `isPlusOnly: true,` (match: `isPlus`)
- src/utils.ts:33 — `"Invalid Copilot Plus license key. Please check your license key in settings.",` (match: `Copilot Plus`)
- src/utils.ts:197 — `return ChainType.COPILOT\_PLUS\_CHAIN;` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/utils.ts:329 — `\* Checks if a chain type is a Plus mode chain (Copilot Plus or Project Chain).` (match: `Copilot Plus`)
- src/utils.ts:334 — `export function isPlusChain(chainType: ChainType): boolean {` (match: `isPlus`)
- src/utils.ts:335 — `return chainType === ChainType.COPILOT\_PLUS\_CHAIN \|\| chainType === ChainType.PROJECT\_CHAIN;` (match: `ChainType.COPILOT\_PLUS\_CHAIN`)
- src/utils.ts:335 — `return chainType === ChainType.COPILOT\_PLUS\_CHAIN \|\| chainType === ChainType.PROJECT\_CHAIN;` (match: `ChainType.PROJECT\_CHAIN`)
- src/utils.ts:357 — `return isPlusChain(chainType);` (match: `isPlus`)
- src/utils.ts:450 — `\* Note: For multimodal chains (CopilotPlus, AutonomousAgent), use` (match: `CopilotPlus`)
- src/utils.ts:795 — `return baseLabel + (model?.believerExclusive && baseLabel === "Copilot Plus" ? "(Believer)" : "");` (match: `Copilot Plus`)
- src/utils.ts:983 — `EmbeddingModelProviders.COPILOT\_PLUS\_JINA,` (match: `PLUS\_`)
