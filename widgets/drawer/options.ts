import { opt, mkOptions } from 'core/lib/option';

export default mkOptions('drawer', {
  rowSize: opt(11),
  rows: opt(6),
  solidBackground: opt(false),
  icon: {
    size: opt(3),
    monochrome: opt(false),
  },
});
