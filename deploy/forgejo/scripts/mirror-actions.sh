#!/usr/bin/env bash
# 把判分要用的公共步骤镜像到本机的 actions 组织里，并提前拉好判分镜像。
# 配合 compose.yaml 里的 DEFAULT_ACTIONS_URL=self：工作流里写 `uses: actions/checkout@v4`，
# 就会从本机取，不去连 GitHub。要联网运行一次；以后断网也能判分。
# 加别的步骤：在下面 ACTIONS 里加一行“名字 来源地址”，再运行一次。
set -euo pipefail
# shellcheck source=lib.sh
. "$(dirname "$0")/lib.sh"

# 来源优先用 code.forgejo.org（国内一般比 GitHub 好连），它镜像了 GitHub 上常用的 actions
ACTIONS=(
  "checkout https://code.forgejo.org/actions/checkout.git"
  "setup-python https://code.forgejo.org/actions/setup-python.git"
)

if [ "$(api_status GET /orgs/actions)" != 200 ]; then
  say "建组织 actions（放公共步骤）"
  # 公开：所有登录用户的仓库都要能读到它
  api POST /orgs '{"username":"actions","full_name":"公共判分步骤","visibility":"public"}' >/dev/null
fi
ACTIONS_ORG_ID=$(api GET /orgs/actions | json_get id)

failed=0
for line in "${ACTIONS[@]}"; do
  name="${line%% *}"; src="${line#* }"
  if [ "$(api_status GET "/repos/actions/$name")" = 200 ]; then
    say "actions/$name 已存在，跳过（它是镜像，联网时会自动同步）"
    continue
  fi
  say "镜像 actions/$name ← $src"
  # mirror=true：联网时每 8 小时自动同步一次；断网时保留已有版本
  if ! api POST /repos/migrate "{\"clone_addr\":\"$src\",\"repo_name\":\"$name\",\"repo_owner\":\"actions\",\"uid\":$ACTIONS_ORG_ID,\"mirror\":true,\"mirror_interval\":\"8h0m0s\",\"private\":false,\"service\":\"git\"}" >/dev/null; then
    failed=1
  fi
done

# 判分镜像：和 runner-config.yaml 的 labels 保持一致
IMAGE=node:20-bookworm
if docker image inspect "$IMAGE" >/dev/null 2>&1; then
  say "判分镜像 $IMAGE 已在本机"
else
  say "拉取判分镜像 $IMAGE（约 400MB）"
  docker pull "$IMAGE" || { warn "拉不下来，国内可能要给 Docker 配镜像源"; failed=1; }
fi

exit $failed
