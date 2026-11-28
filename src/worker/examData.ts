import { Exam } from "../shared/exam";
import fa25mt1 from "../../content/exams/cs61a-fa25-mt1.json";
import fa25mt2 from "../../content/exams/cs61a-fa25-mt2.json";
import fa25final from "../../content/exams/cs61a-fa25-final.json";

/**
 * 限时测验的完整内容（带标准答案），打包进 Worker，不经过公开的静态文件（故事 3.5）。
 * 新增测验：在 content/exams/ 放 JSON，在这里加一行 import。
 */
export const EXAMS = new Map<string, Exam>([fa25mt1, fa25mt2, fa25final].map((raw) => {
  const e = Exam.parse(raw);
  return [e.id, e];
}));
