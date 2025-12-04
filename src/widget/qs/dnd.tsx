import AstalNotifd from 'gi://AstalNotifd?version=0.1';
import { QSSimpleToggleButton } from './button';
import { createBinding } from 'gnim';

export const DND = () => {
  const notifd = AstalNotifd.get_default();
  return (
    <QSSimpleToggleButton
      state={createBinding(notifd, 'dontDisturb')}
      icon={createBinding(notifd, 'dontDisturb').as(dnd => (dnd ? 'notifications-disabled' : 'preferences-system-notifications'))}
      label={createBinding(notifd, 'dontDisturb').as(dnd => (dnd ? 'Silent' : 'Noisy'))}
      onToggled={() => (notifd.dontDisturb = !notifd.dontDisturb)}
    />
  );
};
