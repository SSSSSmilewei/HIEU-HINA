import { Router } from "../http";
import { applicationRoutes } from "./applications";
import { attendanceRoutes } from "./attendance";
import { authRoutes } from "./auth";
import { heatmapRoutes } from "./heatmap";
import { learningRoutes } from "./learning";
import { levelRoutes } from "./levels";
import { memberRoutes } from "./members";
import { noticeRoutes } from "./notices";
import { ojRoutes } from "./oj";
import { ojAiRoutes } from "./ojAi";
import { examRoutes } from "./exams";
import { videoRoutes } from "./videos";
import { pinRoutes } from "./pins";
import { reflectionRoutes } from "./reflections";
import { repoRoutes } from "./repos";
import { tokenRoutes } from "./tokens";
import { siteRoutes } from "./site";
import { startRoutes } from "./start";

/**
 * 网站和手机 App 的全部接口，都在 /api 下。
 * 按板块分文件：登录、签到、导学、公告与比赛、热力图、公共信息与 App 更新、成员管理、晨思夜思、蓝色钉子、新生报名、新生任务、闯关、OJ 判题、学员仓库。
 */
export const api = new Router();
authRoutes(api);
attendanceRoutes(api);
learningRoutes(api);
noticeRoutes(api);
heatmapRoutes(api);
siteRoutes(api);
memberRoutes(api);
reflectionRoutes(api);
pinRoutes(api);
applicationRoutes(api);
startRoutes(api);
levelRoutes(api);
ojRoutes(api);
ojAiRoutes(api);
examRoutes(api);
videoRoutes(api);
repoRoutes(api);
tokenRoutes(api);
