import { App, Astal } from 'astal/gtk3';
import { GLib } from 'astal';
import Notifd from 'gi://AstalNotifd';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import { cnames } from 'core/lib/utils';
import { scss } from 'core/theme';
import Icon from 'gtk/primitive/Icon';

void scss`.DateMenu box.Notification {
  color: $fg;

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

    .time {
      font-size: .85rem;
    }
  }

  .critical .body .title {
    color: $error;
  }
}`;

const time = (time: number, format = '%H:%M') => GLib.DateTime.new_from_unix_local(time).format(format)!;

export default function Notification({ notification }: { notification: Notifd.Notification }) {
  const n = notification;
  const className = cnames('Notification', 'raised', notification.urgency === Notifd.Urgency.CRITICAL && 'critical');

  return (
    <Box vertical className={className} p="xl" r="2xl">
      <box vertical>
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
          <Box vertical valign={CENTER} gap="xl">
            <Box>
              <label className="title" halign={START} xalign={0} label={n.summary} maxWidthChars={24} truncate />
              <Box hexpand gap="lg" halign={END} valign={START}>
                <label className="time" label={time(n.time)} />
                <Button className="close" hfill flat color="primary" valign={START} onClick={() => n.dismiss()}>
                  <Icon symbolic icon="window-close" />
                </Button>
              </Box>
            </Box>
            {n.body && <label wrap useMarkup halign={START} xalign={0} label={n.body} />}
          </Box>
        </Box>
        {n.get_actions().length > 0 && (
          <Box gap="xl" m="md">
            {n.get_actions().map(({ label, id }) => (
              <Button
                suggested
                hexpand
                hfill
                onClicked={() => {
                  n.invoke(id);
                  n.dismiss();
                  App.toggle_window('datemenu');
                }}
              >
                <Box my="md">
                  <label label={label} halign={CENTER} hexpand />
                </Box>
              </Button>
            ))}
          </Box>
        )}
      </box>
    </Box>
  );
}
