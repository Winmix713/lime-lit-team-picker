import { defineMcp } from "@lovable.dev/mcp-js";
import listSeasons from "./tools/list-seasons";
import getSeasonMatches from "./tools/get-season-matches";
import getTeamRatings from "./tools/get-team-ratings";

export default defineMcp({
  name: "bolt-to-lovable",
  title: "Bolt to Lovable",
  version: "0.1.0",
  instructions:
    "Read-only WinMix football data. Use list_seasons to find seasons, get_season_matches for results, and get_team_ratings for engine ratings.",
  tools: [listSeasons, getSeasonMatches, getTeamRatings],
});
