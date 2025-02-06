import { App } from 'astal/gtk3';
import Hyprland from 'gi://AstalHyprland';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Icon from 'gtk/primitive/Icon';
import Separator from 'gtk/primitive/Separator';
import { Variable, bind } from 'astal';
import { scss } from 'core/theme';
import options from '../../options';

function Client({ client }: { client: Hyprland.Client }) {
  const { icon } = options.hyprland;

  return (
    <box className="Client">
      <Button
        hfill
        vfill
        flat
        hexpand={true}
        onClicked={() => {
          client.focus();
          App.get_window('launcher')!.hide();
        }}
      >
        <box>
          <Box p="lg">
            <Icon symbolic={icon.monochrome()} icon={client.class} size={icon.size()} fallback="application-x-executable" />
          </Box>
          <label xalign={0} wrap label={bind(client, 'title')} />
        </box>
      </Button>
      <Button
        hfill
        flat
        suggested
        color="error"
        onClicked={() => {
          client.kill();
          App.get_window('launcher')!.hide();
        }}
      >
        <Box p="lg">
          <Icon symbolic icon="window-close" />
        </Box>
      </Button>
    </box>
  );
}

void scss`.Launcher .Hyprland {
    .ZeroApps icon {
        color: $error;
    }

    .List {
        /* md Separator spacing */
        margin-top: -$spacing * .4;
    }
}`;

export default function (filter: Variable<Array<string>>) {
  const clients = bind(Hyprland.get_default(), 'clients');

  return (
    <Box vertical className="Hyprland" pb="2xl">
      <Box vertical className="ZeroApps" visible={clients.as(cs => cs.length === 0)}>
        <Separator />
        <Box pt="2xl" halign={CENTER}>
          <Icon symbolic css="margin-right: .1em" icon="application-x-executable" />
          There are no applications running.
        </Box>
      </Box>
      <Box className="List" vertical>
        {clients.as(cs =>
          cs.map(c => (
            <revealer transitionType={SLIDE_DOWN} revealChild={filter(filter => filter.includes(c.title!))}>
              <box vertical>
                <Separator my="md" />
                <Box px="2xl">
                  <Client client={c} />
                </Box>
              </box>
            </revealer>
          )),
        )}
      </Box>
    </Box>
  );
}
