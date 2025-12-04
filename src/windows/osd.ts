import OSD from '@/widget/osd';
import app from 'ags/gtk4/app';

export default () => {
  app.get_monitors().map(OSD);
};
