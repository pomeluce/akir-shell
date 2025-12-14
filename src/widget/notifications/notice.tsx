import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import GLib from 'gi://GLib?version=2.0';
import Pango from 'gi://Pango?version=1.0';
import { Gtk } from 'ags/gtk4';
import { Box, Button, Icon, Separator } from '@/components';
import { lookupIcon } from '@/support/icons';
import { createState } from 'gnim';
import { scss } from '@/theme/style';

type Props = {
  width?: number;
  onHoverLost?: () => void;
  notification: AstalNotifd.Notification;
};

const time = (time: number, format = '%H:%M') => GLib.DateTime.new_from_unix_local(time).format(format)!;

export default function Notification(props: Props) {
  const { notification: n, onHoverLost } = props;
  const [showActions, setShowActions] = createState(false);

  return (
    <box
      $={self => {
        const ctrl = new Gtk.EventControllerMotion();
        ctrl.connect('enter', () => setShowActions(true));
        ctrl.connect('leave', () => {
          onHoverLost?.();
          setShowActions(false);
        });
        self.add_controller(ctrl);
      }}
    >
      <Box vertical class="notification">
        <Box class="app" gap="sm" p="md" pl="lg">
          {(n.appIcon || n.desktopEntry) && <Icon symbolic class="icon" css="font-size: 1rem;" iconName={n.appIcon || n.desktopEntry} />}
          <label class="name" halign={START} singleLineMode ellipsize={Pango.EllipsizeMode.END} label={n.appName} />
          <label class="time" hexpand halign={END} label={time(n.time)} />
          <box>
            <Button onClicked={() => n.dismiss()} color="error" flat>
              <Box m="sm">
                <Icon symbolic iconName="window-close" />
              </Box>
            </Button>
          </box>
        </Box>
        <Separator mx="sm" />
        <Box gap="xl" p="lg" class="body">
          {n.image && GLib.file_test(n.image, GLib.FileTest.EXISTS) && (
            <box
              valign={CENTER}
              class="image"
              css={`
                background-image: url('file://${n.image}');
              `}
            />
          )}
          {n.image && lookupIcon(n.image) && (
            <box hexpand={false} vexpand={false} valign={START} class="icon-image">
              <Icon iconName={n.image} hexpand vexpand halign={CENTER} valign={CENTER} />
            </box>
          )}
          <Box vertical>
            <label class="title" halign={START} xalign={0} label={n.summary} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
            {n.body && <label wrap useMarkup halign={START} xalign={0} label={n.body} maxWidthChars={35} />}
          </Box>
        </Box>
        {n.get_actions().length > 0 && (
          <revealer transitionType={SLIDE_DOWN} revealChild={showActions}>
            <Box gap="xl" m="md">
              {n.get_actions().map(({ label, id }) => (
                <Button suggested color="primary" hexpand hfill onClicked={() => n.invoke(id)}>
                  <Box my="md">
                    <label label={label} halign={CENTER} hexpand />
                  </Box>
                </Button>
              ))}
            </Box>
          </revealer>
        )}
      </Box>
    </box>
  );
}

void scss`.notifications box.notification {
  color: $fg;

  box.app {
    .name, .icon, .time {
      color: transparentize($fg, .4);
    }
  }

  box.body {
    box.image,
    box.icon-image {
      min-height: 5rem;
      min-width: 5rem;
    }

    box.image {
      border-radius: $radius;
      background-size: cover;
      background-position: center;

      @if $shadows {
        box-shadow: $box-shadow;
      }
    }

    box.icon-image image {
      font-size: 4.8em;

      @if $shadows {
        -gtk-icon-shadow: $text-shadow;
      }
    }

    .title {
      font-weight: bold;
      font-size: 1.14rem;
    }
  }
}`;
