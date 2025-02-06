import { cnames, fake } from 'core/lib/utils';
import { scss } from 'core/theme';
import Icon from './Icon';
import Binding from 'astal/binding';

type Props = {
  icon?: string;
  className?: string;
  spin?: boolean | Binding<boolean>;
};

export default function Spinner({ icon = 'process-working', spin = true, className = '' }: Props) {
  return <Icon symbolic icon={icon} className={fake(spin).as(spin => cnames('Spinner', className, { spin }))} />;
}

void scss`Spinner.spin {
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
