#!/usr/bin/env bash
# Deploy commo.cc to server. Run from project root on your machine (uses your SSH keys).
# Requires: .env.deploy with COMMO_SSH and COMMO_REMOTE_PATH (see .env.deploy.example).

set -e
cd "$(dirname "$0")/.."

if [ -f .env.deploy ]; then
  set -a
  source .env.deploy
  set +a
fi

if [ -z "$COMMO_SSH" ] || [ -z "$COMMO_REMOTE_PATH" ]; then
  echo "Missing COMMO_SSH or COMMO_REMOTE_PATH. Copy .env.deploy.example to .env.deploy and set values."
  exit 1
fi

SSH_OPTS=()
[ -n "$COMMO_SSH_KEY" ] && SSH_OPTS=(-i "$COMMO_SSH_KEY")

echo "Deploying to $COMMO_SSH ($COMMO_REMOTE_PATH) ..."
ssh "${SSH_OPTS[@]}" "$COMMO_SSH" "[ -s /root/.nvm/nvm.sh ] && . /root/.nvm/nvm.sh; cd $COMMO_REMOTE_PATH && git pull && (test -f package-lock.json && npm ci || npm install) && npm run build && (pm2 restart commo 2>/dev/null || pm2 start ecosystem.config.cjs 2>/dev/null || pm2 start npm --name commo -- start 2>/dev/null || echo 'Start app manually: pm2 start ecosystem.config.cjs')"
echo "Done."
