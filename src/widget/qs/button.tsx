import Pango from 'gi://Pango?version=1.0';
import { Box, Icon, Separator } from '@/components';
import { Gtk } from 'ags/gtk4';
import { Accessor, Node, createState } from 'gnim';
import { timeout } from 'ags/time';

const [opened, setOpened] = createState('');

interface QSSimpleToggleButtonProps {
  label: string | Accessor<string>;
  icon: string | Accessor<string>;
  onToggled: () => void;
  state?: Accessor<boolean> | boolean;
}

export const QSSimpleToggleButton = ({ icon, label, state = false, onToggled }: QSSimpleToggleButtonProps) => {
  const [innerState, setInnerState] = createState(state instanceof Accessor ? state.peek() : state);

  return (
    <Box
      class="qs-simple-toggle-button raised"
      r="2xl"
      $={self => {
        self[innerState.peek() ? 'add_css_class' : 'remove_css_class']('active');
        innerState(() => self[innerState.peek() ? 'add_css_class' : 'remove_css_class']('active'));
        if (state instanceof Accessor) state.subscribe(() => setInnerState(state.peek()));
      }}
    >
      <button hexpand onClicked={onToggled}>
        <Box p="xl" gap="xl">
          <Icon symbolic iconName={icon} />
          <label label={label} maxWidthChars={10} ellipsize={Pango.EllipsizeMode.END} singleLineMode />
        </Box>
      </button>
    </Box>
  );
};

export const QSToggleArrow = ({ name, activate }: { name: string; activate?: () => void }) => {
  const [css, setCss] = createState('');
  return (
    <button
      onClicked={() => {
        setOpened(opened.peek() === name ? '' : name);
        activate?.();
      }}
    >
      <Box>
        <Icon
          symbolic
          iconName="pan-end-symbolic"
          css={css}
          $={() => {
            let deg = 0;
            let btnOpened = false;
            opened.subscribe(() => {
              if ((opened.peek() === name && !btnOpened) || (opened.peek() !== name && btnOpened)) {
                const step = opened.peek() === name ? 10 : -10;
                btnOpened = !btnOpened;
                for (let i = 0; i < 9; ++i) {
                  timeout(15 * i, () => {
                    deg += step;
                    setCss(`-gtk-icon-transform: rotate(${deg}deg)`);
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

interface QSToggleButtonProps {
  name?: string;
  label: string | Accessor<string>;
  icon: string | Accessor<string>;
  activate: () => void;
  deactivate: () => void;
  state?: Accessor<boolean> | boolean;
}

export const QSToggleButton = ({ label, icon, state = false, name = '', activate, deactivate }: QSToggleButtonProps) => {
  const [innerState, setInnerState] = createState(state instanceof Accessor ? state.peek() : state);

  return (
    <Box
      class="qs-toggle-button raised"
      r="2xl"
      $={self => {
        self[innerState.peek() ? 'add_css_class' : 'remove_css_class']('active');
        innerState(() => self[innerState.peek() ? 'add_css_class' : 'remove_css_class']('active'));
        if (state instanceof Accessor) state.subscribe(() => setInnerState(state.peek()));
      }}
    >
      <button
        hexpand
        onClicked={() => {
          if (innerState.peek()) {
            deactivate();
            if (opened.peek() === name) setOpened('');
          } else activate();
        }}
      >
        <Box p="xl" gap="xl">
          <Icon symbolic iconName={icon} />
          <label label={label} ellipsize={Pango.EllipsizeMode.END} singleLineMode maxWidthChars={10} />
        </Box>
      </button>
      <QSToggleArrow name={name} activate={activate} />
    </Box>
  );
};

type QSMenuProps = {
  name: string;
  icon: string | Accessor<string>;
  title: Gtk.Label['label'];
  child?: Gtk.Widget;
  children?: Node | Node[];
};

export const QSMenu = ({ name, icon, title, child, children }: QSMenuProps) => {
  return (
    <revealer revealChild={opened(v => v === name)} transitionType={SLIDE_DOWN}>
      <Box class={`qs-menu raised ${name}`} vertical p="xl" r="2xl">
        <Box gap="xl" px="2xl" valign={CENTER}>
          <Icon symbolic iconName={icon} />
          <label label={title} />
        </Box>
        <Separator mt="md" />
        <Box vertical>{child || children}</Box>
      </Box>
    </revealer>
  );
};
