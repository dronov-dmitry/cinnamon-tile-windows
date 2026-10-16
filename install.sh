#!/bin/sh
# install.sh — установить доработанный grouped-window-list@cinnamon.org
# (фича «Разложить плиткой» в ПКМ-меню значков таскбара)
#
# Стратегия безопасной установки (как в 19_ZorinTaskbar):
#   системные файлы НЕ трогаются;
#   пользовательская копия кладётся в ~/.local/share/cinnamon/applets/,
#   которая загружается приоритетнее системной (/usr/share/...);
#   откат — удалить пользовательскую копию (см. uninstall.sh).
#
# После установки нужно перезапустить Cinnamon:
#   Alt+F2 → r → Enter   (или: cinnamon --replace &)

set -eu

HERE="$(cd "$(dirname "$0")" && pwd)"
SRC="$HERE/gwl-src/grouped-window-list@cinnamon.org"
DEST="$HOME/.local/share/cinnamon/applets/grouped-window-list@cinnamon.org"
BACKUP_DIR="$HOME/.local/share/cinnamon/applets/.backups"

say() { printf '%s\n' "$*"; }
die() { say "ОШИБКА: $*" >&2; exit 1; }

[ -d "$SRC" ] || die "не найден источник: $SRC"

say "→ Проверяю, что Cinnamon запущен..."
pgrep -x cinnamon >/dev/null 2>&1 || say "  (предупреждение: процесс cinnamon не найден — установка всё равно продолжится)"

say "→ Бэкап системного оригинала (если ещё не бэкапили):"
if [ ! -d "$BACKUP_DIR/grouped-window-list@cinnamon.org" ]; then
    mkdir -p "$BACKUP_DIR"
    cp -a "/usr/share/cinnamon/applets/grouped-window-list@cinnamon.org" "$BACKUP_DIR/"
    say "   системная копия сохранена в $BACKUP_DIR"
else
    say "   бэкап уже есть: $BACKUP_DIR/grouped-window-list@cinnamon.org"
fi

say "→ Устанавливаю пользовательскую копию в $DEST ..."
mkdir -p "$HOME/.local/share/cinnamon/applets"
rm -rf "$DEST"
cp -a "$SRC" "$DEST"

say "→ Готово. Теперь перезапустите Cinnamon, чтобы применить:"
say "    Alt+F2 → введите r → Enter"
say "    или в терминале:  cinnamon --replace &"
say ""
say "Откат: ./uninstall.sh"
