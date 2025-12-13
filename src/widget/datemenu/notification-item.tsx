import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import Pango from 'gi://Pango?version=1.0';
import GLib from 'gi://GLib?version=2.0';
import { Gtk } from 'ags/gtk4';
import { Box, Button, Icon } from '@/components';
import { cnames } from '@/support/utils';
import { lookupIcon } from '@/support/icons';
import app from 'ags/gtk4/app';
import { scss } from '@/theme/style';

const time = (time: number, format = '%H:%M') => GLib.DateTime.new_from_unix_local(time).format(format)!;

export default ({ notification }: { notification: AstalNotifd.Notification }) => {
  const n = notification;
  const className = cnames('notification', 'raised', notification.urgency === AstalNotifd.Urgency.CRITICAL && 'critical');

  return (
    <Box vertical class={className} p="xl" r="2xl">
      <box orientation={Gtk.Orientation.VERTICAL}>
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
          <Box vertical valign={CENTER} gap="xl">
            <Box>
              <label class="title" halign={START} xalign={0} label={n.summary} maxWidthChars={24} singleLineMode ellipsize={Pango.EllipsizeMode.END} />
              <Box hexpand gap="lg" halign={END} valign={START}>
                <label class="time" label={time(n.time)} />
                <Button class="close" hfill flat color="primary" valign={START} onClicked={() => n.dismiss()}>
                  <Icon symbolic iconName="window-close" />
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
                  app.toggle_window('datemenu');
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
};

void scss`.date-menu box.notification {
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

    .time {
      font-size: .85rem;
    }
  }

  .critical .body .title {
    color: $error;
  }
}`;
