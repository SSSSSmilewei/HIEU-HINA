# 各脚本共用：读 .env、调 Forgejo 接口。由其他脚本 source，不单独运行。
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$HERE"

if [ ! -f .env ]; then
  echo "找不到 .env，请先运行 scripts/setup.sh" >&2
  exit 1
fi
set -a
# shellcheck disable=SC1091
. ./.env
set +a

# 本机访问接口的地址（不一定等于 ROOT_URL，ROOT_URL 可能是还没配好的域名）
API="http://localhost:${HTTP_PORT}/api/v1"

say() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m注意：\033[0m%s\n' "$*" >&2; }

# api 方法 路径 [JSON]：成功时输出返回内容；失败时打印状态码和内容并返回 1
api() {
  local method="$1" path="$2" body="${3:-}"
  local out code
  out="$(mktemp)"
  if [ -n "$body" ]; then
    code=$(curl -sS -o "$out" -w '%{http_code}' -u "$ADMIN_USER:$ADMIN_PASSWORD" \
      -X "$method" -H 'Content-Type: application/json' -d "$body" "$API$path")
  else
    code=$(curl -sS -o "$out" -w '%{http_code}' -u "$ADMIN_USER:$ADMIN_PASSWORD" \
      -X "$method" "$API$path")
  fi
  if [ "${code:0:1}" != "2" ]; then
    echo "接口 $method $path 返回 $code：$(cat "$out")" >&2
    rm -f "$out"
    return 1
  fi
  cat "$out"
  rm -f "$out"
}

# api_status 方法 路径：只返回状态码（用来判断东西在不在）
api_status() {
  curl -sS -o /dev/null -w '%{http_code}' -u "$ADMIN_USER:$ADMIN_PASSWORD" -X "$1" "$API$2"
}

# 从标准输入的 JSON 里取一个字段：echo '{"id":3}' | json_get id
json_get() { python3 -c 'import sys,json; print(json.load(sys.stdin)[sys.argv[1]])' "$1"; }

# 在 Forgejo 容器里以 git 用户运行命令
fj() { docker compose exec -T -u git forgejo forgejo "$@"; }
