import { Accessor } from 'gnim';
import Icon from './icon';
import { cnames, fake } from '@/support/utils';
import { scss } from '@/theme/theme';

type Props = {
  icon?: string;
  class?: string;
  spin?: boolean | Accessor<boolean>;
};

export default ({ icon = 'process-working', spin = true, class: cname = '' }: Props) => {
  return <Icon symbolic iconName={icon} class={fake(spin).as(spin => cnames('spinner', cname, { spin }))} />;
};

void scss`.spinner.spin {
  @keyframes spin {
    to { -gtk-icon-transform: rotate(1turn); }
  }

  & {
    animation-name: spin;
    animation-duration: 1s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
  }
}`;
