# ADR-0008: Gestão da versão do Node (22.23.2 + engine-strict + vfox)

- **Status:** Substituída
- **Data:** 2026-08-28
- **Decisores:** Time de frontend
- **Relacionadas:** ADR-0011; substituída pela ADR-0019 (Node 24 LTS)

## Contexto e problema

Divergências de versão do Node.js entre máquinas causam bugs difíceis de
reproduzir e builds inconsistentes. Além disso, parte dos desenvolvedores não
tem privilégios de administrador para instalar runtimes globalmente. Como
garantir que todo o time (e o CI) use exatamente a mesma versão do Node?

## Drivers da decisão

- Reprodutibilidade: mesma versão de Node em todas as máquinas e no CI.
- Instalar/alternar versões sem privilégios de administrador.
- Falhar cedo quando a versão estiver errada, em vez de só avisar.

## Opções consideradas

- **Travar a versão exata + `engine-strict` + vfox como gerenciador** — versão
  fixada em `.nvmrc`, `.tool-versions` e `engines`; `engine-strict=true` faz o
  `npm install` falhar; vfox instala/alterna sem admin.
- **nvm** — continua válido (lê o `.nvmrc`), mas o vfox é o padrão do time por
  dispensar privilégios de administrador. Não é obrigatório.

## Decisão

Fixamos o Node na versão exata **22.23.2** em `.nvmrc`, `.tool-versions` e no
campo `engines` do `package.json`. O `.npmrc` define `engine-strict=true` (o
`npm install` falha com `EBADENGINE` se a versão não bater) e `save-exact=true`
(dependências gravadas sem `^`/`~`). Recomendamos o **vfox** como gerenciador de
versões, por permitir instalar e alternar o Node sem privilégios de
administrador e por respeitar `.tool-versions` e `.nvmrc`.

## Consequências

### Positivas

- Versão de Node uniforme entre time e CI, com falha explícita se divergir.
- Desenvolvedores sem admin conseguem gerenciar a versão via vfox.
- Dependências com versões exatas, aumentando a reprodutibilidade.

### Negativas / trade-offs

- `engine-strict` bloqueia o `npm install` em máquinas com outra versão de Node,
  exigindo ativar a versão correta antes de instalar.
- Atualizar o patch do Node exige alterar múltiplos arquivos de versão.

### Neutras

- Convivência de `.nvmrc` (nvm) e `.tool-versions` (vfox), ambos suportados.

## Referências

- `.nvmrc`, `.tool-versions`, `.npmrc`, `package.json` (`engines`).
- `CONTRIBUTING.md` — seção sobre vfox e `engine-strict`.
- `CHANGELOG.md`.
