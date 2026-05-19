# Text Diff for Figma

---

# Introdução

Extensão para Google Chrome criada para auxiliar QAs na validação de textos implementados em interfaces web com base em protótipos do Figma, sem depender de comparação pixel perfect.

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

---

# Funcionalidades

- Comparação de textos da aplicação com o Figma
- Validação de conteúdos de formulário (`value` e `placeholder`)
- Suporte a entrada em texto simples ou JSON
- Destaque visual interativo diretamente na tela
- Comparação aproximada usando distância de Levenshtein
- Ignora elementos invisíveis
- Limite de tamanho de texto configurável
- Tooltip dinâmico de comparação (imune a cortes de tela e overflow)
- Destaque residual para textos em tela que não foram validados
- Memória de estado: Salva último texto colado e preferências de configuração
- Compatível com qualquer framework frontend

---

# Como Funciona

A extensão:

1. Coleta os textos visíveis da página
2. Normaliza os textos
3. Compara cada texto esperado com os textos encontrados na tela
4. Busca o texto mais parecido
5. Classifica o resultado como:
   - Correspondência exata
   - Texto parecido, mas divergente
   - Texto não encontrado

A heurística de similaridade é baseada em distância de Levenshtein.

---

# Estrutura do Projeto

```txt
text-diff-extension/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── styles.css
└── icons/
```

---

# Instalação

## 1. Abrir extensões do Chrome

Acesse:

```txt
chrome://extensions
```

---

## 2. Ativar modo desenvolvedor

Habilite a opção "Modo do desenvolvedor".

---

## 3. Carregar extensão

Clique em:

```txt
Carregar sem compactação
```

Selecione a pasta do projeto.

---

# Como Usar

## Modo Texto Simples

Com a opção "Texto simples" habilitada, cole um texto por linha:

```txt
Buscar matrícula
Buscar CPF
Código do título
Período letivo
```

---

## Modo JSON

Com a opção desabilitada, utilize o formato JSON:

```json
{
  "texts": [
    "Buscar matrícula",
    "Buscar CPF",
    "Código do título"
  ]
}
```

---

## Executando a comparação

1. Abra a aplicação desejada
2. Clique na extensão
3. Configure o modo de precisão e os alvos de busca desejados
4. Cole os textos esperados
5. Clique em "Comparar textos"

*Nota: Suas configurações e texto base ficarão salvos automaticamente para os próximos testes.*

---

# Tipos de Destaque

## Correspondência Exata

O texto encontrado é igual ao esperado após normalização.

Resultado visual:
- Contorno verde

---

## Texto Similar

O texto encontrado é parecido, mas possui diferenças.

Exemplos:
- Palavra faltando
- Pontuação diferente
- Pequeno erro de digitação

Resultado visual:
- Contorno amarelo

---

## Texto Não Encontrado

Nenhum texto suficientemente parecido foi encontrado.

Resultado visual:
- Alerta flutuante no canto superior direito (empilhável)

---

## Texto Não Buscado (Residual)

Textos visíveis na tela, mas que não foram contemplados na validação (caso a opção esteja ativa na extensão).

Resultado visual:
- Cor roxa com sublinhado tracejado

---

# Normalização de Texto

Antes da comparação, os textos são normalizados:

- Conversão para lowercase
- Remoção de espaços duplicados
- Aplicação de trim()

Exemplo:

```txt
"  Buscar   CPF "
```

se transforma em:

```txt
"buscar cpf"
```

---

# Heurística de Similaridade

A extensão utiliza distância de Levenshtein para medir similaridade entre textos.

Exemplo:

```txt
Esperado:
"Proibido a entrada no local"

Encontrado:
"Proibido entrada no local"
```

O algoritmo entende que os textos são altamente parecidos e classifica como divergente, ao invés de completamente ausente.

Fórmula utilizada:

```txt
1 - (distância / tamanho máximo da string)
```

---

# Limitações Atuais

A extensão atualmente não:

- Entende contexto semântico
- Valida hierarquia visual
- Detecta diferenças de posicionamento
- Valida fonte ou espaçamento
- Relaciona labels com componentes específicos

O foco atual é validação textual.

---

# Casos de Uso Recomendados

- Validação de QA
- Revisão de copy
- Testes de regressão
- Design QA
- Validação de handoff do Figma
- Conferência de layout textual

---

# Melhorias Futuras

Possíveis evoluções:

- Ignorar pontuação
- Exportar relatório de divergências
- Painel lateral
- Integração automática com API do Figma
- Similaridade semântica
- Upload de arquivos
- Scroll automático para divergências
- Comparação em lote

---

# Tecnologias Utilizadas

- JavaScript
- Chrome Extension Manifest V3
- DOM APIs
- Distância de Levenshtein

---

# Licença

MIT