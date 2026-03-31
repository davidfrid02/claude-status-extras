#!/bin/bash
# Wrapper that runs claude-hud then claude-status-extras, piping stdin to both.

config_dir="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
node="/usr/local/bin/node"

# Find latest claude-hud version
hud_dir=$(ls -d "${config_dir}"/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null \
  | awk -F/ '{ print $(NF-1) "\t" $0 }' \
  | sort -t. -k1,1n -k2,2n -k3,3n -k4,4n \
  | tail -1 | cut -f2-)

extras_dir="/Users/davidfried/Projects/claude-status-extras"

# Read stdin once
stdin_data=$(cat)

# Run both plugins, feeding each the same stdin
if [ -n "$hud_dir" ]; then
  hud_out=$(echo "$stdin_data" | "$node" "${hud_dir}dist/index.js" 2>/dev/null)
  [ -n "$hud_out" ] && echo "$hud_out"
fi

extras_out=$(echo "$stdin_data" | "$node" "${extras_dir}/dist/index.js" 2>/dev/null)
[ -n "$extras_out" ] && echo "$extras_out"

exit 0
