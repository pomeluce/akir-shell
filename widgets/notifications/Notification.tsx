import Button from 'gtk/primitive/Button';
import Box from 'gtk/primitive/Box';
import Separator from 'gtk/primitive/Separator';
import Icon from 'gtk/primitive/Icon';
import Notifd from 'gi://AstalNotifd';
import GLib from 'gi://GLib';
import Astal from 'gi://Astal?version=3.0';
import Variable from 'astal/variable';
import { scss } from 'core/theme';

void scss`.Notifications box.Notification {
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

    box.icon-image icon {
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

const time = (time: number, format = '%H:%M') => GLib.DateTime.new_from_unix_local(time).format(format)!;

type Props = {
  width?: number;
  onHoverLost?: () => void;
  notification: Notifd.Notification;
};

export default function Notification(props: Props) {
  const { notification: n, onHoverLost } = props;
  const showActions = Variable(false);

  return (
    <eventbox
      onHover={() => showActions.set(true)}
      onHoverLost={() => {
        onHoverLost?.();
        showActions.set(false);
      }}
    >
      <Box vertical className="Notification">
        <Box className="app" gap="sm" p="md" pl="lg">
          {(n.appIcon || n.desktopEntry) && <Icon symbolic className="icon" css="font-size: 1rem" icon={n.appIcon || n.desktopEntry} />}
          <label className="name" halign={START} truncate label={n.appName} />
          <label className="time" hexpand halign={END} label={time(n.time)} />
          <box>
            <Button onClicked={() => n.dismiss()} color="error" flat>
              <Box m="sm">
                <Icon symbolic icon="window-close" />
              </Box>
            </Button>
          </box>
        </Box>
        <Separator mx="sm" />
        <Box gap="xl" p="lg" className="body">
          {n.image && GLib.file_test(n.image, GLib.FileTest.EXISTS) && (
            <box
              valign={CENTER}
              className="image"
              css={`
                background-image: url('${n.image}');
              `}
            />
          )}
          {n.image && Astal.Icon.lookup_icon(n.image) && (
            <box expand={false} valign={START} className="icon-image">
              <icon icon={n.image} expand halign={CENTER} valign={CENTER} />
            </box>
          )}
          <Box vertical>
            <label className="title" halign={START} xalign={0} label={n.summary} truncate />
            {n.body && <label wrap useMarkup halign={START} xalign={0} label={n.body} />}
          </Box>
        </Box>
        {n.get_actions().length > 0 && (
          <revealer transitionType={SLIDE_DOWN} revealChild={showActions()}>
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
    </eventbox>
  );
}
