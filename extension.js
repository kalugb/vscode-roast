const vscode = require('vscode');
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + '/.env' });

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const outputChannel = vscode.window.createOutputChannel("Roast");

	context.subscriptions.push(
		vscode.window.onDidEndTerminalShellExecution(async (e) => {
			const exitCode = e.exitCode;

			if (exitCode) {
				let output = ''
				const stream = e.execution.read();

				for await (const data of stream) {
					output += data;
				}

				console.log("Command failed with exit code " + exitCode + "\n" + output);	

				handleTerminalError(output, exitCode, e.terminal, outputChannel);
			}
		})
	);
}

function handleTerminalError(output, exitCode, terminal, outputChannel) {
	outputChannel.clear();
	
	outputChannel.appendLine("Your command sucks");
	outputChannel.appendLine(`Exit Code: ${exitCode}`);
	outputChannel.show(true);

	vscode.window.showErrorMessage(`Your command failed with exit code ${exitCode}`);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
