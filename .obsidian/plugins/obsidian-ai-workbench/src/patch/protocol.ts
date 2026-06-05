import { WriteBackMode } from "../types";

export interface WriteBackPlan {
  mode: WriteBackMode;
  content: string;
  sourceTitle: string;
  resultPath: string | null;
}
