# Forgejo 试装：作业仓库 + 自动判分

海纳协会的代码仓库服务，计划部署在学校服务器上。来历和选型见 [`docs/灵感备忘录.md`](../../docs/灵感备忘录.md)。

这一版用于**在自己电脑上试装**，确认整套流程能跑通：建仓库、按账号分权限、推送后自动判分。它和网站（Cloudflare）还没有连起来。

## 一、装好以后是什么样

- 打开 `http://localhost:3300/`，**不登录只能看到登录页**，也不能自己注册，账号由管理员开。
- 组织 `hiana`（海纳协会）下有两个团队：
  - `core`：核心同学，能推送代码、交作业；
  - `members`：普通成员，只能浏览、拉代码。
- 示例作业 `hiana/hello-assignment`：同学在 `solution.py` 里写代码，推送后「Actions」一栏自动跑测试，绿色是通过，红色是没通过。
- 判分要用的公共步骤（`actions/checkout`）和判分镜像都存在本机，**判分时不去连 GitHub**。

## 二、需要什么

- Linux，装好 Docker 和 Docker Compose（`docker compose version` 能输出版本号）。
- 第一次安装要联网，下载约 600MB 的镜像，再镜像几个公共步骤。装好以后断网也能用。
- 端口：网页 3300、SSH 2222。被占用的话，改 `.env` 里的 `HTTP_PORT`、`SSH_PORT` 和 `ROOT_URL`。

## 三、安装

```bash
cd deploy/forgejo
bash scripts/setup.sh
```

脚本依次做这几件事，可以重复运行，已经建好的会跳过：

1. 从 `.env.example` 生成 `.env`，随机生成管理员密码和运行器密钥；
2. 启动 Forgejo，建管理员；
3. 登记并启动判分运行器；
4. 建组织 `hiana` 和 `core`、`members` 两个团队；
5. 运行 `scripts/mirror-actions.sh`：镜像公共步骤，拉取判分镜像；
6. 运行 `scripts/demo-assignment.sh`：推送示例作业，触发第一次判分。示例里的 `add` 还没写，所以第一次是红色的，这是正常的。

管理员密码在 `.env` 的 `ADMIN_PASSWORD` 里。**`.env` 不要提交，也不要发到群里。**

## 四、日常操作

| 要做什么 | 命令 |
|---|---|
| 给同学开账号 | `bash scripts/add-user.sh 用户名 邮箱 core`，或者最后写 `members`。会打印初始密码，同学第一次登录时必须改 |
| 换团队 | 对同一个用户名再运行一次 `add-user.sh`，写新的团队名 |
| 加一个公共步骤 | 在 `scripts/mirror-actions.sh` 的 `ACTIONS` 里加一行，再运行一次 |
| 停止 | `docker compose stop` |
| 再次启动 | `docker compose up -d` |
| 看日志 | `docker compose logs -f forgejo`，或者 `runner` |
| 全部删掉重来 | `docker compose down && sudo rm -rf data .env`（**数据全部清空**；`data/` 里有容器写的 root 文件，要用 sudo） |

所有数据都在 `data/` 下，备份时把整个 `data/` 目录拷走即可，最好先 `docker compose stop`。

## 五、写判分

在作业仓库里放 `.forgejo/workflows/grade.yml`，写法和 GitHub Actions 一样，参考 `examples/hello-assignment/`：

```yaml
on: [push]
jobs:
  grade:
    runs-on: docker            # 用 node:20-bookworm 镜像，自带 Python 3、gcc、make
    steps:
      - uses: actions/checkout@v4     # 从本机取，不连 GitHub
      - run: python3 -m unittest discover -v -s tests -t .
```

断网时不能 `pip install`、`npm install`。需要依赖的话，先做一个装好依赖的判分镜像，在 `runner-config.yaml` 的 `labels` 里加一行，比如 `"cs61a:docker://hiana/cs61a-grader:1"`，然后工作流里写 `runs-on: cs61a`。

## 六、本机试装时验证过的（2026-11-19）

- [x] 安装脚本从空目录一次跑通（Fedora、Docker 29）。
- [x] 没写答案时判分失败（3 条测试报错）；交了正确答案后判分通过。
- [x] 游客打开仓库被跳到登录页，调接口返回 403；注册页显示已关闭。
- [x] `core` 团队的同学能推送；`members` 团队的同学能拉代码，推送被拒绝。
- [ ] **断网判分还没实测**：从日志看，判分时只访问了本机，没有访问外网。拔掉网线后再推一次示例作业，就能确认。

## 七、正式上线前要改的

这一版只用于试装，放到学校服务器上之前，下面几件要处理：

1. **判分和服务器隔开。** 现在判分容器和宿主机共用网络，运行器还能操作宿主机的 Docker。学生的代码虽然拿不到 Docker 的控制权，但能访问宿主机上的其他服务。正式上线时，运行器要放到单独的虚拟机里（最稳），或者至少改用 Docker-in-Docker，再给判分容器断网、限制内存和 CPU。
2. **每个同学一个作业仓库。** 现在 `core` 团队对组织里所有仓库都有写权限，同学之间能改彼此的作业。正式做作业时，应该按「作业模板 → 每人复制一份私有仓库」来做，这一步可以写成脚本，以后也可以由平台来管。
3. **HTTPS 和地址。** `ROOT_URL` 改成学校给的地址或域名，前面加一层 HTTPS，可以用 Caddy 自动申请证书。如果没有公网，就只能在校园网里用（见备忘录「外网访问的几种办法」）。
4. **管理员开两步验证**：登录后在「设置 → 安全」里开启。
5. **按时升级。** Forgejo 15 是长期支持版。升级时运行 `docker compose pull && docker compose up -d`，升级前先备份 `data/`。
6. 国内服务器拉 Docker Hub 的镜像（`node:20-bookworm`）可能很慢，要给 Docker 配镜像源，或者在别的机器上 `docker save` 导出后拷过去。

## 八、文件说明

| 文件 | 作用 |
|---|---|
| `compose.yaml` | Forgejo 和判分运行器两个服务，所有设置都写在环境变量里 |
| `runner-config.yaml` | 判分运行器的设置：用哪个镜像、并发数、超时 |
| `.env.example` | 地址、端口、管理员。复制成 `.env` 使用 |
| `scripts/setup.sh` | 一键安装 |
| `scripts/mirror-actions.sh` | 镜像公共步骤，拉取判分镜像 |
| `scripts/add-user.sh` | 开账号、分团队 |
| `scripts/demo-assignment.sh` | 推送示例作业 |
| `scripts/lib.sh` | 各脚本共用的函数 |
| `examples/hello-assignment/` | 示例作业：题目、测试、判分工作流 |
