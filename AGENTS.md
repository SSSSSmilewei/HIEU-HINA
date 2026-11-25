# AGENTS.md · 给接手的人和 AI 看的工作说明

这个仓库是海纳协会（智慧算法网络协会，简称 INAA）的学习平台：网站（Cloudflare Workers + D1 + React）和学员端手机 App（Flutter + flutter_miuix）。


## 工作约定（必须遵守）

- 回复和文案一律用简体中文。
- 求稳：宁可少做，不要把线上弄坏。
- **不经同意不部署。** `main` 分支连着 Cloudflare 自动构建，推到 `main` 就等于上线，所以改动先推到别的分支，等负责人确认再合并。
- 不经同意不提交、不推送。
- App 里禁止用 Material 控件（`app/tool/check_no_material.sh` 会检查），统一用 flutter_miuix 和 `app/lib/widgets/ui.dart` 里的组件。
- **不要对整个 `app/lib` 跑 `dart format`**：原来的代码不是这个工具排的版，跑一次会把所有文件重新排版，对比记录全乱。只格式化自己改过的文件。
- 改了 `src/shared/package.ts`（课程包格式）或 `src/shared/blockSchema.ts`（知识块格式）后，要跑 `npx tsx scripts/schema.ts` 重新生成 `content/schema/` 下的 JSON Schema（测试会检查）。
- 课程内容改在 `content/courses/<slug>/`，不要改构建产物。
- 发布前的检查：`npm test`、`npx tsc --noEmit -p .`、`npm run build`；App：`flutter analyze`、`flutter test`、`bash tool/check_no_material.sh`。

## 已经做完的

### 课程（导学）
- **写课程内容之前先读 [`docs/课程制作标准.md`](docs/课程制作标准.md)**：「做完」的标准是学生在站内就能学完每个条目（标尺是 CS50x），交付前按其中的验收清单检查。
- 统一的课程包格式 `hiana-course@1`：基本信息、中文介绍（爱好者写的）、官方介绍中文翻译、分组资源链接、模块 → 条目（讲义 / 阅读 / 视频 / 作业 / 实验 / 项目 / 测验 / 考试）→ 正文、视频、正式提交地址、练手题。
- 118 门课按分类浏览；“CSDIY 的一切”一门课收齐 csdiy 的前言、使用指南、学习规划、必学工具、书单、后记。
- 89 门课补了官方介绍的中文翻译（由 AI 子任务抓取翻译，**未逐门人工核对**）。
- CS50x、Missing Semester 2026、Missing Semester 2020 全文在站内，每个条目都有练手题，共 342 道。
- CS61A、CS61B、CS61C、MIT 18.01、MIT 线性代数按 [`docs/课程制作标准.md`](docs/课程制作标准.md) 重做（2026-11-19 起）。2026-11-17 的第一版（每讲只有几条自编要点、一半条目只有外链）不合格，见该文档附录。
  - CS61A（2026 春季）已重做，生成脚本 `scripts/courses/cs61a/build.py`：讲义用 csfive/composing-programs-zh 的教材中文翻译按小节拆到各讲（教材没覆盖的 9 讲是依据官方幻灯片自编的），视频配哔哩哔哩双语分集；247 道练手题改编自官方实验、作业、讨论课（Scheme 题改成填空和选择）；实验 / 作业 / 讨论课的「要做什么」页由脚本生成，四个项目页是据官方说明改写的。代码题的检查方法见 `scripts/courses/qhelp.py`。
  - MIT 18.06SC 线性代数（slug `mitla`，2011 秋季 OCW 版）已重做，生成脚本 `scripts/courses/mitla/build.py`（读本地缓存的 OCW 压缩包）：全部 37 个讲座条目（含三次考试复习和期末复习）每条都有：官方讲座摘要的中文翻译（`notes/`）和官方习题与解答的中文翻译（`problems/`，解答折叠），三次单元考试和期末考试也整份翻译（PDF 是特殊字体，按图片读的）；视频配哔哩哔哩双语分集 + 官方 YouTube；221 道练手题（`practice.py`）改编自官方习题和讲座摘要。翻译时发现的原文笔误都加了「译注」并在译文里更正（例如期末第 9 题官方算出的 207 应为 63）。**未经人工逐页核对**。
  - MIT 18.01SC 单变量微积分（slug `mit-1801`，2010 秋季 OCW 版）已重做，生成脚本 `scripts/courses/mit1801/build.py`（读本地缓存的 OCW 压缩包）：5 个单元 19 个模块、114 个条目——101 节讲座（每节「讲义」= 各讲座片段配套讲义的中文翻译，`notes/`；77 节有「例题与解答」，`examples/`）、11 次习题课（只翻译官方指定的题，`psets/`）、4 次单元考试和期末考试（整份翻译，`exams/`）；视频是官方 YouTube 讲座片段（带起始时间）和习题讲解视频，另附 Mathlet 交互演示；430 道练手题（`practice.py`）改编自讲义、例题、习题课和考试。翻译时发现的原文错误有 64 处加了「译注」并在译文里更正（例如第 69 节例题 ∫sin⁴x cos²x dx、第 81 节落体例题丢了负号、习题 4G-5 积分上限），每一处都对照过原文 PDF 的图片（pdftotext 会丢上标和分数，不能只看文字）；官方解答缺的部分标「本站补写」。**未经人工逐页核对**。
- **闯关（2026-11-26 起，试点 CS61A）**：一门课一张地图（`/courses/<课>/map`），一章是一个官方项目，一关是官方的一个问题（`/courses/<课>/levels/<章>/<关>`）。课程页有「开始闯关」入口（`src/shared/levels.ts` 的 `LEVEL_COURSES`）。
  - 内容在 `content/levels/<课>/`：`index.json`（格式 `hiana-levels@1`，类型见 `src/shared/levels.ts`）+ 官方起始代码和 ok 测试，由 `scripts/courses/cs61a/levels.py` 生成，构建时原样复制到 `/levels/`。Hog 13 关已做完；Cats、Ants、Scheme 是「筹备中」占位。
  - 判题器 `content/levels/ok_runner.py` 在浏览器的 Pyodide 里跑官方 ok 测试（`src/client/levels/runner.ts`）。官方测试的期望输出是 hmac-md5 加密的（密钥是作业名，如 `Hog Project`），把学生输出加密后比较，**站内没有官方答案**。改判题器后用本地 Python 对照一份参考解跑一遍全部测试（参考解不进仓库）。
  - 「我的仓库」：登录后存表 `repo_files`（v15），游客存 `localStorage` 的 `hiana.repo.<课>`；只存可编辑的文件，只读文件和测试读静态文件。过关记表 `level_passes`，第一次通过记一条学习记录（`level`）。接口在 `src/worker/api/levels.ts`，测试 `tests/levels.test.ts`。
  - 编辑器暂时是 textarea（Tab 缩进、Ctrl+Enter 运行、Ctrl+S 保存），前端重做时再换。
  - 许可：起始代码和测试 © UC Berkeley CS 61A，取自课程网站存档镜像，**还没确认能否转载**，见 `index.json` 的 `license`。
- 网页能显示数学公式（2026-11-19，`src/client/markdown.ts` 用 KaTeX）：行内 `$…$` 或 `\(…\)`，独立成段 `$$…$$` 或 `\[…\]`；`$15`、`$ ls` 这类写法不会被当成公式。App 还不显示公式。
- 练手题在浏览器里判：选择、填空、代码（Python 用 Pyodide，SQL 用 sql.js，JavaScript）；做对记进热力图。
- 导入 / 导出课程包；任何人都能导入到自己设备上学，管理员能发布给所有人；`/courses/format` 有格式说明和给 AI 用的整理提示词。
- 进度按条目记；没有条目的课手动标记学完。

### 知识块（2026-10-29）
- 格式 `hiana-block@1`（`src/shared/blocks.ts` 计算，`blockSchema.ts` 校验），源文件 `content/blocks/`，构建时补上课程名和课时（`scripts/blocks.mjs`），引用不存在的课或条目会构建失败。
- 四个：新手、人工智能、嵌入式、考研。网页 `/blocks/<slug>`（宽屏导图、手机大纲树），课程页和首页有卡片；App 课程页有卡片和大纲页。
- 课程格式补了三处：模块 `group`（单元）、条目类型 `section`（讨论课）、条目 `optional`（选学）；练手题 `origin`（official / review）。

### 账号
- 邀请码注册、管理员可关闭注册；重置码找回密码；改密码后其他设备退出。
- 校内 / 校外两种账号：
  - 校内：学号登录，能签到。
  - 校外：用户名或邮箱登录，不签到，看不到成员真名，能报名比赛，能被设为管理员。
  - 邀请码分类型，用错了类型会提示。
  - 校内注册**班级必填**（2026-11-01 起；以前选填）。没填过的老账号在「我的」里会提示补填（`PUT /api/me/class`，网页和 App 都有）。
  - 邮箱暂时不验证。
- 游客能看首页、课程、公告。

### 管理
- 管理员能修改成员信息（后台「成员」→「编辑」，`PUT /api/admin/members/:id`）：校内改姓名、学号、班级；校外改昵称、用户名、邮箱、学校 / 单位。改学号 / 用户名 / 邮箱就是改登录账号，已登录的设备不掉线。
- 晚自习签到（默认周一、二、四 19:00–20:40，可在后台改），签到签退都要拍照；现场口令防代签；按日期导出 CSV；“最近没动静”名单。
- 场地签到 2026-11 取消（和晚自习是同一个场地）：不能再新建，接口收到 `kind: "venue"` 回“场地签到已取消”（旧版 App 还会发）；以前的场地记录照常显示、照常算学习时长，签到表里只有这段时间有场地记录时才显示场地一列。
- 签到时手写签名（网页和 App 都有；旧版 App 签的没有签名，接口不强制）。
- 给学校的签到表 `/admin/report`：汇总、每次的照片和签名、晚自习未签到名单，可打印 / 存 PDF。
- 热力图第一行改成“协会学习时长”（分钟），规则在 `attendanceMinutes`。

### 新生任务（2026-11-04）
- 「新生任务」当作一个知识块：首页和「学习 → 知识块」的第一张卡片（`StartBlockCard`，2026-11-11 起；以前是首页最上方的大卡片，负责人说不要放在首页），`/start` 列出三项任务：阅读前言（CSDIY 前言、《我的一些小想法》），完成 CS50x，学习 Across the Deep Sea。
- 进度只请求 `GET /api/start` 一个接口（三项任务的状态 + CS50x 站内进度），首页不再为它下载三门课的详情。
- CS50x：学完后本人在 `/start` 点「我已完成」（`PUT /api/start/done/cs50x`，点错了可以撤销）。2026-11 取消了证书提交和管理员确认；「我已完成」仍记在表 `certificates` 里（`status = 'approved'`、`reviewed_by` = 本人），旧版 App 读得懂；以前管理员确认过的证书照样算完成。证书的旧接口保留路径，提交回 410 和一句提示，管理员列表回空。
- Across the Deep Sea 是站内课 `content/courses/across-the-deep-sea/`，《我的一些小想法》在 `preface.md`（写给同学的一段话，署负责人的名字，不强调身份；现在是占位）；「竞赛」「专题」两个模块是空的，标「筹备中」。
- 界面文案用正式的书面语完整描述，不写口语，不压缩成极简短语；介绍课程时写全称并附中文翻译（负责人 2026-11-04 明确要求）。

### 规划
- 负责人的 CourseTable 负责课表 / 里课表 / 早晚一分钟。平台这边：课程页“加到里课表”，把没学完的条目复制成卡片（`planCards`），在 CourseTable 里粘贴。

### 交流
- 公告与比赛卡：比赛描述、官方文档、群聊、报名组队、阅读确认。
- 蓝色钉子（照 Math-Teach-Job）：分「提问」和「标记」两种（2026-11-11，见“结构重做”第 4 步）。表 `pins` / `pin_messages` / `pin_votes`（v10），接口 `src/worker/api/pins.ts`，网页 `components/Pins.tsx`、后台 `/admin/pins`。钉在讲义段落（列表按每一条）或练手题上，开头文字用来在改版后重新定位。游客能看，登录能钉、回复、“我也想问”；新问题走微信通知。App 里长按讲义段落或练手题就能钉（位置标记和网页同一套规则，见 `app/lib/widgets/markdown_view.dart`）。
- Agent：钉子上“请 AI 回答”（`/api/pins/:id/ai`），默认智谱 GLM-4-Flash，要在 Cloudflare 填 `AI_API_KEY` 才启用；每人每天 20 次、每颗钉子 3 次。

### 协会介绍与招新报名（2026-11-01）
- 开场动画是独立静态页：源文件 `intro/src/`，用 `intro/build.py` 打包成 `public/intro/index.html`（**打包结果要提交**，Cloudflare 构建环境没有 Python），流程见 `intro/README.md`。
- 三个入口：游客第一次打开 `/` 自动跳 `/intro/`（`localStorage` 的 `hiana.intro.seen`，只跳一次，读写出错当作看过了，登录的成员不跳）；协会页「打开协会介绍」→ `/intro/?view=map&from=/about`；首页「协会介绍与学生成就」→ `/intro/?view=map`。
- 演示版的假首页（`#site`）删掉了；「直接进入平台」「回到平台」「进入海纳协会」跳到真网站（`from` 只认站内路径）。
- 报名表接真实接口：`POST /api/applications`（服务器重新校验、蜜罐、每个 IP 每小时 10 次、同一学号覆盖、新报名发微信通知但不带手机号和 QQ），`GET /api/applications/status`（招新开关）。收起时草稿存 `localStorage`，提交成功后清掉。已登录成员和招新关闭时不显示「新生报名」。
- 表 `applications`、`application_hits`（v11）；管理员接口 `src/worker/api/applications.ts`；后台 `/admin/applications`（导航栏显示新报名数量）；招新开关存在 `settings` 的 `applications_open` / `applications_closed_message`。
- 测试 `tests/applications.test.ts`。本地开发服务器 `scripts/dev.ts` 改成和 Cloudflare 一样，目录先找里面的 `index.html`（否则 `/intro/` 会被网站吞掉）。

### 协会页（2026-11-04）
- `/about` 照「海纳协会新生介绍书」重写成长海报（`pages/About.tsx`、`styles/about.css`，只在 `.hn` 里生效，固定深海蓝，不跟皮肤走，不从外网加载字体）。
- `/about` 是**独立整页**：`App.tsx` 里不套 `Shell`（没有侧边栏和底栏），页面自己有吸顶的顶栏（HI·NA 回首页、「回到平台」、「协会介绍」）。在这一页时根元素底色设成深海蓝，离开时还原。
- 页面上的报名入口都是「播放协会介绍」→ `/intro/?from=/about`（从头播，结尾是报名表）；「直接看地图」→ `/intro/?view=map&from=/about`。`/honors` 仍跳到 `/about#honors`。
- 开场动画各站的详细介绍按负责人的培养方案文档补充过；获奖汇总用学校统计（2020.10—2026.6，国家级 12、省级 82、合计 94）。
- 从开场动画点「进入平台」：跳转时有接力过渡（白屏接住 → 揭开平台），只在从动画过来的那一次播，平时不播。做法见 `intro/README.md`。
- 开场动画掉帧已修：两张画布按 1 倍分辨率画（原来三倍屏上每帧画 9 倍像素）。
- 本地装依赖：锁文件里的地址是 `registry.npmmirror.com`，云端容器连不上时用 `npm ci --registry=https://registry.npmjs.org/ --replace-registry-host=registry.npmmirror.com`。

### 外观
- 只有液态玻璃一套皮肤。「经典直角」2026-11-12 删掉了（负责人看过重做的版本，决定不要）。
- 默认配色是海纳橙（2026-11-12 起；以前是 shanmoew-mizu 水色），其他配色没动。以前选过配色的人，浏览器里存着当时的选择，不受影响。
- 配色是从文字色调出来的；深色模式的阴影和遮罩要单独写成黑色，否则会调成一层白雾（`palettes.css` 深色那段）。
- 宽屏时内容（`.page`，最宽 1040px）在侧栏右边的区域里居中。
- 回弹 `--spring` 只越过终点约 1.5%（2026-11-12 减弱过；以前约 10%）。
- 毛玻璃（`backdrop-filter`）的祖先元素不能有 `view-transition-name`、`filter`、`opacity < 1`，否则 Chrome 里模糊失效，只剩半透明颜色（2026-11-12 修过侧栏：`view-transition-name: sidebar` 挪到 `.sidebar-inner` 自己身上；手机抽屉用更实的 `--glass-strong`）。
- 圆角容器里的滚动条不能顶进圆角：侧栏的滚动放在里层 `.sidebar-scroll`；对话框和讨论框给轨道上下留出圆角的高度。
- 七级字号阶梯（13 / 14 / 15 / 16 / 18 / 22 / 28），11 套配色可导入，默认更纱黑体。
- 名字已改成“海纳协会”（副标题“智慧算法网络协会”）。

### App
- 与网站同步：课程分类、课程页（介绍与资源 / 课程内容）、条目页（选择和填空题原生作答，代码题跳网页）、校内 / 校外账号、协会介绍。
- **版本号改成 0.x.x（内测）**：App 1.3.1+5 → 0.4.0+6，构建号只能往上加。服务器 `/api/app/version` 对不带 `?scheme=0` 的旧版 1.x 回 `latest: 1.99.0`，让旧版照常提示更新。GitHub 上已有的 `app-v1.3.x` 发行版没改。
- 安装包下载走本站：`GET /api/app/apk?v=0.4.1&abi=universal`，Worker 从 GitHub Releases 取包、经 Cloudflare 转发并缓存（国内打不开 GitHub 也能下）。后台「APK 下载地址」留空就用它；只转发白名单里的四个文件名；没有通用包的旧版本退回 arm64-v8a。
- 工作流同时打**通用包** `app-release.apk`（所有手机能装）和按芯片分的三个小包，都发到 Releases。
- 0.4.1：注册必填班级、「我的」里补填 / 修改班级。
- 0.4.0：本地升级（`lib/data/updater.dart`、`lib/widgets/update_dialog.dart`，用 `open_filex` 打开系统安装器，工作流给清单加了 `REQUEST_INSTALL_PACKAGES`）；管理员在「我的」看到「管理员」标记和「管理」一组，用浏览器打开网页后台。


## 还没做的 / 待确认

### 结构重做（2026-11-10 起，正在进行）
方案和来历见 `docs/重构交接.md`、`docs/结构重做方案.md`。和负责人对过的结论：
- 平台定位是通用的高校协会管理平台，功能归成四块（签到、课程学习、通知与活动、排行）加底座。**前端外观暂缓**，这一轮只改负责人点名的外观问题。
- 分步做，每步一个 PR，从最新的 `origin/main` 开分支：
  1. ✅ 删功能：场地签到、CS50x 证书审核（改成「我已完成」）、热力图里没接通的 Gitee / 洛谷 / 扇贝、`intro/demo.html`。
  2. ✅ 拆两个大文件，只搬代码、不改行为：`pages/Admin.tsx` → `pages/admin/`（`Today`、`Members`、`Notices`、`Settings`、共用的 `Head`）；`worker/api/members.ts` → `heatmap.ts`（热力图）、`site.ts`（协会介绍、教学周、App 更新和安装包）、`members.ts`（成员、邀请码、设置）。侧栏的新报名数改用 `GET /api/admin/applications/count`（只返回数量，不再每 5 分钟拉整张名单）。
  3. ✅ 导航（`components/Shell.tsx`、`components/LearnTabs.tsx`）：
     - 手机去掉底栏，顶栏左上角 ☰ 打开侧栏（抽屉）；换页、点遮罩、按 Esc 收起。手机上不在后台时，管理只显示一项「进入后台」。
     - 「课程」改名「学习」，页内标签：我的学习（`/courses?tab=mine`）、课程目录（`?tab=all`）、知识块（`?tab=blocks`，第一张卡片是新生任务，`/start` 归在这个标签下）。没指定标签时，选过课的人看「我的学习」，其他人看「课程目录」。「公告与比赛」改名「公告与活动」。
     - 后台侧栏是一组「管理」（2026-11-12 起；以前分四组，负责人说切得太碎）。不在后台时，宽屏和手机都只显示一项「进入后台」。所有旧地址不变。
     - 液态玻璃的样式和动效没动；抽屉只补了最少的样式。
  4. ✅ 蓝色钉子（2026-11-11）：
     - 钉子分两种（负责人说钉子不一定是写下来的问题，也可以是自己的记录和重点）：**提问**（大家都能看，和原来一样）、**标记**（划重点、记心得，可以不写字）。标记由本人选「只给自己」（默认）或「公开」，点开后能改（`POST /api/pins/:id/visibility`）。表 `pins` 加了两列 `kind`（`question` / `note`）和 `is_public`（迁移只做加法，旧数据都是提问）。
     - 只给自己的标记对别人（包括管理员）就像不存在：读写一律 404。公开的标记大家（包括游客）都能看、登录后能回复，本人和管理员能删。
     - 标记都不进「最近的问题」、问题数和后台；不记“提问”活动、不发通知；不能点“我也想问”、不能标已解决、不能请 AI。本人随时能删自己的标记。
     - 按页面取钉子要带 `?notes=1` 才会带上公开的标记和自己的标记，旧版 App 不带，所以 App 里看不到标记、也不会因为不认识而出错。App 里还不能做标记。
     - 讲义上方的入口改成蓝色实心按钮「提问或标记」（快捷键 Q 不变）；宽屏时鼠标停在哪一段，右侧边栏出现「＋」，点它直接钉在这一段；钉下后选「提问」或「标记」。标记用琥珀色，提问仍是蓝色，只给提问编号。
     - 第一次打开讲义时显示一次提示（点「知道了」或钉过一次后不再显示，记在 `localStorage` 的 `hiana.pins.tip`）。
     - 使用说明（`components/PinGuide.tsx`，四步图文弹窗）：入口在讲义上方「使用说明」、提示条「查看使用说明」、「学习 → 问题」页。
     - 顺手修了通用弹窗：打开时聚焦第一个按钮不再滚动（`ui.tsx` 的 `Dialog`），否则只有底部一个按钮的弹窗一打开就滚到底、标题被挡住。
     - 课程页每个条目显示问题数（`GET /api/pins/counts?course=`，只数提问）；「学习」加「问题」标签（`/courses?tab=questions`，`GET /api/pins/recent`：没人回答的在前，其次有人回了，最后已解决）。后台「蓝色钉子」和它共用列表组件 `components/PinRows.tsx`。
     - 以后有了“仅内部可见”的课程（第 5 步），这两个新接口也要按可见范围过滤。
  5. 内外账号和可见范围：等负责人定细节。规矩已定：仅内部可见的课程只能由管理员在后台发布，站内自带课程（`content/courses/`）一律公开（静态文件不经过 Worker，拦不住）。
- **排行榜暂缓**（维护成本高）。OJ 用外部平台（洛谷团队、Codeforces 小组、Vjudge），作业用 GitHub 组织（私有仓库；GitHub Classroom 已于 2026-08 停止服务），网站只放链接。
- 首页的标题和问候语（`greeting/Welcome`）要保留。
- 液态玻璃的结构不要改；样式和动效只按负责人的具体要求调整（2026-11-12 减弱了回弹）。
- App 里还有场地签到和证书提交的界面，服务器已经回提示，不会闪退；等负责人决定发版时再删。
- 热力图里的 WakaTime 也没接通（状态 `pending`），这次没删，要不要删待负责人定。

### 待办清单

**见 [`docs/待办.md`](docs/待办.md)**（2026-11-12 起，原来的「待办总表」搬过去了，做完一项就打勾或删掉）。

### 负责人已确认（2026-10-29）
1. ✅ 协会全称是**智慧算法网络协会**（简称 INAA，也叫海纳协会；2026-10-31 确认，网站、App、README 已改）。
2. 知识块：一个方向的思维导图，把很多门课收在一起，比如新手、考研、人工智能、嵌入式。
3. 热力图 = 在协会的学习时长（签到到签退）+ 其他平台的热力图。现在按“事件次数”算，要改成按时长。
4. 签到要有照片和**手写签名**，导出表格，主要给学校看，方便晚自习请假。
5. 蓝色钉子：游客能看，评论要账号，Agent 的回答也留在讨论里。
6. 练手题优先从**官方作业**改编（CS50x 的习题集很好）；官方没有的课再出复习题。
7. 规划（表课表 / 里课表 / 拖拽 / 自动排 / 早晚一分钟）已经在负责人自己的仓库 [course-table](https://github.com/SSSSSmilewei/course-table)（Flutter，本地优先）里做了，平台这边做对接，不重做。

### 功能缺口（对照 2026-10-22 的方案）
| 方案里的点 | 现状 |
|---|---|
| 规划：导入课程表、“表课程表”和“理课程表”、拖拽安排 | ✅ 在 CourseTable 里；平台能复制卡片过去。以后可以做双向同步（CourseTable 里完成的卡片回写进度） |
| 主页：课程表（计划安排）、知识块 | ⚠️ 知识块有了；课程表在 CourseTable |
| 交流：蓝色钉子（在讲义上钉问题，和 Agent、同学讨论） | ✅ 网页和 App 都完整（App 长按段落钉） |
| 规划：早晚 1 分钟总结（冥想界面、推送） | ➡️ course-table 里有；平台有 `/api/reflections` 接口，可以同步过来 |
| 报告心得分享到朋友圈、QQ 空间、GitHub | ❌ |
| Agent | ⚠️ 只用在蓝色钉子上；还没填 `AI_API_KEY`。出题、优化心得等以后再加 |
| 练手题从官方作业出 | ⚠️ CS50x 作业题本来就是官方改编；Missing Semester 两版的题还是自编复习题，官方每讲有 Exercises，待改编 |
| 课程目录卡片上的“多少讲、多少作业、多少课时”概括 | ⚠️ 只显示条目数和学时 |
| 签到报表导成 Excel（带图片） | ⚠️ 现在是可打印的网页 + 纯文字 CSV |
| 课程 tags | ⚠️ 全部为空 |
| 官方书籍的文本放进站内 | ❌ 只有链接，开放许可的书要查许可 |
| 选课页的欢迎语 | ⚠️ 只在首页 |
| 邮箱验证、自助找回密码 | ❌ 需要先接发信服务 |
| APK 本地打包 | ✅ `cd app && flutter create . --org win.shanmoew --project-name hiana_app --platforms=android` 生成后就能 `flutter build apk`（生成的目录不进仓库） |

### 调研结论（2026-10-29，详见当天对话）
1. 课程官网：CS50x（周 → 讲座 / Section / Shorts / 习题集）、CS61A（讲座 / 讨论 / Lab / 作业 / 项目 / 往年考试）、MIT 18.01SC（单元 → 部分 → 节）。格式已补 group / section / optional。
2. 规划巧思：每日规划仪式、今日最重要的一件事、45 分钟上课铃专注、周回顾（拖延 3 次以上的卡片提示拆小）、错题间隔重复、估时校准。建议加进 CourseTable。
3. 课表导入：保持易班 xls，再支持 ICS 和 WakeUp 的 `.wakeup_schedule`；“真正一键”是内嵌网页登录教务后解析（小爱课程表的做法）。
4. 免费 AI：智谱 GLM-4.7-Flash / GLM-4-Flash 永久免费（首选）；Workers AI 每天 1 万 Neurons（备用）；硅基流动小模型免费；Gemini 免费层不稳且地区受限；OpenRouter 免费每天 50 次。
5. 推送：早晚一分钟用 App 本地通知（CourseTable 已有）；服务器消息用 WxPusher；安卓 Web Push 在国内不可用。
6. 分享：微信 / QQ 官方 SDK 要登记应用（部分能力 300 元认证），不划算；用分享图片 + 系统分享菜单；GitHub 用令牌把心得提交到自己的仓库。
7. 蓝色钉子：照 Math-Teach-Job 做了。

### 建议顺序（下一轮）
1. 负责人在 Cloudflare 填 `AI_API_KEY`（智谱），试用“请 AI 回答”。
2. Missing Semester 两版的练手题改成官方 Exercises 改编。
3. ✅ App 里在正文上钉问题（长按段落，0.5.0 已做）。
4. CourseTable 双向同步（完成的里课卡片回写平台进度和热力图）。
5. 早晚一分钟的心得分享（分享图片、提交到 GitHub）。

### 协会介绍与招新：待负责人决定（2026-11-01）
- `src/shared/association.ts` 的部门已改成和开场动画一致：综合网络部、项目部、算法部、宣传设计部（2026-11-04）。指导老师熊芳、余力（2026-11-01）。
- 报名草稿存在浏览器的 `localStorage` 里（含手机号、QQ），在公用电脑上填了一半不交，要点「擦掉」才会清掉。
- 手机网页上没有底栏了，管理员从左上角 ☰ 的「进入后台」或「我的」页的「管理后台」进后台（2026-11-10）。

### 已知的小问题
- 已修（2026-11-06）：网页上 CSDIY 的一切、Across the Deep Sea 的讲义页白屏——这两门课的 course.json 省略了空的 `practice`，讲义页读 `practice.length` 报错。现在 `src/client/library.ts` 的 `withDefaults` 在加载课程包时补齐空数组（测试 `tests/packages.test.ts`）。
- 以前选过 git、vim 这类工具课的成员，这些选课不再显示（工具课并进了“CSDIY 的一切”）。
- 旧版 App（1.x，现在的 0.x 之前）：校内同学能照常用；校外同学要更新 App。
- 本地 `.staging/`（不进仓库）里有内容生成的中间文件、旧讲义目录 `old/lessons` 和截图工具，确认不用后可以删。
