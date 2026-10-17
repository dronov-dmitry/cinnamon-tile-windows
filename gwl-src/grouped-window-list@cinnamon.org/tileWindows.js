/*
 * This file is part of the Grouped window list applet (Cinnamon).
 *
 * Ported from the "Tile N Windows" feature of Zorin Taskbar
 * (https://github.com/ZorinOS/zorin-taskbar), GPL-2.0-or-later.
 *
 * Adds a "Tile windows" submenu to the right-click menu of grouped window
 * list items. The selected layout arranges all windows of the app on the
 * work area of the monitor the applet lives on.
 */

const Meta = imports.gi.Meta;
const Main = imports.ui.main;

const GAP = 0;

/*
 * Layout presets. Every preset except "auto" defines the relative width of
 * each column of the grid (left to right, fractions of the work area width).
 * The number of rows grows automatically to fit the actual window count.
 */
const TILE_LAYOUTS = {
    // `auto` is treated specially: cols = ceil(sqrt(n)), rows = ceil(n / cols)
    auto: null,
    'half-h': [1 / 2, 1 / 2],
    'half-v': [1],
    'thirds': [1 / 3, 1 / 3, 1 / 3],
    'two-thirds-left': [2 / 3, 1 / 3],
    'two-thirds-right': [1 / 3, 2 / 3],
    'quarters': [1 / 2, 1 / 2]
};

function getWorkAreaForMonitor(monitorIndex) {
    const workspace = global.workspace_manager.get_active_workspace();
    return workspace.get_work_area_for_monitor(monitorIndex);
}

/*
 * Compute cell rectangles (x, y, w, h) for `n` windows inside `area`
 * according to a column-width template.
 */
function computeCells(area, cols, n) {
    const rows = Math.ceil(n / cols.length);
    const totalW = area.width - GAP * (cols.length - 1);
    const offsets = [];
    let acc = 0;

    // Distribute the width among columns proportional to the preset fractions.
    cols.forEach((frac, i) => {
        const isLast = i === cols.length - 1;
        const w = isLast
            ? totalW - acc
            : Math.round(totalW * frac);
        offsets.push([acc, w]);
        acc += w + GAP;
    });

    const cellH = Math.floor((area.height - GAP * (rows - 1)) / rows);
    const cells = [];

    for (let i = 0; i < n; i++) {
        const col = i % cols.length;
        const row = Math.floor(i / cols.length);
        const [offX, cellW] = offsets[col];
        cells.push({
            x: area.x + offX,
            y: area.y + row * (cellH + GAP),
            w: cellW,
            h: cellH
        });
    }

    return cells;
}

function computeCellsAuto(area, n) {
    const cols = Math.ceil(Math.sqrt(n));
    const rows = Math.ceil(n / cols);
    const cellW = Math.floor((area.width - GAP * (cols - 1)) / cols);
    const cellH = Math.floor((area.height - GAP * (rows - 1)) / rows);
    const cells = [];

    for (let i = 0; i < n; i++) {
        const col = i % cols;
        const row = Math.floor(i / cols);
        cells.push({
            x: area.x + col * (cellW + GAP),
            y: area.y + row * (cellH + GAP),
            w: cellW,
            h: cellH
        });
    }

    return cells;
}

function placeWindows(windows, cells) {
    const workspace = global.workspace_manager.get_active_workspace();

    windows.forEach((win, i) => {
        if (!win.located_on_workspace(workspace)) {
            win.change_workspace(workspace);
        }
        if (win.minimized) {
            win.unminimize();
        }
        if (win.fullscreen) {
            win.unmake_fullscreen();
        }
        if (win.get_maximized()) {
            win.unmaximize(Meta.MaximizeFlags.HORIZONTAL | Meta.MaximizeFlags.VERTICAL);
        }

        const {x, y, w, h} = cells[i];

        /*
         * move_resize_frame can apply only the size and ignore the position
         * for client-side decorated windows, so the position is applied in a
         * separate move_frame call.
         */
        win.move_resize_frame(true, x, y, w, h);
        win.move_frame(true, x, y);

        /*
         * Raise every tiled window to the top so they appear above other
         * windows after tiling.
         */
        win.raise();
    });
}

/*
 * Tile the given windows on the monitor with the given layout.
 * layout can be one of the TILE_LAYOUTS keys or 'auto'.
 */
function tileWindows(windows, monitorIndex, layout) {
    if (!windows || windows.length < 1 || layout === undefined) return;

    const activeWindow = windows.find(win =>
        win.get_compositor_private() && win.has_focus()
    );

    const area = getWorkAreaForMonitor(monitorIndex);
    const n = windows.length;
    const cols = TILE_LAYOUTS[layout];
    const cells = cols === null
        ? computeCellsAuto(area, n)
        : computeCells(area, cols, n);

    const place = () => placeWindows(windows, cells);

    place();

    // Windows that were just moved to the current workspace or unminimized
    // may not be mapped yet and can drop the first request - repeat it after
    // events have been processed.
    setTimeout(() => {
        place();
        // Raise all tiled windows so they appear above other windows after tiling
        windows.forEach(win => win.raise());
        if (activeWindow) {
            Main.activateWindow(activeWindow, global.get_current_time());
        }
    }, 250);
}