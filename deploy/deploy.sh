#!/usr/bin/env bash
#
# Deploy the portfolio: build the static export locally, then rsync it to the
# EC2 box where Caddy serves it. This is the whole deploy process — no SSH
# session, no `git pull`, no nginx.
#
#   ./deploy/deploy.sh
#
# One-time setup:
#   1. Edit the REMOTE_* values below to match your box.
#   2. Make sure your SSH key can log in:  ssh "$REMOTE_USER@$REMOTE_HOST"
#   3. Install deps once:  npm ci
#
set -euo pipefail

# --- Configuration — EDIT THESE ---------------------------------------------
REMOTE_USER="ubuntu"                 # SSH user on the EC2 box
REMOTE_HOST="CHANGE_ME.compute.amazonaws.com"  # EC2 public DNS or IP (not the
                                     # site domain, unless DNS already points here)
REMOTE_PATH="/var/www/portfolio"     # must match `root` in deploy/Caddyfile
SSH_KEY="${SSH_KEY:-$HOME/.ssh/id_ed25519}"    # override: SSH_KEY=~/.ssh/other ./deploy/deploy.sh
# ---------------------------------------------------------------------------

cd "$(dirname "$0")/.."  # repo root, regardless of where this is invoked from

echo "==> Building static export (next build -> ./out)…"
npm run build

if [ ! -f out/index.html ]; then
	echo "!! Build did not produce out/index.html — aborting." >&2
	exit 1
fi

echo "==> Syncing ./out/ -> ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"
# --delete makes the server an exact mirror of ./out (removes stale pages).
# REMOTE_PATH must be dedicated to this site.
rsync -avz --delete \
	-e "ssh -i ${SSH_KEY}" \
	out/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}/"

echo "==> Deployed. Live at https://www.evanshwu.com"
