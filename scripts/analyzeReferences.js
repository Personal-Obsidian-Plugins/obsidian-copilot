#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { Project, SyntaxKind, Node } = require("ts-morph");

const DEFAULT_TSCONFIG = path.join(__dirname, "..", "tsconfig.json");
const DEFAULT_FLOW_DETAIL = "file";
const PROMPTS_DIR = path.join(__dirname, "..", "prompts");
const REPO_ROOT = path.resolve(__dirname, "..");

// Standard library symbols to exclude from outbound references
const STDLIB_SYMBOLS = new Set([
  "Object",
  "Array",
  "Promise",
  "Error",
  "String",
  "Number",
  "Boolean",
  "Map",
  "Set",
  "JSON",
  "Math",
  "Date",
  "RegExp",
  "URL",
  "FormData",
  "Blob",
  "File",
  "fetch",
  "console",
  "ArrayBuffer",
  "Uint8Array",
  "Int8Array",
  "Float32Array",
  "Float64Array",
  "DataView",
  "Symbol",
  "BigInt",
  "Proxy",
  "Reflect",
  "WeakMap",
  "WeakSet",
  "Intl",
  "WebAssembly",
  "ArrayBufferView",
  "SharedArrayBuffer",
  "Atomics",
  "globalThis",
  "window",
  "document",
  "XMLHttpRequest",
  "TextEncoder",
  "TextDecoder",
  "ReadableStream",
  "WritableStream",
  "TransformStream",
]);

// Standard library methods to exclude from call hierarchy
const STDLIB_METHODS = new Set([
  "forEach",
  "map",
  "filter",
  "reduce",
  "find",
  "findIndex",
  "includes",
  "indexOf",
  "lastIndexOf",
  "some",
  "every",
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "slice",
  "concat",
  "join",
  "reverse",
  "sort",
  "fill",
  "copyWithin",
  "entries",
  "keys",
  "values",
  "flat",
  "flatMap",
  "append",
  "delete",
  "get",
  "set",
  "has",
  "clear",
  "add",
  "toString",
  "valueOf",
  "toLocaleString",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
  "assign",
  "create",
  "defineProperty",
  "defineProperties",
  "freeze",
  "seal",
  "preventExtensions",
  "getPrototypeOf",
  "setPrototypeOf",
  "getOwnPropertyDescriptor",
  "getOwnPropertyDescriptors",
  "getOwnPropertyNames",
  "getOwnPropertySymbols",
  "is",
  "fromEntries",
  "parse",
  "stringify",
  "then",
  "catch",
  "finally",
  "resolve",
  "reject",
  "all",
  "race",
  "allSettled",
  "any",
  "json",
  "text",
  "blob",
  "arrayBuffer",
  "formData",
  "clone",
]);

/**
 * @typedef {Object} ScriptOptions
 * @property {string} target - File or directory to analyze
 * @property {string[]=} filters - Optional list of directories/files to restrict search to
 * @property {"file" | "function"} flowDetail - Level of detail for execution flow diagram
 * @property {string} tsconfigPath - Path to tsconfig.json
 * @property {string=} outputPath - Optional custom output path
 * @property {boolean} excludeStdlib - Exclude standard library symbols from analysis
 * @property {boolean} includeSnippets - Include code snippets for top symbols
 * @property {boolean} splitReferences - Generate separate files for inbound/outbound references
 */

/**
 * @typedef {Object} LocationInfo
 * @property {string} file
 * @property {number} line
 * @property {number} column
 */

/**
 * @typedef {Object} SymbolInfo
 * @property {string} name
 * @property {string} kind
 * @property {LocationInfo} location
 * @property {string} snippet
 * @property {import("ts-morph").Node} node
 */

/**
 * @typedef {Object} ReferenceInfo
 * @property {LocationInfo} location
 * @property {string} text
 * @property {string} usageKind
 */

/**
 * @typedef {Object} CallInfo
 * @property {string} caller
 * @property {string} callerFile
 * @property {string} callee
 * @property {string} calleeFile
 * @property {LocationInfo} location
 */

/**
 * @typedef {Object} DependencyEdge
 * @property {string} from
 * @property {string} to
 * @property {string[]} symbols
 * @property {number} count
 */

/**
 * @typedef {Object} RankedSymbol
 * @property {SymbolInfo} symbol
 * @property {number} score - Importance score (0-100)
 * @property {Object} metrics
 * @property {number} metrics.inboundCount - Total number of inbound references
 * @property {number} metrics.uniqueFiles - Number of unique files that reference this
 * @property {number} metrics.complexity - Lines of code (for functions/classes)
 * @property {boolean} metrics.isExported - Whether this symbol is exported
 */

/**
 * @typedef {Object} AnalysisReport
 * @property {ScriptOptions} options
 * @property {SymbolInfo[]} targetSymbols
 * @property {Map<string, ReferenceInfo[]>} inboundReferences
 * @property {Map<string, ReferenceInfo[]>} outboundReferences
 * @property {CallInfo[]} callHierarchy
 * @property {DependencyEdge[]} dependencies
 * @property {RankedSymbol[]} rankedSymbols
 */

/**
 * Entrypoint.
 */
async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));
    validateOptions(options);

    await ensureDirectory(PROMPTS_DIR);

    const project = createProject(options);
    const report = await analyzeTarget(project, options);
    const outputPath = generateOutputPath(options);

    await writeMarkdownReport(outputPath, report);

    if (options.splitReferences) {
      const referencesPath = outputPath.replace(/\.md$/, "-references.md");
      await writeReferencesReport(referencesPath, report);
      process.stdout.write(`Analysis reports generated:\n`);
      process.stdout.write(`  Main: ${outputPath}\n`);
      process.stdout.write(`  References: ${referencesPath}\n`);
    } else {
      process.stdout.write(`Analysis report generated: ${outputPath}\n`);
    }
  } catch (error) {
    process.stderr.write(`Failed to generate analysis report: ${error.message}\n`);
    process.exitCode = 1;
  }
}

/**
 * Parse CLI arguments into structured options.
 *
 * Supported flags:
 * --target <path> (required)
 * --filter <path,path,...> (optional)
 * --flow-detail <file|function> (optional, default "file")
 * --tsconfig <path> (optional)
 * --output <path> (optional)
 * --exclude-stdlib (optional, default true)
 * --include-snippets (optional, default false)
 * --split-references (optional, default true)
 * --no-split-references (optional, disable splitting)
 *
 * @param {string[]} argv
 * @returns {ScriptOptions}
 */
function parseArgs(argv) {
  const args = [...argv];
  /** @type {Partial<ScriptOptions>} */
  const options = {
    flowDetail: DEFAULT_FLOW_DETAIL,
    tsconfigPath: DEFAULT_TSCONFIG,
    excludeStdlib: true,
    includeSnippets: false,
    splitReferences: true,
  };

  while (args.length > 0) {
    const flag = args.shift();
    if (!flag) {
      break;
    }
    switch (flag) {
      case "--target":
        options.target = requireValue(flag, args.shift());
        break;
      case "--filter":
        options.filters = parseListArg(requireValue(flag, args.shift()));
        break;
      case "--flow-detail":
        const flowDetail = requireValue(flag, args.shift());
        if (flowDetail !== "file" && flowDetail !== "function") {
          throw new Error('--flow-detail must be either "file" or "function"');
        }
        options.flowDetail = flowDetail;
        break;
      case "--tsconfig":
        options.tsconfigPath = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--output":
        options.outputPath = resolvePath(requireValue(flag, args.shift()));
        break;
      case "--exclude-stdlib":
        options.excludeStdlib = true;
        break;
      case "--no-exclude-stdlib":
        options.excludeStdlib = false;
        break;
      case "--include-snippets":
        options.includeSnippets = true;
        break;
      case "--split-references":
        options.splitReferences = true;
        break;
      case "--no-split-references":
        options.splitReferences = false;
        break;
      default:
        throw new Error(`Unknown flag: ${flag}`);
    }
  }

  if (!options.target) {
    throw new Error("--target flag is required");
  }

  return /** @type {ScriptOptions} */ (options);
}

/**
 * Validate parsed options.
 *
 * @param {ScriptOptions} options
 */
function validateOptions(options) {
  const targetPath = resolvePath(options.target);
  if (!fs.existsSync(targetPath)) {
    throw new Error(`Target path does not exist: ${targetPath}`);
  }

  if (!fs.existsSync(options.tsconfigPath)) {
    throw new Error(`tsconfig.json not found: ${options.tsconfigPath}`);
  }

  if (options.filters) {
    options.filters.forEach((filterPath) => {
      const resolved = resolvePath(filterPath);
      if (!fs.existsSync(resolved)) {
        throw new Error(`Filter path does not exist: ${resolved}`);
      }
    });
  }
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
 * Parse comma separated paths.
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

  project.resolveSourceFileDependencies();
  return project;
}

/**
 * Analyze the target file or directory.
 *
 * @param {Project} project
 * @param {ScriptOptions} options
 * @returns {Promise<AnalysisReport>}
 */
async function analyzeTarget(project, options) {
  const targetPath = resolvePath(options.target);
  const sourceFiles = getTargetSourceFiles(project, targetPath);

  if (sourceFiles.length === 0) {
    throw new Error(`No source files found for target: ${options.target}`);
  }

  const lineCache = new Map();
  const targetSymbols = collectTargetSymbols(sourceFiles, lineCache);
  const inboundReferences = collectInboundReferences(targetSymbols, options, lineCache);
  const outboundReferences = collectOutboundReferences(sourceFiles, options, lineCache);
  const callHierarchy = collectCallHierarchy(sourceFiles, options, lineCache);
  const dependencies = buildDependencyMap(inboundReferences, outboundReferences);
  const rankedSymbols = rankSymbols(targetSymbols, inboundReferences);

  return {
    options,
    targetSymbols,
    inboundReferences,
    outboundReferences,
    callHierarchy,
    dependencies,
    rankedSymbols,
  };
}

/**
 * Get source files for the target path.
 *
 * @param {Project} project
 * @param {string} targetPath
 * @returns {import("ts-morph").SourceFile[]}
 */
function getTargetSourceFiles(project, targetPath) {
  const stats = fs.statSync(targetPath);

  if (stats.isFile()) {
    const sourceFile = project.getSourceFile(targetPath);
    return sourceFile ? [sourceFile] : [];
  }

  if (stats.isDirectory()) {
    return project.getSourceFiles().filter((sf) => {
      const filePath = sf.getFilePath();
      return filePath.startsWith(targetPath);
    });
  }

  return [];
}

/**
 * Collect all exported symbols from target source files.
 *
 * @param {import("ts-morph").SourceFile[]} sourceFiles
 * @param {Map<string, string[]>} lineCache
 * @returns {SymbolInfo[]}
 */
function collectTargetSymbols(sourceFiles, lineCache) {
  const symbols = [];

  sourceFiles.forEach((sourceFile) => {
    const declarations = getNamedDeclarations(sourceFile);

    declarations.forEach((decl) => {
      const nameNode =
        typeof decl.node.getNameNode === "function" ? decl.node.getNameNode() : undefined;
      const startPos = nameNode ? nameNode.getStart() : decl.node.getStart();
      const { line, column } = sourceFile.getLineAndColumnAtPos(startPos);

      symbols.push({
        name: decl.name,
        kind: decl.kind,
        location: {
          file: toPosixPath(path.relative(REPO_ROOT, sourceFile.getFilePath())),
          line,
          column,
        },
        snippet: getLineSnippet(sourceFile, line, lineCache),
        node: decl.node,
      });
    });
  });

  return symbols;
}

/**
 * Collect named declarations from a source file.
 *
 * @param {import("ts-morph").SourceFile} sourceFile
 * @returns {{name: string, kind: string, node: import("ts-morph").Node}[]}
 */
function getNamedDeclarations(sourceFile) {
  const DECLARATION_KINDS = new Set([
    SyntaxKind.ClassDeclaration,
    SyntaxKind.FunctionDeclaration,
    SyntaxKind.VariableDeclaration,
    SyntaxKind.InterfaceDeclaration,
    SyntaxKind.TypeAliasDeclaration,
    SyntaxKind.EnumDeclaration,
    SyntaxKind.MethodDeclaration,
  ]);

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
 * Collect inbound references (who uses the target symbols).
 *
 * @param {SymbolInfo[]} targetSymbols
 * @param {ScriptOptions} options
 * @param {Map<string, string[]>} lineCache
 * @returns {Map<string, ReferenceInfo[]>}
 */
function collectInboundReferences(targetSymbols, options, lineCache) {
  const inboundMap = new Map();
  const targetPath = resolvePath(options.target);
  const targetStats = fs.statSync(targetPath);

  // Get all target file paths
  const targetFilePaths = new Set();
  if (targetStats.isFile()) {
    targetFilePaths.add(path.normalize(targetPath));
  } else if (targetStats.isDirectory()) {
    targetSymbols.forEach((symbol) => {
      const symbolFilePath = path.resolve(REPO_ROOT, symbol.location.file);
      targetFilePaths.add(path.normalize(symbolFilePath));
    });
  }

  targetSymbols.forEach((symbol) => {
    const references = [];
    const referenceSymbols = symbol.node.findReferences();

    const declarationSourceFile = symbol.node.getSourceFile();
    const declarationStart = symbol.node.getStart();
    const declarationEnd = symbol.node.getEnd();

    referenceSymbols.forEach((refSymbol) => {
      refSymbol.getReferences().forEach((ref) => {
        // Skip definitions
        if (ref.isDefinition()) {
          return;
        }

        const referenceNode = ref.getNode();
        const referenceSourceFile = referenceNode.getSourceFile();
        const referenceStart = referenceNode.getStart();
        const referenceEnd = referenceNode.getEnd();

        // Skip self-references within the declaration
        if (
          referenceSourceFile === declarationSourceFile &&
          referenceStart >= declarationStart &&
          referenceEnd <= declarationEnd
        ) {
          return;
        }

        const refFilePath = referenceSourceFile.getFilePath();
        const normalizedRefPath = path.normalize(refFilePath);

        // Skip references from within the target files
        if (targetFilePaths.has(normalizedRefPath)) {
          return;
        }

        // Apply filters if specified
        if (options.filters && options.filters.length > 0) {
          const matchesFilter = options.filters.some((filter) => {
            const resolvedFilter = resolvePath(filter);
            return refFilePath.startsWith(resolvedFilter);
          });
          if (!matchesFilter) {
            return;
          }
        }

        const { line, column } = referenceSourceFile.getLineAndColumnAtPos(referenceStart);
        const usageKind = describeReferenceUsage(referenceNode);

        references.push({
          location: {
            file: toPosixPath(path.relative(REPO_ROOT, refFilePath)),
            line,
            column,
          },
          text: getLineSnippet(referenceSourceFile, line, lineCache),
          usageKind,
        });
      });
    });

    if (references.length > 0) {
      inboundMap.set(symbol.name, dedupeReferences(references));
    }
  });

  return inboundMap;
}

/**
 * Describe how a reference node is being used.
 *
 * @param {import("ts-morph").Node} referenceNode
 * @returns {string}
 */
function describeReferenceUsage(referenceNode) {
  const parent = referenceNode.getParent();
  if (!parent) {
    return "unknown";
  }

  if (
    Node.isImportSpecifier(parent) ||
    Node.isImportClause(parent) ||
    Node.isNamespaceImport(parent)
  ) {
    return "import";
  }

  if (Node.isExportSpecifier(parent)) {
    return "export";
  }

  if (Node.isCallExpression(parent) && parent.getExpression() === referenceNode) {
    return "function-call";
  }

  if (Node.isNewExpression(parent) && parent.getExpression() === referenceNode) {
    return "constructor";
  }

  if (Node.isTypeReference(parent)) {
    return "type-reference";
  }

  if (Node.isPropertyAccessExpression(parent) && parent.getExpression() === referenceNode) {
    return "property-access";
  }

  return "other";
}

/**
 * Deduplicate references by location.
 *
 * @param {ReferenceInfo[]} references
 * @returns {ReferenceInfo[]}
 */
function dedupeReferences(references) {
  const seen = new Set();
  const result = [];

  references.forEach((ref) => {
    const key = `${ref.location.file}:${ref.location.line}:${ref.location.column}`;
    if (!seen.has(key)) {
      seen.add(key);
      result.push(ref);
    }
  });

  return result;
}

/**
 * Collect outbound references (what the target uses).
 *
 * @param {import("ts-morph").SourceFile[]} sourceFiles
 * @param {ScriptOptions} options
 * @param {Map<string, string[]>} lineCache
 * @returns {Map<string, ReferenceInfo[]>}
 */
function collectOutboundReferences(sourceFiles, options, lineCache) {
  const outboundMap = new Map();

  sourceFiles.forEach((sourceFile) => {
    // Collect all identifiers and their definitions
    sourceFile.forEachDescendant((node) => {
      if (!Node.isIdentifier(node)) {
        return;
      }

      // Skip if it's part of a declaration in this file
      const parent = node.getParent();
      if (!parent) {
        return;
      }

      // Try to find the definition
      const definitions = node.getDefinitionNodes();
      if (definitions.length === 0) {
        return;
      }

      definitions.forEach((def) => {
        const defSourceFile = def.getSourceFile();
        const defFilePath = defSourceFile.getFilePath();
        const currentFilePath = sourceFile.getFilePath();

        // Only track if definition is in a different file
        if (defFilePath === currentFilePath) {
          return;
        }

        // Apply filters if specified
        if (options.filters && options.filters.length > 0) {
          const matchesFilter = options.filters.some((filter) => {
            const resolvedFilter = resolvePath(filter);
            return defFilePath.startsWith(resolvedFilter);
          });
          if (!matchesFilter) {
            return;
          }
        }

        const name = node.getText();
        if (!name) {
          return;
        }

        // Skip stdlib symbols if excludeStdlib is enabled
        if (options.excludeStdlib && STDLIB_SYMBOLS.has(name)) {
          return;
        }

        const { line, column } = sourceFile.getLineAndColumnAtPos(node.getStart());
        const usageKind = describeReferenceUsage(node);

        if (!outboundMap.has(name)) {
          outboundMap.set(name, []);
        }

        outboundMap.get(name).push({
          location: {
            file: toPosixPath(path.relative(REPO_ROOT, currentFilePath)),
            line,
            column,
          },
          text: getLineSnippet(sourceFile, line, lineCache),
          usageKind,
        });
      });
    });
  });

  // Deduplicate all outbound references
  outboundMap.forEach((references, name) => {
    outboundMap.set(name, dedupeReferences(references));
  });

  return outboundMap;
}

/**
 * Collect call hierarchy (function calls).
 *
 * @param {import("ts-morph").SourceFile[]} sourceFiles
 * @param {ScriptOptions} options
 * @param {Map<string, string[]>} lineCache
 * @returns {CallInfo[]}
 */
function collectCallHierarchy(sourceFiles, options, lineCache) {
  const calls = [];

  sourceFiles.forEach((sourceFile) => {
    sourceFile.forEachDescendant((node) => {
      if (!Node.isCallExpression(node)) {
        return;
      }

      const expression = node.getExpression();
      let calleeName = "";

      if (Node.isIdentifier(expression)) {
        calleeName = expression.getText();
      } else if (Node.isPropertyAccessExpression(expression)) {
        calleeName = expression.getName();
      }

      if (!calleeName) {
        return;
      }

      // Skip stdlib methods if excludeStdlib is enabled
      if (options.excludeStdlib && STDLIB_METHODS.has(calleeName)) {
        return;
      }

      // Find the containing function
      let caller = node.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration);
      if (!caller) {
        caller = node.getFirstAncestorByKind(SyntaxKind.MethodDeclaration);
      }
      if (!caller) {
        caller = node.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
      }

      const callerName =
        caller && typeof caller.getName === "function" ? caller.getName() : "anonymous";

      const { line, column } = sourceFile.getLineAndColumnAtPos(node.getStart());

      calls.push({
        caller: callerName || "anonymous",
        callerFile: toPosixPath(path.relative(REPO_ROOT, sourceFile.getFilePath())),
        callee: calleeName,
        calleeFile: "", // Would need symbol resolution to get actual file
        location: {
          file: toPosixPath(path.relative(REPO_ROOT, sourceFile.getFilePath())),
          line,
          column,
        },
      });
    });
  });

  return calls;
}

/**
 * Build dependency map from references.
 *
 * @param {Map<string, ReferenceInfo[]>} inboundReferences
 * @param {Map<string, ReferenceInfo[]>} outboundReferences
 * @returns {DependencyEdge[]}
 */
function buildDependencyMap(inboundReferences, outboundReferences) {
  const edgeMap = new Map();

  // Process inbound references: other files → target
  inboundReferences.forEach((references, symbolName) => {
    references.forEach((ref) => {
      // For inbound, ref.location.file is the source that depends on the target
      const key = `${ref.location.file}→target`;
      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          from: ref.location.file,
          to: "target",
          symbols: [],
          count: 0,
        });
      }
      const edge = edgeMap.get(key);
      if (!edge.symbols.includes(symbolName)) {
        edge.symbols.push(symbolName);
      }
      edge.count++;
    });
  });

  // Process outbound references: target → other files
  outboundReferences.forEach((references, symbolName) => {
    references.forEach((ref) => {
      // For outbound, ref.location.file is where the usage happens (in target)
      // We need to track which external symbols are being used
      const key = `target→${symbolName}`;
      if (!edgeMap.has(key)) {
        edgeMap.set(key, {
          from: "target",
          to: ref.location.file,
          symbols: [],
          count: 0,
        });
      }
      const edge = edgeMap.get(key);
      if (!edge.symbols.includes(symbolName)) {
        edge.symbols.push(symbolName);
      }
      edge.count++;
    });
  });

  return Array.from(edgeMap.values()).sort((a, b) => b.count - a.count);
}

/**
 * Rank symbols by importance based on usage and complexity.
 *
 * @param {SymbolInfo[]} targetSymbols
 * @param {Map<string, ReferenceInfo[]>} inboundReferences
 * @returns {RankedSymbol[]}
 */
function rankSymbols(targetSymbols, inboundReferences) {
  const rankedSymbols = targetSymbols.map((symbol) => {
    const references = inboundReferences.get(symbol.name) || [];
    const inboundCount = references.length;

    // Count unique files that reference this symbol
    const uniqueFiles = new Set(references.map((ref) => ref.location.file)).size;

    // Calculate complexity (lines of code for the symbol)
    const symbolNode = symbol.node;
    let complexity = 0;
    if (symbolNode) {
      const startLine = symbolNode
        .getSourceFile()
        .getLineAndColumnAtPos(symbolNode.getStart()).line;
      const endLine = symbolNode.getSourceFile().getLineAndColumnAtPos(symbolNode.getEnd()).line;
      complexity = endLine - startLine + 1;
    }

    // Check if symbol is exported
    const isExported = symbolNode
      ? symbolNode
          .getSymbol()
          ?.getDeclarations()
          .some((decl) => {
            const modifiers = decl.getCombinedModifierFlags?.() || 0;
            return (modifiers & 1) !== 0; // 1 = Export flag
          }) || false
      : false;

    // Calculate score (0-100)
    // Weighted: 40% inbound refs, 30% unique files, 20% complexity, 10% export status
    const normalizedInbound = Math.min(inboundCount / 10, 1) * 40;
    const normalizedFiles = Math.min(uniqueFiles / 5, 1) * 30;
    const normalizedComplexity = Math.min(complexity / 50, 1) * 20;
    const exportBonus = isExported ? 10 : 0;

    const score = normalizedInbound + normalizedFiles + normalizedComplexity + exportBonus;

    return {
      symbol,
      score: Math.round(score),
      metrics: {
        inboundCount,
        uniqueFiles,
        complexity,
        isExported,
      },
    };
  });

  // Sort by score descending
  return rankedSymbols.sort((a, b) => b.score - a.score);
}

/**
 * Extract full code snippet for a symbol.
 *
 * @param {SymbolInfo} symbol
 * @returns {string}
 */
function extractCodeSnippet(symbol) {
  if (!symbol.node) {
    return "";
  }

  try {
    const fullText = symbol.node.getText();
    // Limit to reasonable size (max 100 lines)
    const lines = fullText.split("\n");
    if (lines.length > 100) {
      return lines.slice(0, 100).join("\n") + "\n// ... (truncated)";
    }
    return fullText;
  } catch (error) {
    return "";
  }
}

/**
 * Generate output path based on target and filters.
 *
 * @param {ScriptOptions} options
 * @returns {string}
 */
function generateOutputPath(options) {
  if (options.outputPath) {
    return options.outputPath;
  }

  const targetName = path.basename(options.target, path.extname(options.target));
  const filterSuffix = options.filters && options.filters.length > 0 ? "-filtered" : "";
  const fileName = `prompt-${targetName}${filterSuffix}.md`;

  return path.join(PROMPTS_DIR, fileName);
}

/**
 * Consolidate symbols by name and group/order by kind.
 *
 * @param {SymbolInfo[]} symbols
 * @returns {Array<{name: string, kind: string, location: string}>}
 */
function consolidateSymbols(symbols) {
  const kindOrder = {
    InterfaceDeclaration: 0,
    ClassDeclaration: 1,
    MethodDeclaration: 2,
    VariableDeclaration: 3,
    FunctionDeclaration: 4,
    TypeAliasDeclaration: 5,
    EnumDeclaration: 6,
  };

  // Group by name and kind
  const grouped = new Map();
  symbols.forEach((symbol) => {
    const key = `${symbol.name}|${symbol.kind}`;
    if (!grouped.has(key)) {
      grouped.set(key, {
        name: symbol.name,
        kind: symbol.kind,
        locations: [],
      });
    }
    grouped.get(key).locations.push(`${symbol.location.file}:${symbol.location.line}`);
  });

  // Convert to array and sort
  const result = Array.from(grouped.values()).map((item) => ({
    name: item.name,
    kind: item.kind,
    location: item.locations.join(", "),
  }));

  result.sort((a, b) => {
    const kindA = kindOrder[a.kind] ?? 999;
    const kindB = kindOrder[b.kind] ?? 999;
    if (kindA !== kindB) {
      return kindA - kindB;
    }
    return a.name.localeCompare(b.name);
  });

  return result;
}

/**
 * Write markdown report with mermaid diagrams.
 *
 * @param {string} outputPath
 * @param {AnalysisReport} report
 * @returns {Promise<void>}
 */
async function writeMarkdownReport(outputPath, report) {
  const lines = [];

  // Header
  lines.push(`# Code Analysis Report: ${report.options.target}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  // Quick Reference
  lines.push("## Quick Reference");
  lines.push("");
  const topSymbols = report.rankedSymbols.slice(0, 5);
  if (topSymbols.length > 0) {
    lines.push("**Top Symbols (by importance):**");
    topSymbols.forEach((ranked, index) => {
      const { symbol, score, metrics } = ranked;
      lines.push(
        `${index + 1}. **${escapeMarkdown(symbol.name)}** (score: ${score}) - ${metrics.inboundCount} refs, ${metrics.uniqueFiles} files, ${metrics.complexity} LOC`
      );
    });
  }
  lines.push("");

  // Get unique inbound files
  const inboundFiles = new Set();
  report.inboundReferences.forEach((references) => {
    references.forEach((ref) => {
      inboundFiles.add(ref.location.file);
    });
  });
  lines.push(`**Dependencies:** ${inboundFiles.size} files depend on this target`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  lines.push(`- **Target**: \`${report.options.target}\``);
  if (report.options.filters && report.options.filters.length > 0) {
    lines.push(`- **Filters**: ${report.options.filters.map((f) => `\`${f}\``).join(", ")}`);
  }
  lines.push(`- **Exclude Stdlib**: ${report.options.excludeStdlib}`);
  lines.push(`- **Target Symbols**: ${report.targetSymbols.length}`);
  lines.push(`- **Inbound References**: ${getTotalReferences(report.inboundReferences)}`);
  lines.push(`- **Outbound References**: ${getTotalReferences(report.outboundReferences)}`);
  lines.push(`- **Function Calls**: ${report.callHierarchy.length}`);
  lines.push("");

  // Target Symbols - ranked with consolidated locations
  lines.push("## Target Symbols (Ranked by Importance)");
  lines.push("");
  if (report.targetSymbols.length === 0) {
    lines.push("No symbols found.");
  } else {
    // Build consolidated symbol map with rankings
    const consolidatedMap = new Map();
    report.rankedSymbols.forEach((ranked) => {
      const { symbol, score, metrics } = ranked;
      const key = `${symbol.name}|${symbol.kind}`;

      if (!consolidatedMap.has(key)) {
        consolidatedMap.set(key, {
          name: symbol.name,
          kind: symbol.kind,
          score,
          metrics,
          locations: [],
        });
      }
      consolidatedMap.get(key).locations.push(`${symbol.location.file}:${symbol.location.line}`);
    });

    // Convert to array and keep ranking order
    const consolidated = [];
    report.rankedSymbols.forEach((ranked) => {
      const key = `${ranked.symbol.name}|${ranked.symbol.kind}`;
      if (consolidatedMap.has(key)) {
        consolidated.push(consolidatedMap.get(key));
        consolidatedMap.delete(key); // Only add once
      }
    });

    lines.push("| Rank | Name | Kind | Score | Refs | Files | LOC | Locations |");
    lines.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
    consolidated.forEach((item, index) => {
      const locationStr = item.locations.join(", ");
      lines.push(
        `| ${index + 1} | ${escapeMarkdown(item.name)} | ${item.kind} | ${item.score} | ${item.metrics.inboundCount} | ${item.metrics.uniqueFiles} | ${item.metrics.complexity} | ${escapeMarkdown(locationStr)} |`
      );
    });
  }
  lines.push("");

  // Code Snippets for top symbols
  if (report.options.includeSnippets && report.rankedSymbols.length > 0) {
    lines.push("## Top Symbol Implementations");
    lines.push("");
    const topSnippets = report.rankedSymbols.slice(0, 10);
    topSnippets.forEach((ranked) => {
      const { symbol } = ranked;
      const codeSnippet = extractCodeSnippet(symbol);
      if (codeSnippet) {
        lines.push(`### ${escapeMarkdown(symbol.name)} (${symbol.kind})`);
        lines.push("");
        lines.push(`**Location:** ${escapeMarkdown(symbol.location.file)}:${symbol.location.line}`);
        lines.push("");
        lines.push("```typescript");
        lines.push(codeSnippet);
        lines.push("```");
        lines.push("");
      }
    });
  }

  // Target-Level Dependency Diagram
  lines.push("## Target-Level Dependencies");
  lines.push("");
  lines.push("High-level view of files that depend on the target and files the target depends on.");
  lines.push("");
  lines.push("```mermaid");
  lines.push(generateTargetDependencyDiagram(report));
  lines.push("```");
  lines.push("");

  // Detailed Dependency Map Diagram
  lines.push("## Detailed Dependency Map");
  lines.push("");
  lines.push("Detailed symbol-level dependencies (simplified to avoid redundant edges).");
  lines.push("");
  lines.push("```mermaid");
  lines.push(generateDependencyDiagram(report));
  lines.push("```");
  lines.push("");

  // Call Hierarchy Diagram
  lines.push("## Call Hierarchy");
  lines.push("");
  lines.push("```mermaid");
  lines.push(generateCallHierarchyDiagram(report));
  lines.push("```");
  lines.push("");

  // Conditionally include reference details if not split into separate files
  if (!report.options.splitReferences) {
    // Inbound References Details
    lines.push("## Inbound References (Who Uses This)");
    lines.push("");
    if (getTotalReferences(report.inboundReferences) === 0) {
      lines.push("No inbound references found.");
    } else {
      report.inboundReferences.forEach((references, symbolName) => {
        if (references.length > 0) {
          lines.push(`### ${escapeMarkdown(symbolName)}`);
          lines.push("");
          references.forEach((ref) => {
            lines.push(
              `- ${escapeMarkdown(`${ref.location.file}:${ref.location.line}`)} — \`${escapeMarkdown(
                ref.text.trim()
              )}\``
            );
          });
          lines.push("");
        }
      });
    }

    // Outbound References Details
    lines.push("## Outbound References (What This Uses)");
    lines.push("");
    if (getTotalReferences(report.outboundReferences) === 0) {
      lines.push("No outbound references found.");
    } else {
      report.outboundReferences.forEach((references, symbolName) => {
        if (references.length > 0) {
          lines.push(`### ${escapeMarkdown(symbolName)}`);
          lines.push("");
          references.forEach((ref) => {
            lines.push(
              `- ${escapeMarkdown(`${ref.location.file}:${ref.location.line}`)} — \`${escapeMarkdown(
                ref.text.trim()
              )}\` (${ref.usageKind})`
            );
          });
          lines.push("");
        }
      });
    }
  } else {
    lines.push("## References");
    lines.push("");
    lines.push("Detailed inbound and outbound references have been written to a separate file.");
    lines.push("");
    const referencesFileName = path.basename(outputPath).replace(/\.md$/, "-references.md");
    lines.push(`**→ [View Detailed References](${referencesFileName})**`);
    lines.push("");
  }

  await fs.promises.writeFile(outputPath, lines.join("\n"), "utf8");
}

/**
 * Write combined references report (inbound and outbound) to separate file.
 *
 * @param {string} outputPath
 * @param {AnalysisReport} report
 * @returns {Promise<void>}
 */
async function writeReferencesReport(outputPath, report) {
  const lines = [];

  // Header
  lines.push(`# References: ${report.options.target}`);
  lines.push("");
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");

  // Summary
  lines.push("## Summary");
  lines.push("");
  const inboundFiles = new Set();
  report.inboundReferences.forEach((references) => {
    references.forEach((ref) => {
      inboundFiles.add(ref.location.file);
    });
  });
  lines.push(`- **Inbound References**: ${getTotalReferences(report.inboundReferences)}`);
  lines.push(`- **Unique Files Using This**: ${inboundFiles.size}`);
  lines.push(`- **Inbound Symbols**: ${report.inboundReferences.size}`);
  lines.push("");
  lines.push(`- **Outbound References**: ${getTotalReferences(report.outboundReferences)}`);
  lines.push(`- **Outbound Symbols**: ${report.outboundReferences.size}`);
  if (report.options.excludeStdlib) {
    lines.push("- **Note**: Standard library symbols excluded from outbound references");
  }
  lines.push("");

  // Inbound References Section
  lines.push("## Inbound References (Who Uses This)");
  lines.push("");
  if (getTotalReferences(report.inboundReferences) === 0) {
    lines.push("No inbound references found.");
    lines.push("");
  } else {
    report.inboundReferences.forEach((references, symbolName) => {
      if (references.length > 0) {
        lines.push(`### ${escapeMarkdown(symbolName)}`);
        lines.push("");
        lines.push(
          `**${references.length} references from ${new Set(references.map((r) => r.location.file)).size} files**`
        );
        lines.push("");
        references.forEach((ref) => {
          lines.push(
            `- ${escapeMarkdown(`${ref.location.file}:${ref.location.line}`)} — \`${escapeMarkdown(
              ref.text.trim()
            )}\` (${ref.usageKind})`
          );
        });
        lines.push("");
      }
    });
  }

  // Outbound References Section
  lines.push("## Outbound References (What This Uses)");
  lines.push("");
  if (getTotalReferences(report.outboundReferences) === 0) {
    lines.push("No outbound references found.");
    lines.push("");
  } else {
    report.outboundReferences.forEach((references, symbolName) => {
      if (references.length > 0) {
        lines.push(`### ${escapeMarkdown(symbolName)}`);
        lines.push("");
        lines.push(`**${references.length} references**`);
        lines.push("");
        references.forEach((ref) => {
          lines.push(
            `- ${escapeMarkdown(`${ref.location.file}:${ref.location.line}`)} — \`${escapeMarkdown(
              ref.text.trim()
            )}\` (${ref.usageKind})`
          );
        });
        lines.push("");
      }
    });
  }

  await fs.promises.writeFile(outputPath, lines.join("\n"), "utf8");
}

/**
 * Generate target-level dependency diagram.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateTargetDependencyDiagram(report) {
  const lines = ["graph LR"];

  // Collect unique files that depend on target (inbound)
  const inboundFiles = new Set();
  report.inboundReferences.forEach((references) => {
    references.forEach((ref) => {
      inboundFiles.add(ref.location.file);
    });
  });

  // Collect unique files that target depends on (outbound)
  const outboundFiles = new Set();
  report.outboundReferences.forEach((references) => {
    references.forEach((ref) => {
      // Note: outbound refs have the target file in location
      // We'd need to track the actual dependency files differently
    });
  });

  lines.push(`    Target["Target: ${escapeForMermaid(path.basename(report.options.target))}"]`);
  lines.push(`    style Target fill:#e1f5ff,stroke:#01579b,stroke-width:3px`);

  if (inboundFiles.size === 0 && outboundFiles.size === 0) {
    lines.push("    NoDepend[No Dependencies Found]");
    lines.push("    Target -.-> NoDepend");
    return lines.join("\n");
  }

  let nodeCounter = 0;
  const nodeIds = new Map();

  const getNodeId = (filePath) => {
    if (!nodeIds.has(filePath)) {
      nodeIds.set(filePath, `N${nodeCounter++}`);
    }
    return nodeIds.get(filePath);
  };

  // Add inbound nodes and edges
  if (inboundFiles.size > 0) {
    const sortedInbound = Array.from(inboundFiles).sort();
    sortedInbound.forEach((file) => {
      const nodeId = getNodeId(file);
      const fileName = path.basename(file);
      lines.push(`    ${nodeId}["${escapeForMermaid(fileName)}"]`);
      lines.push(`    ${nodeId} -->|uses| Target`);
    });
  }

  // Add outbound nodes and edges (if we had proper tracking)
  // For now, this is simplified since outbound tracking would need improvement

  return lines.join("\n");
}

/**
 * Generate dependency map mermaid diagram with simplified bidirectional edges.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateDependencyDiagram(report) {
  const lines = ["graph LR"];

  if (report.dependencies.length === 0) {
    lines.push("    Target[Target Files]");
    lines.push("    NoDepend[No Dependencies Found]");
    lines.push("    Target --> NoDepend");
    return lines.join("\n");
  }

  const nodeIds = new Map();
  let nodeCounter = 0;

  const getNodeId = (filePath) => {
    if (!nodeIds.has(filePath)) {
      nodeIds.set(filePath, `N${nodeCounter++}`);
    }
    return nodeIds.get(filePath);
  };

  // Add nodes
  const uniqueFiles = new Set();
  report.dependencies.forEach((edge) => {
    uniqueFiles.add(edge.from);
    if (edge.to) {
      uniqueFiles.add(edge.to);
    }
  });

  uniqueFiles.forEach((file) => {
    const nodeId = getNodeId(file);
    const fileName = file === "target" ? "Target" : path.basename(file);
    lines.push(`    ${nodeId}["${escapeForMermaid(fileName)}"]`);
    if (file === "target") {
      lines.push(`    style ${nodeId} fill:#e1f5ff,stroke:#01579b,stroke-width:2px`);
    }
  });

  // Simplify edges: detect bidirectional relationships
  const edgeMap = new Map();
  report.dependencies.forEach((edge) => {
    if (!edge.to) return;

    const key1 = `${edge.from}::${edge.to}`;
    const key2 = `${edge.to}::${edge.from}`;

    if (edgeMap.has(key2)) {
      // Mark as bidirectional
      edgeMap.get(key2).bidirectional = true;
    } else {
      edgeMap.set(key1, {
        from: edge.from,
        to: edge.to,
        symbols: edge.symbols,
        count: edge.count,
        bidirectional: false,
      });
    }
  });

  // Add simplified edges
  const processedBidirectional = new Set();
  edgeMap.forEach((edge, key) => {
    const reverseKey = `${edge.to}::${edge.from}`;

    if (edge.bidirectional && !processedBidirectional.has(reverseKey)) {
      // Bidirectional edge - use <--> without labels
      const fromId = getNodeId(edge.from);
      const toId = getNodeId(edge.to);
      lines.push(`    ${fromId} <--> ${toId}`);
      processedBidirectional.add(key);
    } else if (!edge.bidirectional) {
      // Unidirectional edge - show with limited symbols
      const fromId = getNodeId(edge.from);
      const toId = getNodeId(edge.to);
      const label = edge.symbols.length > 0 ? edge.symbols.slice(0, 2).join(", ") : "";
      if (label && edge.symbols.length <= 3) {
        lines.push(`    ${fromId} -->|"${escapeForMermaid(label)}"| ${toId}`);
      } else {
        lines.push(`    ${fromId} --> ${toId}`);
      }
    }
  });

  return lines.join("\n");
}

/**
 * Generate call hierarchy mermaid diagram.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateCallHierarchyDiagram(report) {
  const lines = ["graph TD"];

  if (report.callHierarchy.length === 0) {
    lines.push("    Root[Target]");
    lines.push("    NoCalls[No Function Calls Found]");
    lines.push("    Root --> NoCalls");
    return lines.join("\n");
  }

  const nodeIds = new Map();
  let nodeCounter = 0;

  const getNodeId = (funcName) => {
    const key = funcName || "anonymous";
    if (!nodeIds.has(key)) {
      nodeIds.set(key, `F${nodeCounter++}`);
    }
    return nodeIds.get(key);
  };

  // Collect unique functions
  const uniqueFunctions = new Set();
  report.callHierarchy.forEach((call) => {
    uniqueFunctions.add(call.caller);
    uniqueFunctions.add(call.callee);
  });

  // Add nodes
  uniqueFunctions.forEach((funcName) => {
    const nodeId = getNodeId(funcName);
    lines.push(`    ${nodeId}["${escapeForMermaid(funcName)}"]`);
  });

  // Add edges (limit to prevent overwhelming diagrams)
  const maxEdges = 50;
  report.callHierarchy.slice(0, maxEdges).forEach((call) => {
    const callerId = getNodeId(call.caller);
    const calleeId = getNodeId(call.callee);
    lines.push(`    ${callerId} --> ${calleeId}`);
  });

  if (report.callHierarchy.length > maxEdges) {
    lines.push(`    More["... ${report.callHierarchy.length - maxEdges} more calls"]`);
  }

  return lines.join("\n");
}

/**
 * Generate execution flow mermaid diagram.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateExecutionFlowDiagram(report) {
  if (report.options.flowDetail === "file") {
    return generateFileFlowDiagram(report);
  } else {
    return generateFunctionFlowDiagram(report);
  }
}

/**
 * Generate file-level execution flow diagram with simplified bidirectional edges.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateFileFlowDiagram(report) {
  const lines = ["graph TB"];

  // Collect unique files from dependencies
  const files = new Set();
  report.dependencies.forEach((dep) => {
    files.add(dep.from);
    if (dep.to) {
      files.add(dep.to);
    }
  });

  if (files.size === 0) {
    lines.push("    Target[Target Files]");
    lines.push("    NoFlow[No Execution Flow Found]");
    lines.push("    Target --> NoFlow");
    return lines.join("\n");
  }

  const nodeIds = new Map();
  let nodeCounter = 0;

  const getNodeId = (filePath) => {
    if (!nodeIds.has(filePath)) {
      nodeIds.set(filePath, `File${nodeCounter++}`);
    }
    return nodeIds.get(filePath);
  };

  // Add nodes for files
  files.forEach((file) => {
    const nodeId = getNodeId(file);
    const fileName = file === "target" ? "Target" : path.basename(file);
    lines.push(`    ${nodeId}["${escapeForMermaid(fileName)}"]`);
    if (file === "target") {
      lines.push(`    style ${nodeId} fill:#e1f5ff,stroke:#01579b,stroke-width:2px`);
    }
  });

  // Simplify edges: detect bidirectional relationships
  const edgeSet = new Set();
  const edgeList = [];
  report.dependencies.forEach((dep) => {
    if (dep.to) {
      const key1 = `${dep.from}::${dep.to}`;
      const key2 = `${dep.to}::${dep.from}`;

      if (!edgeSet.has(key1) && !edgeSet.has(key2)) {
        edgeSet.add(key1);
        edgeList.push({ from: dep.from, to: dep.to, reverse: key2 });
      }
    }
  });

  // Check for bidirectional and add appropriate edges
  const processedBidirectional = new Set();
  edgeList.forEach((edge) => {
    if (processedBidirectional.has(`${edge.from}::${edge.to}`)) {
      return;
    }

    if (edgeSet.has(edge.reverse)) {
      // Bidirectional
      const fromId = getNodeId(edge.from);
      const toId = getNodeId(edge.to);
      lines.push(`    ${fromId} <--> ${toId}`);
      processedBidirectional.add(`${edge.from}::${edge.to}`);
      processedBidirectional.add(edge.reverse);
    } else {
      // Unidirectional
      const fromId = getNodeId(edge.from);
      const toId = getNodeId(edge.to);
      lines.push(`    ${fromId} --> ${toId}`);
    }
  });

  return lines.join("\n");
}

/**
 * Generate function-level execution flow diagram.
 *
 * @param {AnalysisReport} report
 * @returns {string}
 */
function generateFunctionFlowDiagram(report) {
  const lines = ["graph TB"];

  if (report.callHierarchy.length === 0) {
    lines.push("    Target[Target Functions]");
    lines.push("    NoFlow[No Function Flow Found]");
    lines.push("    Target --> NoFlow");
    return lines.join("\n");
  }

  // Build function flow from call hierarchy
  const functionNodes = new Map();
  let nodeCounter = 0;

  const getNodeId = (funcName, filePath) => {
    const key = `${funcName}@${filePath}`;
    if (!functionNodes.has(key)) {
      functionNodes.set(key, `Func${nodeCounter++}`);
    }
    return functionNodes.get(key);
  };

  // Add nodes and edges
  const maxNodes = 30;
  const callsToShow = report.callHierarchy.slice(0, maxNodes);

  const addedNodes = new Set();
  callsToShow.forEach((call) => {
    const callerId = getNodeId(call.caller, call.callerFile);
    const calleeId = getNodeId(call.callee, call.calleeFile || call.callerFile);

    if (!addedNodes.has(callerId)) {
      lines.push(`    ${callerId}["${escapeForMermaid(call.caller)}"]`);
      addedNodes.add(callerId);
    }
    if (!addedNodes.has(calleeId)) {
      lines.push(`    ${calleeId}["${escapeForMermaid(call.callee)}"]`);
      addedNodes.add(calleeId);
    }

    lines.push(`    ${callerId} --> ${calleeId}`);
  });

  if (report.callHierarchy.length > maxNodes) {
    lines.push(`    More["... ${report.callHierarchy.length - maxNodes} more functions"]`);
  }

  return lines.join("\n");
}

/**
 * Get total count of references from a map.
 *
 * @param {Map<string, ReferenceInfo[]>} refMap
 * @returns {number}
 */
function getTotalReferences(refMap) {
  let total = 0;
  refMap.forEach((refs) => {
    total += refs.length;
  });
  return total;
}

/**
 * Escape string for use in mermaid diagrams.
 *
 * @param {string} value
 * @returns {string}
 */
function escapeForMermaid(value) {
  return value.replace(/"/g, "#quot;").replace(/\[/g, "#91;").replace(/\]/g, "#93;");
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

/**
 * Ensure directory exists.
 *
 * @param {string} dirPath
 * @returns {Promise<void>}
 */
async function ensureDirectory(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

// Execute script.
void main();
