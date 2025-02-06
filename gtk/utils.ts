import GdkPixbuf from 'gi://GdkPixbuf';
import Gtk from 'gi://Gtk?version=3.0';
import GLib from 'gi://GLib?version=2.0';
import Gio from 'gi://Gio?version=2.0';
import { mkdir } from 'core/lib/os';

/** to use with drag and drop */
export function createSurfaceFromWidget(widget: Gtk.Widget) {
  // @ts-expect-error missing module
  const cairo = imports.gi.cairo as any;
  const alloc = widget.get_allocation();
  const surface = new cairo.ImageSurface(cairo.Format.ARGB32, alloc.width, alloc.height);
  const cr = new cairo.Context(surface);
  cr.setSourceRGBA(255, 255, 255, 0);
  cr.rectangle(0, 0, alloc.width, alloc.height);
  cr.fill();
  widget.draw(cr);
  return surface;
}

export function thumbnail(file: string, size = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const result = `${CACHE}/thumbnail/${GLib.path_get_basename(file)}`;

    if (GLib.file_test(result, GLib.FileTest.EXISTS)) return resolve(result);

    mkdir(`${CACHE}/thumbnail`);
    const f = Gio.File.new_for_path(file);
    f.read_async(GLib.PRIORITY_DEFAULT, null, (_, res) => {
      try {
        const stream = f.read_finish(res);

        GdkPixbuf.Pixbuf.new_from_stream_async(stream, null, (_, f) => {
          try {
            const pb = GdkPixbuf.Pixbuf.new_from_stream_finish(f);

            const ratio = pb.width / pb.height;
            let scaledHeight: number;
            let scaledWidth: number;

            if (ratio > 1) {
              // Landscape
              scaledWidth = size;
              scaledHeight = size / ratio;
            } else {
              // Portrait
              scaledHeight = size;
              scaledWidth = size * ratio;
            }

            pb.scale_simple(scaledWidth, scaledHeight, GdkPixbuf.InterpType.BILINEAR)?.savev(result, 'jpeg', [], []);

            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  });
}
