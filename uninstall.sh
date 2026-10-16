#!/bin/sh
# uninstall.sh — откат до оригинального таскбара Cinnamon
#
# Удаляет пользовательскую копию из ~/.local/share/cinnamon/applets/,
# после чего Cinnamon снова использует системную версию из
# /usr/share/cinnamon/applets/. Перезапуск Cinnamon обязателен.

set -eu

DEST="$HOME/.local/share/cinnamon/applets/grouped-window-list@cinnamon.org"

say() { printf '%s\n' "$*"; }

if [ -d "$DEST" ]; then
    say "→ Удаляю пользовательскую копию: $DEST"
    rm -rf "$DEST"
else
    say "→ Пользовательской копии нет — откат не требуется."
fi

say "→ Готово. Перезапустите Cinnamon:"
say "    Alt+F2 → введите r → Enter"
say "    или в терминале:  cinnamon --replace &"
