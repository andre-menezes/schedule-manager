import { ESLint } from 'eslint';
import tseslint from 'typescript-eslint';
import { describe, expect, it } from 'vitest';

// Os caminhos testados não existem em disco, então não fazem parte do programa
// TypeScript; o lint tipado é desligado para que só as regras de camada rodem.
const eslint = new ESLint({ overrideConfig: tseslint.configs.disableTypeChecked });

/** Retorna as mensagens de `no-restricted-imports` para o código no caminho informado. */
async function restrictedImports(code: string, filePath: string): Promise<string[]> {
  const [result] = await eslint.lintText(code, { filePath });
  return (result?.messages ?? [])
    .filter((message) => message.ruleId === 'no-restricted-imports')
    .map((message) => message.message);
}

// O ESLint carrega a configuração inteira na primeira chamada, o que pode passar
// do timeout padrão em máquinas lentas.
describe('regras de camada (ADR-0018)', { timeout: 20_000 }, () => {
  it.each([
    ['src/modules/home/routes.ts', "import x from '../architecture/routes';"],
    ['src/modules/home/views/HomeView.ts', "import x from '../../architecture/routes';"],
    ['src/modules/home/views/sub/Item.ts', "import x from '../../../architecture/routes';"],
    ['src/modules/home/views/HomeView.ts', "import x from '../../../shared/utils/format';"],
  ])('bloqueia import relativo que sai do módulo em %s', async (filePath, code) => {
    const messages = await restrictedImports(`${code}\nexport default x;\n`, filePath);

    expect(messages).toHaveLength(1);
  });

  it.each([
    ['src/modules/home/routes.ts', "import x from './views/HomeView.vue';"],
    ['src/modules/home/views/HomeView.ts', "import x from '../components/MetricCard.vue';"],
    ['src/modules/home/views/sub/Item.ts', "import x from '../../components/MetricCard.vue';"],
  ])('permite import relativo dentro do módulo em %s', async (filePath, code) => {
    const messages = await restrictedImports(`${code}\nexport default x;\n`, filePath);

    expect(messages).toEqual([]);
  });

  it('bloqueia import de outro módulo pelo alias', async () => {
    const messages = await restrictedImports(
      "import x from '@modules/architecture/routes';\nexport default x;\n",
      'src/modules/home/routes.ts'
    );

    expect(messages).toHaveLength(1);
  });
});
