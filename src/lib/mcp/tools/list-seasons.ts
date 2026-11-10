import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { currentVersionId, publicRpc } from "../supabase";

export default defineTool({
  name: "list_seasons",
  title: "List seasons",
  description: "List the published football seasons (English or Spanish league) with their IDs and match counts.",
  inputSchema: { league: z.enum(["angol", "spanyol"]).optional().describe("League: angol (English) or spanyol (Spanish). Omit for both.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ league }) => {
    const version = await currentVersionId();
    if (!version) return { content: [{ type: "text", text: "No published data yet." }] };
    const rows = ((await publicRpc("winmix_cloud_seasons", { p_version: version, p_league: league ?? null })) ?? []) as Array<{
      id: string; league: string; name: string; matchCount: number; revision: number; dataVersionId: string;
    }>;
    const seasons = rows.map((s) => ({ id: s.id, league: s.league, name: s.name, matchCount: s.matchCount, revision: s.revision, dataVersionId: s.dataVersionId }));
    return {
      content: [{ type: "text", text: seasons.length ? seasons.map((s) => `${s.id} — ${s.league} ${s.name} (${s.matchCount} matches)`).join("\n") : "No seasons found." }],
      structuredContent: { seasons },
    };
  },
});
