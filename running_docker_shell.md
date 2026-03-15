# Docker helper: `docker.sh`

This document explains the small helper script `docker.sh` included in this repository. The script wraps `docker compose` / `docker-compose` commands to make common workflows (build, start, stop, logs, exec) easy and consistent across environments.

**Purpose:** Provide a simple, reproducible CLI for building, running and inspecting the project's services without remembering long docker-compose commands.

**Requirements:**
- Docker installed
- Docker Compose support (either `docker compose` plugin or legacy `docker-compose` binary)
- Make the script executable with `chmod +x docker.sh`

Quick start

```shell
chmod +x docker.sh
./docker.sh up            # start all services (detached)
./docker.sh dev          # start dev stack (angular + nest hot reload)
./docker.sh up client     # start only the `client` service (detached)
./docker.sh build         # build all service images
./docker.sh build --no-cache client  # build the `client` image without cache
```

Environment

- `COMPOSE_FILE` can be used to override the default compose file. Default: `docker-compose.yaml`.

Usage overview

```text
Usage: ./docker.sh <command> [service] [args...]

Commands:
  build [--no-cache] [service]    Build images (optional --no-cache)
  up [service]                    Start services (detached)
  start [service]                 Start existing containers
  dev                             Start development stack (docker-compose.dev.yml)
  prune                           Remove unused docker images, containers, networks and cache
  stop [service]                  Stop services
  restart [service]               Restart services
  down                            Stop and remove containers/networks
  logs [service]                  Tail logs (ctrl-c to exit)
  ps|status                       Show compose status
  exec <service> <cmd...>         Exec a command in a running service
  help                            Show this help
```

Common examples

```shell
./docker.sh build                     # build all images
./docker.sh build --no-cache client   # build client image, no cache
./docker.sh up                        # start all services in background
./docker.sh logs client               # follow logs for client service
./docker.sh exec api bash             # open a shell inside `api` container
./docker.sh ps                        # show compose status
./docker.sh down                      # stop and remove containers and networks
```

Notes and behavior

- The script prefers the modern `docker compose` (plugin). If not available, it falls back to `docker-compose`.
- It enforces strict shell options at the top of the script for safer execution.
- Most commands accept an optional `service` argument to limit the action to a single service.

Troubleshooting

- If you see "Error: docker compose or docker-compose not found.", install Docker Desktop or the `docker-compose` binary depending on your platform.
- If compose uses a non-standard file name, set the environment variable: `COMPOSE_FILE=custom.yml ./docker.sh up`.

Full script

```shell
#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.yaml}"

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
  start [service]                 Start existing containers
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

  *)
    echo "Unknown command: $cmd" >&2
    usage
    exit 2
    ;;
esac
```