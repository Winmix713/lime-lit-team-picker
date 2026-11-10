import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { currentVersionId, publicRpc } from "../supabase";

export default defineTool({
  name: "get_season_matches",
  title: "Get season matches",
  description: "Return the match results of one season. Get season IDs from list_seasons.",
  inputSchema: { seasonId: z.string().min(1).describe("Season ID from list_seasons.") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ seasonId }) => {
    const version = await currentVersionId();
    if (!version) throw new ToolError("No published data yet.");
    const seasons = ((await publicRpc("winmix_cloud_seasons", { p_version: version, p_league: null })) ?? []) as Array<{ id: string; revision: number }>;
    const season = seasons.find((s) => s.id === seasonId);
    if (!season) throw new ToolError("Unknown season ID; call list_seasons first.");
    const data = (await publicRpc("winmix_cloud_season", { p_season: season.id, p_version: version, p_revision: season.revision })) as {
      matches: Array<{ match_no: number; date: string | null; home_team: string; away_team: string; home_score: number; away_score: number; ht_home_score: number | null; ht_away_score: number | null }>;
    };
    const matches = (data?.matches ?? []).map((m) => ({
      matchNo: m.match_no, date: m.date, home: m.home_team, away: m.away_team,
      homeScore: m.home_score, awayScore: m.away_score, htHome: m.ht_home_score, htAway: m.ht_away_score,
    }));
    return {
      content: [{ type: "text", text: matches.map((m) => `${m.matchNo}. ${m.date ?? ""} ${m.home} ${m.homeScore}-${m.awayScore} ${m.away}`).join("\n") || "No matches." }],
      structuredContent: { matches },
    };
  },
});
