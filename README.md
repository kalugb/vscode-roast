# 🔥 Roast

A VS Code extension that roasts you every time you make a terminal error. Because you deserve it.

## What it does

Every time a command fails in your terminal, **Roast** sends your error to an AI and comes back with a savage, funny roast — like a best friend clowning on your terrible code.

```
$ pyhton script.py
...
🔥 Bro really typed 'pyhton' and expected the computer to just figure it out 💀
   The keyboard did nothing wrong, YOU did.
```

## Features

- **Detects terminal errors automatically** — any non-zero exit code triggers a roast
- **AI-powered roasts** via OpenRouter — savage, creative, and specific to your mistake
- **Streaming output** — roast appears token by token in the Roast output panel
- **Knows what you typed** — captures your command so the roast is specific to your mistake
- **Non-intrusive** — roast appears in its own output panel + a VS Code notification

## Requirements

- VS Code `^1.120.0`
- Shell integration enabled (should be on by default)
- An [OpenRouter](https://openrouter.ai) API key (free)
- Node.js + `dotenv` installed (`npm install`)

## Setup

1. Clone the repo and run:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root folder:
   ```env
   OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
   OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
   OPENROUTER_MODEL_NAME=meta-llama/llama-3.2-3b-instruct:free
   ```

3. Get your free API key at [openrouter.ai/keys](https://openrouter.ai/keys) — no credit card needed for free models.

4. Press `F5` to launch the extension in development mode.

## How it works

1. You run a command in the terminal
2. It fails (because of course it does)
3. Roast captures the command and error output
4. Sends it to an AI model via OpenRouter
5. AI roasts you
6. You cry, then fix your code

## Known Issues

- Shell integration must be enabled for the extension to capture terminal output. If roasts aren't triggering, check that `terminal.integrated.shellIntegration.enabled` is `true` in VS Code settings.
- The `.env` file must be in the same folder as `extension.js`.

## Release Notes

### 0.0.1

Initial release. You can now get roasted by AI for your terrible terminal commands. Enjoy.

---

*Made as a joke project. But your errors are very real.*