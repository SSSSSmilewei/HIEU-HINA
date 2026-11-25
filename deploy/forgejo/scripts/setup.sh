#!/usr/bin/env bash
# 一键试装：启动 Forgejo、建管理员、接上判分运行器、建协会组织和两个团队、放一个示例作业。
# 可以重复运行，已经建好的东西会跳过。
set -euo pipefail
cd "$(dirname "$0")/.."

# —— 1. 准备 .env ——
if [ ! -f .env ]; then
  cp .env.example .env
  echo "已从 .env.example 生成 .env"
fi
fill() { # fill 变量名 值：变量为空时写入
  if grep -qE "^$1=$" .env; then
    sed -i "s|^$1=$|$1=$2|" .env
    echo "已生成 $1，写在 .env 里"
  fi
}
fill ADMIN_PASSWORD "$(openssl rand -base64 18 | tr -d '/+=' | cut -c1-20)"
fill RUNNER_SECRET "$(openssl rand -hex 20)"

# shellcheck source=lib.sh
. scripts/lib.sh
mkdir -p data/forgejo data/runner

# —— 2. 启动 Forgejo ——
say "启动 Forgejo（第一次要下载镜像，可能要几分钟）"
docker compose up -d --quiet-pull forgejo
for i in $(seq 1 60); do
  if curl -fsS "http://localhost:${HTTP_PORT}/api/healthz" >/dev/null 2>&1; then break; fi
  [ "$i" = 60 ] && { echo "Forgejo 一直没起来，看看 docker compose logs forgejo" >&2; exit 1; }
  sleep 2
done

# —— 3. 管理员 ——
if fj admin user list --admin | awk 'NR>1{print $2}' | grep -qx "$ADMIN_USER"; then
  say "管理员 $ADMIN_USER 已存在，跳过"
else
  say "建管理员 $ADMIN_USER"
  fj admin user create --admin --username "$ADMIN_USER" --password "$ADMIN_PASSWORD" \
    --email "$ADMIN_EMAIL" --must-change-password=false
fi

# —— 4. 判分运行器 ——
say "在服务器上登记运行器"
fj forgejo-cli actions register --name hiana-runner-1 --secret "$RUNNER_SECRET" --labels docker >/dev/null
say "启动运行器"
docker compose up -d --quiet-pull runner

# —— 5. 组织和团队 ——
if [ "$(api_status GET "/orgs/$ORG")" = 200 ]; then
  say "组织 $ORG 已存在，跳过"
else
  say "建组织 $ORG"
  api POST /orgs "{\"username\":\"$ORG\",\"full_name\":\"海纳协会\",\"visibility\":\"private\",\"description\":\"智慧算法网络协会的作业仓库\"}" >/dev/null
fi

UNITS='["repo.code","repo.issues","repo.pulls","repo.releases","repo.wiki","repo.actions"]'
make_team() { # make_team 名字 权限 说明
  if api GET "/orgs/$ORG/teams" | python3 -c 'import sys,json; sys.exit(0 if any(t["name"]==sys.argv[1] for t in json.load(sys.stdin)) else 1)' "$1"; then
    say "团队 $1 已存在，跳过"
  else
    say "建团队 $1（$3）"
    api POST "/orgs/$ORG/teams" "{\"name\":\"$1\",\"description\":\"$3\",\"permission\":\"$2\",\"includes_all_repositories\":true,\"can_create_org_repo\":false,\"units\":$UNITS}" >/dev/null
  fi
}
# 团队名只能用英文；中文写在说明里
make_team core write "核心同学：能推送代码、交作业"
make_team members read "普通成员：只能浏览"

# —— 6. 判分要用的公共步骤（actions/checkout 等）——
if ! bash scripts/mirror-actions.sh; then
  warn "公共步骤没镜像成功（可能没联网）。联网后再运行 scripts/mirror-actions.sh，否则判分会失败。"
fi

# —— 7. 示例作业 ——
bash scripts/demo-assignment.sh || warn "示例作业没建成，可以稍后单独运行 scripts/demo-assignment.sh"

cat <<EOF

装好了。
  地址：    ${ROOT_URL}
  管理员：  ${ADMIN_USER}
  密码：    写在 $(pwd)/.env 的 ADMIN_PASSWORD
  示例作业：${ROOT_URL}${ORG}/hello-assignment （看「Actions」一栏的判分结果）

加同学：scripts/add-user.sh 用户名 邮箱 core|members
EOF
