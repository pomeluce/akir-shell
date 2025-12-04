import { Gtk } from 'ags/gtk4';
import Gio from 'gi://Gio?version=2.0';
import GLib from 'gi://GLib?version=2.0';
import version from 'inline:../../version';

// DEV
try {
  Object.assign(globalThis, { DEV });
} catch (err) {
  if (err instanceof ReferenceError) {
    Object.assign(globalThis, { DEV: true });
  }
}

// VERSION
try {
  Object.assign(globalThis, { VERSION });
} catch (err) {
  if (err instanceof ReferenceError) {
    Object.assign(globalThis, { VERSION: version.trim() });
  }
}

declare global {
  const VERSION: string;
  const DEV: boolean;

  // GTK
  const START: number;
  const CENTER: number;
  const END: number;
  const FILL: number;

  // Revealer
  const SLIDE_UP: number;
  const SLIDE_DOWN: number;
  const SLIDE_LEFT: number;
  const SLIDE_RIGHT: number;
  const CROSSFADE: number;

  // Shell
  const CACHE: string;
  const CONFIG: string;
  const TMP: string;
  const USER: string;
  const HOME: string;
}

(() => {
  const { Align, RevealerTransitionType } = Gtk;

  Object.assign(globalThis, {
    START: Align.START,
    CENTER: Align.CENTER,
    END: Align.END,
    FILL: Align.FILL,

    SLIDE_UP: RevealerTransitionType.SLIDE_UP,
    SLIDE_DOWN: RevealerTransitionType.SLIDE_DOWN,
    SLIDE_LEFT: RevealerTransitionType.SLIDE_LEFT,
    SLIDE_RIGHT: RevealerTransitionType.SLIDE_RIGHT,
    CROSSFADE: RevealerTransitionType.CROSSFADE,

    CACHE: `${GLib.get_user_cache_dir()}/akirds`,
    CONFIG: GLib.getenv('AKIRDS_CONFIG') || `${GLib.get_user_config_dir()}/akirds`,
    TMP: `${GLib.get_user_runtime_dir()}/akirds`,
    USER: GLib.get_user_name(),
    HOME: GLib.get_home_dir(),
  });

  for (const dir of [TMP, CACHE, CONFIG]) {
    if (!GLib.file_test(dir, GLib.FileTest.IS_DIR)) Gio.File.new_for_path(dir).make_directory(null);
  }
})();
