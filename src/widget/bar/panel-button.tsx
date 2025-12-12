import { Box, Button } from '@/components';
import { ButtonProps } from '@/types/element';
import { fake } from '@/support/utils';
import app from 'ags/gtk4/app';

export default (props: ButtonProps & { winName?: string }) => {
  const { children, class: cname = '', winName = '', $: setup, ...prop } = props;
  return (
    <Button
      vfill
      p="md"
      class={fake(cname).as(cls => `panel-button ${cls}`)}
      $={self => {
        setup?.(self);

        let open = false;

        if (winName) {
          self.cssClasses.includes(winName) ? self.remove_css_class(winName) : self.add_css_class(winName);
        }

        app.connect('window-toggled', (_, win) => {
          const name = win.name;
          const visible = win.visible;

          if (!name || !winName || name !== winName) return;

          if (open && !visible) {
            open = false;
            self.remove_css_class('active');
          }

          if (visible) {
            open = true;
            self.add_css_class('active');
          }
        });
      }}
      {...prop}
    >
      <Box py="md" px="xl" children={children} />
    </Button>
  );
};
