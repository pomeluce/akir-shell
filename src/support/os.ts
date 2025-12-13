import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { execAsync } from 'ags/process';

/** @returns execAsync(["bash", "-c", cmd]).catch */
export async function sh(strings: string | TemplateStringsArray, ...values: unknown[]) {
  const cmd = typeof strings === 'string' ? strings : strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

  return execAsync(['bash', '-c', cmd]).catch(err => {
    console.error(cmd, err);
    return '';
  });
}

/** @returns execAsync(["bash", "-c", cmd]) */
export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]) {
  const cmd = typeof strings === 'string' ? strings : strings.flatMap((str, i) => str + `${values[i] ?? ''}`).join('');

  return execAsync(['bash', '-c', cmd]);
}

/**
 * @returns true if all of the `bins` are found
 */
export function dependencies(...bins: string[]) {
  const missing = bins.filter(bin => !GLib.find_program_in_path(bin));

  if (missing.length > 0) {
    printerr(`missing dependencies: ${missing.join(', ')}`);
  }

  return missing.length === 0;
}

export function ls(path: string) {
  const list: string[] = [];
  const dir = GLib.Dir.open(path, 0);

  let file = dir.read_name();
  while (file) {
    if (!GLib.file_test(`${path}/${file}`, GLib.FileTest.IS_DIR)) {
      list.push(file);
    }

    file = dir.read_name();
  }

  return list;
}

export function mkdir(path: string) {
  if (!GLib.file_test(path, GLib.FileTest.IS_DIR)) {
    Gio.File.new_for_path(path).make_directory_with_parents(null);
  }

  return path;
}
