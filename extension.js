// @ts-nocheck
/*
 * @Author: your name
 * @Date: 2020-08-18 10:07:57
 * @LastEditTime: 2020-08-19 16:08:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \open-any-url\OpenAnyUrl\extension.js
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const {
	url
} = require('inspector');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	// console.log('Congratulations, your extension "OpenAnyUrl" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('OpenAnyUrl.Start', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		//vscode.window.showInformationMessage('Hello World from open-any-url!');

		vscode.window.showInputBox({ 	// 这个对象中所有参数都是可选参数
			password:false, // 输入内容是否是密码
			ignoreFocusOut:true, // 默认false，设置为true时鼠标点击别的地方输入框不会消失
			placeHolder:'https://...', // 在输入框内的提示信息
			prompt:'请输入正确的URL地址', // 在输入框下方的提示信息
			validateInput: text => {
				const reg  = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/
				return reg.test(text) ? null : 'Url格式不正确！';
			}
		}).then(function (url) {
			if(url) {
				vscode.window.showInformationMessage("即将在Tab页中打开：" + url);
				// 1.创建并显示Webview
				const panel = vscode.window.createWebviewPanel(
					// 该webview的标识，任意字符串
					'OpenAnyUrl',
					// webview面板的标题，会展示给用户
					url.split('/')[2] || '新标签页',
					// webview面板所在的分栏
					vscode.ViewColumn.One,
					// 其它webview选项
					{
						enableScripts: true, // 启用JS，默认禁用
						retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
					}
		
				);
				//设置标题前图标
		
				//panel.iconPath = vscode.Uri.file(context.extensionPath + '/Images/iconDark.png');
		
				panel.iconPath = {
					dark: vscode.Uri.file(context.extensionPath + '/Images/iconDark.png'),
					light: vscode.Uri.file(context.extensionPath + '/Images/iconBlack.png')
				};
		
				panel.webview.html = `<!DOCTYPE html>
										<html lang="en">
										<head>
											<meta charset="UTF-8">
											<meta content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" name="viewport">
											<meta content="portrait" name="x5-orientation">
											<meta content="true" name="x5-fullscreen">
											<meta content="portrait" name="screen-orientation">
											<meta content="yes" name="full-screen">
											<meta content="webkit" name="renderer">
											<meta content="IE=Edge" http-equiv="X-UA-Compatible">
											<title>微信读书</title>
											<style>
											html,body,iframe{
												width:100%;
												height:100%;
												border:0;
												overflow: hidden;
											}
											</style>
										</head>
										<body>
											<iframe src="${url}"/>
										</body>
										</html>`;
			}else {
				vscode.window.showInformationMessage("未输入任何Url");
			}
		});

	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}