chrome.runtime.onMessage.addListener((message) => {

  if (message.type !== 'COMPARE_TEXTS') return;

  removeOldHighlights();

  const expectedTexts = message.payload.texts || [];

  const elements = getTextElements();

  const pageTexts = elements.map(el => ({
    element: el,
    text: normalize(el.innerText),
    original: el.innerText
  }));

  console.log('TEXTOS ENCONTRADOS', pageTexts);

  expectedTexts.forEach(expected => {

    const normalizedExpected = normalize(expected);

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

      highlight(
        best.element,
        'success',
        `✔ Texto OK

${best.original}`
      );

      return;
    }

    // SIMILAR
    if (bestScore >= 0.75) {

      highlight(
        best.element,
        'warning',
        `⚠ Texto divergente

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

function normalize(text) {

  return text
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
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

  const className =
    type === 'success'
      ? 'figma-diff-success'
      : 'figma-diff-warning';

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
      '.figma-diff-success, .figma-diff-warning'
    )
    .forEach(el => {

      el.classList.remove(
        'figma-diff-success',
        'figma-diff-warning'
      );

      el.removeAttribute('data-figma-diff');
    });

  document
    .querySelectorAll('.figma-floating-alert')
    .forEach(el => el.remove());
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