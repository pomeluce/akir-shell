import { opt, mkOptions } from 'core/lib/option';

export default mkOptions('notifications', {
  anchor: opt<Array<'top' | 'bottom' | 'left' | 'right'>>(['top', 'right']),
  blacklist: opt(['Spotify']),
  width: opt(24),
  dissmissOnHover: opt(false),
});
