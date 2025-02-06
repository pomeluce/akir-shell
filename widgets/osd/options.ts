import { opt, mkOptions } from 'core/lib/option';

export default mkOptions('osd', {
  vertical: opt(true),
  timeout: opt(2000),
  margin: opt(0),
  slide: opt(true),
  anchors: opt<Array<'top' | 'bottom' | 'left' | 'right'>>(['right']),
});
