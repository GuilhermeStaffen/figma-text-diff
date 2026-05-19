chrome.runtime.onMessage.addListener((message) => {

  if (message.type !== 'COMPARE_TEXTS') return;

  removeOldHighlights();

  const expectedTexts = message.payload.texts || [];

  const options = message.options || {};

  const elements = getTextElements();

  const pageTexts = elements.map(el => ({
    element: el,
    text: normalize(el.innerText, options),
    original: el.innerText,
    matched: false
  }));

  console.log('TEXTOS ENCONTRADOS', pageTexts);

  expectedTexts.forEach(expected => {

    const normalizedExpected = normalize(expected, options);

    let best = null;
    let bestScore = 0;

    for (const item of pageTexts) {

      const score = similarity(
        item.text,
        normalizedExpected
      );

      if (score > bestScore) {
        best = item;
        bestScore = score;
      }
    }

    if (!best) return;

    console.log({
      esperado: expected,
      encontrado: best.original,
      score: bestScore
    });

    // MATCH EXATO
    if (best.text === normalizedExpected) {
      best.matched = true;

      highlight(
        best.element,
        'success',
        `Texto OK

${best.original}`
      );

      return;
    }

    // SIMILAR
    if (bestScore >= 0.75) {
      best.matched = true;

      highlight(
        best.element,
        'warning',
        `Texto divergente

Esperado:
${expected}

Encontrado:
${best.original}

Similaridade:
${Math.round(bestScore * 100)}%`
      );

      return;
    }

    // NÃO ENCONTRADO
    createFloatingAlert(expected);
  });

  // TEXTOS NÃO BUSCADOS
  if (options.highlightUnmatched) {
    pageTexts.forEach(item => {
      if (!item.matched) {
        highlight(
          item.element,
          'unmatched',
          `Texto não buscado na validação\n\n${item.original}`
        );
      }
    });
  }

});

function getTextElements() {

  const blacklist = [
    'SCRIPT',
    'STYLE',
    'NOSCRIPT'
  ];

  return [...document.querySelectorAll('*')]
    .filter(el => {

      if (blacklist.includes(el.tagName)) {
        return false;
      }

      if (!isVisible(el)) {
        return false;
      }

      // Garante que o elemento possui texto próprio diretamente nele
      // Ignora containers/pais que só servem para guardar outros elementos
      const hasDirectText = Array.from(el.childNodes).some(
        node => node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== ''
      );

      if (!hasDirectText) {
        return false;
      }

      const text = el.innerText?.trim();

      if (!text) {
        return false;
      }

      // ignora containers gigantes
      if (text.length > 120) {
        return false;
      }

      return true;
    });
}

function normalize(text, options) {

  if (!options.caseSensitive) {
    text = text.toLowerCase();
  }

  if (!options.accentSensitive) {
    text = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  return text
    .replace(/\s+/g, ' ')
    .trim();
}

function isVisible(el) {

  const style = window.getComputedStyle(el);

  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0'
  );
}

function similarity(a, b) {

  const distance = levenshtein(a, b);

  return 1 - distance / Math.max(a.length, b.length);
}

function highlight(element, type, tooltipText) {

  let className = 'figma-diff-unmatched';
  if (type === 'success') {
    className = 'figma-diff-success';
  } else if (type === 'warning') {
    className = 'figma-diff-warning';
  }

  element.classList.add(className);

  element.setAttribute(
    'data-figma-diff',
    tooltipText
  );

  console.log(
    'DESTACANDO',
    element,
    type
  );
}

function removeOldHighlights() {

  document
    .querySelectorAll(
      '.figma-diff-success, .figma-diff-warning, .figma-diff-unmatched'
    )
    .forEach(el => {

      el.classList.remove(
        'figma-diff-success',
        'figma-diff-warning',
        'figma-diff-unmatched'
      );

      el.removeAttribute('data-figma-diff');
    });

  document
    .querySelectorAll('.figma-floating-alert')
    .forEach(el => el.remove());

  const tooltip = document.getElementById('figma-dynamic-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

function createFloatingAlert(expected) {

  const div = document.createElement('div');

  div.className = 'figma-floating-alert';

  div.innerText =
    `Texto não encontrado

${expected}`;

  document.body.appendChild(div);
}

function levenshtein(a, b) {

  if (a === b) return 0;

  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {

    for (let j = 1; j <= a.length; j++) {

      if (b.charAt(i - 1) === a.charAt(j - 1)) {

        matrix[i][j] =
          matrix[i - 1][j - 1];

      } else {

        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// --- GESTÃO DINÂMICA DO TOOLTIP ---
document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('[data-figma-diff]');
  if (!target) return;

  const tooltipText = target.getAttribute('data-figma-diff');
  if (!tooltipText) return;

  let tooltip = document.getElementById('figma-dynamic-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'figma-dynamic-tooltip';
    document.body.appendChild(tooltip);
  }

  tooltip.innerText = tooltipText;
  tooltip.style.display = 'block';

  const rect = target.getBoundingClientRect();
  const tooltipRect = tooltip.getBoundingClientRect();

  // Verifica se há espaço para renderizar abaixo do elemento
  if (rect.bottom + tooltipRect.height + 10 < window.innerHeight) {
    tooltip.style.top = `${rect.bottom + 10}px`;
  } else {
    // Caso contrário, renderiza para cima do elemento
    tooltip.style.top = `${rect.top - tooltipRect.height - 10}px`;
  }

  // Garante que o tooltip nunca ultrapasse o limite direito da janela
  if (rect.left + tooltipRect.width > window.innerWidth) {
    tooltip.style.left = `${window.innerWidth - tooltipRect.width - 10}px`;
  } else {
    tooltip.style.left = `${rect.left}px`;
  }
});

document.addEventListener('mouseout', (e) => {
  const target = e.target.closest('[data-figma-diff]');
  if (!target) return;

  // Evita o flickering caso o usuário mova o cursor entre filhos internos do target
  if (e.relatedTarget && target.contains(e.relatedTarget)) {
    return;
  }

  const tooltip = document.getElementById('figma-dynamic-tooltip');
  if (tooltip) tooltip.style.display = 'none';
});