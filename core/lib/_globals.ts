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

async function Gtk(gtk: 3 | 4) {
  try {
    if (gtk == 3) {
      return await import('gi://Gtk?version=3.0').then(m => m.default);
    }
    if (gtk == 4) {
      return await import('gi://Gtk?version=4.0').then(m => m.default);
    }
  } catch (error) {
    logError(error);
  }

  throw new Error(`invalid Gtk version ${gtk}`);
}

export default async function init(gtk: 3 | 4) {
  const { Align, RevealerTransitionType } = await Gtk(gtk);

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

    CACHE: `${GLib.get_user_cache_dir()}/akir-shell`,
    CONFIG: GLib.getenv('AKIR_CONFIG') || `${GLib.get_user_config_dir()}/akir-shell`,
    TMP: `${GLib.get_user_runtime_dir()}/akir-shell`,
    USER: GLib.get_user_name(),
    HOME: GLib.get_home_dir(),
  });

  for (const dir of [TMP, CACHE, CONFIG]) {
    if (!GLib.file_test(dir, GLib.FileTest.IS_DIR)) Gio.File.new_for_path(dir).make_directory(null);
  }
}
