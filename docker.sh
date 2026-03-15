#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yaml}"
DEV_COMPOSE_FILE="${DEV_COMPOSE_FILE:-docker-compose.dev.yaml}"

if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  echo "Error: docker compose or docker-compose not found." >&2
  exit 1
fi

usage() {
  cat <<EOF
Usage: $0 <command> [service] [args...]

Commands:
  build [--no-cache] [service]    Build images (optional --no-cache)
  up [service]                    Start services (detached)
  dev                             Start development stack (docker-compose.dev.yml)
  start [service]                 Start existing containers
  prune                           Remove unused docker images, containers, networks and cache
  stop [service]                  Stop services
  restart [service]               Restart services
  down                            Stop and remove containers/networks
  logs [service]                  Tail logs (ctrl-c to exit)
  ps|status                       Show compose status
  exec <service> <cmd...>         Exec a command in a running service
  help                            Show this help
EOF
}

if [ $# -lt 1 ]; then usage; exit 1; fi

cmd="$1"; shift || true

case "$cmd" in
  build)
    NO_CACHE=""
    if [ "${1:-}" = "--no-cache" ]; then NO_CACHE="--no-cache"; shift || true; fi
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" build $NO_CACHE ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  up)
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" up -d ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  start)
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" start ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  stop)
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" stop ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  restart)
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" restart ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  down)
    $DC -f "$COMPOSE_FILE" down
    ;;

  logs)
    SERVICE_ARG="${1:-}"
    $DC -f "$COMPOSE_FILE" logs -f --tail=100 ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  ps|status)
    $DC -f "$COMPOSE_FILE" ps
    ;;

  exec)
    if [ $# -lt 2 ]; then
      echo "Usage: $0 exec <service> <cmd...>" >&2
      exit 2
    fi
    svc="$1"; shift
    $DC -f "$COMPOSE_FILE" exec "$svc" "$@"
    ;;

  help|--help|-h)
    usage
    ;;

  dev)
    SERVICE_ARG="${1:-}"
    $DC -f "$DEV_COMPOSE_FILE" up ${SERVICE_ARG:+$SERVICE_ARG}
    ;;

  prune)
    echo "Stopping compose stacks..."
    $DC -f "$COMPOSE_FILE" down || true
    $DC -f "$DEV_COMPOSE_FILE" down || true

    echo "Cleaning unused Docker resources..."
    docker system prune -a --volumes -f
    ;;

  *)
    echo "Unknown command: $cmd" >&2
    usage
    exit 2
    ;;
esac