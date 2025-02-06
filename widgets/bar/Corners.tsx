import { App, Gdk, Astal } from 'astal/gtk3';
import { Variable, idle } from 'astal';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';
import options from 'options';

export default function Corners(monitor: Gdk.Monitor) {
  const { corners, transparent, position } = options.bar;

  const className = Variable.derive([corners, position], (c, p) => cnames('Corners', c, p));

  return (
    <window
      clickThrough
      className={className()}
      onDestroy={() => className.drop()}
      name={`corner-${monitor.model}`}
      namespace="corners"
      application={App}
      css="background-color: transparent"
      setup={self => {
        idle(() => (self.clickThrough = true));
      }}
      visible={transparent(t => !t)}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      gdkmonitor={monitor}
    >
      <box expand className="shadow">
        <box expand className="border">
          <box expand className="corner" />
        </box>
      </box>
    </window>
  );
}

void scss`
@mixin corners($multiplier) {
    box.border {
        border-radius: $radius * $multiplier;
        box-shadow: 0 0 0 ($radius * $multiplier) $bg;
    }

    box.corner {
        border-radius: $radius * $multiplier;
    }
}

.Corners {
    box {
        transition: $transition;
    }

    &.top {
        box.shadow { margin-bottom: -99px; }
        box.border { border-top: $border-width solid $bg; }
    }

    &.bottom {
        box.shadow { margin-top: -99px; }
        box.border { border-bottom: $border-width solid $bg; }
    }

    box.shadow {
        margin-right: -99px;
        margin-left: -99px;

        @if $shadows {
            box-shadow: inset 0 0 1rem 0 $shadow-color;
        }
    }

    box.border {
        margin-right: 99px;
        margin-left: 99px;
    }

    box.corner {
        box-shadow: 0 0 0 $border-width $border-color;
    }

    &.sm { @include corners(0.6) }
    &.md { @include corners(1.0) }
    &.lg { @include corners(1.4) }
    &.xl { @include corners(1.8) }
}
`;
