const vscode = require('vscode');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

const API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = process.env.OPENROUTER_API_URL;
const MODEL_NAME = process.env.OPENROUTER_MODEL_NAME;

/**
 * @param {vscode.ExtensionContext} context
 */

async function getRoast(lastCommand, errorOutput, outputChannel) {
	sys_instruction = `
You are a comedian and a best friend who loves to roast people's coding mistakes for fun. 
This is a lighthearted roast in the spirit of a comedy roast show — think Jimmy Carr or a roast battle.
The target is the user's BAD CODE and MISTAKES, never the person themselves.

User command: ${lastCommand}
Error output: ${errorOutput}

Your job:
- Write ONE short, savage, funny roast about their mistake
- Be creative and witty, like a best friend clowning on you
- Use emojis to spice it up
- You MAY use mild swear words (shit, damn, hell, crap) for comedic effect
- Punch at the CODE and the MISTAKE, not the person
- Keep it to 1-2 sentences max

Examples of the tone:
- "Bro typed 'pyhton' and wondered why it didn't work 💀 the keyboard did nothing wrong, YOU did"
- "Damn, even the terminal gave up on you faster than your ex did 😂"
- "Holy shit, a SyntaxError on line 1?? You couldn't even make it past the FIRST LINE 💀🔥"

Now roast this mistake`;

	try {
		const res = await fetch(API_URL, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model: MODEL_NAME,
				max_tokens: 75,
				stream: true,
				messages: [{
					role: "user",
					content: sys_instruction
				}]
			})
		});

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let roast = '';

		outputChannel.clear();
		outputChannel.show(true);

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value);
			const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

			for (const line of lines) {
				const json = line.replace('data: ',  '').trim()
				if (json === '[DONE]') break;

				try {
					const parsed = JSON.parse(json);
					const token = parsed.choices[0]?.delta?.content || '';

					if (token) {
						roast += token;
						outputChannel.append(token);
					}
				} catch (err) {
					console.error(err);
				}
			}
		}

		outputChannel.appendLine("");

		return roast;

	} catch (error) {
		console.error(error);
		return "The command is so bad even AI can't even roast you holy shit";
	}	
}

function activate(context) {
	const outputChannel = vscode.window.createOutputChannel("Roast");
	let lastCommand = '';
	let lastOutput = '';

	context.subscriptions.push(
		vscode.window.onDidStartTerminalShellExecution((e) => {
			lastCommand = e.execution.commandLine.value;
			lastOutput = '';

			(async () => {
				for await (const data of e.execution.read()) {
					lastOutput += data;
				}
			})();
		})
	);

	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution(async (e) => {
			const exitCode = e.exitCode;
			const terminal = e.terminal;

			if (exitCode) {
				terminal.sendText('echo "Hold on, the terminal have something to say to you. Please wait for a while... :)"')
				await getRoast(lastCommand, lastOutput, outputChannel);	
			}
		})
	);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
