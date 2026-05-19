# Text Diff for Figma

🌍 [Read in English](../readme.md)

## Introdução

Uma extensão para Google Chrome criada para auxiliar QAs (Quality Assurance) e desenvolvedores na validação de textos implementados em interfaces web com base em protótipos do Figma, sem depender de uma comparação "pixel perfect".

A extensão compara os textos visíveis renderizados na aplicação com os textos esperados extraídos do Figma e destaca:

- Correspondências exatas
- Textos parecidos, mas divergentes
- Textos não encontrados

O objetivo é facilitar a identificação de problemas como:

- Erros de copy
- Palavras faltando
- Erros de digitação
- Labels incorretas
- Placeholders e values divergentes em formulários
- Mudanças inesperadas de texto
- Regressões visuais relacionadas a conteúdo textual

## Funcionalidades

- **Comparação Aplicação vs Figma:** Valida textos da página com um baseline exportado.
- **Validação de Formulários:** Suporte a verificação de propriedades `value` e `placeholder` em inputs e textareas.
- **Modos de Entrada flexíveis:** Suporte a entrada em texto simples (uma linha por texto) ou JSON.
- **Feedback Visual Interativo:** Destaque visual diretamente na tela.
- **Busca Aproximada (Fuzzy Matching):** Comparação usando o algoritmo de distância de Levenshtein.
- **Filtro Inteligente:** Ignora elementos invisíveis ou estruturais sem texto direto.
- **Personalizável:** Limite de tamanho de texto configurável, além de opções para diferenciar maiúsculas/minúsculas, acentuação e pontuação.
- **Tooltips Dinâmicos:** Tooltip de comparação que se adapta à tela (imune a cortes e overflow).
- **Rastreio de Textos Não Validados:** Destaque residual para textos visíveis em tela que não estavam na lista de validação (opcional).
- **Memória de Estado:** Salva automaticamente o último texto colado e as preferências de configuração.
- **Agnóstico de Framework:** Funciona em qualquer aplicação frontend (React, Vue, Angular, Vanilla JS, etc.).

## Como Funciona

A extensão executa os seguintes passos:

1. Coleta os textos visíveis da página atual.
2. Normaliza os textos (tratando maiúsculas, acentos e pontuação conforme a configuração).
3. Compara cada texto esperado com os textos encontrados na tela.
4. Busca o texto mais parecido utilizando o cálculo de distância de Levenshtein.
5. Classifica o resultado como:
   - **Correspondência Exata:** Textos idênticos após normalização.
   - **Texto Similar:** Textos muito parecidos, porém com divergências (score $\ge$ 75%).
   - **Não Encontrado:** Nenhum texto com similaridade suficiente foi encontrado.

## Instalação

### 1. Abrir extensões do Chrome
Acesse no seu navegador:
```text
chrome://extensions
```

### 2. Ativar modo desenvolvedor
Habilite a opção **"Modo do desenvolvedor"** no canto superior direito.

### 3. Carregar extensão
Clique no botão:
```text
Carregar sem compactação
```
Selecione a pasta do projeto (`text-diff-for-figma`).

## Como Usar

### Modo Texto Simples
Com a opção **"Texto simples"** habilitada, basta colar um texto por linha:

```text
Buscar matrícula
Buscar CPF
Código do título
Período letivo
```

### Modo JSON
Com a opção de texto simples desabilitada, utilize o formato JSON:

```json
{
  "texts": [
    "Buscar matrícula",
    "Buscar CPF",
    "Código do título"
  ]
}
```

### Executando a comparação
1. Abra a aplicação/página que deseja testar.
2. Clique no ícone da extensão.
3. Configure o modo de precisão (acentos, pontuação, etc.) e os alvos de busca desejados.
4. Cole os textos esperados (Baseline).
5. Clique em **"Comparar textos"**.

*Nota: Suas configurações e o texto base ficarão salvos automaticamente para os próximos testes.*

## Tipos de Destaque

### Correspondência Exata
O texto encontrado é igual ao esperado após a normalização.
- **Resultado visual:** Contorno e fundo verde.

### Texto Similar
O texto encontrado é parecido, mas possui diferenças (ex: palavra faltando, pontuação diferente, erro de digitação).
- **Resultado visual:** Contorno e fundo amarelo/laranja.

### Texto Não Encontrado
Nenhum texto suficientemente parecido foi encontrado na tela.
- **Resultado visual:** Alerta vermelho flutuante no canto superior direito (empilhável).

### Texto Não Buscado (Residual)
Textos que estão visíveis na tela, mas não foram contemplados na validação (caso a opção "Destacar textos não buscados na tela" esteja ativa).
- **Resultado visual:** Cor roxa com sublinhado tracejado.

## Normalização de Texto

Antes da comparação, os textos podem ser normalizados com base nas suas preferências:
- Conversão para minúsculas
- Remoção de acentuação
- Remoção de pontuação
- Remoção de espaços duplicados e aplicação de `trim()`

Exemplo:
```text
"  Buscar   CPF "
```
se transforma em:
```text
"buscar cpf"
```

## Heurística de Similaridade

A extensão utiliza o algoritmo de distância de Levenshtein para medir a similaridade entre os textos.

Exemplo:
```text
Esperado:
"Proibido a entrada no local"

Encontrado:
"Proibido entrada no local"
```
O algoritmo entende que os textos são altamente parecidos e classifica como divergente (aviso), ao invés de acusar que o texto está completamente ausente.

Fórmula de pontuação utilizada:
```javascript
1 - (distância / Math.max(esperado.length, encontrado.length))
```
Considera-se um "match similar" quando a pontuação é $\ge$ 75%.

## Limitações Atuais

Atualmente, a extensão não:
- Entende contexto semântico.
- Valida hierarquia visual.
- Detecta diferenças de posicionamento.
- Valida fonte, cores ou espaçamento.
- Relaciona labels diretamente com componentes específicos (exceto valores e placeholders próprios).

O foco atual é estritamente na validação textual.

## Casos de Uso Recomendados

- Validação de QA
- Revisão de Copywriting
- Testes de Regressão
- Design QA
- Validação de Handoff do Figma
- Conferência de layout textual

## Melhorias Futuras

Possíveis evoluções para o projeto:
- Ignorar pontuações específicas
- Exportar relatório de divergências
- Transformar a interface em um painel lateral (Side Panel)
- Integração automática com a API do Figma
- Verificação de similaridade semântica
- Suporte a upload de arquivos
- Scroll automático para divergências na tela
- Comparação em lote

## Tecnologias Utilizadas

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- DOM APIs
- Algoritmo de Distância de Levenshtein

## Licença

MIT
