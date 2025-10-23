# References: src/LLMProviders/promptManager.ts

Generated: 2025-10-23T16:46:24.665Z

## Summary

- **Inbound References**: 5
- **Unique Files Using This**: 1
- **Inbound Symbols**: 3

- **Outbound References**: 31
- **Outbound Symbols**: 14
- **Note**: Standard library symbols excluded from outbound references

## Inbound References (Who Uses This)

### PromptManager

**3 references from 1 files**

- src/LLMProviders/chainManager.ts:31 — `import PromptManager from "./promptManager";` (import)
- src/LLMProviders/chainManager.ts:48 — `public promptManager: PromptManager;` (type-reference)
- src/LLMProviders/chainManager.ts:56 — `this.promptManager = PromptManager.getInstance();` (property-access)

### getInstance

**1 references from 1 files**

- src/LLMProviders/chainManager.ts:56 — `this.promptManager = PromptManager.getInstance();` (other)

### getChatPrompt

**1 references from 1 files**

- src/LLMProviders/chainManager.ts:191 — `const chatPrompt = this.promptManager.getChatPrompt();` (other)

## Outbound References (What This Uses)

### getSystemPrompt

**2 references**

- src/LLMProviders/promptManager.ts:1 — `import { getSystemPrompt, subscribeToSettingsChange } from "@/settings/model";` (import)
- src/LLMProviders/promptManager.ts:38 — `let systemPrompt = getSystemPrompt();` (function-call)

### subscribeToSettingsChange

**2 references**

- src/LLMProviders/promptManager.ts:1 — `import { getSystemPrompt, subscribeToSettingsChange } from "@/settings/model";` (import)
- src/LLMProviders/promptManager.ts:19 — `subscribeToSettingsChange(() => {` (function-call)

### ChatPromptTemplate

**6 references**

- src/LLMProviders/promptManager.ts:3 — `ChatPromptTemplate,` (import)
- src/LLMProviders/promptManager.ts:12 — `private chatPrompt: ChatPromptTemplate;` (type-reference)
- src/LLMProviders/promptManager.ts:13 — `private qaPrompt: ChatPromptTemplate;` (type-reference)
- src/LLMProviders/promptManager.ts:48 — `this.chatPrompt = ChatPromptTemplate.fromMessages([` (property-access)
- src/LLMProviders/promptManager.ts:64 — `this.qaPrompt = ChatPromptTemplate.fromMessages([` (property-access)
- src/LLMProviders/promptManager.ts:74 — `getChatPrompt(): ChatPromptTemplate {` (type-reference)

### HumanMessagePromptTemplate

**2 references**

- src/LLMProviders/promptManager.ts:4 — `HumanMessagePromptTemplate,` (import)
- src/LLMProviders/promptManager.ts:51 — `HumanMessagePromptTemplate.fromTemplate("{input}"),` (property-access)

### MessagesPlaceholder

**1 references**

- src/LLMProviders/promptManager.ts:5 — `MessagesPlaceholder,` (import)

### SystemMessagePromptTemplate

**3 references**

- src/LLMProviders/promptManager.ts:6 — `SystemMessagePromptTemplate,` (import)
- src/LLMProviders/promptManager.ts:49 — `SystemMessagePromptTemplate.fromTemplate(escapedSystemMessage),` (property-access)
- src/LLMProviders/promptManager.ts:65 — `SystemMessagePromptTemplate.fromTemplate(qaTemplate),` (property-access)

### getCurrentProject

**2 references**

- src/LLMProviders/promptManager.ts:8 — `import { getCurrentProject, isProjectMode, subscribeToProjectChange } from "@/aiParams";` (import)
- src/LLMProviders/promptManager.ts:40 — `const currentProject = getCurrentProject();` (function-call)

### isProjectMode

**2 references**

- src/LLMProviders/promptManager.ts:8 — `import { getCurrentProject, isProjectMode, subscribeToProjectChange } from "@/aiParams";` (import)
- src/LLMProviders/promptManager.ts:41 — `if (currentProject && isProjectMode()) {` (function-call)

### subscribeToProjectChange

**2 references**

- src/LLMProviders/promptManager.ts:8 — `import { getCurrentProject, isProjectMode, subscribeToProjectChange } from "@/aiParams";` (import)
- src/LLMProviders/promptManager.ts:24 — `subscribeToProjectChange(() => {` (function-call)

### systemPrompt

**1 references**

- src/LLMProviders/promptManager.ts:42 — `systemPrompt = currentProject.systemPrompt;` (other)

### fromMessages

**2 references**

- src/LLMProviders/promptManager.ts:48 — `this.chatPrompt = ChatPromptTemplate.fromMessages([` (other)
- src/LLMProviders/promptManager.ts:64 — `this.qaPrompt = ChatPromptTemplate.fromMessages([` (other)

### fromTemplate

**3 references**

- src/LLMProviders/promptManager.ts:49 — `SystemMessagePromptTemplate.fromTemplate(escapedSystemMessage),` (other)
- src/LLMProviders/promptManager.ts:51 — `HumanMessagePromptTemplate.fromTemplate("{input}"),` (other)
- src/LLMProviders/promptManager.ts:65 — `SystemMessagePromptTemplate.fromTemplate(qaTemplate),` (other)

### replace

**2 references**

- src/LLMProviders/promptManager.ts:71 — `return str.replace(/\\{/g, "{{").replace(/\\}/g, "}}");` (other)
- src/LLMProviders/promptManager.ts:71 — `return str.replace(/\\{/g, "{{").replace(/\\}/g, "}}");` (other)

### format

**1 references**

- src/LLMProviders/promptManager.ts:87 — `const promptResult = await this.qaPrompt.format({` (other)
