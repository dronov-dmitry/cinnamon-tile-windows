# 22_LinuxMint_Taskbar — таскбар Cinnamon с плиткованием окон

## Что это

Доработка стандартного апплета Cinnamon **Grouped window list** (`grouped-window-list@cinnamon.org`), который и служит таскбаром в Linux Mint 22.3 / Cinnamon 6.6.

Добавлено:
* В ПКМ-меню значка приложения в таскбаре — подменю **«Tile windows»** (Разложить плиткой).
* Раскладки: авто-сетка, половины (влево/вправо / вверх/вниз), трети, две трети + треть, четыре четверти.
* Алгоритм портирован из проверенной фичи «Tile N Windows» проекта Zorin Taskbar (GPL-2.0-or-later).

## Адрес оригинала на GitHub

Апплет входит в сам репозиторий Cinnamon:

https://github.com/linuxmint/cinnamon/tree/master/files/usr/share/cinnamon/applets/grouped-window-list@cinnamon.org

## Безопасность / откат

Системные файлы **не трогаются**. Установка кладёт пользовательскую копию в
`~/.local/share/cinnamon/applets/`, которая загружается приоритетнее системной.

* Установить: `./install.sh` → перезапуск Cinnamon (`Alt+F2 → r → Enter`).
* Откат: `./uninstall.sh` → перезапуск Cinnamon.

## Как работает

ПКМ по значку окна в таскбаре → «Tile windows» → нужная раскладка. Все окна приложения перекладываются на рабочую область монитора, где стоит панель. Активное окно после операции остаётся активным.

## Структура

* `gwl-src/` — изменённые исходники апплета (ветка `feature/tile-app-windows`).
* `install.sh` / `uninstall.sh` — установка и откат.
* Бэкап системного оригинала: `~/.local/share/cinnamon/applets/.backups/`.

## Лицензия

Главный код апплета — GPL-2.0-or-later (как и Cinnamon). Модуль тайлинга портирован из Zorin Taskbar (https://github.com/ZorinOS/zorin-taskbar), тоже GPL-2.0-or-later.
