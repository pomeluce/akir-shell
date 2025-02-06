import Binding from 'astal/binding';
import { tmpl, fake } from 'core/lib/utils';

type PaddingProps = {
  child?: JSX.Element;
  onClick: () => void;
  h?: boolean | Binding<boolean>;
  v?: boolean | Binding<boolean>;
  height?: number | Binding<number>;
  width?: number | Binding<number>;
};

export default function PopupPadding({ h = false, v = false, width = 0, height = 0, child, onClick }: PaddingProps) {
  const size = tmpl`min-width: ${fake(width)}rem; min-height: ${fake(height)}rem;`;

  return (
    <eventbox onDestroy={() => size.drop()} onClick={onClick} hexpand={h} vexpand={v}>
      <box css={size()}>{child}</box>
    </eventbox>
  );
}
