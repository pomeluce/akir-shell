import { Astal } from 'astal/gtk3';
import { GLib, Variable } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import { cnames } from 'core/lib/utils';
import { scss } from 'core/theme';

void scss`.Launcher box.Notification {
  color: $fg;

  box.header {
    .icon { color: $primary }
    .name { color: transparentize($fg, .1) }
    .time { color: transparentize($fg, .4) }
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

  .critical .body .title {
    color: $error;
  }
}`;

const time = (time: number, format = '%H:%M') => GLib.DateTime.new_from_unix_local(time).format(format)!;

export default function Notification({ notification }: { notification: Notifd.Notification }) {
  const n = notification;
  const showBody = Variable(false);

  const className = cnames('Notification', notification.urgency === Notifd.Urgency.CRITICAL && 'critical');

  return (
    <Box vertical className={className}>
      <Box className="header" gap="sm" p="md" pl="lg">
        {(n.appIcon || n.desktopEntry) && <Icon symbolic className="icon" css="font-size: 1rem" icon={n.appIcon || n.desktopEntry} />}
        <label className="name" halign={START} truncate label={n.appName} />
        <label className="time" hexpand halign={END} label={time(n.time)} />
        <box>
          <Button onClicked={() => showBody.set(!showBody.get())}>
            <Box m="sm">
              <Icon symbolic icon="pan-down" />
            </Box>
          </Button>
        </box>
        <box>
          <Button onClicked={() => n.dismiss()} color="error" flat suggested>
            <Box m="sm">
              <Icon symbolic icon="window-close" />
            </Box>
          </Button>
        </box>
      </Box>
      <revealer revealChild={showBody()} transitionType={SLIDE_DOWN}>
        <box vertical>
          <Box gap="xl" p="lg" className="body">
            {n.image && GLib.file_test(n.image, GLib.FileTest.EXISTS) && (
              <box
                valign={START}
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
              {n.body && <label wrap useMarkup halign={START} xalign={0} justifyFill label={n.body} />}
            </Box>
          </Box>
          {n.get_actions().length > 0 && (
            <Box gap="xl" m="md">
              {n.get_actions().map(({ label, id }) => (
                <Button suggested color="primary" hexpand hfill onClicked={() => n.invoke(id)}>
                  <Box my="md">
                    <label label={label} halign={CENTER} hexpand />
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </box>
      </revealer>
    </Box>
  );
}
