#!/usr/bin/env bash
# Interactive arrow-key picker. Prints the chosen option to stdout.
# Usage: ./select-app.sh "Prompt text" option1 option2 ...
set -euo pipefail

prompt="$1"
shift
options=("$@")
selected=0
count=${#options[@]}

# Open TTY explicitly so stdout can be captured by the caller.
exec 3</dev/tty

print_menu() {
  printf "%s\n" "$prompt" >&2
  for i in "${!options[@]}"; do
    if [[ $i -eq $selected ]]; then
      printf "  \033[36m> %s\033[0m\n" "${options[$i]}" >&2
    else
      printf "    %s\n" "${options[$i]}" >&2
    fi
  done
}

clear_menu() {
  local lines=$((count + 1))
  for ((i = 0; i < lines; i++)); do
    printf "\033[1A\033[2K" >&2
  done
}

# Hide cursor; restore on exit.
printf "\033[?25l" >&2
trap 'printf "\033[?25h" >&2' EXIT

print_menu

while true; do
  IFS= read -rsn1 -u 3 key
  if [[ $key == $'\x1b' ]]; then
    IFS= read -rsn2 -u 3 rest
    key="$key$rest"
  fi
  case "$key" in
    $'\x1b[A'|k) selected=$(( (selected - 1 + count) % count )) ;;
    $'\x1b[B'|j) selected=$(( (selected + 1) % count )) ;;
    "")          break ;;  # Enter
    q)           exit 130 ;;
  esac
  clear_menu
  print_menu
done

printf "%s\n" "${options[$selected]}"
