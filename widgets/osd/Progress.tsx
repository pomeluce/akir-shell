import { Widget } from 'astal/gtk3';
import { Binding } from 'astal';
import { scss } from 'core/theme';
import Icon from 'gtk/primitive/Icon';

void scss`box.Progress {
  box.fill {
    border-radius: $radius;
    background-color: $primary;
    transition: 200ms;

    icon {
      color: $accent-fg;
    }
  }
}`;

type ProgressProps = {
  height?: number;
  width?: number;
  vertical?: boolean;
  value: Binding<number>;
  icon?: Binding<string> | string;
};

export default ({ height = 18, width = 180, vertical = false, value, icon }: ProgressProps) => {
  let fill: Widget.Box;

  const unsub = value.subscribe(value => {
    if (value < 0) return;

    const axis = vertical ? 'height' : 'width';
    const axisv = vertical ? height : width;
    const min = vertical ? width : height;
    const preferred = (axisv - min) * value + min;
    fill.css = `min-${axis}: ${preferred}px;`;
  });

  return (
    <box
      onDestroy={unsub}
      className="Progress"
      expand={false}
      css={`
        min-width: ${width}px;
        min-height: ${height}px;
      `}
    >
      <box className="fill" setup={self => (fill = self)} hexpand={vertical} vexpand={!vertical} halign={vertical ? FILL : START} valign={vertical ? END : FILL}>
        <Icon
          expand
          symbolic
          valign={vertical ? START : FILL}
          halign={vertical ? FILL : END}
          icon={icon}
          css={`
            min-width: ${Math.min(width, height)}px;
            min-height: ${Math.min(width, height)}px;
            font-size: ${Math.min(width, height) * 0.65}px;
          `}
        />
      </box>
    </box>
  );
};
