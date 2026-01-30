# 14 – Testes, Qualidade e Garantia do Software

## Objetivo

Definir a **estratégia de testes e garantia de qualidade** do SaaS, garantindo confiabilidade, previsibilidade e segurança na evolução do produto, com forte apoio de **IA (Cursor)** para geração, manutenção e validação dos testes.

Este documento orienta:

- O que testar
- Como testar
- Quando testar
- Como usar IA para acelerar testes sem perder qualidade

---

## Princípios de Qualidade

1. **Testar comportamento, não implementação**
2. **Automatizar tudo que for repetível**
3. **Falhar rápido e de forma explícita**
4. **Qualidade como parte do desenvolvimento, não etapa final**
5. **IA como copiloto, nunca como fonte cega de verdade**

---

## Pirâmide de Testes Adotada

Prioridade clara para testes rápidos e baratos.

- 🟩 **Testes Unitários (base)**
- 🟨 **Testes de Integração**
- 🟥 **Testes End-to-End (E2E)**

---

## Testes Unitários

### Objetivo

Validar regras de negócio isoladas, sem dependências externas.

### Escopo

- Services (backend)
- Casos de uso
- Funções utilitárias
- Validações de domínio

### Diretrizes

- Não acessar banco de dados
- Não acessar APIs externas
- Usar mocks e stubs

### Exemplos de Cenários

- Criação de agendamento válido
- Bloqueio de conflito de horário
- Validação de dados obrigatórios

### Uso de IA (Cursor)

- Gerar testes a partir de regras de negócio
- Criar cenários de erro não óbvios
- Refatorar testes junto com o código

---

## Testes de Integração

### Objetivo

Garantir que múltiplas partes do sistema funcionem corretamente juntas.

### Escopo

- Controllers + Services
- Services + Banco de Dados
- Autenticação e autorização

### Diretrizes

- Banco isolado (local ou container)
- Dados descartáveis
- Reset automático entre testes

### Exemplos de Cenários

- Criar paciente e recuperar via API
- Login e acesso a rota protegida
- Persistência correta de dados

### Uso de IA

- Geração de dados de teste realistas
- Criação de asserts completos

---

## Testes End-to-End (E2E)

### Objetivo

Validar fluxos reais do usuário do início ao fim.

### Escopo

- Fluxos críticos do MVP
- Autenticação
- Agendamento completo

### Diretrizes

- Poucos testes, mas essenciais
- Rodar apenas em ambientes controlados
- Nunca depender de dados reais

### Exemplos de Fluxos

- Cadastro → Login → Criar paciente → Agendar atendimento
- Cancelamento de atendimento

### Uso de IA

- Gerar scripts baseados nos Fluxos do Usuário (Doc 12)
- Manter testes alinhados ao comportamento esperado

---

## Testes de Frontend

### Objetivo

Garantir estabilidade visual e comportamental da interface.

### Tipos

- Testes de componentes
- Testes de interação
- Testes de estado

### Diretrizes

- Testar estados importantes (loading, erro, sucesso)
- Não testar detalhes visuais irrelevantes

### Uso de IA

- Gerar testes a partir dos requisitos funcionais
- Criar cenários de borda

---

## Testes de Regressão

### Objetivo

Evitar que funcionalidades existentes quebrem ao evoluir o sistema.

### Estratégia

- Testes automatizados como rede de segurança
- Reexecução a cada alteração relevante

---

## Testes Manuais (Quando Necessários)

Usados apenas para:

- Validação visual inicial
- Experiência do usuário
- Casos exploratórios

Sempre documentados antes da execução.

---

## Qualidade de Código

### Padrões

- Código legível > código esperto
- Funções pequenas
- Nomes explícitos

### Apoio de IA

- Sugestões de refatoração
- Identificação de complexidade excessiva

---

## Métricas de Qualidade

- Cobertura mínima por camada (não absoluta)
- Taxa de falhas em produção
- Tempo médio para correção

---

## Critérios de Aceite (Definition of Done)

Uma funcionalidade só é considerada pronta quando:

- Implementada conforme requisito
- Testada (unitário + integração quando aplicável)
- Coberta por testes automatizados
- Revisada com apoio da IA

---

## Integração com Agentes de IA

Este documento orienta diretamente:

- Agente de Backend
- Agente de Frontend
- Agente de Planejamento Técnico
- Agente de Execução Assistida por IA

---

## Próximo Documento Sugerido

➡️ **15 – Regras de Negócio Detalhadas**
