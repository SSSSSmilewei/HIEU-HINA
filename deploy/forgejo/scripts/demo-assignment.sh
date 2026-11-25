#!/usr/bin/env bash
# 把 examples/hello-assignment 推成组织里的一个仓库，推送后会自动判分一次。
set -euo pipefail
# shellcheck source=lib.sh
. "$(dirname "$0")/lib.sh"

REPO=hello-assignment
if [ "$(api_status GET "/repos/$ORG/$REPO")" = 200 ]; then
  say "示例作业 $ORG/$REPO 已存在，跳过"
  exit 0
fi

say "建示例作业 $ORG/$REPO"
api POST "/orgs/$ORG/repos" "{\"name\":\"$REPO\",\"description\":\"示例作业：实现 add 函数，推送后自动判分\",\"private\":true,\"default_branch\":\"main\"}" >/dev/null

tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
cp -r examples/hello-assignment/. "$tmp/"
cd "$tmp"
git init -q -b main
git -c user.name="$ADMIN_USER" -c user.email="$ADMIN_EMAIL" add -A
git -c user.name="$ADMIN_USER" -c user.email="$ADMIN_EMAIL" commit -qm "示例作业"
# 密码只放在这一次命令里，不写进仓库配置
git push -q "http://$ADMIN_USER:$(python3 -c 'import sys,urllib.parse;print(urllib.parse.quote(sys.argv[1],safe=""))' "$ADMIN_PASSWORD")@localhost:${HTTP_PORT}/$ORG/$REPO.git" main
say "已推送，判分结果在 ${ROOT_URL}$ORG/$REPO/actions"
