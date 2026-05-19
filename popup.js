document
  .getElementById('compare')
  .addEventListener('click', async () => {

    const raw =
      document
        .getElementById('baseline')
        .value;

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
          highlightUnmatched
        }
      }
    );

  });