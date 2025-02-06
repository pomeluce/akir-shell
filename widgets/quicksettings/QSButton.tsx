import { Binding, timeout, Variable } from 'astal';
import { Gtk, Widget } from 'astal/gtk3';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import Separator from 'gtk/primitive/Separator';

interface QSSimpleToggleButtonProps {
  icon: Widget.IconProps['icon'];
  label: Widget.LabelProps['label'];
  onToggled: () => void;
  state?: Binding<boolean> | boolean;
}

export const QSSimpleToggleButton = ({ icon, label, state = false, onToggled }: QSSimpleToggleButtonProps) => {
  const innerState = Variable(state instanceof Binding ? state.get() : state);

  return (
    <Box
      className="QSSimpleToggleButton raised"
      r="2xl"
      setup={self => {
        self.toggleClassName('active', innerState.get());
        self.hook(innerState, () => self.toggleClassName('active', innerState.get()));
        if (state instanceof Binding) {
          self.hook(state, () => innerState.set(state.get()));
        }
      }}
    >
      <button hexpand onClicked={onToggled}>
        <Box p="xl" gap="xl">
          <Icon symbolic icon={icon} />
          <label label={label} maxWidthChars={10} truncate />
        </Box>
      </button>
    </Box>
  );
};

interface QSToggleButtonProps {
  name?: string;
  label: Widget.LabelProps['label'];
  icon: Widget.IconProps['icon'];
  activate: () => void;
  deactivate: () => void;
  state?: Binding<boolean> | boolean;
}

export const opened = Variable('');

export const QSToggleArrow = ({ name, activate }: { name: string; activate?: () => void }) => {
  return (
    <button
      onClicked={() => {
        opened.set(opened.get() === name ? '' : name);
        activate?.();
      }}
    >
      <Box>
        <Icon
          symbolic
          icon="pan-end-symbolic"
          setup={self => {
            let deg = 0;
            let btnOpened = false;
            self.hook(opened, () => {
              if ((opened.get() === name && !btnOpened) || (opened.get() !== name && btnOpened)) {
                const step = opened.get() === name ? 10 : -10;
                btnOpened = !btnOpened;
                for (let i = 0; i < 9; ++i) {
                  timeout(15 * i, () => {
                    deg += step;
                    self.set_css(`-gtk-icon-transform: rotate(${deg}deg);`);
                  });
                }
              }
            });
          }}
        />
      </Box>
    </button>
  );
};

export const QSToggleButton = ({ label, icon, state = false, name = '', activate, deactivate }: QSToggleButtonProps) => {
  const innerState = Variable(state instanceof Binding ? state.get() : state);

  return (
    <Box
      className="QSToggleButton raised"
      r="2xl"
      setup={self => {
        self.toggleClassName('active', innerState.get());
        self.hook(innerState, () => self.toggleClassName('active', innerState.get()));
        if (state instanceof Binding) {
          self.hook(state, () => innerState.set(state.get()));
        }
      }}
    >
      <button
        hexpand
        onClicked={() => {
          if (innerState.get()) {
            deactivate();
            if (opened.get() === name) opened.set('');
          } else activate();
        }}
      >
        <Box p="xl" gap="xl">
          <Icon symbolic icon={icon} />
          <label label={label} maxWidthChars={10} truncate />
        </Box>
      </button>
      <QSToggleArrow name={name} activate={activate} />
    </Box>
  );
};

type QSMenuProps = {
  name: string;
  icon: Widget.IconProps['icon'];
  title: Widget.LabelProps['label'];
  child?: Gtk.Widget;
  children?: Gtk.Widget[];
};

export const QSMenu = ({ name, icon, title, child, children }: QSMenuProps) => {
  return (
    <revealer revealChild={opened().as(v => v === name)} transitionType={SLIDE_DOWN}>
      <Box className={`QSMenu raised ${name}`} vertical p="xl" r="2xl">
        <Box gap="xl" px="2xl" valign={CENTER}>
          <Icon symbolic icon={icon} />
          <label label={title} />
        </Box>
        <Separator mt="md" />
        <Box vertical>{child || children}</Box>
      </Box>
    </revealer>
  );
};
