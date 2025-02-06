import Notifd from 'gi://AstalNotifd';
import { QSSimpleToggleButton } from '../QSButton';
import { bind } from 'astal';

export const DND = () => {
  const notifd = Notifd.get_default();
  return (
    <QSSimpleToggleButton
      state={bind(notifd, 'dontDisturb')}
      icon={bind(notifd, 'dontDisturb').as(dnd => (dnd ? 'notifications-disabled' : 'preferences-system-notifications'))}
      label={bind(notifd, 'dontDisturb').as(dnd => (dnd ? 'Silent' : 'Noisy'))}
      onToggled={() => (notifd.dontDisturb = !notifd.dontDisturb)}
    />
  );
};
