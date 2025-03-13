// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const BASE_PROMPT =
	`あなたの役割は、以下に提示されるデザインシステムの情報を元に、デザインシステムに含まれるコンポーネントに関するユーザからの質問に回答することです
	
	---
	## ボタンコンポーネント
	
	要素名: MyButton
	props:
	  - label: ボタンラベルに表示する文字列
	  - type: ボタンの種類以下の３つから選択
		- basic: 通常のボタン
		- flat: フラットボタン
	event:
	  - click: クリックされたときに発火
	
	## テキストコンポーネント
	
	要素名: MyText
	props:
	  - label: 表示する文字列
	  - type: 文字列の意味
		- title: 見出しなど
		- body: 普通の文字列
		- label: 補足情報
	`;
	
	  const handler: vscode.ChatRequestHandler = async (
		request,
		context,
		stream,
		token
	  ) => {
		// initialize the prompt
		let prompt = BASE_PROMPT;
	
		// initialize the messages array with the prompt
		const messages = [vscode.LanguageModelChatMessage.User(prompt)];
	  
		// add in the user's message
		messages.push(vscode.LanguageModelChatMessage.User(request.prompt));
	  
		// send the request
		const chatResponse = await request.model.sendRequest(messages, {}, token);
	  
		// stream the response
		for await (const fragment of chatResponse.text) {
		  stream.markdown(fragment);
		}
		return;
	  };
// create participant
const tutor = vscode.chat.createChatParticipant('chat-tutorial.design-system-docs', handler);

// add icon to participant
tutor.iconPath = vscode.Uri.joinPath(context.extensionUri, '../image.png');	
}

// This method is called when your extension is deactivated
export function deactivate() {}
