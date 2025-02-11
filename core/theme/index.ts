import { IntegrationProps } from './integrations';
import Variable from 'astal/variable';
import { idle } from 'astal/time';
import { writeFileAsync } from 'astal/file';
import { dependencies, bash, mkdir } from '../lib/os';
import { debounce } from '../lib/function';
import integrations from './integrations';
import variables from './variables';
import options from 'options';

const stylesheets = Variable<Array<string>>([]);

/**
 * Add a stylesheet to the global scss scope
 */
export function scss(sheet: TemplateStringsArray | { default: string }) {
  const style = (sheet as { default: string }).default || sheet;
  stylesheets.set([...stylesheets.get(), style as string]);
}

export default async function theme(props: IntegrationProps) {
  const { App } = props;
  const reset = debounce(10, async () => {
    try {
      if (!dependencies('sass')) {
        App.quit();
      }

      const tmp = mkdir(`${TMP}/${App.instanceName}`);
      const scss = `${tmp}/main.scss`;
      const css = `${tmp}/main.css`;
      const sheet = variables.get() + stylesheets.get().join('\n');

      await writeFileAsync(scss, sheet);
      await bash`sass ${scss} ${css}`;
      App.apply_css(css, true);

      for (const i of integrations) {
        if (i.reset) await i.reset(props);
      }

      return 'reset';
    } catch (error) {
      logError(error);
      App.quit(1);
    }
  });

  for (const i of integrations) {
    if (i.init) await i.init(props);
  }

  options.subscribe(reset);
  variables.subscribe(reset);
  stylesheets.subscribe(reset);
  return new Promise((res, rej) => {
    reset()
      .then(() => idle(() => res(null)))
      .catch(rej);
  });
}
