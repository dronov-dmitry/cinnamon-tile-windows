# cinnamon-tile-windows

**Плиткование окон из ПКМ-меню таскбара Cinnamon** — без PR в upstream, как самостоятельный пользовательский апплет.

## Что делает

Добавляет в стандартный апплет Cinnamon **Grouped window list** (`grouped-window-list@cinnamon.org`) пункт контекстного меню:

**ПКМ по значку приложения в таскбаре → «Tile windows» → раскладка:**
- `Tile all windows in a grid` — авто-сетка (столбцы × строки)
- `Left and right halves` — две половины по горизонтали
- `Top and bottom halves` — две половины по вертикали
- `Three columns` — три колонки
- `Two thirds – one third` / `One third – two thirds`
- `Four quarters` — 2×2

Все окна группы всплывают на верх после плиткования.

## Как установить (себе или другому пользователю)

```bash
git clone https://github.com/dronov-dmitry/cinnamon-tile-windows.git
cd cinnamon-tile-windows
./install.sh
```

Затем перезапустить Cinnamon:
- `Alt+F2 → ввести r → Enter`
- или в терминале: `cinnamon --replace &`

## Как откатить

```bash
./uninstall.sh
Alt+F2 → r → Enter
```

## Безопасность

Системные файлы в `/usr/share/cinnamon/applets/` **не трогаются**.  
Установка кладёт пользовательскую копию в `~/.local/share/cinnamon/applets/`, которая загружается приоритетнее системной. Бэкап оригинала сохраняется в `~/.local/share/cinnamon/applets/.backups/`.

## Для разработчиков

- `gwl-src/` — изменённые исходники апплета (ветка `feature/tile-app-windows`)
- `tileWindows.js` — новый модуль алгоритма плиткования
- `menus.js` — добавлено подменю «Tile windows» в `AppMenuButtonRightClickMenu`
- Проверено на Cinnamon 6.6.9+zena (Linux Mint 22.3 "Zena"), X11

## Статус upstream

Предложение добавить эту функцию в официальный Cinnamon было закрыто как `not planned` (см. https://github.com/linuxmint/cinnamon/issues/14056). Этот репозиторий — независимое решение для пользователей, которым нужен этот функционал.

## Лицензия

GPL-2.0-or-later (как и Cinnamon).
