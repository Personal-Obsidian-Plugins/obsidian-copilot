import { PatternMatchingModal } from "@/components/modals/PatternMatchingModal";
import { GraphTagManagerModal } from "@/components/modals/GraphTagManagerModal";
import { RebuildIndexConfirmModal } from "@/components/modals/RebuildIndexConfirmModal";
import { SemanticSearchToggleModal } from "@/components/modals/SemanticSearchToggleModal";
import { Button } from "@/components/ui/button";
import { getModelDisplayWithIcons } from "@/components/ui/model-display";
import { SettingItem } from "@/components/ui/setting-item";
import { HelpTooltip } from "@/components/ui/help-tooltip";
import { VAULT_VECTOR_STORE_STRATEGIES } from "@/constants";
import { getModelKeyFromModel, updateSetting, useSettingsValue } from "@/settings/model";
import { Notice } from "obsidian";
import React, { useState } from "react";
import { buildGraphConnectionConfigFromSettings, Neo4jGraphStore } from "@/search/neo4jGraphStore";

export const QASettings: React.FC = () => {
  const settings = useSettingsValue();
  const graphSettingsDisabled = !settings.enableGraphVectorStore;
  const [isTestingGraphConnection, setIsTestingGraphConnection] = useState(false);

  const handleGraphTagManager = () => {
    new GraphTagManagerModal(app, {
      initialTags: settings.graphIncludedTagPrefixes,
      indexAllTags: settings.graphIndexAllTags,
      onSave: ({ tags, indexAllTags }) => {
        updateSetting("graphIncludedTagPrefixes", tags);
        updateSetting("graphIndexAllTags", indexAllTags);
        new Notice("Graph tag preferences updated. Reindex to apply changes.");
      },
    }).open();
  };

  const handleSetDefaultEmbeddingModel = async (modelKey: string) => {
    if (modelKey === settings.embeddingModelKey) return;

    if (settings.enableSemanticSearchV3) {
      // Persist only after user confirms rebuild
      new RebuildIndexConfirmModal(app, async () => {
        updateSetting("embeddingModelKey", modelKey);
        const VectorStoreManager = (await import("@/search/vectorStoreManager")).default;
        await VectorStoreManager.getInstance().indexVaultToVectorStore(false);
      }).open();
      return;
    }

    // Persist without rebuild when semantic search is disabled
    updateSetting("embeddingModelKey", modelKey);
    new Notice("Embedding model saved. Enable Semantic Search to build the index.");
  };

  // Partitions are automatically managed in v3 (150MB per JSONL partition).
  // Remove UI control; keep handler stub to avoid accidental usage.
  // const handlePartitionsChange = (_value: string) => {};

  const handleTestNeo4jConnection = async () => {
    setIsTestingGraphConnection(true);
    const graphStore = new Neo4jGraphStore();

    try {
      const connection = buildGraphConnectionConfigFromSettings(settings);
      await graphStore.verifyConnection(connection);
      new Notice("Successfully connected to Neo4j. The Desktop-managed instance responded.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown error";
      new Notice(`Neo4j connection failed: ${message}`);
    } finally {
      await graphStore.shutdown();
      setIsTestingGraphConnection(false);
    }
  };

  return (
    <div className="tw-space-y-4">
      <section>
        <div className="tw-space-y-4">
          {/* Enable Inline Citations */}
          <SettingItem
            type="switch"
            title="Enable Inline Citations (experimental)"
            description="When enabled, AI responses will include footnote-style citations within the text and numbered sources at the end (This is an experimental feature and may not work as expected for all models.)"
            checked={settings.enableInlineCitations}
            onCheckedChange={(checked) => updateSetting("enableInlineCitations", checked)}
          />

          {/* Enable Semantic Search (v3) */}
          <SettingItem
            type="switch"
            title="Enable Semantic Search"
            description="Enable semantic search for meaning-based document retrieval. When disabled, uses fast lexical search only. Use 'Refresh Vault Index' or 'Force Reindex Vault' to build the embedding index."
            checked={settings.enableSemanticSearchV3}
            onCheckedChange={(checked) => {
              // Show confirmation modal with appropriate message
              new SemanticSearchToggleModal(
                app,
                async () => {
                  updateSetting("enableSemanticSearchV3", checked);
                  if (checked) {
                    const VectorStoreManager = (await import("@/search/vectorStoreManager"))
                      .default;
                    await VectorStoreManager.getInstance().indexVaultToVectorStore(false);
                  }
                },
                checked // true = enabling, false = disabling
              ).open();
            }}
          />

          {/* Embedding Model - Always shown to reduce ambiguity */}
          <SettingItem
            type="select"
            title="Embedding Model"
            description={
              <div className="tw-space-y-2">
                <div className="tw-flex tw-items-center tw-gap-1.5">
                  <span className="tw-font-medium tw-leading-none tw-text-accent">
                    Powers Semantic Vault Search and Relevant Notes. Enable Semantic Search to use
                    it.
                  </span>
                  <HelpTooltip
                    content={
                      <div className="tw-flex tw-max-w-96 tw-flex-col tw-gap-2">
                        <div className="tw-pt-2 tw-text-sm tw-text-muted">
                          This model converts text into vector representations, essential for
                          semantic search and Question Answering (QA) functionality. Changing the
                          embedding model will:
                        </div>
                        <ul className="tw-pl-4 tw-text-sm tw-text-muted">
                          <li>Require rebuilding your vault&#39;s vector index</li>
                          <li>Affect semantic search quality</li>
                          <li>Impact Question Answering feature performance</li>
                        </ul>
                      </div>
                    }
                  />
                </div>
              </div>
            }
            value={settings.embeddingModelKey}
            onChange={handleSetDefaultEmbeddingModel}
            options={settings.activeEmbeddingModels.map((model) => ({
              label: getModelDisplayWithIcons(model),
              value: getModelKeyFromModel(model),
            }))}
            placeholder="Model"
          />

          {/* Auto-Index Strategy */}
          <SettingItem
            type="select"
            title="Auto-Index Strategy"
            description={
              <div className="tw-flex tw-items-center tw-gap-1.5">
                <span className="tw-leading-none">
                  Decide when you want the vault to be indexed.
                </span>
                <HelpTooltip
                  content={
                    <div className="tw-space-y-2 tw-py-2">
                      <div className="tw-space-y-1">
                        <div className="tw-text-sm tw-text-muted">
                          Choose when to index your vault:
                        </div>
                        <ul className="tw-list-disc tw-space-y-1 tw-pl-2 tw-text-sm">
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                NEVER:
                              </strong>
                              <span>Manual indexing via command or refresh only</span>
                            </div>
                          </li>
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                ON STARTUP:
                              </strong>
                              <span>Index updates when plugin loads or reloads</span>
                            </div>
                          </li>
                          <li>
                            <div className="tw-flex tw-items-center tw-gap-1">
                              <strong className="tw-inline-block tw-whitespace-nowrap">
                                ON MODE SWITCH:
                              </strong>
                              <span>Updates when entering QA mode (Recommended)</span>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <p className="tw-text-sm tw-text-callout-warning">
                        Warning: Cost implications for large vaults with paid models
                      </p>
                    </div>
                  }
                />
              </div>
            }
            value={settings.indexVaultToVectorStore}
            onChange={(value) => {
              updateSetting("indexVaultToVectorStore", value);
            }}
            options={VAULT_VECTOR_STORE_STRATEGIES.map((strategy) => ({
              label: strategy,
              value: strategy,
            }))}
            placeholder="Strategy"
          />

          {/* Max Sources */}
          <SettingItem
            type="slider"
            title="Max Sources"
            description="Copilot goes through your vault to find relevant notes and passes the top N to the LLM. Default for N is 15. Increase if you want more notes included in the answer generation step."
            min={1}
            max={128}
            step={1}
            value={settings.maxSourceChunks}
            onChange={(value) => updateSetting("maxSourceChunks", value)}
          />

          {/* Embedding-related settings - Only shown when semantic search is enabled */}
          {settings.enableSemanticSearchV3 && (
            <>
              {/* Requests per Minute */}
              <SettingItem
                type="slider"
                title="Requests per Minute"
                description="Default is 60. Decrease if you are rate limited by your embedding provider."
                min={10}
                max={60}
                step={10}
                value={Math.min(settings.embeddingRequestsPerMin, 60)}
                onChange={(value) => updateSetting("embeddingRequestsPerMin", value)}
              />

              {/* Embedding batch size */}
              <SettingItem
                type="slider"
                title="Embedding Batch Size"
                description="Default is 16. Increase if you are rate limited by your embedding provider."
                min={1}
                max={128}
                step={1}
                value={settings.embeddingBatchSize}
                onChange={(value) => updateSetting("embeddingBatchSize", value)}
              />

              {/* Number of Partitions */}
              <SettingItem
                type="select"
                title="Number of Partitions"
                description="Number of partitions for Copilot index. Default is 1. Increase if you have issues indexing large vaults. Warning: Changes require clearing and rebuilding the index!"
                value={String(settings.numPartitions || 1)}
                onChange={(value) => updateSetting("numPartitions", Number(value))}
                options={[
                  { label: "1", value: "1" },
                  { label: "2", value: "2" },
                  { label: "4", value: "4" },
                  { label: "8", value: "8" },
                  { label: "16", value: "16" },
                  { label: "32", value: "32" },
                  { label: "40", value: "40" },
                ]}
                placeholder="Select partitions"
              />
            </>
          )}

          {/* Lexical Search RAM Limit */}
          <SettingItem
            type="slider"
            title="Lexical Search RAM Limit"
            description="Maximum RAM usage for full-text search index. Lower values use less memory but may limit search performance on large vaults. Default is 100 MB."
            min={20}
            max={1000}
            step={20}
            value={settings.lexicalSearchRamLimit || 100}
            onChange={(value) => updateSetting("lexicalSearchRamLimit", value)}
            suffix=" MB"
          />

          {/* Enable Folder and Graph Boosts */}
          <SettingItem
            type="switch"
            title="Enable Folder and Graph Boosts"
            description="Enable folder and graph-based relevance boosts for lexical search results. When disabled, provides pure keyword-based relevance scoring without folder or connection-based adjustments."
            checked={settings.enableLexicalBoosts}
            onCheckedChange={(checked) => updateSetting("enableLexicalBoosts", checked)}
          />

          <div className="tw-pt-4 tw-text-xl tw-font-semibold">Graph Retrieval (beta)</div>

          <SettingItem
            type="switch"
            title="Enable Graph Vector Store"
            description="Builds a local Neo4j graph using tags and wiki-links to enhance retrieval quality. Requires a vault reindex when toggled."
            checked={settings.enableGraphVectorStore}
            onCheckedChange={(checked) => {
              updateSetting("enableGraphVectorStore", checked);
              new Notice(
                checked
                  ? "Graph vector store enabled. Run a vault reindex to build the graph."
                  : "Graph vector store disabled. Existing graph data will no longer be used."
              );
            }}
          />

          <SettingItem
            type="switch"
            title="Enable Hybrid RRF Scoring"
            description="Combine graph-based results with dense embeddings using reciprocal rank fusion. When disabled, results rely solely on dense vectors."
            checked={settings.enableHybridRRFScoring}
            onCheckedChange={(checked) => updateSetting("enableHybridRRFScoring", checked)}
            disabled={graphSettingsDisabled}
          />

          <SettingItem
            type="text"
            title="Neo4j Connection URI"
            description="Bolt or Neo4j+SRV address for your Desktop-managed Neo4j instance."
            value={settings.graphNeo4jUri}
            onChange={(value) => updateSetting("graphNeo4jUri", value)}
            placeholder="bolt://localhost:7687"
          />

          <SettingItem
            type="text"
            title="Neo4j Username"
            description="Username configured in Neo4j Desktop. The default user is usually 'neo4j'."
            value={settings.graphNeo4jUsername}
            onChange={(value) => updateSetting("graphNeo4jUsername", value)}
            placeholder="neo4j"
          />

          <SettingItem
            type="password"
            title="Neo4j Password"
            description="Password generated or configured for the Desktop database. Stored locally within Obsidian settings."
            value={settings.graphNeo4jPassword}
            onChange={(value) => updateSetting("graphNeo4jPassword", value)}
            placeholder="••••••••"
          />

          <SettingItem
            type="text"
            title="Neo4j Database (optional)"
            description="Name of the Neo4j database to target. Leave blank to use the default database."
            value={settings.graphNeo4jDatabase}
            onChange={(value) => updateSetting("graphNeo4jDatabase", value)}
            placeholder="neo4j"
          />

          <SettingItem
            type="switch"
            title="Use Encryption"
            description="Enable when connecting to a remote Neo4j server that requires TLS. Leave disabled for Neo4j Desktop."
            checked={settings.graphNeo4jUseEncryption}
            onCheckedChange={(checked) => updateSetting("graphNeo4jUseEncryption", checked)}
          />

          <SettingItem
            type="custom"
            title="Connection Health Check"
            description="Verify that the plugin can reach the configured Neo4j instance before running a reindex."
          >
            <Button
              variant="secondary"
              onClick={handleTestNeo4jConnection}
              disabled={isTestingGraphConnection}
            >
              {isTestingGraphConnection ? "Testing..." : "Test Neo4j Connection"}
            </Button>
          </SettingItem>

          <SettingItem
            type="switch"
            title="Index Wiki Links"
            description="Capture [[wikilinks]] between notes and surface related content during retrieval."
            checked={settings.graphIncludeWikiLinks}
            onCheckedChange={(checked) => updateSetting("graphIncludeWikiLinks", checked)}
            disabled={graphSettingsDisabled}
          />

          <SettingItem
            type="switch"
            title="Index Embeds"
            description="Include embedded notes and other resources as graph relationships."
            checked={settings.graphIncludeEmbeds}
            onCheckedChange={(checked) => updateSetting("graphIncludeEmbeds", checked)}
            disabled={graphSettingsDisabled}
          />

          <SettingItem
            type="slider"
            title="Graph Traversal Depth"
            description="Maximum hop distance used when expanding graph neighbourhoods during retrieval."
            min={1}
            max={4}
            step={1}
            value={settings.graphTraversalMaxDepth}
            onChange={(value) => updateSetting("graphTraversalMaxDepth", value)}
            disabled={graphSettingsDisabled}
          />

          <SettingItem
            type="custom"
            title="Manage Graph Tags"
            description={
              settings.graphIndexAllTags
                ? "All tags are currently indexed. Open the manager to curate specific prefixes."
                : `${settings.graphIncludedTagPrefixes.length} tag prefix(es) selected.`
            }
            disabled={graphSettingsDisabled}
          >
            <Button
              variant="secondary"
              onClick={handleGraphTagManager}
              disabled={graphSettingsDisabled}
            >
              Open Tag Manager
            </Button>
          </SettingItem>

          {/* Exclusions */}
          <SettingItem
            type="custom"
            title="Exclusions"
            description={
              <>
                <p>
                  Exclude folders, tags, note titles or file extensions from being indexed.
                  Previously indexed files will remain until a force re-index is performed.
                </p>
              </>
            }
          >
            <Button
              variant="secondary"
              onClick={() =>
                new PatternMatchingModal(
                  app,
                  (value) => updateSetting("qaExclusions", value),
                  settings.qaExclusions,
                  "Manage Exclusions"
                ).open()
              }
            >
              Manage
            </Button>
          </SettingItem>

          {/* Inclusions */}
          <SettingItem
            type="custom"
            title="Inclusions"
            description={
              <p>
                Index only the specified paths, tags, or note titles. Exclusions take precedence
                over inclusions. Previously indexed files will remain until a force re-index is
                performed.
              </p>
            }
          >
            <Button
              variant="secondary"
              onClick={() =>
                new PatternMatchingModal(
                  app,
                  (value) => updateSetting("qaInclusions", value),
                  settings.qaInclusions,
                  "Manage Inclusions"
                ).open()
              }
            >
              Manage
            </Button>
          </SettingItem>

          {/* Enable Obsidian Sync */}
          <SettingItem
            type="switch"
            title="Enable Obsidian Sync for Copilot index"
            description="If enabled, store the semantic index in .obsidian so it syncs with Obsidian Sync. If disabled, store it under .copilot/ at the vault root."
            checked={settings.enableIndexSync}
            onCheckedChange={(checked) => updateSetting("enableIndexSync", checked)}
          />

          {/* Disable index loading on mobile */}
          <SettingItem
            type="switch"
            title="Disable index loading on mobile"
            description="When enabled, Copilot index won't be loaded on mobile devices to save resources. Only chat mode will be available. Any existing index from desktop sync will be preserved. Uncheck to enable QA modes on mobile."
            checked={settings.disableIndexOnMobile}
            onCheckedChange={(checked) => updateSetting("disableIndexOnMobile", checked)}
          />
        </div>
      </section>
    </div>
  );
};
