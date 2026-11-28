// 生成课程包、知识块、OJ 题目与作业包的 JSON Schema：npx tsx scripts/schema.ts（改了 src/shared/package.ts、blockSchema.ts 或 problem.ts 之后跑一次）
import { writeFileSync } from "node:fs";
import { blockJsonSchema } from "../src/shared/blockSchema";
import { packageJsonSchema } from "../src/shared/package";
import { assignmentJsonSchema, problemJsonSchema } from "../src/shared/problem";

writeFileSync("content/schema/course-v1.json", JSON.stringify(packageJsonSchema(), null, 1) + "\n");
writeFileSync("content/schema/block-v1.json", JSON.stringify(blockJsonSchema(), null, 1) + "\n");
writeFileSync("content/schema/problem-v1.json", JSON.stringify(problemJsonSchema(), null, 1) + "\n");
writeFileSync("content/schema/assignment-v1.json", JSON.stringify(assignmentJsonSchema(), null, 1) + "\n");
