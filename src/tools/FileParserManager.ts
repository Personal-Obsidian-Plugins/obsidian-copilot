import { ProjectConfig } from "@/aiParams";
import { ProjectContextCache } from "@/cache/projectContextCache";
import { logError, logInfo } from "@/logger";
import { ImageProcessor } from "@/processors/imageProcessor";
import { LocalPdfProcessor } from "@/processors/pdfProcessor";
import { TFile, Vault } from "obsidian";
import { CanvasLoader } from "./CanvasLoader";

interface FileParser {
  supportedExtensions: string[];
  parseFile: (file: TFile, vault: Vault) => Promise<string>;
}

export class MarkdownParser implements FileParser {
  supportedExtensions = ["md"];

  constructor(
    private readonly projectContextCache: ProjectContextCache | null = null,
    private readonly project: ProjectConfig | null = null
  ) {}

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    if (this.projectContextCache && this.project) {
      const cachedContent = await this.projectContextCache.getOrReuseFileContext(
        this.project,
        file.path
      );
      if (cachedContent) {
        logInfo(
          `[MarkdownParser] Project ${this.project.name}: Using cached content for: ${file.path}`
        );
        return cachedContent;
      }
      logInfo(`[MarkdownParser] Project ${this.project.name}: Cache miss for: ${file.path}.`);
    }

    const content = await vault.read(file);

    if (this.projectContextCache && this.project) {
      await this.projectContextCache.setFileContext(this.project, file.path, content);
      logInfo(
        `[MarkdownParser] Project ${this.project.name}: Successfully processed and cached: ${file.path}`
      );
    }

    return content;
  }
}

export class PDFParser implements FileParser {
  supportedExtensions = ["pdf"];

  constructor(
    private readonly pdfProcessor: LocalPdfProcessor,
    private readonly projectContextCache: ProjectContextCache | null = null,
    private readonly project: ProjectConfig | null = null
  ) {}

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    try {
      if (this.projectContextCache && this.project) {
        const cachedContent = await this.projectContextCache.getOrReuseFileContext(
          this.project,
          file.path
        );
        if (cachedContent) {
          logInfo(
            `[PDFParser] Project ${this.project.name}: Using cached content for: ${file.path}`
          );
          return cachedContent;
        }
        logInfo(`[PDFParser] Project ${this.project.name}: Cache miss for: ${file.path}.`);
      }

      logInfo("Parsing PDF file:", file.path);

      const entry = await this.pdfProcessor.parseToMarkdown(file, vault);
      const content = entry.markdown;

      if (this.projectContextCache && this.project) {
        await this.projectContextCache.setFileContext(this.project, file.path, content);
        logInfo(
          `[PDFParser] Project ${this.project.name}: Successfully processed and cached: ${file.path}`
        );
      }

      return content;
    } catch (error) {
      logError(`Error extracting content from PDF ${file.path}:`, error);
      return `[Error: Could not extract content from PDF ${file.basename}]`;
    }
  }

  async clearCache(): Promise<void> {
    logInfo("Clearing PDF cache");
    await this.pdfProcessor.clearCache();
  }
}

export class CanvasParser implements FileParser {
  supportedExtensions = ["canvas"];

  constructor(
    private readonly projectContextCache: ProjectContextCache | null = null,
    private readonly project: ProjectConfig | null = null
  ) {}

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    try {
      if (this.projectContextCache && this.project) {
        const cachedContent = await this.projectContextCache.getOrReuseFileContext(
          this.project,
          file.path
        );
        if (cachedContent) {
          logInfo(
            `[CanvasParser] Project ${this.project.name}: Using cached content for: ${file.path}`
          );
          return cachedContent;
        }
        logInfo(`[CanvasParser] Project ${this.project.name}: Cache miss for: ${file.path}.`);
      }

      logInfo("Parsing Canvas file:", file.path);
      const canvasLoader = new CanvasLoader(vault);
      const canvasData = await canvasLoader.load(file);

      const content = canvasLoader.buildPrompt(canvasData);

      if (this.projectContextCache && this.project) {
        await this.projectContextCache.setFileContext(this.project, file.path, content);
        logInfo(
          `[CanvasParser] Project ${this.project.name}: Successfully processed and cached: ${file.path}`
        );
      }

      return content;
    } catch (error) {
      logError(`Error parsing Canvas file ${file.path}:`, error);
      return `[Error: Could not parse Canvas file ${file.basename}]`;
    }
  }
}

export class ImageParser implements FileParser {
  supportedExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "tiff", "webp"];

  constructor(
    private readonly projectContextCache: ProjectContextCache | null = null,
    private readonly project: ProjectConfig | null = null
  ) {}

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    try {
      if (this.projectContextCache && this.project) {
        const cachedContent = await this.projectContextCache.getOrReuseFileContext(
          this.project,
          file.path
        );
        if (cachedContent) {
          logInfo(
            `[ImageParser] Project ${this.project.name}: Using cached content for: ${file.path}`
          );
          return cachedContent;
        }
        logInfo(`[ImageParser] Project ${this.project.name}: Cache miss for: ${file.path}.`);
      }

      logInfo("Parsing image file:", file.path);
      const imageContent = await ImageProcessor.convertToBase64(file.path, vault);

      if (!imageContent || !imageContent.image_url.url) {
        throw new Error("Could not convert image to base64");
      }

      const content = imageContent.image_url.url;

      if (this.projectContextCache && this.project) {
        await this.projectContextCache.setFileContext(this.project, file.path, content);
        logInfo(
          `[ImageParser] Project ${this.project.name}: Successfully processed and cached: ${file.path}`
        );
      }

      return content;
    } catch (error) {
      logError(`Error parsing image file ${file.path}:`, error);
      return `[Error: Could not parse image file ${file.basename}]`;
    }
  }
}

// Future parsers can be added like this:
/*
class DocxParser implements FileParser {
  supportedExtensions = ["docx", "doc"];

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    // Implementation for Word documents
  }
}
*/

export class FileParserManager {
  private parsers: Map<string, FileParser> = new Map();
  private isProjectMode: boolean;
  private currentProject: ProjectConfig | null;

  constructor(vault: Vault, isProjectMode: boolean = false, project: ProjectConfig | null = null) {
    this.isProjectMode = isProjectMode;
    this.currentProject = project;
    const localPdfProcessor = new LocalPdfProcessor();
    const projectContextCache = isProjectMode ? ProjectContextCache.getInstance() : null;

    // Register parsers
    this.registerParser(new MarkdownParser(projectContextCache, project));
    this.registerParser(new PDFParser(localPdfProcessor, projectContextCache, project));
    this.registerParser(new CanvasParser(projectContextCache, project));
    this.registerParser(new ImageParser(projectContextCache, project));
  }

  registerParser(parser: FileParser) {
    for (const ext of parser.supportedExtensions) {
      this.parsers.set(ext, parser);
    }
  }

  async parseFile(file: TFile, vault: Vault): Promise<string> {
    const parser = this.parsers.get(file.extension);
    if (!parser) {
      throw new Error(`No parser found for file type: ${file.extension}`);
    }
    return await parser.parseFile(file, vault);
  }

  supportsExtension(extension: string): boolean {
    return this.parsers.has(extension);
  }

  async clearPDFCache(): Promise<void> {
    const pdfParser = this.parsers.get("pdf");
    if (pdfParser instanceof PDFParser) {
      await pdfParser.clearCache();
    }
  }
}
