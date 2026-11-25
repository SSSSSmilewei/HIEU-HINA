#!/usr/bin/env bash
# 开账号并放进团队。
# 用法：scripts/add-user.sh 用户名 邮箱 core|members
#   core    核心同学，能推送代码、交作业
#   members 普通成员，只能浏览
# 会生成一个初始密码打印出来，同学第一次登录时必须改掉。
set -euo pipefail
# shellcheck source=lib.sh
. "$(dirname "$0")/lib.sh"

if [ $# -ne 3 ] || { [ "$3" != core ] && [ "$3" != members ]; }; then
  echo "用法：$0 用户名 邮箱 core|members" >&2
  exit 1
fi
user="$1"; email="$2"; team="$3"

if [ "$(api_status GET "/users/$user")" = 200 ]; then
  say "账号 $user 已存在，只调整团队"
else
  pass="$(openssl rand -base64 12 | tr -d '/+=' | cut -c1-12)"
  api POST /admin/users "{\"username\":\"$user\",\"email\":\"$email\",\"password\":\"$pass\",\"must_change_password\":true,\"visibility\":\"private\"}" >/dev/null
  say "已开账号 $user，初始密码：$pass （第一次登录必须改）"
fi

team_id() {
  api GET "/orgs/$ORG/teams" | python3 -c 'import sys,json; print(next(t["id"] for t in json.load(sys.stdin) if t["name"]==sys.argv[1]))' "$1"
}
# 两个团队只留一个：先从另一个移出
other=$([ "$team" = core ] && echo members || echo core)
api DELETE "/teams/$(team_id "$other")/members/$user" >/dev/null 2>&1 || true
api PUT "/teams/$(team_id "$team")/members/$user" >/dev/null
say "$user 已放进团队 $team"
