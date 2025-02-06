import Button, { type ButtonProps } from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import { fake } from 'core/lib/utils';
import { App, Gtk, hook } from 'astal/gtk3';

export default function PanelButton({ child, className = '', winName = '', setup, ...props }: ButtonProps & { winName?: string }) {
  return (
    <Button
      vfill
      m="md"
      className={fake(className).as(cn => `PanelButton ${cn}`)}
      setup={self => {
        setup?.(self);

        let open = false;

        self.toggleClassName(winName);

        hook(self, App, 'window-toggled', (_, win: Gtk.Window) => {
          const name = win.name;
          const visible = win.visible;

          if (!name || !winName || name !== winName) return;

          if (open && !visible) {
            open = false;
            self.toggleClassName('active', false);
          }

          if (visible) {
            open = true;
            self.toggleClassName('active');
          }
        });
      }}
      {...props}
    >
      <Box py="md" px="xl">
        {child}
      </Box>
    </Button>
  );
}
