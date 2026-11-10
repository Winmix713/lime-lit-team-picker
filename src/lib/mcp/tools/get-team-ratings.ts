import { defineTool, ToolError } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { currentVersionId, publicRpc } from "../supabase";

export default defineTool({
  name: "get_team_ratings",
  title: "Get team ratings",
  description: "Return the current team strength ratings computed by the WinMix engine for a league.",
  inputSchema: { league: z.enum(["angol", "spanyol"]).describe("League: angol (English) or spanyol (Spanish).") },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ league }) => {
    const version = await currentVersionId();
    if (!version) throw new ToolError("No published data yet.");
    const data = await publicRpc("winmix_cloud_ratings", { p_version: version, p_league: league });
    return { content: [{ type: "text", text: JSON.stringify(data ?? null) }] };
  },
});
