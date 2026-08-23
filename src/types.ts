export type QuestionGroup = 'content' | 'instructor' | 'logistics';

export interface Question {
  col: number;
  label: string;
  group: QuestionGroup;
  mean: number;
}

export interface GroupMeans {
  content: number;
  instructor: number;
  logistics: number;
}

export interface SampleQuote {
  text: string;
  tag: 'مثبت' | 'ترکیبی' | 'منفی' | string;
}

export interface QualitativeData {
  n_comments: number;
  pct_of_participants: number;
  sentiment_counts: Record<string, number>;
  sentiment_pct: Record<string, number>;
  theme_counts: Record<string, number>;
  theme_pct_of_comments: Record<string, number>;
  sample_quotes: SampleQuote[];
}

export interface EventData {
  n_participants: number;
  date_start_jalali: string;
  date_end_jalali: string;
  overall_mean: number;
  group_means: GroupMeans;
  instructor_group_label?: string;
  questions: Question[];
  narrative: string;
  qualitative: QualitativeData;
  recommendations: string[];
}

export interface PerEventSummary {
  event: string;
  n: number;
  content_mean: number;
  instructor_mean: number;
  logistics_mean: number;
  overall_mean: number;
  n_comments: number;
}

export interface ComparisonData {
  total_participants: number;
  total_comments: number;
  best_event: string;
  worst_event: string;
  aggregate_theme_counts: Record<string, number>;
  aggregate_sentiment_counts: Record<string, number>;
  narrative: string;
  per_event_summary: PerEventSummary[];
}

export interface Dataset {
  events: Record<string, EventData>;
  comparison: ComparisonData;
}

export type ViewType =
  | 'overview'
  | 'event1_quantitative'
  | 'event1_qualitative'
  | 'event2_quantitative'
  | 'event2_qualitative'
  | 'event3_quantitative'
  | 'event3_qualitative'
  | 'event4_quantitative'
  | 'event4_qualitative'
  | 'comparison';
