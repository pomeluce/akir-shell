import GLib from 'gi://GLib?version=2.0';
import { Gdk, Gtk } from 'ags/gtk4';
import { readFile } from 'ags/file';
import app from 'ags/gtk4/app';

export function initIcons() {
  if (GLib.file_test(`${CONFIG}/icons`, GLib.FileTest.EXISTS)) app.add_icons(`${CONFIG}/icons`);
}

export function icon(name: string | null, fallback = 'image-missing', checker: (name: string) => boolean) {
  if (!name) return fallback || '';

  const icon = substitutes[name] || substitutes[name.toLowerCase()] || name;
  if (GLib.file_test(icon, GLib.FileTest.EXISTS)) return icon;
  if (checker(icon)) return icon;
  if (checker(icon.toLowerCase())) return icon.toLowerCase();
  printerr(`no icon "${icon}", fallback: "${fallback}"`);
  return fallback;
}

export const substitutes: Record<string, string> = GLib.file_test(`${CONFIG}/substitutes.json`, GLib.FileTest.EXISTS) ? JSON.parse(readFile(`${CONFIG}/substitutes.json`)) : {};

export function symbolic(i: string, s: boolean) {
  if (i == null) return symbolic('image-missing', s);
  return s ? (i.endsWith('-symbolic') ? i : i + '-symbolic') : i.endsWith('-symbolic') ? i.replace('-symbolic', '') : i;
}

export function lookupIcon(name: string) {
  return Gtk.IconTheme.get_for_display(Gdk.Display.get_default()!).lookup_icon(name, null, 16, 1, Gtk.TextDirection.LTR, Gtk.IconLookupFlags.NONE);
}
