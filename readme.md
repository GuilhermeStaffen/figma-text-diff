# Text Diff for Figma

🌍 [Leia em Português (Brasil)](./docs/readme.md)

## Introduction

A Google Chrome extension designed to help QA engineers and developers validate texts implemented in web interfaces against Figma prototypes, without relying on pixel-perfect comparison.

The extension compares the visible text rendered on the application with the expected text extracted from Figma and highlights:

- Exact matches
- Similar but divergent texts
- Texts not found

The goal is to easily identify issues such as:

- Copywriting errors
- Missing words
- Typos
- Incorrect labels
- Divergent placeholders and values in forms
- Unexpected text changes
- Visual regressions related to textual content

## Features

- **Application vs. Figma Comparison:** Validates page texts against a baseline.
- **Form Content Validation:** Checks `value` and `placeholder` attributes in inputs and textareas.
- **Input Modes:** Supports both plain text (one per line) and JSON formats.
- **Interactive Visual Highlighting:** Clear visual feedback directly on the interface.
- **Fuzzy Matching:** Approximate comparison using the Levenshtein distance heuristic.
- **Smart Filtering:** Ignores invisible elements and hidden containers.
- **Customizable:** Configurable maximum text length, case/accent/punctuation sensitivity.
- **Dynamic Tooltips:** Floating information tooltips that adapt to screen boundaries.
- **Unmatched Text Tracking:** Residual highlighting for visible texts on the screen that weren't part of the validation set.
- **State Memory:** Automatically saves your last pasted text and configuration preferences for your next test.
- **Framework Agnostic:** Compatible with any frontend framework (React, Vue, Angular, Vanilla JS, etc.).

## How it Works

The extension operates through these steps:

1. Collects visible texts from the current web page.
2. Normalizes texts (handling casing, accents, and punctuation based on user settings).
3. Compares each expected text with the texts found on the screen.
4. Finds the most similar text using the Levenshtein distance algorithm.
5. Classifies the result as:
   - **Exact Match:** Perfect match after normalization.
   - **Similar Text:** High similarity but containing differences.
   - **Not Found:** No sufficiently similar text was found.

## Installation

### 1. Open Chrome Extensions
Navigate to:
```text
chrome://extensions
```

### 2. Enable Developer Mode
Turn on the **"Developer mode"** toggle in the top right corner.

### 3. Load the Extension
Click on:
```text
Load unpacked
```
Select the project folder (`text-diff-for-figma`).

## Usage

### Plain Text Mode
With the **"Texto simples"** (Plain text) option enabled, simply paste one text per line:

```text
Search registration
Search SSN
Title code
Academic term
```

### JSON Mode
With the plain text option disabled, use the following JSON format:

```json
{
  "texts": [
    "Search registration",
    "Search SSN",
    "Title code"
  ]
}
```

### Running the Comparison
1. Open your target application/webpage.
2. Click on the extension icon.
3. Configure the precision mode (case/accent/punctuation) and search targets.
4. Paste your expected texts (Baseline).
5. Click **"Comparar textos"** (Compare texts).

*Note: Your configurations and baseline text will be automatically saved for subsequent tests.*

## Highlight Types

### Exact Match
The found text perfectly matches the expected text after normalization.
- **Visual Result:** Green outline and background.

### Similar Text
The found text is similar but has differences (e.g., missing a word, different punctuation, or small typo).
- **Visual Result:** Yellow/Orange outline and background.

### Text Not Found
No text on the screen is similar enough to the expected baseline.
- **Visual Result:** Red floating alert in the top right corner (stackable).

### Unmatched Text (Residual)
Visible texts on the screen that were not part of the search baseline (if the option is enabled).
- **Visual Result:** Purple text with a dashed underline.

## Text Normalization

Before comparing, texts can be normalized based on your settings:
- Lowercase conversion
- Accent removal (diacritics)
- Punctuation stripping
- Trimming and removal of duplicate spaces

Example:
```text
"  Search   SSN "
```
becomes:
```text
"search ssn"
```

## Similarity Heuristic

The extension uses the Levenshtein distance algorithm to measure similarity.

Example:
```text
Expected:
"Entry prohibited on premises"

Found:
"Entry prohibted on premises"
```
The algorithm understands that the texts are highly similar and classifies it as a divergent text (warning) rather than completely missing.

Score Formula used:
```javascript
1 - (distance / Math.max(expected.length, found.length))
```
A match is considered "Similar" if the score is $\ge$ 75%.

## Current Limitations

The extension currently does not:
- Understand semantic context.
- Validate visual hierarchy.
- Detect positioning differences.
- Validate fonts or spacing.
- Relate labels directly to specific components (unless checking their direct value/placeholder).

The current focus is strictly on textual content validation.

## Recommended Use Cases

- QA Validation
- Copywriting Review
- Regression Testing
- Design QA
- Figma Handoff Validation
- Textual Layout Checking

## Technologies Used

- JavaScript (ES6+)
- Chrome Extension Manifest V3
- DOM APIs
- Levenshtein Distance Algorithm

## License

MIT
