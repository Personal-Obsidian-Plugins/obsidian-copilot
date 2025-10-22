#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { Project, SyntaxKind, Node } = require("ts-morph");

const DEFAULT_PATTERN =
  "copilot\\s*plus|plusLicense|isPlus|ChainType\\.COPILOT_PLUS_CHAIN|ChainType\\.PROJECT_CHAIN|CopilotPlus|PlusUtm|plusOnly|PlusChain|PLUS_";
const DEFAULT_PATTERN_FLAGS = "gi";

const DEFAULT_INCLUDE_GLOBS = [
  "src/**/*.ts",
  "src/**/*.tsx",
  "src/**/*.js",
  "src/**/*.jsx", // only concerned with src/
];

const DEFAULT_JSON_OUTPUT = path.join("analysis", "plus-reference-report.json");
const DEFAULT_MARKDOWN_OUTPUT = path.join("analysis", "plus-reference-report.md");
const DEFAULT_DECLARATIONS_TEXT_OUTPUT = path.join("analysis", "plus-declarations.txt");
const DEFAULT_DECLARATIONS_TARGETS_OUTPUT = path.join("analysis", "plus-declarations-targets.json");
const DEFAULT_DEPENDENCY_MAP_OUTPUT = path.join("analysis", "plus-dependency-map.json");
const DEFAULT_TSCONFIG = path.join(__dirname, "..", "tsconfig.json");

const REPO_ROOT = path.resolve(__dirname, "..");

const DECLARATION_KINDS = new Set([
  SyntaxKind.ClassDeclaration,
  SyntaxKind.FunctionDeclaration,
  SyntaxKind.VariableDeclaration,
  SyntaxKind.InterfaceDeclaration,
  SyntaxKind.TypeAliasDeclaration,
  SyntaxKind.EnumDeclaration,
]);

/**
 * @typedef {"exact" | "prefix"} MatchType
 */

/**
 * @typedef {Object} TargetEntry
 * @property {MatchType} type
 * @property {string} name
 * @property {string=} category
 * @property {string[]=} tags
 * @property {string=} note
 */

/**
 * @typedef {Object} TargetFile
 * @property {string} file
 * @property {string=} label
 * @property {TargetEntry[]} entries
 */

/**
 * @typedef {Object} ScriptOptions
 * @property {string} pattern
 * @property {string} patternFlags
 * @property {string} jsonOutput
 * @property {string} markdownOutput
 * @property {string} declarationsTextOutput
 * @property {string} declarationsTargetsOutput
 * @property {string} dependencyMapOutput
 * @property {string} tsconfigPath
 * @property {string[]=} includeGlobs
 * @property {string[]=} extraPatternGlobs
 * @property {string[]=} rawArgs
 * @property {TargetFile[]=} additionalTargets
 */

/**
 * @typedef {Object} LocationInfo
 * @property {string} file
 * @property {number} line
 * @property {number} column
 */

/**
 * @typedef {Object} ReferenceInfo
 * @property {LocationInfo} location
 * @property {string} text
 * @property {ReferenceUsage} usage
 */

/**
 * @typedef {Object} SymbolReferenceReport
 * @property {Object} target
 * @property {MatchType} target.matchType
 * @property {string} target.request
 * @property {string} target.file
 * @property {string=} target.category
 * @property {string[]=} target.tags
 * @property {string=} target.note
 * @property {Object} declaration
 * @property {string} declaration.name
 * @property {string} declaration.kind
 * @property {LocationInfo} declaration.location
 * @property {string} declaration.snippet
 * @property {ReferenceInfo[]} references
 * @property {UsageSummaryEntry[]} usageSummary
 */

/**
 * @typedef {Object} ReferenceUsage
 * @property {string} kind
 * @property {string} detail
 * @property {string=} context
 */

/**
 * @typedef {Object} UsageSummaryEntry
 * @property {string} kind
 * @property {string} detail
 * @property {number} count
 */

/**
 * @typedef {Object} PatternMatch
 * @property {string} match
 * @property {LocationInfo} location
 * @property {string} text
 */

/**
 * @typedef {Object} FileSummary
 * @property {string} file
 * @property {number} symbolReferenceCount
 * @property {number} patternMatchCount
 * @property {string[]} symbols
 * @property {string[]} categories
 */

/**
 * @typedef {Object} CategorySummary
 * @property {string} category
 * @property {number} symbolCount
 * @property {number} referenceCount
 */

/** @type {TargetFile[]} */
const TARGET_SYMBOLS = [
  {
    file: "src/plusUtils.ts",
    label: "Plus Utilities",
    entries: [
      { type: "exact", name: "turnOffPlus", category: "licensing", tags: ["status", "settings"] },
      { type: "exact", name: "turnOnPlus", category: "licensing", tags: ["status", "settings"] },
      { type: "exact", name: "checkIsPlusUser", category: "licensing", tags: ["validation"] },
      { type: "exact", name: "isPlusModel", category: "model-selection", tags: ["models"] },
      {
        type: "exact",
        name: "navigateToPlusPage",
        category: "marketing",
        tags: ["ui", "navigation"],
      },
      { type: "exact", name: "useIsPlusUser", category: "licensing", tags: ["hooks"] },
      {
        type: "prefix",
        name: "DEFAULT_COPILOT_PLUS_",
        category: "model-selection",
        tags: ["defaults"],
        note: "Covers all default model constants for Plus users.",
      },
      {
        type: "exact",
        name: "applyPlusSettings",
        category: "licensing",
        tags: ["settings", "side-effects"],
      },
      { type: "exact", name: "createPlusPageUrl", category: "marketing", tags: ["urls"] },
    ],
  },
  {
    file: "src/LLMProviders/brevilabsClient.ts",
    label: "Brevilabs Client",
    entries: [
      { type: "exact", name: "BrocaResponse", category: "tools", tags: ["remove"] },
      { type: "exact", name: "RerankResponse", category: "tools", tags: ["remove"] },
      { type: "exact", name: "ToolCall", category: "tools", tags: ["remove"] },
      { type: "exact", name: "Url4llmResponse", category: "tools", tags: ["remove"] },
      { type: "exact", name: "Pdf4llmResponse", category: "pdf", tags: ["migrate"] },
      { type: "exact", name: "Docs4llmResponse", category: "context", tags: ["remove"] },
      { type: "exact", name: "WebSearchResponse", category: "tools", tags: ["remove"] },
      { type: "exact", name: "Youtube4llmResponse", category: "integrations", tags: ["remove"] },
      { type: "exact", name: "LicenseResponse", category: "licensing", tags: ["status"] },
      { type: "exact", name: "AutocompleteResponse", category: "autocomplete", tags: ["remove"] },
      { type: "exact", name: "WordCompleteResponse", category: "autocomplete", tags: ["remove"] },
      { type: "exact", name: "BrevilabsClient", category: "licensing", tags: ["client", "remove"] },
    ],
  },
];

/**
 * Entrypoint.
 */
async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    const pattern = new RegExp(options.pattern, options.patternFlags || DEFAULT_PATTERN_FLAGS);
    await ensureDirectory(path.dirname(options.jsonOutput));
    await ensureDirectory(path.dirname(options.markdownOutput));
    await ensureDirectory(path.dirname(options.declarationsTextOutput));
    await ensureDirectory(path.dirname(options.declarationsTargetsOutput));
    await ensureDirectory(path.dirname(options.dependencyMapOutput));

    const project = createProject(options);
    const combinedTargets = mergeTargets(TARGET_SYMBOLS, options.additionalTargets);

    const lineCache = new Map();
    const { reports, missingTargets } = collectSymbolReports(project, combinedTargets, lineCache);
    const patternMatches = collectPatternMatches(project, pattern, lineCache);

    const fileSummary = buildFileSummary(reports, patternMatches);
    const categorySummary = buildCategorySummary(reports);
    const report = buildReport({
      options,
      reports,
      patternMatches,
      fileSummary,
      categorySummary,
      missingTargets,
    });

    await writeJson(options.jsonOutput, report);
    await writeMarkdown(options.markdownOutput, report);
    await writeDeclarationsArtifacts({
      reports,
      textPath: options.declarationsTextOutput,
      targetsPath: options.declarationsTargetsOutput,
    });
    await writeDependencyMap(options.dependencyMapOutput, reports);

    process.stdout.write(
      `Plus reference report generated.\nJSON: ${options.jsonOutput}\nMarkdown: ${options.markdownOutput}\nDeclarations: ${options.declarationsTextOutput}\nTargets JSON: ${options.declarationsTargetsOutput}\nDependency map: ${options.dependencyMapOutput}\n`
    );
  } catch (error) {
    process.stderr.write(`Failed to generate plus reference report: ${error.message}\n`);
    process.exitCode = 1;
  }
}

/**
 * Parse CLI arguments into structured options.
 *
 * Supported flags:
 * --pattern <regex> (default DEFAULT_PATTERN)
 * --pattern-flags <flags> (default "gi")
 * --json <path> (default DEFAULT_JSON_OUTPUT)
 * --markdown <path> (default DEFAULT_MARKDOWN_OUTPUT)
 * --decl-text <path> (default DEFAULT_DECLARATIONS_TEXT_OUTPUT)
 * --decl-targets <path> (default DEFAULT_DECLARATIONS_TARGETS_OUTPUT)
 * --dependency-map <path> (default DEFAULT_DEPENDENCY_MAP_OUTPUT)
 * --tsconfig <path> (default repo tsconfig)
 * --include <glob,glob,...> (additional include globs)
 * --extra-pattern-globs <glob,glob,...> (currently unused but reserved)
 * --targets <json file path> (additional target entries)
 *
 * @param {string[]} argv
 * @returns {ScriptOptions}
 */
function parseArgs(argv) {
  const args = [...argv];
  /** @type {ScriptOptions} */
  const options = {
    pattern: DEFAULT_PATTERN,
    patternFlags: DEFAULT_PATTERN_FLAGS,
    jsonOutput: DEFAULT_JSON_OUTPUT,
    markdownOutput: DEFAULT_MARKDOWN_OUTPUT,
    declarationsTextOutput: DEFAULT_DECLARATIONS_TEXT_OUTPUT,
    declarationsTargetsOutput: DEFAULT_DECLARATIONS_TARGETS_OUTPUT,
    dependencyMapOutput: DEFAULT_DEPENDENCY_MAP_OUTPUT,
    tsconfigPath: DEFAULT_TSCONFIG,
    includeGlobs: [...DEFAULT_INCLUDE_GLOBS],
    rawArgs: argv,
  };

  while (args.length > 0) {
    const flag = args.shift();
    if (!flag) {
      break;
    }
    switch (flag) {
      case "--pattern":
        options.pattern = requireValue(flag, args.shift());
        break;
      case "--pattern-flags":
        options.patternFlags = requireValue(flag, args.shift());
        break;
      case "--json":
        options.jsonOutput = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--markdown":
        options.markdownOutput = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--decl-text":
        options.declarationsTextOutput = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--decl-targets":
        options.declarationsTargetsOutput = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--dependency-map":
        options.dependencyMapOutput = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--tsconfig":
        options.tsconfigPath = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--include":
        options.includeGlobs = parseListArg(requireValue(flag, args.shift()));
        break;
      case "--extra-pattern-globs":
        options.extraPatternGlobs = parseListArg(requireValue(flag, args.shift()));
        break;
      case "--targets":
        options.additionalTargets = loadTargetOverrides(requireValue(flag, args.shift()));
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  options.patternFlags = ensureGlobalFlag(options.patternFlags || DEFAULT_PATTERN_FLAGS);
  return options;
}

/**
 * Ensure the provided regex flags include the global flag.
 *
 * @param {string} flags
 * @returns {string}
 */
function ensureGlobalFlag(flags) {
  if (!flags.includes("g")) {
    return `${flags}g`;
  }
  return flags;
}

/**
 * Ensure a CLI flag value exists.
 *
 * @param {string} flag
 * @param {string|undefined} value
 * @returns {string}
 */
function requireValue(flag, value) {
  if (!value) {
    throw new Error(`Flag ${flag} requires a value`);
  }
  return value;
}

/**
 * Parse comma separated globs.
 *
 * @param {string} value
 * @returns {string[]}
 */
function parseListArg(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

/**
 * Merge base targets with overrides.
 *
 * @param {TargetFile[]} base
 * @param {TargetFile[]=} overrides
 * @returns {TargetFile[]}
 */
function mergeTargets(base, overrides) {
  if (!overrides || overrides.length === 0) {
    return base;
  }
  const byFile = new Map();
  base.forEach((entry) => {
    byFile.set(entry.file, {
      ...entry,
      entries: [...entry.entries],
    });
  });

  overrides.forEach((override) => {
    const existing = byFile.get(override.file);
    if (existing) {
      existing.entries.push(...override.entries);
    } else {
      byFile.set(override.file, {
        ...override,
        entries: [...override.entries],
      });
    }
  });

  return Array.from(byFile.values());
}

/**
 * Load target overrides from JSON file.
 *
 * @param {string} filePath
 * @returns {TargetFile[]}
 */
function loadTargetOverrides(filePath) {
  const resolved = resolvePath(filePath);
  if (!fs.existsSync(resolved)) {
    throw new Error(`Targets file not found: ${resolved}`);
  }
  const content = fs.readFileSync(resolved, "utf8");
  /** @type {TargetFile[]} */
  const parsed = JSON.parse(content);
  return parsed;
}

/**
 * Resolve path relative to repo root.
 *
 * @param {string} value
 * @returns {string}
 */
function resolvePath(value) {
  if (path.isAbsolute(value)) {
    return value;
  }
  return path.resolve(REPO_ROOT, value);
}

/**
 * Create a ts-morph project configured for the repository.
 *
 * @param {ScriptOptions} options
 * @returns {Project}
 */
function createProject(options) {
  const project = new Project({
    tsConfigFilePath: options.tsconfigPath,
    skipAddingFilesFromTsConfig: false,
  });

  if (options.includeGlobs && options.includeGlobs.length > 0) {
    project.addSourceFilesAtPaths(options.includeGlobs);
  }
  project.resolveSourceFileDependencies();
  return project;
}

/**
 * Build reports for all target symbols.
 *
 * @param {Project} project
 * @param {TargetFile[]} targets
 * @param {Map<string, string[]>} lineCache
 * @returns {{reports: SymbolReferenceReport[], missingTargets: ReferenceInfo[]}}
 */
function collectSymbolReports(project, targets, lineCache) {
  /** @type {SymbolReferenceReport[]} */
  const reports = [];
  /** @type {ReferenceInfo[]} */
  const missing = [];

  targets.forEach((target) => {
    const sourceFile = project.getSourceFile(pathResolve(target.file));
    if (!sourceFile) {
      missing.push({
        location: {
          file: toPosixPath(target.file),
          line: 0,
          column: 0,
        },
        text: `Source file not found for ${target.file}`,
      });
      return;
    }

    const declarations = getNamedDeclarations(sourceFile);

    target.entries.forEach((entry) => {
      const matchingDeclarations = declarations.filter((decl) => {
        const name = decl.name;
        if (!name) {
          return false;
        }
        return entry.type === "exact" ? name === entry.name : name.startsWith(entry.name);
      });

      if (matchingDeclarations.length === 0) {
        missing.push({
          location: {
            file: toPosixPath(target.file),
            line: 0,
            column: 0,
          },
          text: `No declarations found for ${entry.type} "${entry.name}"`,
        });
      }

      matchingDeclarations.forEach((decl) => {
        const references = collectReferences(decl.node);
        const referenceInfos = references.map((referenceNode) => {
          const usage = describeReferenceUsage(referenceNode);
          const refSource = referenceNode.getSourceFile();
          const { line, column } = refSource.getLineAndColumnAtPos(referenceNode.getStart());
          return {
            location: {
              file: toPosixPath(path.relative(REPO_ROOT, refSource.getFilePath())),
              line,
              column,
            },
            text: getLineSnippet(refSource, line, lineCache),
            usage,
          };
        });

        const declarationSource = decl.node.getSourceFile();
        const nameNode =
          typeof decl.node.getNameNode === "function" ? decl.node.getNameNode() : undefined;
        const startPos = nameNode ? nameNode.getStart() : decl.node.getStart();
        const { line, column } = declarationSource.getLineAndColumnAtPos(startPos);
        const dedupedReferences = dedupeReferences(referenceInfos);
        reports.push({
          target: {
            matchType: entry.type,
            request: entry.name,
            file: toPosixPath(target.file),
            category: entry.category,
            tags: entry.tags,
            note: entry.note,
          },
          declaration: {
            name: decl.name,
            kind: decl.kind,
            location: {
              file: toPosixPath(path.relative(REPO_ROOT, declarationSource.getFilePath())),
              line,
              column,
            },
            snippet: getLineSnippet(declarationSource, line, lineCache),
          },
          references: dedupedReferences,
          usageSummary: summarizeUsage(dedupedReferences),
        });
      });
    });
  });

  const sortedReports = reports.sort((a, b) => {
    if (a.target.category && b.target.category && a.target.category !== b.target.category) {
      return a.target.category.localeCompare(b.target.category);
    }
    if (b.references.length !== a.references.length) {
      return b.references.length - a.references.length;
    }
    return a.declaration.name.localeCompare(b.declaration.name);
  });

  return { reports: sortedReports, missingTargets: missing };
}

/**
 * Resolve repository relative path from project.
 *
 * @param {Project} project
 * @param {string} relativePath
 * @returns {string}
 */
function pathResolve(relativePath) {
  const absolute = path.isAbsolute(relativePath)
    ? relativePath
    : path.resolve(REPO_ROOT, relativePath);
  return path.normalize(absolute);
}

/**
 * Collect named declarations from a source file.
 *
 * @param {import("ts-morph").SourceFile} sourceFile
 * @returns {{name: string, kind: string, node: import("ts-morph").Node}[]}
 */
function getNamedDeclarations(sourceFile) {
  const declarations = [];
  sourceFile.forEachDescendant((node) => {
    const kind = node.getKind();
    if (!DECLARATION_KINDS.has(kind)) {
      return;
    }
    if (typeof node.getName !== "function") {
      return;
    }
    const name = node.getName();
    if (!name) {
      return;
    }
    declarations.push({
      name,
      kind: node.getKindName(),
      node,
    });
  });
  return declarations;
}

/**
 * Collect references for a declaration node.
 *
 * @param {import("ts-morph").Node} node
 * @returns {import("ts-morph").Node[]}
 */
function collectReferences(node) {
  const references = [];
  const referenceSymbols = node.findReferences();
  const declarationSourceFile = node.getSourceFile();
  const declarationStart = node.getStart();
  const declarationEnd = node.getEnd();
  referenceSymbols.forEach((refSymbol) => {
    refSymbol.getReferences().forEach((ref) => {
      if (ref.isDefinition()) {
        return;
      }
      const referenceNode = ref.getNode();
      const referenceSourceFile = referenceNode.getSourceFile();
      const referenceStart = referenceNode.getStart();
      const referenceEnd = referenceNode.getEnd();
      if (
        referenceSourceFile === declarationSourceFile &&
        referenceStart >= declarationStart &&
        referenceEnd <= declarationEnd
      ) {
        return;
      }
      references.push(referenceNode);
    });
  });
  return references;
}

/**
 * Deduplicate references using file + start position.
 *
 * @param {ReferenceInfo[]} references
 * @returns {ReferenceInfo[]}
 */
function dedupeReferences(references) {
  const seen = new Set();
  const result = [];
  references.forEach((reference) => {
    const key = `${reference.location.file}:${reference.location.line}:${reference.location.column}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    result.push(reference);
  });
  return result;
}

/**
 * Describe how a reference node is being used.
 *
 * @param {import("ts-morph").Node} referenceNode
 * @returns {ReferenceUsage}
 */
function describeReferenceUsage(referenceNode) {
  const parent = referenceNode.getParent();
  if (!parent) {
    return { kind: "unknown", detail: "(no-parent)" };
  }

  if (
    Node.isImportSpecifier(parent) ||
    Node.isImportClause(parent) ||
    Node.isNamespaceImport(parent) ||
    Node.isImportEqualsDeclaration(parent)
  ) {
    return { kind: "import", detail: "specifier" };
  }

  if (Node.isExportSpecifier(parent)) {
    return { kind: "export", detail: "specifier" };
  }

  if (Node.isPropertyAccessExpression(parent) && parent.getExpression() === referenceNode) {
    const name = parent.getName();
    const grandParent = parent.getParent();
    if (
      grandParent &&
      Node.isCallExpression(grandParent) &&
      grandParent.getExpression() === parent
    ) {
      return { kind: "static-method-call", detail: name };
    }
    return { kind: "static-property-access", detail: name };
  }

  if (Node.isCallExpression(parent)) {
    if (parent.getExpression() === referenceNode) {
      return { kind: "direct-call", detail: referenceNode.getText() };
    }
    const argumentIndex = parent.getArguments().findIndex((arg) => arg === referenceNode);
    if (argumentIndex !== -1) {
      return { kind: "argument", detail: parent.getExpression().getText() };
    }
  }

  if (Node.isNewExpression(parent)) {
    if (parent.getExpression() === referenceNode) {
      return { kind: "constructor", detail: "new" };
    }
    const argumentIndex = (parent.getArguments() || []).findIndex((arg) => arg === referenceNode);
    if (argumentIndex !== -1) {
      return { kind: "constructor-argument", detail: parent.getExpression()?.getText() || "new" };
    }
  }

  if (Node.isTypeReference(parent)) {
    const owner = parent.getParent();
    const { detail, context } = describeTypeReferenceOwner(owner);
    return { kind: "type-reference", detail, context };
  }

  if (Node.isExpressionWithTypeArguments(parent)) {
    return { kind: "heritage-clause", detail: "extends/implements" };
  }

  if (Node.isPropertyAssignment(parent) && parent.getInitializer() === referenceNode) {
    return { kind: "property-assignment", detail: parent.getName() }; // eslint-disable-line @typescript-eslint/no-unsafe-call
  }

  if (Node.isReturnStatement(parent)) {
    return { kind: "return", detail: "return-value" };
  }

  if (Node.isDecorator(parent)) {
    return { kind: "decorator", detail: parent.getExpression().getText() };
  }

  return { kind: "other", detail: parent.getKindName() };
}

/**
 * Determine context detail for a type reference owner.
 *
 * @param {import("ts-morph").Node | undefined} owner
 * @returns {{detail: string, context?: string}}
 */
function describeTypeReferenceOwner(owner) {
  if (!owner) {
    return { detail: "type" };
  }

  if (Node.isPropertyDeclaration(owner) || Node.isPropertySignature(owner)) {
    return {
      detail: "property",
      context: typeof owner.getName === "function" ? owner.getName() : undefined,
    };
  }

  if (Node.isParameterDeclaration(owner)) {
    return {
      detail: "parameter",
      context: typeof owner.getName === "function" ? owner.getName() : undefined,
    };
  }

  if (Node.isVariableDeclaration(owner)) {
    return {
      detail: "variable",
      context: typeof owner.getName === "function" ? owner.getName() : undefined,
    };
  }

  if (
    Node.isFunctionDeclaration(owner) ||
    Node.isMethodDeclaration(owner) ||
    Node.isMethodSignature(owner)
  ) {
    return {
      detail: "return",
      context: typeof owner.getName === "function" ? owner.getName() : undefined,
    };
  }

  if (Node.isTypeAliasDeclaration(owner)) {
    return { detail: "type-alias", context: owner.getName() };
  }

  const ownerName = typeof owner.getName === "function" ? owner.getName() : undefined;
  return { detail: owner.getKindName(), context: ownerName };
}

/**
 * Summarize usage patterns for references.
 *
 * @param {ReferenceInfo[]} references
 * @returns {UsageSummaryEntry[]}
 */
function summarizeUsage(references) {
  const usageMap = new Map();
  references.forEach((reference) => {
    const detail = reference.usage.detail || "unknown";
    const key = `${reference.usage.kind}:${detail}`;
    const existing = usageMap.get(key);
    if (existing) {
      existing.count += 1;
    } else {
      usageMap.set(key, {
        kind: reference.usage.kind,
        detail,
        count: 1,
      });
    }
  });

  return Array.from(usageMap.values()).sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    if (a.kind !== b.kind) {
      return a.kind.localeCompare(b.kind);
    }
    return a.detail.localeCompare(b.detail);
  });
}

/**
 * Collect regex pattern matches across project source files.
 *
 * @param {Project} project
 * @param {RegExp} pattern
 * @param {Map<string, string[]>} lineCache
 * @returns {PatternMatch[]}
 */
function collectPatternMatches(project, pattern, lineCache) {
  /** @type {PatternMatch[]} */
  const matches = [];
  project.getSourceFiles().forEach((sourceFile) => {
    const text = sourceFile.getFullText();
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const { line, column } = sourceFile.getLineAndColumnAtPos(match.index);
      matches.push({
        match: match[0],
        location: {
          file: toPosixPath(path.relative(REPO_ROOT, sourceFile.getFilePath())),
          line,
          column,
        },
        text: getLineSnippet(sourceFile, line, lineCache),
      });
      if (pattern.lastIndex === match.index) {
        pattern.lastIndex += 1;
      }
    }
    pattern.lastIndex = 0;
  });

  matches.sort((a, b) => {
    if (a.location.file !== b.location.file) {
      return a.location.file.localeCompare(b.location.file);
    }
    return a.location.line - b.location.line;
  });

  return matches;
}

/**
 * Build summary per file.
 *
 * @param {SymbolReferenceReport[]} reports
 * @param {PatternMatch[]} patternMatches
 * @returns {FileSummary[]}
 */
function buildFileSummary(reports, patternMatches) {
  /** @type {Map<string, {symbolReferenceCount: number, patternMatchCount: number, symbols: Set<string>, categories: Set<string>}>} */
  const summaryMap = new Map();

  reports.forEach((report) => {
    const declarationFile = report.declaration.location.file;
    const declarationSummary = ensureFileSummary(summaryMap, declarationFile);
    declarationSummary.symbols.add(report.declaration.name);
    if (report.target.category) {
      declarationSummary.categories.add(report.target.category);
    }

    report.references.forEach((reference) => {
      const refSummary = ensureFileSummary(summaryMap, reference.location.file);
      refSummary.symbolReferenceCount += 1;
      refSummary.symbols.add(report.declaration.name);
      if (report.target.category) {
        refSummary.categories.add(report.target.category);
      }
    });
  });

  patternMatches.forEach((match) => {
    const summary = ensureFileSummary(summaryMap, match.location.file);
    summary.patternMatchCount += 1;
  });

  const result = Array.from(summaryMap.entries()).map(([file, value]) => ({
    file,
    symbolReferenceCount: value.symbolReferenceCount,
    patternMatchCount: value.patternMatchCount,
    symbols: Array.from(value.symbols).sort(),
    categories: Array.from(value.categories).sort(),
  }));

  result.sort((a, b) => {
    const impactA = a.symbolReferenceCount + a.patternMatchCount;
    const impactB = b.symbolReferenceCount + b.patternMatchCount;
    if (impactA !== impactB) {
      return impactB - impactA;
    }
    return a.file.localeCompare(b.file);
  });

  return result;
}

/**
 * Ensure file summary entry exists.
 *
 * @param {Map<string, {symbolReferenceCount: number, patternMatchCount: number, symbols: Set<string>, categories: Set<string>}>} map
 * @param {string} file
 * @returns {{symbolReferenceCount: number, patternMatchCount: number, symbols: Set<string>, categories: Set<string>}}
 */
function ensureFileSummary(map, file) {
  let entry = map.get(file);
  if (!entry) {
    entry = {
      symbolReferenceCount: 0,
      patternMatchCount: 0,
      symbols: new Set(),
      categories: new Set(),
    };
    map.set(file, entry);
  }
  return entry;
}

/**
 * Build category summary.
 *
 * @param {SymbolReferenceReport[]} reports
 * @returns {CategorySummary[]}
 */
function buildCategorySummary(reports) {
  /** @type {Map<string, {symbols: Set<string>, references: number}>} */
  const summary = new Map();
  reports.forEach((report) => {
    const category = report.target.category || "uncategorized";
    let entry = summary.get(category);
    if (!entry) {
      entry = { symbols: new Set(), references: 0 };
      summary.set(category, entry);
    }
    entry.symbols.add(report.declaration.name);
    entry.references += report.references.length;
  });

  const result = Array.from(summary.entries()).map(([category, value]) => ({
    category,
    symbolCount: value.symbols.size,
    referenceCount: value.references,
  }));

  result.sort((a, b) => {
    if (b.referenceCount !== a.referenceCount) {
      return b.referenceCount - a.referenceCount;
    }
    if (b.symbolCount !== a.symbolCount) {
      return b.symbolCount - a.symbolCount;
    }
    return a.category.localeCompare(b.category);
  });

  return result;
}

/**
 * Construct full report object.
 *
 * @param {Object} params
 * @param {ScriptOptions} params.options
 * @param {SymbolReferenceReport[]} params.reports
 * @param {PatternMatch[]} params.patternMatches
 * @param {FileSummary[]} params.fileSummary
 * @param {CategorySummary[]} params.categorySummary
 * @param {ReferenceInfo[]} params.missingTargets
 * @returns {Object}
 */
function buildReport({
  options,
  reports,
  patternMatches,
  fileSummary,
  categorySummary,
  missingTargets,
}) {
  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      repoRoot: REPO_ROOT,
      pattern: options.pattern,
      patternFlags: options.patternFlags || DEFAULT_PATTERN_FLAGS,
      tsconfigPath: options.tsconfigPath,
      includeGlobs: options.includeGlobs,
      rawArgs: options.rawArgs,
      declarationsTextOutput: options.declarationsTextOutput,
      declarationsTargetsOutput: options.declarationsTargetsOutput,
      dependencyMapOutput: options.dependencyMapOutput,
    },
    stats: {
      symbolCount: reports.length,
      referenceCount: reports.reduce((sum, report) => sum + report.references.length, 0),
      patternMatchCount: patternMatches.length,
      impactedFileCount: fileSummary.length,
    },
    symbols: reports,
    patternMatches,
    fileSummary,
    categorySummary,
    missingTargets,
  };
}

/**
 * Write declaration artifacts for reuse.
 *
 * @param {{reports: SymbolReferenceReport[], textPath: string, targetsPath: string}} params
 * @returns {Promise<void>}
 */
async function writeDeclarationsArtifacts({ reports, textPath, targetsPath }) {
  const index = buildDeclarationIndex(reports);

  const textLines = [];
  textLines.push("# Plus Declaration Index");
  textLines.push("");

  if (index.size === 0) {
    textLines.push("(no declarations collected)");
  } else {
    Array.from(index.entries())
      .sort(([fileA], [fileB]) => fileA.localeCompare(fileB))
      .forEach(([file, declarations]) => {
        textLines.push(`## ${file}`);
        Array.from(declarations.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .forEach((entry) => {
            const categories =
              entry.categories.length > 0 ? ` categories=${entry.categories.join(",")}` : "";
            const tags = entry.tags.length > 0 ? ` tags=${entry.tags.join(",")}` : "";
            const matchTypes =
              entry.matchTypes.length > 0 && entry.matchTypes.length < 2
                ? ` match=${entry.matchTypes[0]}`
                : entry.matchTypes.length > 1
                  ? ` match=${entry.matchTypes.join("|")}`
                  : "";
            const sources =
              entry.sourceFiles.length > 0 ? ` sources=${entry.sourceFiles.join(",")}` : "";
            textLines.push(
              `- ${entry.kind} ${entry.name} refs=${entry.referenceCount}${categories}${tags}${matchTypes}${sources}`
            );
          });
        textLines.push("");
      });
  }

  await fs.promises.writeFile(textPath, textLines.join("\n"), "utf8");

  const targetsPayload = Array.from(index.entries())
    .map(([file, declarations]) => ({
      file,
      entries: Array.from(declarations.values())
        .map((entry) => {
          const noteParts = [];
          if (entry.referenceCount) {
            noteParts.push(`refs=${entry.referenceCount}`);
          }
          if (entry.matchTypes.length > 0) {
            noteParts.push(`match=${entry.matchTypes.join("/")}`);
          }
          if (entry.sourceFiles.length > 0) {
            noteParts.push(`sources=${entry.sourceFiles.join(",")}`);
          }
          return {
            type: "exact",
            name: entry.name,
            category: entry.categories.length === 1 ? entry.categories[0] : undefined,
            tags: entry.tags.length > 0 ? entry.tags : undefined,
            note: noteParts.length > 0 ? `auto-generated (${noteParts.join("; ")})` : undefined,
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.file.localeCompare(b.file));

  await fs.promises.writeFile(targetsPath, JSON.stringify(targetsPayload, null, 2), "utf8");
}

/**
 * Build declaration index keyed by file and name.
 *
 * @param {SymbolReferenceReport[]} reports
 */
function buildDeclarationIndex(reports) {
  /** @type {Map<string, Map<string, {name: string, kind: string, categories: string[], tags: string[], sourceFiles: string[], matchTypes: string[], referenceCount: number}>>} */
  const index = new Map();

  reports.forEach((report) => {
    const file = report.declaration.location.file;
    let declarations = index.get(file);
    if (!declarations) {
      declarations = new Map();
      index.set(file, declarations);
    }

    const name = report.declaration.name;
    let entry = declarations.get(name);
    if (!entry) {
      entry = {
        name,
        kind: report.declaration.kind,
        categories: [],
        tags: [],
        sourceFiles: [],
        matchTypes: [],
        referenceCount: 0,
      };
      declarations.set(name, entry);
    }

    if (report.target.category && !entry.categories.includes(report.target.category)) {
      entry.categories.push(report.target.category);
    }
    (report.target.tags || []).forEach((tag) => {
      if (!entry.tags.includes(tag)) {
        entry.tags.push(tag);
      }
    });
    if (!entry.sourceFiles.includes(report.target.file)) {
      entry.sourceFiles.push(report.target.file);
    }
    if (!entry.matchTypes.includes(report.target.matchType)) {
      entry.matchTypes.push(report.target.matchType);
    }
    entry.referenceCount += report.references.length;
  });

  return index;
}

/**
 * Write dependency map between files based on symbol references.
 *
 * @param {string} filePath
 * @param {SymbolReferenceReport[]} reports
 * @returns {Promise<void>}
 */
async function writeDependencyMap(filePath, reports) {
  /** @type {Map<string, {file: string, categories: Set<string>, symbols: Set<string>, inbound: number, outbound: number}>} */
  const nodes = new Map();
  /** @type {Map<string, {from: string, to: string, referenceCount: number, symbols: Set<string>}>} */
  const edges = new Map();

  const ensureNode = (file) => {
    let node = nodes.get(file);
    if (!node) {
      node = {
        file,
        categories: new Set(),
        symbols: new Set(),
        inbound: 0,
        outbound: 0,
      };
      nodes.set(file, node);
    }
    return node;
  };

  reports.forEach((report) => {
    const targetFile = report.declaration.location.file;
    const targetNode = ensureNode(targetFile);
    targetNode.symbols.add(report.declaration.name);
    if (report.target.category) {
      targetNode.categories.add(report.target.category);
    }
    targetNode.inbound += report.references.length;

    report.references.forEach((reference) => {
      const fromFile = reference.location.file;
      const fromNode = ensureNode(fromFile);
      fromNode.symbols.add(report.declaration.name);
      if (report.target.category) {
        fromNode.categories.add(report.target.category);
      }
      fromNode.outbound += 1;

      const edgeKey = `${fromFile}:::${targetFile}`;
      let edge = edges.get(edgeKey);
      if (!edge) {
        edge = {
          from: fromFile,
          to: targetFile,
          referenceCount: 0,
          symbols: new Set(),
        };
        edges.set(edgeKey, edge);
      }
      edge.referenceCount += 1;
      edge.symbols.add(report.declaration.name);
    });
  });

  const nodeEntries = Array.from(nodes.values())
    .map((node) => ({
      file: node.file,
      categories: Array.from(node.categories).sort(),
      symbols: Array.from(node.symbols).sort(),
      inbound: node.inbound,
      outbound: node.outbound,
    }))
    .sort((a, b) => {
      const scoreA = a.inbound + a.outbound;
      const scoreB = b.inbound + b.outbound;
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      return a.file.localeCompare(b.file);
    });

  const edgeEntries = Array.from(edges.values())
    .map((edge) => ({
      from: edge.from,
      to: edge.to,
      referenceCount: edge.referenceCount,
      symbols: Array.from(edge.symbols).sort(),
    }))
    .sort((a, b) => {
      if (b.referenceCount !== a.referenceCount) {
        return b.referenceCount - a.referenceCount;
      }
      if (a.from !== b.from) {
        return a.from.localeCompare(b.from);
      }
      return a.to.localeCompare(b.to);
    });

  const payload = {
    generatedAt: new Date().toISOString(),
    nodes: nodeEntries,
    edges: edgeEntries,
  };

  await fs.promises.writeFile(filePath, JSON.stringify(payload, null, 2), "utf8");
}

/**
 * Ensure directory exists.
 *
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
async function ensureDirectory(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

/**
 * Write JSON file.
 *
 * @param {string} filePath
 * @param {any} data
 * @returns {Promise<void>}
 */
async function writeJson(filePath, data) {
  await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

/**
 * Write Markdown report.
 *
 * @param {string} filePath
 * @param {ReturnType<typeof buildReport>} report
 * @returns {Promise<void>}
 */
async function writeMarkdown(filePath, report) {
  const lines = [];
  lines.push("# Plus Reference Report");
  lines.push("");
  lines.push(`- Generated: ${report.metadata.generatedAt}`);
  lines.push(
    `- Pattern: \`${escapeMarkdown(report.metadata.pattern)}\` (${report.metadata.patternFlags})`
  );
  lines.push(`- Symbol Entries: ${report.stats.symbolCount}`);
  lines.push(`- Total References: ${report.stats.referenceCount}`);
  lines.push(`- Pattern Matches: ${report.stats.patternMatchCount}`);
  lines.push(`- Impacted Files: ${report.stats.impactedFileCount}`);
  lines.push("");

  if (report.fileSummary.length > 0) {
    lines.push("## File Impact Summary");
    lines.push("");
    lines.push("| File | Symbol References | Pattern Matches | Symbols | Categories |");
    lines.push("| --- | --- | --- | --- | --- |");
    report.fileSummary.forEach((entry) => {
      lines.push(
        `| ${escapeMarkdown(entry.file)} | ${entry.symbolReferenceCount} | ${entry.patternMatchCount} | ${
          escapeMarkdown(entry.symbols.join(", ")) || "–"
        } | ${escapeMarkdown(entry.categories.join(", ")) || "–"} |`
      );
    });
    lines.push("");
  }

  if (report.categorySummary.length > 0) {
    lines.push("## Category Summary");
    lines.push("");
    lines.push("| Category | Symbols | References |");
    lines.push("| --- | --- | --- |");
    report.categorySummary.forEach((entry) => {
      lines.push(
        `| ${escapeMarkdown(entry.category)} | ${entry.symbolCount} | ${entry.referenceCount} |`
      );
    });
    lines.push("");
  }

  if (report.symbols.length > 0) {
    lines.push("## Symbol Details");
    lines.push("");
    report.symbols.forEach((symbol) => {
      lines.push(
        `### ${escapeMarkdown(symbol.declaration.name)} (${symbol.declaration.kind}) — ${escapeMarkdown(
          `${symbol.declaration.location.file}:${symbol.declaration.location.line}`
        )}`
      );
      lines.push("");
      lines.push(
        `- Target: ${symbol.target.matchType} \`${escapeMarkdown(symbol.target.request)}\` from \`${escapeMarkdown(
          symbol.target.file
        )}\``
      );
      if (symbol.target.category) {
        lines.push(`- Category: ${escapeMarkdown(symbol.target.category)}`);
      }
      if (symbol.target.tags && symbol.target.tags.length > 0) {
        lines.push(`- Tags: ${escapeMarkdown(symbol.target.tags.join(", "))}`);
      }
      if (symbol.target.note) {
        lines.push(`- Note: ${escapeMarkdown(symbol.target.note)}`);
      }
      lines.push(`- Declaration: \`${escapeMarkdown(symbol.declaration.snippet.trim())}\``);
      if (symbol.usageSummary.length > 0) {
        lines.push("- Usage Summary:");
        symbol.usageSummary.forEach((usage) => {
          lines.push(
            `  - ${escapeMarkdown(usage.kind)} — ${escapeMarkdown(usage.detail)} (${usage.count})`
          );
        });
      }
      lines.push(`- References (${symbol.references.length}):`);
      if (symbol.references.length === 0) {
        lines.push("  - None");
      } else {
        symbol.references.forEach((reference) => {
          lines.push(
            `  - ${escapeMarkdown(
              `${reference.location.file}:${reference.location.line}`
            )} — \`${escapeMarkdown(reference.text.trim())}\``
          );
        });
      }
      lines.push("");
    });
  }

  if (report.patternMatches.length > 0) {
    lines.push("## Pattern Matches");
    lines.push("");
    report.patternMatches.forEach((match) => {
      lines.push(
        `- ${escapeMarkdown(match.location.file)}:${match.location.line} — \`${escapeMarkdown(
          match.text.trim()
        )}\` (match: \`${escapeMarkdown(match.match)}\`)`
      );
    });
    lines.push("");
  }

  if (report.missingTargets.length > 0) {
    lines.push("## Missing Targets");
    lines.push("");
    report.missingTargets.forEach((entry) => {
      lines.push(`- ${escapeMarkdown(entry.location.file)} — ${escapeMarkdown(entry.text)}`);
    });
    lines.push("");
  }

  await fs.promises.writeFile(filePath, lines.join("\n"), "utf8");
}

/**
 * Escape Markdown special characters.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeMarkdown(value) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\|/g, "\\|")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_")
    .replace(/~/g, "\\~");
}

/**
 * Convert file path to POSIX style for consistency.
 *
 * @param {string} filePath
 * @returns {string}
 */
function toPosixPath(filePath) {
  return filePath.split(path.sep).join("/");
}

/**
 * Return a snippet for a source line.
 *
 * @param {import("ts-morph").SourceFile} sourceFile
 * @param {number} lineNumber
 * @param {Map<string, string[]>} lineCache
 * @returns {string}
 */
function getLineSnippet(sourceFile, lineNumber, lineCache) {
  const key = sourceFile.getFilePath();
  if (!lineCache.has(key)) {
    lineCache.set(key, sourceFile.getFullText().split(/\r?\n/));
  }
  const lines = lineCache.get(key);
  if (!lines) {
    return "";
  }
  const line = lines[lineNumber - 1];
  if (!line) {
    return "";
  }
  return line.trim();
}

// Execute script.
void main();
