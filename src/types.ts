export type Grade = '6' | '7' | '8' | '9' | '10' | '11' | '12';

export interface SubItem {
  id: string;
  title: string;
}

export interface Topic {
  id: string;
  grade: Grade;
  title: string;
  description: string;
  subItems: SubItem[];
}

export interface AssessmentLevel {
  knowing: number;
  understanding: number;
  applying: number;
}

export interface MatrixRow {
  id: string;
  topicTitle: string;
  contentTitle: string;
  tnkq_choice: AssessmentLevel;
  tnkq_tf: AssessmentLevel;
  tnkq_short: AssessmentLevel;
  essay: AssessmentLevel;
  points?: {
    tnkq_choice: AssessmentLevel;
    tnkq_tf: AssessmentLevel;
    tnkq_short: AssessmentLevel;
    essay: AssessmentLevel;
  };
}

export interface SpecLevel {
  levelName: string;
  requirements: string[];
  questionCounts: {
    tnkq_choice: number;
    tnkq_tf: number;
    tnkq_short: number;
    essay: number;
  };
}

export interface SpecItem {
  topicTitle: string;
  contentTitle: string;
  levels: SpecLevel[];
}
export interface MatrixData {
  rows: MatrixRow[];
  config: {
    pointsPerQuestion: {
      tnkq_choice: number;
      tnkq_tf: number;
      tnkq_short: number;
      essay: number;
    };
    targets: {
      tnkq_choice: number;
      tnkq_tf: number;
      tnkq_short: number;
      essay: number;
      knowing: number;
      understanding: number;
      applying: number;
    };
  };
}
