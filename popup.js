const baselineInput = document.getElementById('baseline');

// Recupera o último texto salvo ao abrir o popup
chrome.storage.local.get(['savedBaseline'], (result) => {
  if (result.savedBaseline) {
    baselineInput.value = result.savedBaseline;
  }
});

// Salva o texto no storage sempre que o usuário digitar ou colar algo
baselineInput.addEventListener('input', () => {
  chrome.storage.local.set({ savedBaseline: baselineInput.value });
});

document
  .getElementById('compare')
  .addEventListener('click', async () => {

    const raw = baselineInput.value;

    const caseSensitive =
      document
        .getElementById('caseSensitive')
        .checked;

    const accentSensitive =
      document
        .getElementById('accentSensitive')
        .checked;

    const plainMode =
      document
        .getElementById('plainMode')
        .checked;

    const highlightUnmatched =
      document
        .getElementById('highlightUnmatched')
        .checked;

    const validateValue =
      document
        .getElementById('validateValue')
        .checked;

    const validatePlaceholder =
      document
        .getElementById('validatePlaceholder')
        .checked;

    let parsed;

    try {

      // TEXTO SIMPLES
      if (plainMode) {

        parsed = {
          texts: raw
            .split('\n')
            .map(x => x.trim())
            .filter(Boolean)
        };

      } else {

        // JSON
        parsed = JSON.parse(raw);
      }

    } catch (err) {

      console.error(err);

      alert('Formato inválido');

      return;
    }

    const [tab] =
      await chrome.tabs.query({
        active: true,
        currentWindow: true
      });

    chrome.tabs.sendMessage(
      tab.id,
      {
        type: 'COMPARE_TEXTS',
        payload: parsed,
        options: {
          caseSensitive,
          accentSensitive,
          highlightUnmatched,
          validateValue,
          validatePlaceholder
        }
      }
    );

  });