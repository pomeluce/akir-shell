import { Accessor, createState } from 'gnim';
import { Icon } from '@/components';
import { scss } from '@/theme/style';

type ProgressProps = {
  height?: number;
  width?: number;
  vertical?: boolean;
  value: Accessor<number>;
  icon?: Accessor<string> | string;
};

export default ({ height = 18, width = 180, vertical = false, value, icon }: ProgressProps) => {
  const [style, setStyle] = createState(``);

  const unsub = value.subscribe(() => {
    if (value.peek() < 0) return;

    const axis = vertical ? 'height' : 'width';
    const axisv = vertical ? height : width;
    const min = vertical ? width : height;
    const preferred = (axisv - min) * value.peek() + min;
    setStyle(`min-${axis}: ${preferred}px;`);
  });

  return (
    <box
      onDestroy={unsub}
      class="progress"
      hexpand={false}
      vexpand={false}
      css={`
        min-width: ${width}px;
        min-height: ${height}px;
      `}
    >
      <box class="fill" css={style} hexpand={vertical} vexpand={!vertical} halign={vertical ? FILL : START} valign={vertical ? END : FILL}>
        <Icon
          hexpand
          vexpand
          symbolic
          valign={vertical ? START : FILL}
          halign={vertical ? FILL : END}
          iconName={icon}
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

void scss`box.progress {
  box.fill {
    border-radius: $radius;
    background-color: $primary;
    transition: 200ms;

    image {
      color: $accent-fg;
    }
  }
}`;
