import PanelButton from '../panel-button';
import AstalNiri from 'gi://AstalNiri?version=0.1';
import { Gdk, Gtk } from 'ags/gtk4';
import { Box } from '@/components';
import { createBinding, createComputed, For, With } from 'gnim';
import { throttle } from '@/support/function';
import { cnames } from '@/support/utils';
import { scss } from '@/theme/style';
import { compositor, configs } from 'options';

const niri = compositor() === 'niri' ? AstalNiri.get_default() : null;

function Workspace({ ws }: { ws: AstalNiri.Workspace }) {
  const niri = AstalNiri.get_default();

  const classes = createComputed(() => {
    const focused = createBinding(niri, 'focusedWorkspace');
    const clients = createBinding(ws, 'windows');
    return cnames('workspace', focused() === ws && 'focused', clients().filter(c => c.workspace == ws).length > 0 ? 'occupied' : 'empty');
  });

  return <label valign={CENTER} class={classes} label={`${ws.id}`} />;
}

export const Workspaces = ({ output }: { output: AstalNiri.Output }) => {
  const workspaces = createBinding(output, 'workspaces').as(workspaces => workspaces.sort((a, b) => a.idx - b.idx));

  const { flat, label } = configs.bar.workspaces;

  const scroll = throttle(200, (y: number) => (y > 0 ? AstalNiri.msg.focus_workspace_up() : AstalNiri.msg.focus_workspace_down()));

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
        <For each={workspaces}>{ws => <Workspace ws={ws} />}</For>
      </Box>
    </PanelButton>
  );
};

export default ({ monitor }: { monitor: Gdk.Monitor }) => {
  if (!niri) {
    console.warn('Workspaces_Niri: Niri compositor not active');
    return <box visible={false} />;
  }
  const output = createBinding(niri, 'outputs').as(outputs => outputs.find(output => output.model === monitor.model));

  return (
    <box>
      <With value={output}>{output => output && <Workspaces output={output} />}</With>
    </box>
  );
};

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
