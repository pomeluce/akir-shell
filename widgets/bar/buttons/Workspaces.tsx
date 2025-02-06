import Hyprland from 'gi://AstalHyprland';
import { bind, Variable } from 'astal';
import PanelButton from '../PanelButton';
import Box from 'gtk/primitive/Box';
import { scss } from 'core/theme';
import { range } from 'core/lib/array';
import { throttle } from 'core/lib/function';
import { cnames } from 'core/lib/utils';
import options from 'options';

void scss`.Bar {
  .panel.transparent .PanelButton.Workspaces label.Workspace {
    box-shadow: $box-shadow;
  }

  .panel:not(.transparent) .PanelButton.Workspaces label.Workspace {
    box-shadow: inset 0 0 0 $border-width $border-color;
  }

  .PanelButton.Workspaces {
    label.Workspace {
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

    &:active label.Workspace.focused {
        background-color: $accent-fg;
    }
  }
}`;

function workspace(id: number) {
  const hyprland = Hyprland.get_default();
  const get = () => hyprland.get_workspace(id) || Hyprland.Workspace.dummy(id, null);

  return Variable(get()).observe(hyprland, 'workspace-added', get).observe(hyprland, 'workspace-removed', get);
}

function Workspace(id: number) {
  const hyprland = Hyprland.get_default();
  const ws = workspace(id);

  const className = Variable.derive([bind(hyprland, 'focusedWorkspace'), bind(hyprland, 'clients'), ws], (focused, clients, ws) =>
    cnames('Workspace', focused === ws && 'focused', clients.filter(c => c.workspace == ws).length > 0 ? 'occupied' : 'empty'),
  );

  return (
    <label
      onDestroy={() => {
        className.drop();
        ws.drop();
      }}
      valign={CENTER}
      className={className()}
      label={`${id}`}
    />
  );
}

export default function Workspaces() {
  const { flat, workspaces, label } = options.bar.workspaces;
  const hyprland = Hyprland.get_default();

  const scroll = throttle(200, (y: number) => hyprland.dispatch('workspace', y > 0 ? 'm+1' : 'm-1'));

  return (
    <PanelButton flat={flat()} className="Workspaces" tooltipText={label()} onScroll={(_, { delta_y }) => scroll(delta_y)}>
      <Box gap="md">{workspaces(n => range(1, n).map(Workspace))}</Box>
    </PanelButton>
  );
}
