export type QuestionType =
  | "text"
  | "longText"
  | "number"
  | "dropdown"
  | "checkbox"
  | "radio";

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
}
