export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      winmix_calibration_bins: {
        Row: {
          band_key: string
          calibrated: boolean
          calibration_gap: number | null
          created_at: string
          evaluable: boolean
          league: string
          lower_bound: number
          market_code: string
          mean_predicted_probability: number | null
          min_required_sample: number
          observed_rate: number | null
          run_id: string
          sample_count: number
          upper_bound: number
          wilson_ci_high: number | null
          wilson_ci_low: number | null
        }
        Insert: {
          band_key: string
          calibrated?: boolean
          calibration_gap?: number | null
          created_at?: string
          evaluable?: boolean
          league: string
          lower_bound: number
          market_code: string
          mean_predicted_probability?: number | null
          min_required_sample?: number
          observed_rate?: number | null
          run_id: string
          sample_count?: number
          upper_bound: number
          wilson_ci_high?: number | null
          wilson_ci_low?: number | null
        }
        Update: {
          band_key?: string
          calibrated?: boolean
          calibration_gap?: number | null
          created_at?: string
          evaluable?: boolean
          league?: string
          lower_bound?: number
          market_code?: string
          mean_predicted_probability?: number | null
          min_required_sample?: number
          observed_rate?: number | null
          run_id?: string
          sample_count?: number
          upper_bound?: number
          wilson_ci_high?: number | null
          wilson_ci_low?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_calibration_bins_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_calibration_bins_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_calibration_refits: {
        Row: {
          fitted_at: string
          id: string
          league: string
          log_loss_after: number | null
          log_loss_before: number | null
          model_component: string
          new_temperature: number
          previous_temperature: number | null
          refit_sequence: number
          run_id: string
          training_sample_count: number
        }
        Insert: {
          fitted_at?: string
          id?: string
          league: string
          log_loss_after?: number | null
          log_loss_before?: number | null
          model_component: string
          new_temperature: number
          previous_temperature?: number | null
          refit_sequence: number
          run_id: string
          training_sample_count: number
        }
        Update: {
          fitted_at?: string
          id?: string
          league?: string
          log_loss_after?: number | null
          log_loss_before?: number | null
          model_component?: string
          new_temperature?: number
          previous_temperature?: number | null
          refit_sequence?: number
          run_id?: string
          training_sample_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_calibration_refits_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_calibration_results: {
        Row: {
          brier: number | null
          created_at: string
          ece: number | null
          league: string
          log_loss: number | null
          market_code: string
          metrics: Json
          run_id: string
          sample_count: number
        }
        Insert: {
          brier?: number | null
          created_at?: string
          ece?: number | null
          league: string
          log_loss?: number | null
          market_code: string
          metrics?: Json
          run_id: string
          sample_count: number
        }
        Update: {
          brier?: number | null
          created_at?: string
          ece?: number | null
          league?: string
          log_loss?: number | null
          market_code?: string
          metrics?: Json
          run_id?: string
          sample_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_calibration_results_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_calibration_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_cloud_operators: {
        Row: {
          created_at: string
          enabled: boolean
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          enabled?: boolean
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          enabled?: boolean
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      winmix_core_decisions: {
        Row: {
          away_team_id: string
          core_slot: string | null
          created_at: string
          data_version_id: string
          decision_score: number | null
          decision_trace: Json
          ess_weight: number | null
          fixture_request_id: string
          gate_calibration_passed: boolean | null
          gate_data_sufficiency_passed: boolean | null
          gate_ess_passed: boolean | null
          gate_failed_reason: string | null
          gate_penalty_passed: boolean | null
          gate_quadrant_passed: boolean | null
          gate_stability_passed: boolean | null
          h2h_pct: number | null
          home_team_id: string
          id: string
          kish_ess: number | null
          league: string
          market_code: string
          model_prob: number | null
          parameter_snapshot_id: string
          penalty_multiplier: number | null
          penalty_score: number | null
          recency_weight: number | null
          round_fixture_id: string
          round_request_id: string
          run_id: string
          selected: boolean
        }
        Insert: {
          away_team_id: string
          core_slot?: string | null
          created_at?: string
          data_version_id: string
          decision_score?: number | null
          decision_trace?: Json
          ess_weight?: number | null
          fixture_request_id: string
          gate_calibration_passed?: boolean | null
          gate_data_sufficiency_passed?: boolean | null
          gate_ess_passed?: boolean | null
          gate_failed_reason?: string | null
          gate_penalty_passed?: boolean | null
          gate_quadrant_passed?: boolean | null
          gate_stability_passed?: boolean | null
          h2h_pct?: number | null
          home_team_id: string
          id?: string
          kish_ess?: number | null
          league: string
          market_code: string
          model_prob?: number | null
          parameter_snapshot_id: string
          penalty_multiplier?: number | null
          penalty_score?: number | null
          recency_weight?: number | null
          round_fixture_id: string
          round_request_id: string
          run_id: string
          selected?: boolean
        }
        Update: {
          away_team_id?: string
          core_slot?: string | null
          created_at?: string
          data_version_id?: string
          decision_score?: number | null
          decision_trace?: Json
          ess_weight?: number | null
          fixture_request_id?: string
          gate_calibration_passed?: boolean | null
          gate_data_sufficiency_passed?: boolean | null
          gate_ess_passed?: boolean | null
          gate_failed_reason?: string | null
          gate_penalty_passed?: boolean | null
          gate_quadrant_passed?: boolean | null
          gate_stability_passed?: boolean | null
          h2h_pct?: number | null
          home_team_id?: string
          id?: string
          kish_ess?: number | null
          league?: string
          market_code?: string
          model_prob?: number | null
          parameter_snapshot_id?: string
          penalty_multiplier?: number | null
          penalty_score?: number | null
          recency_weight?: number | null
          round_fixture_id?: string
          round_request_id?: string
          run_id?: string
          selected?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "winmix_core_decisions_fixture_identity_fkey"
            columns: [
              "round_fixture_id",
              "round_request_id",
              "league",
              "home_team_id",
              "away_team_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: [
              "id",
              "round_request_id",
              "league",
              "home_team_id",
              "away_team_id",
            ]
          },
          {
            foreignKeyName: "winmix_core_decisions_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_core_decisions_parent_provenance_fkey"
            columns: [
              "round_request_id",
              "run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_round_requests"
            referencedColumns: [
              "id",
              "source_run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
          {
            foreignKeyName: "winmix_core_decisions_request_coherence_fkey"
            columns: ["fixture_request_id", "round_request_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_fixture_prediction_requests"
            referencedColumns: ["id", "round_request_id", "league"]
          },
          {
            foreignKeyName: "winmix_core_decisions_run_provenance_fkey"
            columns: ["run_id", "data_version_id", "parameter_snapshot_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: [
              "id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
        ]
      }
      winmix_data_versions: {
        Row: {
          content_fingerprint: string | null
          created_at: string
          expected_matches_per_season: number
          id: string
          ingest_revision: number
          is_current: boolean
          league_coverage: Json
          match_count: number
          sealed_at: string | null
          season_count: number
          source_description: string | null
          status: string
          updated_at: string
          version_key: string
        }
        Insert: {
          content_fingerprint?: string | null
          created_at?: string
          expected_matches_per_season?: number
          id?: string
          ingest_revision?: number
          is_current?: boolean
          league_coverage?: Json
          match_count?: number
          sealed_at?: string | null
          season_count?: number
          source_description?: string | null
          status?: string
          updated_at?: string
          version_key: string
        }
        Update: {
          content_fingerprint?: string | null
          created_at?: string
          expected_matches_per_season?: number
          id?: string
          ingest_revision?: number
          is_current?: boolean
          league_coverage?: Json
          match_count?: number
          sealed_at?: string | null
          season_count?: number
          source_description?: string | null
          status?: string
          updated_at?: string
          version_key?: string
        }
        Relationships: []
      }
      winmix_engine_jobs: {
        Row: {
          attempt_count: number
          claim_token: string | null
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          data_version_id: string
          finished_at: string | null
          id: string
          idempotency_key: string
          last_error_code: string | null
          last_error_message: string | null
          operation_type: string
          parameter_snapshot_id: string
          request_reason: string | null
          requested_by: string | null
          started_at: string | null
          status: string
        }
        Insert: {
          attempt_count?: number
          claim_token?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          data_version_id: string
          finished_at?: string | null
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          last_error_message?: string | null
          operation_type?: string
          parameter_snapshot_id: string
          request_reason?: string | null
          requested_by?: string | null
          started_at?: string | null
          status?: string
        }
        Update: {
          attempt_count?: number
          claim_token?: string | null
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          data_version_id?: string
          finished_at?: string | null
          id?: string
          idempotency_key?: string
          last_error_code?: string | null
          last_error_message?: string | null
          operation_type?: string
          parameter_snapshot_id?: string
          request_reason?: string | null
          requested_by?: string | null
          started_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_engine_jobs_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_engine_jobs_snapshot_dv_fkey"
            columns: ["parameter_snapshot_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_parameter_snapshots"
            referencedColumns: ["id", "data_version_id"]
          },
        ]
      }
      winmix_engine_runs: {
        Row: {
          data_version_id: string
          duration_ms: number | null
          engine_version: string
          error_code: string | null
          error_message: string | null
          finished_at: string | null
          id: string
          input_fingerprint: string
          is_current: boolean
          job_id: string
          parameter_snapshot_id: string
          promoted_at: string | null
          result_summary: Json
          started_at: string
          status: string
          validated_at: string | null
          validation_status: string
        }
        Insert: {
          data_version_id: string
          duration_ms?: number | null
          engine_version: string
          error_code?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_fingerprint: string
          is_current?: boolean
          job_id: string
          parameter_snapshot_id: string
          promoted_at?: string | null
          result_summary?: Json
          started_at?: string
          status?: string
          validated_at?: string | null
          validation_status?: string
        }
        Update: {
          data_version_id?: string
          duration_ms?: number | null
          engine_version?: string
          error_code?: string | null
          error_message?: string | null
          finished_at?: string | null
          id?: string
          input_fingerprint?: string
          is_current?: boolean
          job_id?: string
          parameter_snapshot_id?: string
          promoted_at?: string | null
          result_summary?: Json
          started_at?: string
          status?: string
          validated_at?: string | null
          validation_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_engine_runs_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_engine_runs_job_consistency_fkey"
            columns: ["job_id", "data_version_id", "parameter_snapshot_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_jobs"
            referencedColumns: [
              "id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
          {
            foreignKeyName: "winmix_engine_runs_parameter_snapshot_id_fkey"
            columns: ["parameter_snapshot_id"]
            isOneToOne: false
            referencedRelation: "winmix_parameter_snapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_evaluation_windows: {
        Row: {
          baseline_brier: number | null
          baseline_log_loss: number | null
          created_at: string
          ece: number | null
          ensemble_brier: number | null
          ensemble_log_loss: number | null
          league: string
          market_code: string
          metrics: Json
          run_id: string
          sample_count: number
          skill_brier: number | null
          skill_ci_high: number | null
          skill_ci_low: number | null
          skill_log_loss: number | null
          window_end_sequence: number
          window_size: number
          window_start_sequence: number
        }
        Insert: {
          baseline_brier?: number | null
          baseline_log_loss?: number | null
          created_at?: string
          ece?: number | null
          ensemble_brier?: number | null
          ensemble_log_loss?: number | null
          league: string
          market_code?: string
          metrics?: Json
          run_id: string
          sample_count: number
          skill_brier?: number | null
          skill_ci_high?: number | null
          skill_ci_low?: number | null
          skill_log_loss?: number | null
          window_end_sequence: number
          window_size?: number
          window_start_sequence: number
        }
        Update: {
          baseline_brier?: number | null
          baseline_log_loss?: number | null
          created_at?: string
          ece?: number | null
          ensemble_brier?: number | null
          ensemble_log_loss?: number | null
          league?: string
          market_code?: string
          metrics?: Json
          run_id?: string
          sample_count?: number
          skill_brier?: number | null
          skill_ci_high?: number | null
          skill_ci_low?: number | null
          skill_log_loss?: number | null
          window_end_sequence?: number
          window_size?: number
          window_start_sequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_evaluation_windows_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_evaluation_windows_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_fixture_prediction_cards: {
        Row: {
          away_team_id: string
          card: Json
          created_at: string
          decision_trace: Json
          fixture_no: number
          home_team_id: string
          id: string
          league: string
          request_id: string
          round_fixture_id: string
          round_request_id: string
        }
        Insert: {
          away_team_id: string
          card: Json
          created_at?: string
          decision_trace?: Json
          fixture_no: number
          home_team_id: string
          id?: string
          league: string
          request_id: string
          round_fixture_id: string
          round_request_id: string
        }
        Update: {
          away_team_id?: string
          card?: Json
          created_at?: string
          decision_trace?: Json
          fixture_no?: number
          home_team_id?: string
          id?: string
          league?: string
          request_id?: string
          round_fixture_id?: string
          round_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_fixture_prediction_cards_fixture_coherence_fkey"
            columns: [
              "round_fixture_id",
              "round_request_id",
              "fixture_no",
              "league",
              "home_team_id",
              "away_team_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: [
              "id",
              "round_request_id",
              "fixture_no",
              "league",
              "home_team_id",
              "away_team_id",
            ]
          },
          {
            foreignKeyName: "winmix_fixture_prediction_cards_request_coherence_fkey"
            columns: ["request_id", "round_request_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_fixture_prediction_requests"
            referencedColumns: ["id", "round_request_id", "league"]
          },
        ]
      }
      winmix_fixture_prediction_requests: {
        Row: {
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          cutoff_at: string | null
          data_version_id: string
          error_code: string | null
          error_message: string | null
          id: string
          idempotency_key: string
          input_hash: string
          league: string
          parameter_snapshot_id: string
          published_at: string | null
          request_payload: Json
          round_request_id: string
          source_run_id: string
          status: string
          updated_at: string
        }
        Insert: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          cutoff_at?: string | null
          data_version_id: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key: string
          input_hash: string
          league: string
          parameter_snapshot_id: string
          published_at?: string | null
          request_payload?: Json
          round_request_id: string
          source_run_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          claimed_at?: string | null
          claimed_by?: string | null
          created_at?: string
          cutoff_at?: string | null
          data_version_id?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string
          input_hash?: string
          league?: string
          parameter_snapshot_id?: string
          published_at?: string | null
          request_payload?: Json
          round_request_id?: string
          source_run_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_fixture_prediction_requests_parent_coherence_fkey"
            columns: [
              "round_request_id",
              "source_run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_round_requests"
            referencedColumns: [
              "id",
              "source_run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
          {
            foreignKeyName: "winmix_fixture_prediction_requests_run_consistency_fkey"
            columns: [
              "source_run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: [
              "id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
        ]
      }
      winmix_h2h_pairs: {
        Row: {
          avg_goals: number | null
          away_goals: number
          away_team_id: string
          away_win_pct: number | null
          away_wins: number
          btts_count: number
          btts_rate: number | null
          created_at: string
          data_version_id: string
          draw_pct: number | null
          draws: number
          even_goals_count: number
          even_goals_pct: number | null
          home_goals: number
          home_team_id: string
          home_win_pct: number | null
          home_wins: number
          ht_coverage_pct: number | null
          htft_distribution: Json
          htft_sample_count: number
          kish_ess: number | null
          league: string
          meetings: number
          odd_goals_count: number
          odd_goals_pct: number | null
          over15_count: number
          over15_pct: number | null
          over25_count: number
          over25_rate: number | null
          over35_count: number
          over35_pct: number | null
          recency_mode: string
          recent_avg_goals: number | null
          recent_btts_pct: number | null
          recent_over25_pct: number | null
          run_id: string
        }
        Insert: {
          avg_goals?: number | null
          away_goals?: number
          away_team_id: string
          away_win_pct?: number | null
          away_wins?: number
          btts_count?: number
          btts_rate?: number | null
          created_at?: string
          data_version_id: string
          draw_pct?: number | null
          draws?: number
          even_goals_count?: number
          even_goals_pct?: number | null
          home_goals?: number
          home_team_id: string
          home_win_pct?: number | null
          home_wins?: number
          ht_coverage_pct?: number | null
          htft_distribution?: Json
          htft_sample_count?: number
          kish_ess?: number | null
          league: string
          meetings?: number
          odd_goals_count?: number
          odd_goals_pct?: number | null
          over15_count?: number
          over15_pct?: number | null
          over25_count?: number
          over25_rate?: number | null
          over35_count?: number
          over35_pct?: number | null
          recency_mode?: string
          recent_avg_goals?: number | null
          recent_btts_pct?: number | null
          recent_over25_pct?: number | null
          run_id: string
        }
        Update: {
          avg_goals?: number | null
          away_goals?: number
          away_team_id?: string
          away_win_pct?: number | null
          away_wins?: number
          btts_count?: number
          btts_rate?: number | null
          created_at?: string
          data_version_id?: string
          draw_pct?: number | null
          draws?: number
          even_goals_count?: number
          even_goals_pct?: number | null
          home_goals?: number
          home_team_id?: string
          home_win_pct?: number | null
          home_wins?: number
          ht_coverage_pct?: number | null
          htft_distribution?: Json
          htft_sample_count?: number
          kish_ess?: number | null
          league?: string
          meetings?: number
          odd_goals_count?: number
          odd_goals_pct?: number | null
          over15_count?: number
          over15_pct?: number | null
          over25_count?: number
          over25_rate?: number | null
          over35_count?: number
          over35_pct?: number | null
          recency_mode?: string
          recent_avg_goals?: number | null
          recent_btts_pct?: number | null
          recent_over25_pct?: number | null
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_h2h_pairs_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
        ]
      }
      winmix_import_batches: {
        Row: {
          created_at: string
          data_version_id: string | null
          error_code: string | null
          error_message: string | null
          id: string
          processed_at: string | null
          source_sha256: string | null
          status: string
          storage_bucket: string
          storage_path: string
          validation_report: Json
        }
        Insert: {
          created_at?: string
          data_version_id?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          source_sha256?: string | null
          status?: string
          storage_bucket?: string
          storage_path: string
          validation_report?: Json
        }
        Update: {
          created_at?: string
          data_version_id?: string | null
          error_code?: string | null
          error_message?: string | null
          id?: string
          processed_at?: string | null
          source_sha256?: string | null
          status?: string
          storage_bucket?: string
          storage_path?: string
          validation_report?: Json
        }
        Relationships: [
          {
            foreignKeyName: "winmix_import_batches_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_ingest_receipts: {
        Row: {
          actor_id: string | null
          created_at: string
          data_version_id: string
          payload_hash: string
          receipt: Json
          request_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          data_version_id: string
          payload_hash: string
          receipt: Json
          request_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          data_version_id?: string
          payload_hash?: string
          receipt?: Json
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_ingest_receipts_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_markets: {
        Row: {
          active: boolean
          category: string
          display_name: string
          market_code: string
          settlement_kind: string
        }
        Insert: {
          active?: boolean
          category: string
          display_name: string
          market_code: string
          settlement_kind: string
        }
        Update: {
          active?: boolean
          category?: string
          display_name?: string
          market_code?: string
          settlement_kind?: string
        }
        Relationships: []
      }
      winmix_match_features: {
        Row: {
          created_at: string
          data_version_id: string
          feature_schema_version: number
          features: Json
          match_id: string
          run_id: string
          sequence_no: number
        }
        Insert: {
          created_at?: string
          data_version_id: string
          feature_schema_version: number
          features: Json
          match_id: string
          run_id: string
          sequence_no: number
        }
        Update: {
          created_at?: string
          data_version_id?: string
          feature_schema_version?: number
          features?: Json
          match_id?: string
          run_id?: string
          sequence_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_match_features_match_dv_fkey"
            columns: ["match_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_match_features_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
        ]
      }
      winmix_match_outcomes: {
        Row: {
          away_score: number
          btts: boolean | null
          correction_note: string | null
          home_score: number
          ht_away_score: number | null
          ht_home_score: number | null
          id: string
          match_id: string
          outcome: string | null
          recorded_at: string
          recorded_by: string | null
          source: string
          total_goals: number | null
          version: number
        }
        Insert: {
          away_score: number
          btts?: boolean | null
          correction_note?: string | null
          home_score: number
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          match_id: string
          outcome?: string | null
          recorded_at?: string
          recorded_by?: string | null
          source?: string
          total_goals?: number | null
          version?: number
        }
        Update: {
          away_score?: number
          btts?: boolean | null
          correction_note?: string | null
          home_score?: number
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          match_id?: string
          outcome?: string | null
          recorded_at?: string
          recorded_by?: string | null
          source?: string
          total_goals?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_match_outcomes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_matches: {
        Row: {
          away_name_snapshot: string
          away_score: number
          away_team_id: string
          btts: boolean | null
          created_at: string
          data_version_id: string
          home_name_snapshot: string
          home_score: number
          home_team_id: string
          ht_away_score: number | null
          ht_home_score: number | null
          id: string
          kickoff_iso: string | null
          league: string
          match_date_raw: string | null
          match_no: number
          outcome: string | null
          row_index: number | null
          season_id: string
          source_file_id: string | null
          total_goals: number | null
        }
        Insert: {
          away_name_snapshot: string
          away_score: number
          away_team_id: string
          btts?: boolean | null
          created_at?: string
          data_version_id: string
          home_name_snapshot: string
          home_score: number
          home_team_id: string
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          kickoff_iso?: string | null
          league: string
          match_date_raw?: string | null
          match_no: number
          outcome?: string | null
          row_index?: number | null
          season_id: string
          source_file_id?: string | null
          total_goals?: number | null
        }
        Update: {
          away_name_snapshot?: string
          away_score?: number
          away_team_id?: string
          btts?: boolean | null
          created_at?: string
          data_version_id?: string
          home_name_snapshot?: string
          home_score?: number
          home_team_id?: string
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          kickoff_iso?: string | null
          league?: string
          match_date_raw?: string | null
          match_no?: number
          outcome?: string | null
          row_index?: number | null
          season_id?: string
          source_file_id?: string | null
          total_goals?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_cloud_match_version_fk"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_matches_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_matches_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_matches_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_matches_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_matches_season_consistency_fkey"
            columns: ["season_id", "league", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_seasons"
            referencedColumns: ["id", "league", "data_version_id"]
          },
        ]
      }
      winmix_pair_penalty: {
        Row: {
          accuracy_pct: number | null
          activation_mode: string
          away_team_id: string
          brier_sum: number
          consecutive_failures: number
          evidence_count: number
          expected_yes_sum: number
          home_team_id: string
          id: string
          is_suppressed: boolean
          last_failure_at: string | null
          last_success_at: string | null
          last_updated: string
          league: string
          log_loss_sum: number
          market_code: string
          observed_yes_count: number
          penalty_score: number
          shadow_accuracy_pct: number | null
          shadow_consecutive_failures: number
          shadow_is_suppressed: boolean
          shadow_last_failure_at: string | null
          shadow_last_success_at: string | null
          shadow_log_loss_sum: number
          shadow_penalty_score: number
          shadow_suppressed_until: string | null
          suppressed_until: string | null
          suppression_reason: string | null
          total_correct: number
          total_predictions: number
        }
        Insert: {
          accuracy_pct?: number | null
          activation_mode?: string
          away_team_id: string
          brier_sum?: number
          consecutive_failures?: number
          evidence_count?: number
          expected_yes_sum?: number
          home_team_id: string
          id?: string
          is_suppressed?: boolean
          last_failure_at?: string | null
          last_success_at?: string | null
          last_updated?: string
          league: string
          log_loss_sum?: number
          market_code: string
          observed_yes_count?: number
          penalty_score?: number
          shadow_accuracy_pct?: number | null
          shadow_consecutive_failures?: number
          shadow_is_suppressed?: boolean
          shadow_last_failure_at?: string | null
          shadow_last_success_at?: string | null
          shadow_log_loss_sum?: number
          shadow_penalty_score?: number
          shadow_suppressed_until?: string | null
          suppressed_until?: string | null
          suppression_reason?: string | null
          total_correct?: number
          total_predictions?: number
        }
        Update: {
          accuracy_pct?: number | null
          activation_mode?: string
          away_team_id?: string
          brier_sum?: number
          consecutive_failures?: number
          evidence_count?: number
          expected_yes_sum?: number
          home_team_id?: string
          id?: string
          is_suppressed?: boolean
          last_failure_at?: string | null
          last_success_at?: string | null
          last_updated?: string
          league?: string
          log_loss_sum?: number
          market_code?: string
          observed_yes_count?: number
          penalty_score?: number
          shadow_accuracy_pct?: number | null
          shadow_consecutive_failures?: number
          shadow_is_suppressed?: boolean
          shadow_last_failure_at?: string | null
          shadow_last_success_at?: string | null
          shadow_log_loss_sum?: number
          shadow_penalty_score?: number
          shadow_suppressed_until?: string | null
          suppressed_until?: string | null
          suppression_reason?: string | null
          total_correct?: number
          total_predictions?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_pair_penalty_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
        ]
      }
      winmix_pair_penalty_events: {
        Row: {
          actual_yes: boolean
          away_team_id: string
          brier_contribution: number | null
          created_at: string
          feedback_id: string
          home_team_id: string
          id: string
          league: string
          log_loss_contribution: number | null
          market_code: string
          mode: string
          outcome_link_id: string
          predicted_pct: number
          predicted_yes: boolean
          prediction_correct: boolean | null
        }
        Insert: {
          actual_yes: boolean
          away_team_id: string
          brier_contribution?: number | null
          created_at?: string
          feedback_id: string
          home_team_id: string
          id?: string
          league: string
          log_loss_contribution?: number | null
          market_code: string
          mode?: string
          outcome_link_id: string
          predicted_pct: number
          predicted_yes: boolean
          prediction_correct?: boolean | null
        }
        Update: {
          actual_yes?: boolean
          away_team_id?: string
          brier_contribution?: number | null
          created_at?: string
          feedback_id?: string
          home_team_id?: string
          id?: string
          league?: string
          log_loss_contribution?: number | null
          market_code?: string
          mode?: string
          outcome_link_id?: string
          predicted_pct?: number
          predicted_yes?: boolean
          prediction_correct?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_pair_penalty_events_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "winmix_current_prediction_settlements"
            referencedColumns: ["feedback_id"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "winmix_prediction_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_outcome_link_id_fkey"
            columns: ["outcome_link_id"]
            isOneToOne: true
            referencedRelation: "winmix_current_prediction_settlements"
            referencedColumns: ["outcome_link_id"]
          },
          {
            foreignKeyName: "winmix_pair_penalty_events_outcome_link_id_fkey"
            columns: ["outcome_link_id"]
            isOneToOne: true
            referencedRelation: "winmix_prediction_outcome_links"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_parameter_snapshots: {
        Row: {
          created_at: string
          data_version_id: string
          experiments: Json
          feature_schema_version: number
          history_scope: string
          id: string
          manual_weight_overrides: Json
          model_version: string
          parameters_fingerprint: string | null
          pipeline_contract_version: number
          settings: Json
          weights: Json
        }
        Insert: {
          created_at?: string
          data_version_id: string
          experiments?: Json
          feature_schema_version: number
          history_scope: string
          id?: string
          manual_weight_overrides?: Json
          model_version: string
          parameters_fingerprint?: string | null
          pipeline_contract_version: number
          settings?: Json
          weights?: Json
        }
        Update: {
          created_at?: string
          data_version_id?: string
          experiments?: Json
          feature_schema_version?: number
          history_scope?: string
          id?: string
          manual_weight_overrides?: Json
          model_version?: string
          parameters_fingerprint?: string | null
          pipeline_contract_version?: number
          settings?: Json
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "winmix_parameter_snapshots_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_pipeline_checkpoints: {
        Row: {
          calib_history: Json | null
          calibration_t: number | null
          ensemble_tuned: boolean | null
          ensemble_w_m1: number | null
          experiments_key: string
          feature_schema_version: number
          fit_history: Json | null
          history_scope: string
          league: string
          m1_fit: Json | null
          prefix_signature: string
          processed_match_count: number
          run_id: string
          saved_at: string
          weights_signature: string
        }
        Insert: {
          calib_history?: Json | null
          calibration_t?: number | null
          ensemble_tuned?: boolean | null
          ensemble_w_m1?: number | null
          experiments_key: string
          feature_schema_version: number
          fit_history?: Json | null
          history_scope: string
          league: string
          m1_fit?: Json | null
          prefix_signature: string
          processed_match_count: number
          run_id: string
          saved_at?: string
          weights_signature: string
        }
        Update: {
          calib_history?: Json | null
          calibration_t?: number | null
          ensemble_tuned?: boolean | null
          ensemble_w_m1?: number | null
          experiments_key?: string
          feature_schema_version?: number
          fit_history?: Json | null
          history_scope?: string
          league?: string
          m1_fit?: Json | null
          prefix_signature?: string
          processed_match_count?: number
          run_id?: string
          saved_at?: string
          weights_signature?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_pipeline_checkpoints_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_prediction_feedback: {
        Row: {
          away_team_id: string
          calibration_band_at_prediction: string | null
          calibration_band_n_at_prediction: number | null
          core_slot: string | null
          created_at: string
          fixture_date: string | null
          fixture_request_id: string | null
          home_team_id: string
          id: string
          kish_ess_at_prediction: number | null
          league: string
          market_code: string
          match_id: string | null
          penalty_score_at_prediction: number | null
          predicted_pct: number
          predicted_yes: boolean
          round_fixture_id: string | null
          round_request_id: string | null
          run_id: string
          selection_id: string | null
          source: string
        }
        Insert: {
          away_team_id: string
          calibration_band_at_prediction?: string | null
          calibration_band_n_at_prediction?: number | null
          core_slot?: string | null
          created_at?: string
          fixture_date?: string | null
          fixture_request_id?: string | null
          home_team_id: string
          id?: string
          kish_ess_at_prediction?: number | null
          league: string
          market_code: string
          match_id?: string | null
          penalty_score_at_prediction?: number | null
          predicted_pct: number
          predicted_yes: boolean
          round_fixture_id?: string | null
          round_request_id?: string | null
          run_id: string
          selection_id?: string | null
          source?: string
        }
        Update: {
          away_team_id?: string
          calibration_band_at_prediction?: string | null
          calibration_band_n_at_prediction?: number | null
          core_slot?: string | null
          created_at?: string
          fixture_date?: string | null
          fixture_request_id?: string | null
          home_team_id?: string
          id?: string
          kish_ess_at_prediction?: number | null
          league?: string
          market_code?: string
          match_id?: string | null
          penalty_score_at_prediction?: number | null
          predicted_pct?: number
          predicted_yes?: boolean
          round_fixture_id?: string | null
          round_request_id?: string | null
          run_id?: string
          selection_id?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_prediction_feedback_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_prediction_feedback_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_feedback_round_fixture_identity_fkey"
            columns: [
              "round_fixture_id",
              "round_request_id",
              "league",
              "home_team_id",
              "away_team_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: [
              "id",
              "round_request_id",
              "league",
              "home_team_id",
              "away_team_id",
            ]
          },
          {
            foreignKeyName: "winmix_prediction_feedback_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_feedback_selection_id_fkey"
            columns: ["selection_id"]
            isOneToOne: false
            referencedRelation: "winmix_fixture_prediction_selections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_feedback_selection_id_fkey"
            columns: ["selection_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_selections"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_prediction_outcome_links: {
        Row: {
          feedback_id: string
          id: string
          link_source: string
          linked_at: string
          match_outcome_id: string | null
          round_fixture_outcome_id: string | null
        }
        Insert: {
          feedback_id: string
          id?: string
          link_source?: string
          linked_at?: string
          match_outcome_id?: string | null
          round_fixture_outcome_id?: string | null
        }
        Update: {
          feedback_id?: string
          id?: string
          link_source?: string
          linked_at?: string
          match_outcome_id?: string | null
          round_fixture_outcome_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_prediction_outcome_links_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "winmix_current_prediction_settlements"
            referencedColumns: ["feedback_id"]
          },
          {
            foreignKeyName: "winmix_prediction_outcome_links_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "winmix_prediction_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_outcome_links_match_outcome_id_fkey"
            columns: ["match_outcome_id"]
            isOneToOne: false
            referencedRelation: "winmix_current_match_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_outcome_links_match_outcome_id_fkey"
            columns: ["match_outcome_id"]
            isOneToOne: false
            referencedRelation: "winmix_match_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_outcome_links_round_fixture_outcome_id_fkey"
            columns: ["round_fixture_outcome_id"]
            isOneToOne: false
            referencedRelation: "winmix_current_round_fixture_outcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_prediction_outcome_links_round_fixture_outcome_id_fkey"
            columns: ["round_fixture_outcome_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_fixture_outcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_predictions: {
        Row: {
          confidence: number | null
          created_at: string
          data_version_id: string
          lambda_away: number | null
          lambda_home: number | null
          markets: Json
          match_id: string
          model_output: Json
          outcome_away: number
          outcome_draw: number
          outcome_home: number
          recommendation: Json
          run_id: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          data_version_id: string
          lambda_away?: number | null
          lambda_home?: number | null
          markets?: Json
          match_id: string
          model_output?: Json
          outcome_away: number
          outcome_draw: number
          outcome_home: number
          recommendation?: Json
          run_id: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          data_version_id?: string
          lambda_away?: number | null
          lambda_home?: number | null
          markets?: Json
          match_id?: string
          model_output?: Json
          outcome_away?: number
          outcome_draw?: number
          outcome_home?: number
          recommendation?: Json
          run_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_predictions_match_dv_fkey"
            columns: ["match_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_predictions_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
        ]
      }
      winmix_round_fixture_match_links: {
        Row: {
          correction_note: string | null
          id: string
          is_active: boolean
          link_source: string
          linked_at: string
          match_id: string
          round_fixture_id: string
          version: number
        }
        Insert: {
          correction_note?: string | null
          id?: string
          is_active?: boolean
          link_source?: string
          linked_at?: string
          match_id: string
          round_fixture_id: string
          version?: number
        }
        Update: {
          correction_note?: string | null
          id?: string
          is_active?: boolean
          link_source?: string
          linked_at?: string
          match_id?: string
          round_fixture_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_fixture_match_links_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_round_fixture_match_links_round_fixture_id_fkey"
            columns: ["round_fixture_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_round_fixture_outcomes: {
        Row: {
          away_score: number
          btts: boolean | null
          correction_note: string | null
          home_score: number
          ht_away_score: number | null
          ht_home_score: number | null
          id: string
          outcome: string | null
          recorded_at: string
          recorded_by: string | null
          round_fixture_id: string
          source: string
          total_goals: number | null
          version: number
        }
        Insert: {
          away_score: number
          btts?: boolean | null
          correction_note?: string | null
          home_score: number
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          outcome?: string | null
          recorded_at?: string
          recorded_by?: string | null
          round_fixture_id: string
          source?: string
          total_goals?: number | null
          version?: number
        }
        Update: {
          away_score?: number
          btts?: boolean | null
          correction_note?: string | null
          home_score?: number
          ht_away_score?: number | null
          ht_home_score?: number | null
          id?: string
          outcome?: string | null
          recorded_at?: string
          recorded_by?: string | null
          round_fixture_id?: string
          source?: string
          total_goals?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_fixture_outcomes_round_fixture_id_fkey"
            columns: ["round_fixture_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_round_fixtures: {
        Row: {
          away_team_id: string
          created_at: string
          external_fixture_key: string | null
          fixture_no: number
          home_team_id: string
          id: string
          kickoff_at: string | null
          league: string
          league_slot: number
          round_request_id: string
        }
        Insert: {
          away_team_id: string
          created_at?: string
          external_fixture_key?: string | null
          fixture_no: number
          home_team_id: string
          id?: string
          kickoff_at?: string | null
          league: string
          league_slot: number
          round_request_id: string
        }
        Update: {
          away_team_id?: string
          created_at?: string
          external_fixture_key?: string | null
          fixture_no?: number
          home_team_id?: string
          id?: string
          kickoff_at?: string | null
          league?: string
          league_slot?: number
          round_request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_fixtures_away_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_round_fixtures_away_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_round_fixtures_home_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_round_fixtures_home_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_round_fixtures_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_round_fixtures_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_selection_trace"
            referencedColumns: ["round_request_id"]
          },
        ]
      }
      winmix_round_requests: {
        Row: {
          created_at: string
          data_version_id: string
          error_code: string | null
          error_message: string | null
          id: string
          idempotency_key: string
          input_hash: string
          parameter_snapshot_id: string
          published_at: string | null
          request_payload: Json
          settled_at: string | null
          source_run_id: string
          status: string
          strategy: string
          strategy_version: string
          submitted_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_version_id: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key: string
          input_hash: string
          parameter_snapshot_id: string
          published_at?: string | null
          request_payload?: Json
          settled_at?: string | null
          source_run_id: string
          status?: string
          strategy: string
          strategy_version?: string
          submitted_at?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_version_id?: string
          error_code?: string | null
          error_message?: string | null
          id?: string
          idempotency_key?: string
          input_hash?: string
          parameter_snapshot_id?: string
          published_at?: string | null
          request_payload?: Json
          settled_at?: string | null
          source_run_id?: string
          status?: string
          strategy?: string
          strategy_version?: string
          submitted_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_requests_run_consistency_fkey"
            columns: [
              "source_run_id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: [
              "id",
              "data_version_id",
              "parameter_snapshot_id",
            ]
          },
        ]
      }
      winmix_round_selections: {
        Row: {
          card_id: string | null
          created_at: string
          id: string
          market_key: string | null
          round_request_id: string
          selection_kind: string
          selection_trace: Json
          slot_no: number
        }
        Insert: {
          card_id?: string | null
          created_at?: string
          id?: string
          market_key?: string | null
          round_request_id: string
          selection_kind: string
          selection_trace?: Json
          slot_no: number
        }
        Update: {
          card_id?: string | null
          created_at?: string
          id?: string
          market_key?: string | null
          round_request_id?: string
          selection_kind?: string
          selection_trace?: Json
          slot_no?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_selections_card_round_fkey"
            columns: ["round_request_id", "card_id"]
            isOneToOne: true
            referencedRelation: "winmix_fixture_prediction_cards"
            referencedColumns: ["round_request_id", "id"]
          },
          {
            foreignKeyName: "winmix_round_selections_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_round_selections_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_selection_trace"
            referencedColumns: ["round_request_id"]
          },
        ]
      }
      winmix_round_standings: {
        Row: {
          created_at: string
          data_version_id: string
          goal_diff: number
          goals_against: number
          goals_for: number
          league: string
          played: number
          points: number
          position: number
          round_no: number
          run_id: string
          season_id: string
          team_id: string
        }
        Insert: {
          created_at?: string
          data_version_id: string
          goal_diff?: number
          goals_against?: number
          goals_for?: number
          league: string
          played?: number
          points?: number
          position: number
          round_no: number
          run_id: string
          season_id: string
          team_id: string
        }
        Update: {
          created_at?: string
          data_version_id?: string
          goal_diff?: number
          goals_against?: number
          goals_for?: number
          league?: string
          played?: number
          points?: number
          position?: number
          round_no?: number
          run_id?: string
          season_id?: string
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_standings_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_round_standings_season_consistency_fkey"
            columns: ["season_id", "league", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_seasons"
            referencedColumns: ["id", "league", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_round_standings_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_round_standings_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
        ]
      }
      winmix_run_statistics: {
        Row: {
          actionable_correct: number
          actionable_total: number
          argmax_correct: number
          argmax_total: number
          brier_score: number | null
          created_at: string
          ece: number | null
          league: string
          log_loss: number | null
          metrics: Json
          run_id: string
          sample_count: number
          skill_ci_high: number | null
          skill_ci_low: number | null
        }
        Insert: {
          actionable_correct?: number
          actionable_total?: number
          argmax_correct?: number
          argmax_total?: number
          brier_score?: number | null
          created_at?: string
          ece?: number | null
          league: string
          log_loss?: number | null
          metrics?: Json
          run_id: string
          sample_count?: number
          skill_ci_high?: number | null
          skill_ci_low?: number | null
        }
        Update: {
          actionable_correct?: number
          actionable_total?: number
          argmax_correct?: number
          argmax_total?: number
          brier_score?: number | null
          created_at?: string
          ece?: number | null
          league?: string
          log_loss?: number | null
          metrics?: Json
          run_id?: string
          sample_count?: number
          skill_ci_high?: number | null
          skill_ci_low?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_run_statistics_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_seasons: {
        Row: {
          content_hash: string | null
          created_at: string
          data_version_id: string
          file_name: string
          id: string
          league: string
          match_count: number
          name: string
          order_mode: string
          season_index: number
          source_season_key: string
        }
        Insert: {
          content_hash?: string | null
          created_at?: string
          data_version_id: string
          file_name: string
          id?: string
          league: string
          match_count?: number
          name: string
          order_mode?: string
          season_index: number
          source_season_key: string
        }
        Update: {
          content_hash?: string | null
          created_at?: string
          data_version_id?: string
          file_name?: string
          id?: string
          league?: string
          match_count?: number
          name?: string
          order_mode?: string
          season_index?: number
          source_season_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_cloud_season_version_fk"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_seasons_data_version_id_fkey"
            columns: ["data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_data_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_team_season_stats: {
        Row: {
          away_draws: number
          away_ga: number
          away_gf: number
          away_losses: number
          away_played: number
          away_wins: number
          btts_rate: number | null
          clean_sheet_rate: number | null
          created_at: string
          data_version_id: string
          draws: number
          failed_to_score_rate: number | null
          form_last5: string | null
          goals_against: number
          goals_for: number
          home_draws: number
          home_ga: number
          home_gf: number
          home_losses: number
          home_played: number
          home_wins: number
          league: string
          losses: number
          over25_rate: number | null
          played: number
          points: number
          position: number | null
          ppg: number | null
          run_id: string
          season_id: string
          team_id: string
          wins: number
        }
        Insert: {
          away_draws?: number
          away_ga?: number
          away_gf?: number
          away_losses?: number
          away_played?: number
          away_wins?: number
          btts_rate?: number | null
          clean_sheet_rate?: number | null
          created_at?: string
          data_version_id: string
          draws?: number
          failed_to_score_rate?: number | null
          form_last5?: string | null
          goals_against?: number
          goals_for?: number
          home_draws?: number
          home_ga?: number
          home_gf?: number
          home_losses?: number
          home_played?: number
          home_wins?: number
          league: string
          losses?: number
          over25_rate?: number | null
          played?: number
          points?: number
          position?: number | null
          ppg?: number | null
          run_id: string
          season_id: string
          team_id: string
          wins?: number
        }
        Update: {
          away_draws?: number
          away_ga?: number
          away_gf?: number
          away_losses?: number
          away_played?: number
          away_wins?: number
          btts_rate?: number | null
          clean_sheet_rate?: number | null
          created_at?: string
          data_version_id?: string
          draws?: number
          failed_to_score_rate?: number | null
          form_last5?: string | null
          goals_against?: number
          goals_for?: number
          home_draws?: number
          home_ga?: number
          home_gf?: number
          home_losses?: number
          home_played?: number
          home_wins?: number
          league?: string
          losses?: number
          over25_rate?: number | null
          played?: number
          points?: number
          position?: number | null
          ppg?: number | null
          run_id?: string
          season_id?: string
          team_id?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_team_season_stats_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_team_season_stats_season_consistency_fkey"
            columns: ["season_id", "league", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_seasons"
            referencedColumns: ["id", "league", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_team_season_stats_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_team_season_stats_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
        ]
      }
      winmix_team_state_snapshots: {
        Row: {
          as_of_match_id: string | null
          created_at: string
          data_version_id: string
          league: string
          run_id: string
          sequence_no: number
          state: Json
          team_id: string
        }
        Insert: {
          as_of_match_id?: string | null
          created_at?: string
          data_version_id: string
          league: string
          run_id: string
          sequence_no: number
          state: Json
          team_id: string
        }
        Update: {
          as_of_match_id?: string | null
          created_at?: string
          data_version_id?: string
          league?: string
          run_id?: string
          sequence_no?: number
          state?: Json
          team_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmix_team_state_snapshots_asof_match_dv_fkey"
            columns: ["as_of_match_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_team_state_snapshots_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
          {
            foreignKeyName: "winmix_team_state_snapshots_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_team_state_snapshots_team_league_fkey"
            columns: ["team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
        ]
      }
      winmix_teams: {
        Row: {
          canonical_key: string
          display_name: string
          id: string
          league: string
          updated_at: string
          weight_index: number
          weight_source: string
        }
        Insert: {
          canonical_key: string
          display_name: string
          id?: string
          league: string
          updated_at?: string
          weight_index?: number
          weight_source?: string
        }
        Update: {
          canonical_key?: string
          display_name?: string
          id?: string
          league?: string
          updated_at?: string
          weight_index?: number
          weight_source?: string
        }
        Relationships: []
      }
      winmix_validation_runs: {
        Row: {
          contract_version: string
          executed_at: string
          failed_count: number
          failure_details: Json
          id: string
          passed_count: number
          run_id: string
          status: string
          suite_code: string
          total_count: number
        }
        Insert: {
          contract_version: string
          executed_at?: string
          failed_count?: number
          failure_details?: Json
          id?: string
          passed_count?: number
          run_id: string
          status: string
          suite_code: string
          total_count?: number
        }
        Update: {
          contract_version?: string
          executed_at?: string
          failed_count?: number
          failure_details?: Json
          id?: string
          passed_count?: number
          run_id?: string
          status?: string
          suite_code?: string
          total_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmix_validation_runs_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixcalibrationbins: {
        Row: {
          bandkey: string
          calibrated: boolean
          calibrationgap: number | null
          createdat: string
          evaluable: boolean
          league: string
          lowerbound: number
          marketcode: string
          meanpredictedprobability: number | null
          minrequiredsample: number
          observedrate: number | null
          runid: string
          samplecount: number
          upperbound: number
          wilsoncihigh: number | null
          wilsoncilow: number | null
        }
        Insert: {
          bandkey: string
          calibrated?: boolean
          calibrationgap?: number | null
          createdat?: string
          evaluable?: boolean
          league: string
          lowerbound: number
          marketcode: string
          meanpredictedprobability?: number | null
          minrequiredsample?: number
          observedrate?: number | null
          runid: string
          samplecount?: number
          upperbound: number
          wilsoncihigh?: number | null
          wilsoncilow?: number | null
        }
        Update: {
          bandkey?: string
          calibrated?: boolean
          calibrationgap?: number | null
          createdat?: string
          evaluable?: boolean
          league?: string
          lowerbound?: number
          marketcode?: string
          meanpredictedprobability?: number | null
          minrequiredsample?: number
          observedrate?: number | null
          runid?: string
          samplecount?: number
          upperbound?: number
          wilsoncihigh?: number | null
          wilsoncilow?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmixcalibrationbins_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixcalibrationbins_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixcalibrationrefits: {
        Row: {
          fittedat: string
          id: string
          league: string
          loglossafter: number | null
          loglossbefore: number | null
          modelcomponent: string
          newtemperature: number
          previoustemperature: number | null
          refitsequence: number
          runid: string
          trainingsamplecount: number
        }
        Insert: {
          fittedat?: string
          id?: string
          league: string
          loglossafter?: number | null
          loglossbefore?: number | null
          modelcomponent: string
          newtemperature: number
          previoustemperature?: number | null
          refitsequence: number
          runid: string
          trainingsamplecount: number
        }
        Update: {
          fittedat?: string
          id?: string
          league?: string
          loglossafter?: number | null
          loglossbefore?: number | null
          modelcomponent?: string
          newtemperature?: number
          previoustemperature?: number | null
          refitsequence?: number
          runid?: string
          trainingsamplecount?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixcalibrationrefits_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixcalibrationresults: {
        Row: {
          brier: number | null
          createdat: string
          ece: number | null
          league: string
          logloss: number | null
          marketcode: string
          metrics: Json
          runid: string
          samplecount: number
        }
        Insert: {
          brier?: number | null
          createdat?: string
          ece?: number | null
          league: string
          logloss?: number | null
          marketcode: string
          metrics?: Json
          runid: string
          samplecount: number
        }
        Update: {
          brier?: number | null
          createdat?: string
          ece?: number | null
          league?: string
          logloss?: number | null
          marketcode?: string
          metrics?: Json
          runid?: string
          samplecount?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixcalibrationresults_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixcalibrationresults_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixconductorproposals: {
        Row: {
          createdat: string | null
          currentvalue: number
          id: string
          league: string
          metric: string
          proposedvalue: number
          reason: string
          status: string | null
          teamkey: string
        }
        Insert: {
          createdat?: string | null
          currentvalue: number
          id?: string
          league: string
          metric: string
          proposedvalue: number
          reason: string
          status?: string | null
          teamkey: string
        }
        Update: {
          createdat?: string | null
          currentvalue?: number
          id?: string
          league?: string
          metric?: string
          proposedvalue?: number
          reason?: string
          status?: string | null
          teamkey?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixconductorproposals_team_league_fkey"
            columns: ["teamkey", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["canonical_key", "league"]
          },
          {
            foreignKeyName: "winmixconductorproposals_team_league_fkey"
            columns: ["teamkey", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["canonical_key", "league"]
          },
        ]
      }
      winmixcoredecisions: {
        Row: {
          awayteamid: string
          coreslot: string | null
          createdat: string
          dataversionid: string
          decisionscore: number | null
          decisiontrace: Json
          essweight: number | null
          fixturerequestid: string
          gatecalibrationpassed: boolean | null
          gatedatasufficiencypassed: boolean | null
          gateesspassed: boolean | null
          gatefailedreason: string | null
          gatepenaltypassed: boolean | null
          gatequadrantpassed: boolean | null
          gatestabilitypassed: boolean | null
          h2hpct: number | null
          hometeamid: string
          id: string
          kishess: number | null
          league: string
          marketcode: string
          modelprob: number | null
          parametersnapshotid: string
          penaltymultiplier: number | null
          penaltyscore: number | null
          recencyweight: number | null
          roundfixtureid: string
          roundrequestid: string
          runid: string
          selected: boolean
        }
        Insert: {
          awayteamid: string
          coreslot?: string | null
          createdat?: string
          dataversionid: string
          decisionscore?: number | null
          decisiontrace?: Json
          essweight?: number | null
          fixturerequestid: string
          gatecalibrationpassed?: boolean | null
          gatedatasufficiencypassed?: boolean | null
          gateesspassed?: boolean | null
          gatefailedreason?: string | null
          gatepenaltypassed?: boolean | null
          gatequadrantpassed?: boolean | null
          gatestabilitypassed?: boolean | null
          h2hpct?: number | null
          hometeamid: string
          id?: string
          kishess?: number | null
          league: string
          marketcode: string
          modelprob?: number | null
          parametersnapshotid: string
          penaltymultiplier?: number | null
          penaltyscore?: number | null
          recencyweight?: number | null
          roundfixtureid: string
          roundrequestid: string
          runid: string
          selected?: boolean
        }
        Update: {
          awayteamid?: string
          coreslot?: string | null
          createdat?: string
          dataversionid?: string
          decisionscore?: number | null
          decisiontrace?: Json
          essweight?: number | null
          fixturerequestid?: string
          gatecalibrationpassed?: boolean | null
          gatedatasufficiencypassed?: boolean | null
          gateesspassed?: boolean | null
          gatefailedreason?: string | null
          gatepenaltypassed?: boolean | null
          gatequadrantpassed?: boolean | null
          gatestabilitypassed?: boolean | null
          h2hpct?: number | null
          hometeamid?: string
          id?: string
          kishess?: number | null
          league?: string
          marketcode?: string
          modelprob?: number | null
          parametersnapshotid?: string
          penaltymultiplier?: number | null
          penaltyscore?: number | null
          recencyweight?: number | null
          roundfixtureid?: string
          roundrequestid?: string
          runid?: string
          selected?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "winmixcoredecisions_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_fixturerequestid_fkey"
            columns: ["fixturerequestid"]
            isOneToOne: false
            referencedRelation: "winmixfixturepredictionrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixcoredecisions_parametersnapshotid_fkey"
            columns: ["parametersnapshotid"]
            isOneToOne: false
            referencedRelation: "winmixparametersnapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_roundfixtureid_fkey"
            columns: ["roundfixtureid"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixcoredecisions_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixdataversions: {
        Row: {
          contentfingerprint: string | null
          createdat: string
          expectedmatchesperseason: number
          id: string
          iscurrent: boolean
          leaguecoverage: Json
          matchcount: number
          sealedat: string | null
          seasoncount: number
          sourcedescription: string | null
          status: string
          updatedat: string
          versionkey: string
        }
        Insert: {
          contentfingerprint?: string | null
          createdat?: string
          expectedmatchesperseason?: number
          id?: string
          iscurrent?: boolean
          leaguecoverage?: Json
          matchcount?: number
          sealedat?: string | null
          seasoncount?: number
          sourcedescription?: string | null
          status?: string
          updatedat?: string
          versionkey: string
        }
        Update: {
          contentfingerprint?: string | null
          createdat?: string
          expectedmatchesperseason?: number
          id?: string
          iscurrent?: boolean
          leaguecoverage?: Json
          matchcount?: number
          sealedat?: string | null
          seasoncount?: number
          sourcedescription?: string | null
          status?: string
          updatedat?: string
          versionkey?: string
        }
        Relationships: []
      }
      winmixenginejobs: {
        Row: {
          attemptcount: number
          claimedat: string | null
          claimedby: string | null
          createdat: string
          dataversionid: string
          finishedat: string | null
          id: string
          idempotencykey: string
          lasterrorcode: string | null
          lasterrormessage: string | null
          operationtype: string
          parametersnapshotid: string
          requestedby: string | null
          requestreason: string | null
          startedat: string | null
          status: string
        }
        Insert: {
          attemptcount?: number
          claimedat?: string | null
          claimedby?: string | null
          createdat?: string
          dataversionid: string
          finishedat?: string | null
          id?: string
          idempotencykey?: string
          lasterrorcode?: string | null
          lasterrormessage?: string | null
          operationtype?: string
          parametersnapshotid: string
          requestedby?: string | null
          requestreason?: string | null
          startedat?: string | null
          status?: string
        }
        Update: {
          attemptcount?: number
          claimedat?: string | null
          claimedby?: string | null
          createdat?: string
          dataversionid?: string
          finishedat?: string | null
          id?: string
          idempotencykey?: string
          lasterrorcode?: string | null
          lasterrormessage?: string | null
          operationtype?: string
          parametersnapshotid?: string
          requestedby?: string | null
          requestreason?: string | null
          startedat?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixenginejobs_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixenginejobs_parametersnapshotid_fkey"
            columns: ["parametersnapshotid"]
            isOneToOne: false
            referencedRelation: "winmixparametersnapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixengineruns: {
        Row: {
          dataversionid: string
          durationms: number | null
          engineversion: string
          errorcode: string | null
          errormessage: string | null
          finishedat: string | null
          id: string
          inputfingerprint: string
          iscurrent: boolean
          jobid: string | null
          parametersnapshotid: string
          promotedat: string | null
          resultsummary: Json
          startedat: string
          status: string
          validatedat: string | null
          validationstatus: string
        }
        Insert: {
          dataversionid: string
          durationms?: number | null
          engineversion: string
          errorcode?: string | null
          errormessage?: string | null
          finishedat?: string | null
          id?: string
          inputfingerprint: string
          iscurrent?: boolean
          jobid?: string | null
          parametersnapshotid: string
          promotedat?: string | null
          resultsummary?: Json
          startedat?: string
          status?: string
          validatedat?: string | null
          validationstatus?: string
        }
        Update: {
          dataversionid?: string
          durationms?: number | null
          engineversion?: string
          errorcode?: string | null
          errormessage?: string | null
          finishedat?: string | null
          id?: string
          inputfingerprint?: string
          iscurrent?: boolean
          jobid?: string | null
          parametersnapshotid?: string
          promotedat?: string | null
          resultsummary?: Json
          startedat?: string
          status?: string
          validatedat?: string | null
          validationstatus?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixengineruns_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixengineruns_jobid_fkey"
            columns: ["jobid"]
            isOneToOne: true
            referencedRelation: "winmixenginejobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixengineruns_parametersnapshotid_fkey"
            columns: ["parametersnapshotid"]
            isOneToOne: false
            referencedRelation: "winmixparametersnapshots"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixevaluationwindows: {
        Row: {
          baselinebrier: number | null
          baselinelogloss: number | null
          createdat: string
          ece: number | null
          ensemblebrier: number | null
          ensemblelogloss: number | null
          league: string
          marketcode: string
          metrics: Json
          runid: string
          samplecount: number
          skillbrier: number | null
          skillcihigh: number | null
          skillcilow: number | null
          skilllogloss: number | null
          windowendsequence: number
          windowsize: number
          windowstartsequence: number
        }
        Insert: {
          baselinebrier?: number | null
          baselinelogloss?: number | null
          createdat?: string
          ece?: number | null
          ensemblebrier?: number | null
          ensemblelogloss?: number | null
          league: string
          marketcode?: string
          metrics?: Json
          runid: string
          samplecount: number
          skillbrier?: number | null
          skillcihigh?: number | null
          skillcilow?: number | null
          skilllogloss?: number | null
          windowendsequence: number
          windowsize?: number
          windowstartsequence: number
        }
        Update: {
          baselinebrier?: number | null
          baselinelogloss?: number | null
          createdat?: string
          ece?: number | null
          ensemblebrier?: number | null
          ensemblelogloss?: number | null
          league?: string
          marketcode?: string
          metrics?: Json
          runid?: string
          samplecount?: number
          skillbrier?: number | null
          skillcihigh?: number | null
          skillcilow?: number | null
          skilllogloss?: number | null
          windowendsequence?: number
          windowsize?: number
          windowstartsequence?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixevaluationwindows_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixevaluationwindows_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixfixturepredictioncards: {
        Row: {
          awayteamid: string
          card: Json
          createdat: string
          decisiontrace: Json
          fixtureno: number
          hometeamid: string
          id: string
          league: string
          requestid: string
          roundfixtureid: string
          roundrequestid: string
        }
        Insert: {
          awayteamid: string
          card: Json
          createdat?: string
          decisiontrace?: Json
          fixtureno: number
          hometeamid: string
          id?: string
          league: string
          requestid: string
          roundfixtureid: string
          roundrequestid: string
        }
        Update: {
          awayteamid?: string
          card?: Json
          createdat?: string
          decisiontrace?: Json
          fixtureno?: number
          hometeamid?: string
          id?: string
          league?: string
          requestid?: string
          roundfixtureid?: string
          roundrequestid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixfixturepredictioncards_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictioncards_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictioncards_requestid_fkey"
            columns: ["requestid"]
            isOneToOne: false
            referencedRelation: "winmixfixturepredictionrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictioncards_roundfixtureid_fkey"
            columns: ["roundfixtureid"]
            isOneToOne: true
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictioncards_roundrequestid_fixtureno_fkey"
            columns: ["roundrequestid", "fixtureno"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["roundrequestid", "fixtureno"]
          },
          {
            foreignKeyName: "winmixfixturepredictioncards_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixfixturepredictionrequests: {
        Row: {
          claimedat: string | null
          claimedby: string | null
          createdat: string
          cutoffat: string | null
          dataversionid: string
          errorcode: string | null
          errormessage: string | null
          id: string
          idempotencykey: string
          inputhash: string
          league: string
          parametersnapshotid: string
          publishedat: string | null
          requestpayload: Json
          roundrequestid: string
          sourcerunid: string
          status: string
          updatedat: string
        }
        Insert: {
          claimedat?: string | null
          claimedby?: string | null
          createdat?: string
          cutoffat?: string | null
          dataversionid: string
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          idempotencykey: string
          inputhash: string
          league: string
          parametersnapshotid: string
          publishedat?: string | null
          requestpayload?: Json
          roundrequestid: string
          sourcerunid: string
          status?: string
          updatedat?: string
        }
        Update: {
          claimedat?: string | null
          claimedby?: string | null
          createdat?: string
          cutoffat?: string | null
          dataversionid?: string
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          idempotencykey?: string
          inputhash?: string
          league?: string
          parametersnapshotid?: string
          publishedat?: string | null
          requestpayload?: Json
          roundrequestid?: string
          sourcerunid?: string
          status?: string
          updatedat?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixfixturepredictionrequests_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictionrequests_parametersnapshotid_fkey"
            columns: ["parametersnapshotid"]
            isOneToOne: false
            referencedRelation: "winmixparametersnapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictionrequests_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixfixturepredictionrequests_sourcerunid_fkey"
            columns: ["sourcerunid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixh2hpairs: {
        Row: {
          avggoals: number | null
          awaygoals: number
          awayteamid: string
          awaywinpct: number | null
          awaywins: number
          bttscount: number
          bttsrate: number | null
          createdat: string
          dataversionid: string
          drawpct: number | null
          draws: number
          evengoalscount: number
          evengoalspct: number | null
          homegoals: number
          hometeamid: string
          homewinpct: number | null
          homewins: number
          htcoveragepct: number | null
          htftdistribution: Json
          htftsamplecount: number
          kishess: number | null
          league: string
          meetings: number
          oddgoalscount: number
          oddgoalspct: number | null
          over15count: number
          over15pct: number | null
          over25count: number
          over25rate: number | null
          over35count: number
          over35pct: number | null
          recencymode: string
          recentavggoals: number | null
          recentbttspct: number | null
          recentover25pct: number | null
          runid: string
        }
        Insert: {
          avggoals?: number | null
          awaygoals?: number
          awayteamid: string
          awaywinpct?: number | null
          awaywins?: number
          bttscount?: number
          bttsrate?: number | null
          createdat?: string
          dataversionid: string
          drawpct?: number | null
          draws?: number
          evengoalscount?: number
          evengoalspct?: number | null
          homegoals?: number
          hometeamid: string
          homewinpct?: number | null
          homewins?: number
          htcoveragepct?: number | null
          htftdistribution?: Json
          htftsamplecount?: number
          kishess?: number | null
          league: string
          meetings?: number
          oddgoalscount?: number
          oddgoalspct?: number | null
          over15count?: number
          over15pct?: number | null
          over25count?: number
          over25rate?: number | null
          over35count?: number
          over35pct?: number | null
          recencymode?: string
          recentavggoals?: number | null
          recentbttspct?: number | null
          recentover25pct?: number | null
          runid: string
        }
        Update: {
          avggoals?: number | null
          awaygoals?: number
          awayteamid?: string
          awaywinpct?: number | null
          awaywins?: number
          bttscount?: number
          bttsrate?: number | null
          createdat?: string
          dataversionid?: string
          drawpct?: number | null
          draws?: number
          evengoalscount?: number
          evengoalspct?: number | null
          homegoals?: number
          hometeamid?: string
          homewinpct?: number | null
          homewins?: number
          htcoveragepct?: number | null
          htftdistribution?: Json
          htftsamplecount?: number
          kishess?: number | null
          league?: string
          meetings?: number
          oddgoalscount?: number
          oddgoalspct?: number | null
          over15count?: number
          over15pct?: number | null
          over25count?: number
          over25rate?: number | null
          over35count?: number
          over35pct?: number | null
          recencymode?: string
          recentavggoals?: number | null
          recentbttspct?: number | null
          recentover25pct?: number | null
          runid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixh2hpairs_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixh2hpairs_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixh2hpairs_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixh2hpairs_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmiximportbatches: {
        Row: {
          createdat: string
          dataversionid: string | null
          errorcode: string | null
          errormessage: string | null
          id: string
          processedat: string | null
          sourcesha256: string | null
          status: string
          storagebucket: string
          storagepath: string
          validationreport: Json
        }
        Insert: {
          createdat?: string
          dataversionid?: string | null
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          processedat?: string | null
          sourcesha256?: string | null
          status?: string
          storagebucket?: string
          storagepath: string
          validationreport?: Json
        }
        Update: {
          createdat?: string
          dataversionid?: string | null
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          processedat?: string | null
          sourcesha256?: string | null
          status?: string
          storagebucket?: string
          storagepath?: string
          validationreport?: Json
        }
        Relationships: [
          {
            foreignKeyName: "winmiximportbatches_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixmarkets: {
        Row: {
          active: boolean
          category: string
          displayname: string
          marketcode: string
          settlementkind: string
        }
        Insert: {
          active?: boolean
          category: string
          displayname: string
          marketcode: string
          settlementkind: string
        }
        Update: {
          active?: boolean
          category?: string
          displayname?: string
          marketcode?: string
          settlementkind?: string
        }
        Relationships: []
      }
      winmixmatches: {
        Row: {
          awayscore: number
          awayteamid: string
          btts: boolean | null
          createdat: string
          dataversionid: string
          homescore: number
          hometeamid: string
          htawayscore: number | null
          hthomescore: number | null
          id: string
          kickoffiso: string | null
          league: string
          matchdateraw: string | null
          matchno: number
          outcome: string | null
          rowindex: number | null
          seasonid: string
          sourcefileid: string | null
          totalgoals: number | null
        }
        Insert: {
          awayscore: number
          awayteamid: string
          btts?: boolean | null
          createdat?: string
          dataversionid: string
          homescore: number
          hometeamid: string
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          kickoffiso?: string | null
          league: string
          matchdateraw?: string | null
          matchno: number
          outcome?: string | null
          rowindex?: number | null
          seasonid: string
          sourcefileid?: string | null
          totalgoals?: number | null
        }
        Update: {
          awayscore?: number
          awayteamid?: string
          btts?: boolean | null
          createdat?: string
          dataversionid?: string
          homescore?: number
          hometeamid?: string
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          kickoffiso?: string | null
          league?: string
          matchdateraw?: string | null
          matchno?: number
          outcome?: string | null
          rowindex?: number | null
          seasonid?: string
          sourcefileid?: string | null
          totalgoals?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmixmatches_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixmatches_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixmatches_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixmatches_seasonid_fkey"
            columns: ["seasonid"]
            isOneToOne: false
            referencedRelation: "winmixseasons"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixmatchfeatures: {
        Row: {
          createdat: string
          dataversionid: string
          features: Json
          featureschemaversion: number
          matchid: string
          runid: string
          sequenceno: number
        }
        Insert: {
          createdat?: string
          dataversionid: string
          features: Json
          featureschemaversion: number
          matchid: string
          runid: string
          sequenceno: number
        }
        Update: {
          createdat?: string
          dataversionid?: string
          features?: Json
          featureschemaversion?: number
          matchid?: string
          runid?: string
          sequenceno?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixmatchfeatures_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixmatchfeatures_matchid_fkey"
            columns: ["matchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixmatchfeatures_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixmatchoutcomes: {
        Row: {
          awayscore: number
          btts: boolean | null
          correctionnote: string | null
          homescore: number
          htawayscore: number | null
          hthomescore: number | null
          id: string
          matchid: string
          outcome: string | null
          recordedat: string
          recordedby: string | null
          source: string
          totalgoals: number | null
          version: number
        }
        Insert: {
          awayscore: number
          btts?: boolean | null
          correctionnote?: string | null
          homescore: number
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          matchid: string
          outcome?: string | null
          recordedat?: string
          recordedby?: string | null
          source?: string
          totalgoals?: number | null
          version?: number
        }
        Update: {
          awayscore?: number
          btts?: boolean | null
          correctionnote?: string | null
          homescore?: number
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          matchid?: string
          outcome?: string | null
          recordedat?: string
          recordedby?: string | null
          source?: string
          totalgoals?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixmatchoutcomes_matchid_fkey"
            columns: ["matchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixpairpenalty: {
        Row: {
          accuracypct: number | null
          activationmode: string
          awayteamid: string
          briersum: number
          consecutivefailures: number
          evidencecount: number
          expectedyessum: number
          hometeamid: string
          id: string
          issuppressed: boolean
          lastfailureat: string | null
          lastsuccessat: string | null
          lastupdated: string
          league: string
          loglosssum: number
          marketcode: string
          observedyescount: number
          penaltyscore: number
          shadowaccuracypct: number | null
          shadowconsecutivefailures: number
          shadowissuppressed: boolean
          shadowlastfailureat: string | null
          shadowlastsuccessat: string | null
          shadowloglosssum: number
          shadowpenaltyscore: number
          shadowsuppresseduntil: string | null
          suppresseduntil: string | null
          suppressionreason: string | null
          totalcorrect: number
          totalpredictions: number
        }
        Insert: {
          accuracypct?: number | null
          activationmode?: string
          awayteamid: string
          briersum?: number
          consecutivefailures?: number
          evidencecount?: number
          expectedyessum?: number
          hometeamid: string
          id?: string
          issuppressed?: boolean
          lastfailureat?: string | null
          lastsuccessat?: string | null
          lastupdated?: string
          league: string
          loglosssum?: number
          marketcode: string
          observedyescount?: number
          penaltyscore?: number
          shadowaccuracypct?: number | null
          shadowconsecutivefailures?: number
          shadowissuppressed?: boolean
          shadowlastfailureat?: string | null
          shadowlastsuccessat?: string | null
          shadowloglosssum?: number
          shadowpenaltyscore?: number
          shadowsuppresseduntil?: string | null
          suppresseduntil?: string | null
          suppressionreason?: string | null
          totalcorrect?: number
          totalpredictions?: number
        }
        Update: {
          accuracypct?: number | null
          activationmode?: string
          awayteamid?: string
          briersum?: number
          consecutivefailures?: number
          evidencecount?: number
          expectedyessum?: number
          hometeamid?: string
          id?: string
          issuppressed?: boolean
          lastfailureat?: string | null
          lastsuccessat?: string | null
          lastupdated?: string
          league?: string
          loglosssum?: number
          marketcode?: string
          observedyescount?: number
          penaltyscore?: number
          shadowaccuracypct?: number | null
          shadowconsecutivefailures?: number
          shadowissuppressed?: boolean
          shadowlastfailureat?: string | null
          shadowlastsuccessat?: string | null
          shadowloglosssum?: number
          shadowpenaltyscore?: number
          shadowsuppresseduntil?: string | null
          suppresseduntil?: string | null
          suppressionreason?: string | null
          totalcorrect?: number
          totalpredictions?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixpairpenalty_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpairpenalty_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpairpenalty_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
        ]
      }
      winmixpairpenaltyevents: {
        Row: {
          actualyes: boolean
          awayteamid: string
          briercontribution: number | null
          createdat: string
          feedbackid: string
          hometeamid: string
          id: string
          league: string
          loglosscontribution: number | null
          marketcode: string
          mode: string
          outcomelinkid: string
          predictedpct: number
          predictedyes: boolean
          predictioncorrect: boolean | null
        }
        Insert: {
          actualyes: boolean
          awayteamid: string
          briercontribution?: number | null
          createdat?: string
          feedbackid: string
          hometeamid: string
          id?: string
          league: string
          loglosscontribution?: number | null
          marketcode: string
          mode?: string
          outcomelinkid: string
          predictedpct: number
          predictedyes: boolean
          predictioncorrect?: boolean | null
        }
        Update: {
          actualyes?: boolean
          awayteamid?: string
          briercontribution?: number | null
          createdat?: string
          feedbackid?: string
          hometeamid?: string
          id?: string
          league?: string
          loglosscontribution?: number | null
          marketcode?: string
          mode?: string
          outcomelinkid?: string
          predictedpct?: number
          predictedyes?: boolean
          predictioncorrect?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "winmixpairpenaltyevents_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpairpenaltyevents_feedbackid_fkey"
            columns: ["feedbackid"]
            isOneToOne: false
            referencedRelation: "winmixpredictionfeedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpairpenaltyevents_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpairpenaltyevents_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixpairpenaltyevents_outcomelinkid_fkey"
            columns: ["outcomelinkid"]
            isOneToOne: true
            referencedRelation: "winmixpredictionoutcomelinks"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixparametersnapshots: {
        Row: {
          createdat: string
          dataversionid: string
          experiments: Json
          featureschemaversion: number
          historyscope: string
          id: string
          manualweightoverrides: Json
          modelversion: string
          parametersfingerprint: string | null
          pipelinecontractversion: number
          settings: Json
          weights: Json
        }
        Insert: {
          createdat?: string
          dataversionid: string
          experiments?: Json
          featureschemaversion: number
          historyscope: string
          id?: string
          manualweightoverrides?: Json
          modelversion: string
          parametersfingerprint?: string | null
          pipelinecontractversion: number
          settings?: Json
          weights?: Json
        }
        Update: {
          createdat?: string
          dataversionid?: string
          experiments?: Json
          featureschemaversion?: number
          historyscope?: string
          id?: string
          manualweightoverrides?: Json
          modelversion?: string
          parametersfingerprint?: string | null
          pipelinecontractversion?: number
          settings?: Json
          weights?: Json
        }
        Relationships: [
          {
            foreignKeyName: "winmixparametersnapshots_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixpipelinecheckpoints: {
        Row: {
          calibhistory: Json | null
          calibrationt: number | null
          ensembletuned: boolean | null
          ensemblewm1: number | null
          experimentskey: string
          featureschemaversion: number
          fithistory: Json | null
          historyscope: string
          league: string
          m1fit: Json | null
          prefixsignature: string
          processedmatchcount: number
          runid: string
          savedat: string
          weightssignature: string
        }
        Insert: {
          calibhistory?: Json | null
          calibrationt?: number | null
          ensembletuned?: boolean | null
          ensemblewm1?: number | null
          experimentskey: string
          featureschemaversion: number
          fithistory?: Json | null
          historyscope: string
          league: string
          m1fit?: Json | null
          prefixsignature: string
          processedmatchcount: number
          runid: string
          savedat?: string
          weightssignature: string
        }
        Update: {
          calibhistory?: Json | null
          calibrationt?: number | null
          ensembletuned?: boolean | null
          ensemblewm1?: number | null
          experimentskey?: string
          featureschemaversion?: number
          fithistory?: Json | null
          historyscope?: string
          league?: string
          m1fit?: Json | null
          prefixsignature?: string
          processedmatchcount?: number
          runid?: string
          savedat?: string
          weightssignature?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixpipelinecheckpoints_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixpredictionfeedback: {
        Row: {
          awayteamid: string
          calibrationbandatprediction: string | null
          calibrationbandnatprediction: number | null
          coreslot: string | null
          createdat: string
          fixturedate: string | null
          fixturerequestid: string | null
          hometeamid: string
          id: string
          kishessatprediction: number | null
          league: string
          marketcode: string
          matchid: string | null
          penaltyscoreatprediction: number | null
          predictedpct: number
          predictedyes: boolean
          roundfixtureid: string | null
          roundrequestid: string | null
          runid: string
          selectionid: string | null
          source: string
        }
        Insert: {
          awayteamid: string
          calibrationbandatprediction?: string | null
          calibrationbandnatprediction?: number | null
          coreslot?: string | null
          createdat?: string
          fixturedate?: string | null
          fixturerequestid?: string | null
          hometeamid: string
          id?: string
          kishessatprediction?: number | null
          league: string
          marketcode: string
          matchid?: string | null
          penaltyscoreatprediction?: number | null
          predictedpct: number
          predictedyes: boolean
          roundfixtureid?: string | null
          roundrequestid?: string | null
          runid: string
          selectionid?: string | null
          source?: string
        }
        Update: {
          awayteamid?: string
          calibrationbandatprediction?: string | null
          calibrationbandnatprediction?: number | null
          coreslot?: string | null
          createdat?: string
          fixturedate?: string | null
          fixturerequestid?: string | null
          hometeamid?: string
          id?: string
          kishessatprediction?: number | null
          league?: string
          marketcode?: string
          matchid?: string | null
          penaltyscoreatprediction?: number | null
          predictedpct?: number
          predictedyes?: boolean
          roundfixtureid?: string | null
          roundrequestid?: string | null
          runid?: string
          selectionid?: string | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixpredictionfeedback_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_fixturerequestid_fkey"
            columns: ["fixturerequestid"]
            isOneToOne: false
            referencedRelation: "winmixfixturepredictionrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_marketcode_fkey"
            columns: ["marketcode"]
            isOneToOne: false
            referencedRelation: "winmixmarkets"
            referencedColumns: ["marketcode"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_matchid_fkey"
            columns: ["matchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_roundfixtureid_fkey"
            columns: ["roundfixtureid"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionfeedback_selectionid_fkey"
            columns: ["selectionid"]
            isOneToOne: false
            referencedRelation: "winmixroundselections"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixpredictionoutcomelinks: {
        Row: {
          feedbackid: string
          id: string
          linkedat: string
          linksource: string
          matchoutcomeid: string | null
          roundfixtureoutcomeid: string | null
        }
        Insert: {
          feedbackid: string
          id?: string
          linkedat?: string
          linksource?: string
          matchoutcomeid?: string | null
          roundfixtureoutcomeid?: string | null
        }
        Update: {
          feedbackid?: string
          id?: string
          linkedat?: string
          linksource?: string
          matchoutcomeid?: string | null
          roundfixtureoutcomeid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winmixpredictionoutcomelinks_feedbackid_fkey"
            columns: ["feedbackid"]
            isOneToOne: false
            referencedRelation: "winmixpredictionfeedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionoutcomelinks_matchoutcomeid_fkey"
            columns: ["matchoutcomeid"]
            isOneToOne: false
            referencedRelation: "winmixmatchoutcomes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictionoutcomelinks_roundfixtureoutcomeid_fkey"
            columns: ["roundfixtureoutcomeid"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtureoutcomes"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixpredictions: {
        Row: {
          confidence: number | null
          createdat: string
          dataversionid: string
          lambdaaway: number | null
          lambdahome: number | null
          markets: Json
          matchid: string
          modeloutput: Json
          outcomeaway: number
          outcomedraw: number
          outcomehome: number
          recommendation: Json
          runid: string
        }
        Insert: {
          confidence?: number | null
          createdat?: string
          dataversionid: string
          lambdaaway?: number | null
          lambdahome?: number | null
          markets?: Json
          matchid: string
          modeloutput?: Json
          outcomeaway: number
          outcomedraw: number
          outcomehome: number
          recommendation?: Json
          runid: string
        }
        Update: {
          confidence?: number | null
          createdat?: string
          dataversionid?: string
          lambdaaway?: number | null
          lambdahome?: number | null
          markets?: Json
          matchid?: string
          modeloutput?: Json
          outcomeaway?: number
          outcomedraw?: number
          outcomehome?: number
          recommendation?: Json
          runid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixpredictions_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictions_matchid_fkey"
            columns: ["matchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixpredictions_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundfixturematchlinks: {
        Row: {
          correctionnote: string | null
          id: string
          is_active: boolean
          linkedat: string
          linksource: string
          matchid: string
          roundfixtureid: string
          version: number
        }
        Insert: {
          correctionnote?: string | null
          id?: string
          is_active?: boolean
          linkedat?: string
          linksource?: string
          matchid: string
          roundfixtureid: string
          version?: number
        }
        Update: {
          correctionnote?: string | null
          id?: string
          is_active?: boolean
          linkedat?: string
          linksource?: string
          matchid?: string
          roundfixtureid?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundfixturematchlinks_matchid_fkey"
            columns: ["matchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundfixturematchlinks_roundfixtureid_fkey"
            columns: ["roundfixtureid"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundfixtureoutcomes: {
        Row: {
          awayscore: number
          btts: boolean | null
          correctionnote: string | null
          homescore: number
          htawayscore: number | null
          hthomescore: number | null
          id: string
          outcome: string | null
          recordedat: string
          recordedby: string | null
          roundfixtureid: string
          source: string
          totalgoals: number | null
          version: number
        }
        Insert: {
          awayscore: number
          btts?: boolean | null
          correctionnote?: string | null
          homescore: number
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          outcome?: string | null
          recordedat?: string
          recordedby?: string | null
          roundfixtureid: string
          source?: string
          totalgoals?: number | null
          version?: number
        }
        Update: {
          awayscore?: number
          btts?: boolean | null
          correctionnote?: string | null
          homescore?: number
          htawayscore?: number | null
          hthomescore?: number | null
          id?: string
          outcome?: string | null
          recordedat?: string
          recordedby?: string | null
          roundfixtureid?: string
          source?: string
          totalgoals?: number | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundfixtureoutcomes_roundfixtureid_fkey"
            columns: ["roundfixtureid"]
            isOneToOne: false
            referencedRelation: "winmixroundfixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundfixtures: {
        Row: {
          awayteamid: string
          createdat: string
          externalfixturekey: string | null
          fixtureno: number
          hometeamid: string
          id: string
          kickoffat: string | null
          league: string
          leagueslot: number
          roundrequestid: string
        }
        Insert: {
          awayteamid: string
          createdat?: string
          externalfixturekey?: string | null
          fixtureno: number
          hometeamid: string
          id?: string
          kickoffat?: string | null
          league: string
          leagueslot: number
          roundrequestid: string
        }
        Update: {
          awayteamid?: string
          createdat?: string
          externalfixturekey?: string | null
          fixtureno?: number
          hometeamid?: string
          id?: string
          kickoffat?: string | null
          league?: string
          leagueslot?: number
          roundrequestid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundfixtures_awayteamid_fkey"
            columns: ["awayteamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundfixtures_hometeamid_fkey"
            columns: ["hometeamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundfixtures_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundrequests: {
        Row: {
          createdat: string
          dataversionid: string
          errorcode: string | null
          errormessage: string | null
          id: string
          idempotencykey: string
          inputhash: string
          parametersnapshotid: string
          publishedat: string | null
          requestpayload: Json
          settledat: string | null
          sourcerunid: string
          status: string
          strategy: string
          strategyversion: string
          submittedat: string
          updatedat: string
        }
        Insert: {
          createdat?: string
          dataversionid: string
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          idempotencykey: string
          inputhash: string
          parametersnapshotid: string
          publishedat?: string | null
          requestpayload?: Json
          settledat?: string | null
          sourcerunid: string
          status?: string
          strategy: string
          strategyversion?: string
          submittedat?: string
          updatedat?: string
        }
        Update: {
          createdat?: string
          dataversionid?: string
          errorcode?: string | null
          errormessage?: string | null
          id?: string
          idempotencykey?: string
          inputhash?: string
          parametersnapshotid?: string
          publishedat?: string | null
          requestpayload?: Json
          settledat?: string | null
          sourcerunid?: string
          status?: string
          strategy?: string
          strategyversion?: string
          submittedat?: string
          updatedat?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundrequests_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundrequests_parametersnapshotid_fkey"
            columns: ["parametersnapshotid"]
            isOneToOne: false
            referencedRelation: "winmixparametersnapshots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundrequests_sourcerunid_fkey"
            columns: ["sourcerunid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundselections: {
        Row: {
          cardid: string | null
          createdat: string
          id: string
          marketkey: string | null
          roundrequestid: string
          selectionkind: string
          selectiontrace: Json
          slotno: number
        }
        Insert: {
          cardid?: string | null
          createdat?: string
          id?: string
          marketkey?: string | null
          roundrequestid: string
          selectionkind: string
          selectiontrace?: Json
          slotno: number
        }
        Update: {
          cardid?: string | null
          createdat?: string
          id?: string
          marketkey?: string | null
          roundrequestid?: string
          selectionkind?: string
          selectiontrace?: Json
          slotno?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundselections_cardid_fkey"
            columns: ["cardid"]
            isOneToOne: false
            referencedRelation: "winmixfixturepredictioncards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundselections_roundrequestid_fkey"
            columns: ["roundrequestid"]
            isOneToOne: false
            referencedRelation: "winmixroundrequests"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixroundstandings: {
        Row: {
          createdat: string
          dataversionid: string
          goaldiff: number
          goalsagainst: number
          goalsfor: number
          league: string
          played: number
          points: number
          position: number
          roundno: number
          runid: string
          seasonid: string
          teamid: string
        }
        Insert: {
          createdat?: string
          dataversionid: string
          goaldiff?: number
          goalsagainst?: number
          goalsfor?: number
          league: string
          played?: number
          points?: number
          position: number
          roundno: number
          runid: string
          seasonid: string
          teamid: string
        }
        Update: {
          createdat?: string
          dataversionid?: string
          goaldiff?: number
          goalsagainst?: number
          goalsfor?: number
          league?: string
          played?: number
          points?: number
          position?: number
          roundno?: number
          runid?: string
          seasonid?: string
          teamid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixroundstandings_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundstandings_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundstandings_seasonid_fkey"
            columns: ["seasonid"]
            isOneToOne: false
            referencedRelation: "winmixseasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixroundstandings_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixrunstatistics: {
        Row: {
          actionablecorrect: number
          actionabletotal: number
          argmaxcorrect: number
          argmaxtotal: number
          brierscore: number | null
          createdat: string
          ece: number | null
          league: string
          logloss: number | null
          metrics: Json
          runid: string
          samplecount: number
          skillcihigh: number | null
          skillcilow: number | null
        }
        Insert: {
          actionablecorrect?: number
          actionabletotal?: number
          argmaxcorrect?: number
          argmaxtotal?: number
          brierscore?: number | null
          createdat?: string
          ece?: number | null
          league: string
          logloss?: number | null
          metrics?: Json
          runid: string
          samplecount?: number
          skillcihigh?: number | null
          skillcilow?: number | null
        }
        Update: {
          actionablecorrect?: number
          actionabletotal?: number
          argmaxcorrect?: number
          argmaxtotal?: number
          brierscore?: number | null
          createdat?: string
          ece?: number | null
          league?: string
          logloss?: number | null
          metrics?: Json
          runid?: string
          samplecount?: number
          skillcihigh?: number | null
          skillcilow?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmixrunstatistics_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixseasons: {
        Row: {
          contenthash: string | null
          createdat: string
          dataversionid: string
          filename: string
          id: string
          league: string
          matchcount: number
          name: string
          ordermode: string
          seasonindex: number
        }
        Insert: {
          contenthash?: string | null
          createdat?: string
          dataversionid: string
          filename: string
          id?: string
          league: string
          matchcount?: number
          name: string
          ordermode?: string
          seasonindex: number
        }
        Update: {
          contenthash?: string | null
          createdat?: string
          dataversionid?: string
          filename?: string
          id?: string
          league?: string
          matchcount?: number
          name?: string
          ordermode?: string
          seasonindex?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixseasons_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixteams: {
        Row: {
          canonicalkey: string
          displayname: string
          id: string
          league: string
          updatedat: string
          weightindex: number
          weightsource: string
        }
        Insert: {
          canonicalkey: string
          displayname: string
          id?: string
          league: string
          updatedat?: string
          weightindex?: number
          weightsource?: string
        }
        Update: {
          canonicalkey?: string
          displayname?: string
          id?: string
          league?: string
          updatedat?: string
          weightindex?: number
          weightsource?: string
        }
        Relationships: []
      }
      winmixteamseasonstats: {
        Row: {
          awaydraws: number
          awayga: number
          awaygf: number
          awaylosses: number
          awayplayed: number
          awaywins: number
          bttsrate: number | null
          cleansheetrate: number | null
          createdat: string
          dataversionid: string
          draws: number
          failedtoscorerate: number | null
          formlast5: string | null
          goalsagainst: number
          goalsfor: number
          homedraws: number
          homega: number
          homegf: number
          homelosses: number
          homeplayed: number
          homewins: number
          league: string
          losses: number
          over25rate: number | null
          played: number
          points: number
          position: number | null
          ppg: number | null
          runid: string
          seasonid: string
          teamid: string
          wins: number
        }
        Insert: {
          awaydraws?: number
          awayga?: number
          awaygf?: number
          awaylosses?: number
          awayplayed?: number
          awaywins?: number
          bttsrate?: number | null
          cleansheetrate?: number | null
          createdat?: string
          dataversionid: string
          draws?: number
          failedtoscorerate?: number | null
          formlast5?: string | null
          goalsagainst?: number
          goalsfor?: number
          homedraws?: number
          homega?: number
          homegf?: number
          homelosses?: number
          homeplayed?: number
          homewins?: number
          league: string
          losses?: number
          over25rate?: number | null
          played?: number
          points?: number
          position?: number | null
          ppg?: number | null
          runid: string
          seasonid: string
          teamid: string
          wins?: number
        }
        Update: {
          awaydraws?: number
          awayga?: number
          awaygf?: number
          awaylosses?: number
          awayplayed?: number
          awaywins?: number
          bttsrate?: number | null
          cleansheetrate?: number | null
          createdat?: string
          dataversionid?: string
          draws?: number
          failedtoscorerate?: number | null
          formlast5?: string | null
          goalsagainst?: number
          goalsfor?: number
          homedraws?: number
          homega?: number
          homegf?: number
          homelosses?: number
          homeplayed?: number
          homewins?: number
          league?: string
          losses?: number
          over25rate?: number | null
          played?: number
          points?: number
          position?: number | null
          ppg?: number | null
          runid?: string
          seasonid?: string
          teamid?: string
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixteamseasonstats_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamseasonstats_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamseasonstats_seasonid_fkey"
            columns: ["seasonid"]
            isOneToOne: false
            referencedRelation: "winmixseasons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamseasonstats_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixteamstatesnapshots: {
        Row: {
          asofmatchid: string | null
          createdat: string
          dataversionid: string
          league: string
          runid: string
          sequenceno: number
          state: Json
          teamid: string
        }
        Insert: {
          asofmatchid?: string | null
          createdat?: string
          dataversionid: string
          league: string
          runid: string
          sequenceno: number
          state: Json
          teamid: string
        }
        Update: {
          asofmatchid?: string | null
          createdat?: string
          dataversionid?: string
          league?: string
          runid?: string
          sequenceno?: number
          state?: Json
          teamid?: string
        }
        Relationships: [
          {
            foreignKeyName: "winmixteamstatesnapshots_asofmatchid_fkey"
            columns: ["asofmatchid"]
            isOneToOne: false
            referencedRelation: "winmixmatches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamstatesnapshots_dataversionid_fkey"
            columns: ["dataversionid"]
            isOneToOne: false
            referencedRelation: "winmixdataversions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamstatesnapshots_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmixteamstatesnapshots_teamid_fkey"
            columns: ["teamid"]
            isOneToOne: false
            referencedRelation: "winmixteams"
            referencedColumns: ["id"]
          },
        ]
      }
      winmixvalidationruns: {
        Row: {
          contractversion: string
          executedat: string
          failedcount: number
          failuredetails: Json
          id: string
          passedcount: number
          runid: string
          status: string
          suitecode: string
          totalcount: number
        }
        Insert: {
          contractversion: string
          executedat?: string
          failedcount?: number
          failuredetails?: Json
          id?: string
          passedcount?: number
          runid: string
          status: string
          suitecode: string
          totalcount?: number
        }
        Update: {
          contractversion?: string
          executedat?: string
          failedcount?: number
          failuredetails?: Json
          id?: string
          passedcount?: number
          runid?: string
          status?: string
          suitecode?: string
          totalcount?: number
        }
        Relationships: [
          {
            foreignKeyName: "winmixvalidationruns_runid_fkey"
            columns: ["runid"]
            isOneToOne: false
            referencedRelation: "winmixengineruns"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      view_team_ratings: {
        Row: {
          auto_weight_index: number | null
          canonical_key: string | null
          display_name: string | null
          league: string | null
          net_away: number | null
          net_home: number | null
          net_overall: number | null
          ppg: number | null
          team_id: string | null
          total_played: number | null
        }
        Relationships: []
      }
      winmix_current_calibration_bins: {
        Row: {
          band_key: string | null
          calibrated: boolean | null
          calibration_gap: number | null
          created_at: string | null
          evaluable: boolean | null
          league: string | null
          lower_bound: number | null
          market_code: string | null
          mean_predicted_probability: number | null
          min_required_sample: number | null
          observed_rate: number | null
          run_id: string | null
          sample_count: number | null
          upper_bound: number | null
          wilson_ci_high: number | null
          wilson_ci_low: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_calibration_bins_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_calibration_bins_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_current_calibration_results: {
        Row: {
          brier: number | null
          created_at: string | null
          ece: number | null
          league: string | null
          log_loss: number | null
          market_code: string | null
          metrics: Json | null
          run_id: string | null
          sample_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_calibration_results_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_calibration_results_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_current_evaluation_windows: {
        Row: {
          baseline_brier: number | null
          baseline_log_loss: number | null
          created_at: string | null
          ece: number | null
          ensemble_brier: number | null
          ensemble_log_loss: number | null
          league: string | null
          market_code: string | null
          metrics: Json | null
          run_id: string | null
          sample_count: number | null
          skill_brier: number | null
          skill_ci_high: number | null
          skill_ci_low: number | null
          skill_log_loss: number | null
          window_end_sequence: number | null
          window_size: number | null
          window_start_sequence: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_evaluation_windows_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
          {
            foreignKeyName: "winmix_evaluation_windows_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_current_h2h_pairs: {
        Row: {
          avg_goals: number | null
          away_goals: number | null
          away_team_id: string | null
          away_win_pct: number | null
          away_wins: number | null
          btts_count: number | null
          btts_rate: number | null
          created_at: string | null
          data_version_id: string | null
          draw_pct: number | null
          draws: number | null
          even_goals_count: number | null
          even_goals_pct: number | null
          home_goals: number | null
          home_team_id: string | null
          home_win_pct: number | null
          home_wins: number | null
          ht_coverage_pct: number | null
          htft_distribution: Json | null
          htft_sample_count: number | null
          kish_ess: number | null
          league: string | null
          meetings: number | null
          odd_goals_count: number | null
          odd_goals_pct: number | null
          over15_count: number | null
          over15_pct: number | null
          over25_count: number | null
          over25_rate: number | null
          over35_count: number | null
          over35_pct: number | null
          recency_mode: string | null
          recent_avg_goals: number | null
          recent_btts_pct: number | null
          recent_over25_pct: number | null
          run_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_h2h_pairs_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_away_team_league_fkey"
            columns: ["away_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "view_team_ratings"
            referencedColumns: ["team_id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_home_team_league_fkey"
            columns: ["home_team_id", "league"]
            isOneToOne: false
            referencedRelation: "winmix_teams"
            referencedColumns: ["id", "league"]
          },
          {
            foreignKeyName: "winmix_h2h_pairs_run_dv_fkey"
            columns: ["run_id", "data_version_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id", "data_version_id"]
          },
        ]
      }
      winmix_current_match_outcomes: {
        Row: {
          away_score: number | null
          btts: boolean | null
          home_score: number | null
          ht_away_score: number | null
          ht_home_score: number | null
          id: string | null
          match_id: string | null
          outcome: string | null
          recorded_at: string | null
          total_goals: number | null
          version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_match_outcomes_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "winmix_matches"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_current_prediction_settlements: {
        Row: {
          actual_yes: boolean | null
          brier_contribution: number | null
          feedback_id: string | null
          log_loss_contribution: number | null
          market_code: string | null
          outcome_id: string | null
          outcome_link_id: string | null
          outcome_version: number | null
          penalty_event_id: string | null
          prediction_correct: boolean | null
          round_fixture_id: string | null
          round_request_id: string | null
          settlement_recorded_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_prediction_feedback_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
        ]
      }
      winmix_current_round_fixture_outcomes: {
        Row: {
          away_score: number | null
          btts: boolean | null
          home_score: number | null
          ht_away_score: number | null
          ht_home_score: number | null
          id: string | null
          outcome: string | null
          recorded_at: string | null
          round_fixture_id: string | null
          total_goals: number | null
          version: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_fixture_outcomes_round_fixture_id_fkey"
            columns: ["round_fixture_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_fixtures"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_current_run_statistics: {
        Row: {
          actionable_correct: number | null
          actionable_total: number | null
          argmax_correct: number | null
          argmax_total: number | null
          brier_score: number | null
          created_at: string | null
          ece: number | null
          league: string | null
          log_loss: number | null
          metrics: Json | null
          run_id: string | null
          sample_count: number | null
          skill_ci_high: number | null
          skill_ci_low: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_run_statistics_run_id_fkey"
            columns: ["run_id"]
            isOneToOne: false
            referencedRelation: "winmix_engine_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      winmix_fixture_prediction_selections: {
        Row: {
          card_id: string | null
          created_at: string | null
          id: string | null
          market_key: string | null
          request_id: string | null
          round_request_id: string | null
          selection_kind: string | null
          selection_trace: Json | null
          slot_no: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_round_selections_card_round_fkey"
            columns: ["round_request_id", "card_id"]
            isOneToOne: true
            referencedRelation: "winmix_fixture_prediction_cards"
            referencedColumns: ["round_request_id", "id"]
          },
          {
            foreignKeyName: "winmix_round_selections_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "winmix_round_selections_round_request_id_fkey"
            columns: ["round_request_id"]
            isOneToOne: false
            referencedRelation: "winmix_round_selection_trace"
            referencedColumns: ["round_request_id"]
          },
        ]
      }
      winmix_round_selection_trace: {
        Row: {
          away_team_id: string | null
          card: Json | null
          card_decision_trace: Json | null
          card_id: string | null
          core_decision_trace: Json | null
          decision_score: number | null
          fixture_no: number | null
          gate_calibration_passed: boolean | null
          gate_data_sufficiency_passed: boolean | null
          gate_ess_passed: boolean | null
          gate_failed_reason: string | null
          gate_penalty_passed: boolean | null
          gate_quadrant_passed: boolean | null
          gate_stability_passed: boolean | null
          h2h_pct: number | null
          home_team_id: string | null
          kish_ess: number | null
          league: string | null
          market_code: string | null
          market_key: string | null
          model_prob: number | null
          round_request_id: string | null
          round_status: string | null
          selection_kind: string | null
          slot_no: number | null
        }
        Relationships: [
          {
            foreignKeyName: "winmix_core_decisions_market_fkey"
            columns: ["market_code"]
            isOneToOne: false
            referencedRelation: "winmix_markets"
            referencedColumns: ["market_code"]
          },
        ]
      }
    }
    Functions: {
      ingest_season_csv: {
        Args: {
          p_file_name: string
          p_league: string
          p_matches: Json
          p_season_index: number
          p_season_name: string
        }
        Returns: string
      }
      submitroundrequest: {
        Args: {
          p_data_version_id: string
          p_fixtures: Json
          p_idempotency_key: string
          p_input_hash: string
          p_parameter_snapshot_id: string
          p_source_run_id: string
          p_strategy: string
        }
        Returns: string
      }
      winmix_claim_next_engine_job: {
        Args: { p_worker: string }
        Returns: {
          attempt_count: number
          claim_token: string | null
          claimed_at: string | null
          claimed_by: string | null
          created_at: string
          data_version_id: string
          finished_at: string | null
          id: string
          idempotency_key: string
          last_error_code: string | null
          last_error_message: string | null
          operation_type: string
          parameter_snapshot_id: string
          request_reason: string | null
          requested_by: string | null
          started_at: string | null
          status: string
        }[]
        SetofOptions: {
          from: "*"
          to: "winmix_engine_jobs"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      winmix_cloud_access: { Args: never; Returns: Json }
      winmix_cloud_can_read: { Args: { p_version: string }; Returns: boolean }
      winmix_cloud_is_operator: { Args: { p_user: string }; Returns: boolean }
      winmix_cloud_ratings: {
        Args: { p_league: string; p_version: string }
        Returns: Json
      }
      winmix_cloud_season: {
        Args: { p_revision: number; p_season: string; p_version: string }
        Returns: Json
      }
      winmix_cloud_seasons: {
        Args: { p_league?: string; p_version: string }
        Returns: Json
      }
      winmix_cloud_versions: { Args: never; Returns: Json }
      winmix_compute_season_content_hash: {
        Args: { p_season_id: string }
        Returns: string
      }
      winmix_finalize_engine_run: {
        Args: {
          p_activate_data_version?: boolean
          p_claim_token: string
          p_duration_ms: number
          p_run_id: string
          p_summary: Json
        }
        Returns: undefined
      }
      winmix_ingest_operator: {
        Args: {
          p_expected_revision: number
          p_payload: Json
          p_request_id: string
          p_version_id: string
        }
        Returns: Json
      }
      winmix_ingest_season_v1: {
        Args: { p_matches: Json; p_mode?: string; p_season: Json }
        Returns: Json
      }
      winmix_ingest_v2: {
        Args: {
          p_actor_id: string
          p_expected_revision: number
          p_payload: Json
          p_request_id: string
          p_version_id: string
        }
        Returns: Json
      }
      winmix_market_actual_yes: {
        Args: {
          p_away_score: number
          p_home_score: number
          p_market_code: string
        }
        Returns: boolean
      }
      winmix_parameter_fingerprint_v1: {
        Args: {
          p_experiments: Json
          p_feature_schema_version: number
          p_history_scope: string
          p_manual_weight_overrides: Json
          p_model_version: string
          p_pipeline_contract_version: number
          p_settings: Json
          p_weights: Json
        }
        Returns: string
      }
      winmix_promote_data_version: {
        Args: { p_data_version_id: string }
        Returns: undefined
      }
      winmix_promote_engine_run: {
        Args: { p_run_id: string }
        Returns: undefined
      }
      winmix_recompute_pair_penalty: {
        Args: {
          p_away_team_id: string
          p_home_team_id: string
          p_league: string
          p_market_code: string
        }
        Returns: undefined
      }
      winmix_requeue_stale_jobs: {
        Args: { p_max_attempts?: number; p_timeout?: string }
        Returns: number
      }
      winmix_require_sha256: {
        Args: { p_field_name: string; p_value: string }
        Returns: undefined
      }
      winmix_settle_feedback: {
        Args: {
          p_feedback_id: string
          p_match_outcome_id?: string
          p_mode?: string
          p_round_fixture_outcome_id?: string
        }
        Returns: string
      }
      winmix_validate_engine_run: {
        Args: { p_claim_token: string; p_run_id: string }
        Returns: string
      }
      winmixparameterfingerprintv1: {
        Args: {
          p_experiments: Json
          p_featureschemaversion: number
          p_historyscope: string
          p_manualweightoverrides: Json
          p_modelversion: string
          p_pipelinecontractversion: number
          p_settings: Json
          p_weights: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
