# Auto Feedback Extension

A smart, lightweight browser extension designed to automate the process of filling out college course and faculty feedback forms. It intelligently identifies positive options and automatically populates positive textual feedback.

## Features

- **Smart Option Selection:** Uses a built-in "positivity engine" to parse options and select the most positive ones (e.g., "Strongly Agree", "Very satisfied", "Yes", "10") instead of blindly guessing.
- **Framework Agnostic:** Works on standard HTML forms as well as complex platforms like Microsoft Forms and Google Forms by bypassing React/Vue state managers.
- **Comprehensive Coverage:** Supports standard radio buttons, ARIA `role="radio"` elements, `<textarea>`, `<input type="text">`, and `contenteditable` divs.
- **Cross-Browser Compatible:** Works seamlessly on Chrome, Edge, Brave, and Firefox (via Manifest V3).

## Installation

### For Chrome / Edge / Brave
1. Go to `chrome://extensions/` (or `edge://extensions/`).
2. Turn on **Developer mode** (usually in the top right corner).
3. Click **Load unpacked**.
4. Select the folder containing this extension's files.

### For Firefox
1. Go to `about:debugging#/runtime/this-firefox`.
2. Click **Load Temporary Add-on...**.
3. Select the `manifest.json` file from this extension's folder.

## Usage
1. Navigate to your college's feedback form or survey.
2. Click the Auto Feedback extension icon in your browser toolbar.
3. Click the **Fill Feedback** button.
4. The script will automatically score and select the best options for all visible radio buttons and fill all text boxes with random positive comments.

## Local Testing
A `mock-form.html` file is included in this repository. You can open it directly in your browser to safely test how the extension behaves.
