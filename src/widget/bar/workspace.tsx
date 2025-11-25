import options from 'options';
import PanelButton from './panel-button';
import Hyprland from 'gi://AstalHyprland?version=0.1';
import { Gtk } from 'ags/gtk4';
import { Box } from '@/components';
import { createBinding, createComputed, createState, For } from 'gnim';
import { throttle } from '@/support/function';
import { range } from '@/support/array';
import { cnames } from '@/support/utils';
import { scss } from '@/theme/theme';

void scss`.bar {
  .panel.transparent .panel-button.workspaces label.workspace {
    box-shadow: $box-shadow;
  }

  .panel:not(.transparent) .panel-button.workspaces label.workspace {
    box-shadow: inset 0 0 0 $border-width $border-color;
  }

  .panel-button.workspaces {
    label.workspace {
      border-radius: $radius * 1;
      color: transparent;
      font-size: 0;
      transition: $transition * .5;

      &.empty {
        background-color: transparentize($fg, .78);
        min-height: .75rem;
        min-width: .75rem;
      }

      &.occupied {
        background-color: $fg;
        min-height: .75rem;
        min-width: .75rem;
      }

      &.focused {
        background-color: $primary;
        min-height: 1rem;
        min-width: 1.6rem;
      }
    }

    &:active label.workspace.focused {
        background-color: $accent-fg;
    }
  }
}`;

function workspace(id: number) {
  const hyprland = Hyprland.get_default();
  const get = () => hyprland.get_workspace(id) || Hyprland.Workspace.dummy(id, null);

  const [ws, setWs] = createState(get());

  hyprland.connect('workspace-added', () => setWs(get()));
  hyprland.connect('workspace-removed', () => setWs(get()));

  return ws;
}

function Workspace({ id }: { id: number }) {
  const hyprland = Hyprland.get_default();
  const ws = workspace(id);

  const classes = createComputed([createBinding(hyprland, 'focusedWorkspace'), createBinding(hyprland, 'clients'), ws], (focused, clients, ws) =>
    cnames('workspace', focused === ws && 'focused', clients.filter(c => c.workspace == ws).length > 0 ? 'occupied' : 'empty'),
  );

  return <label valign={CENTER} class={classes} label={`${id}`} />;
}

export default () => {
  const { flat, workspaces, label } = options.bar.workspaces;
  const hyprland = Hyprland.get_default();

  const scroll = throttle(200, (y: number) => hyprland.dispatch('workspace', y > 0 ? 'm+1' : 'm-1'));

  return (
    <PanelButton
      class="workspaces"
      flat={flat()}
      tooltipText={label()}
      $={self => {
        const ctrl = new Gtk.EventControllerScroll({ flags: Gtk.EventControllerScrollFlags.VERTICAL });
        ctrl.connect('scroll', (_ctrl, _dx, dy) => scroll(dy));
        self.add_controller(ctrl);
      }}
    >
      <Box gap="md">
        <For each={workspaces()(n => range(1, n))}>{(i: number) => <Workspace id={i} />}</For>
      </Box>
    </PanelButton>
  );
};
