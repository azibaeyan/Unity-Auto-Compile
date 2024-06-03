// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// File Contents
const SendKeys_code = "@if (@X)==(@Y) @end /* JScript comment \n        @echo off \n       \n        rem :: the first argument is the script name as it will be used for proper help message \n        cscript //E:JScript //nologo \"%~f0\" \"%~nx0\" %* \n        exit /b %errorlevel% \n@if (@X)==(@Y) @end JScript comment */ \nvar sh=new ActiveXObject(\"WScript.Shell\"); \nvar ARGS = WScript.Arguments; \nvar scriptName=ARGS.Item(0); \nvar title=\"\";\nvar keys=\"\";\nfunction printHelp(){ \n        WScript.Echo(scriptName + \" - sends keys to a applicaion with given title\"); \n        WScript.Echo(\"Usage:\"); \n        WScript.Echo(\"call \" + scriptName + \" title string\"); \n        WScript.Echo(\"title  - the title of the application\"); \n        WScript.Echo(\"string - keys to be send\"); \n		WScript.Echo(\"to send keys to no particular window use \\\"\\\" as title (e.g. shortcut keys) \"); \n		WScript.Echo(\"  refence with special keys -> http://social.technet.microsoft.com/wiki/contents/articles/5169.vbscript-sendkeys-method.aspx\");\n} \nfunction parseArgs(){ \n        if (ARGS.Length < 3) { \n                WScript.Echo(\"insufficient arguments\"); \n                printHelp(); \n                WScript.Quit(43); \n        }		title=ARGS.Item(1);\n		keys=ARGS.Item(2);\n}\nfunction escapeRegExp(str) {\n    return str.replace(/([.*+?^=!:${}()|\\[\\]\\/\\\\])/g, \"\\\\$1\");\n}\nfunction replaceAll(str, find, replace) {\n  return str.replace(new RegExp(escapeRegExp(find), \'g\'), replace);\n}\nparseArgs();\n//in case the script is called with CALL command the carets will be doubled\nkeys=replaceAll(keys,\"^^\",\"^\");\nif (title === \"\") {\n	sh.SendKeys(keys); \n	WScript.Quit(0);\n}\nif (sh.AppActivate(title)){\n    sh.SendKeys(keys); \n	WScript.Quit(0);\n} else {\n	WScript.Echo(\"Failed to find application with title \" + title);\n	WScript.Quit(1);\n}\n";
const WindowMode_code = "// 2>nul||@goto :batch\n/*\n:batch\n@echo off\nsetlocal\nrem del /q /f \"%~n0.exe\" >nul 2>nul\n:: find csc.exe\nset \"csc=\"\nfor /r \"%SystemRoot%\\Microsoft.NET\\Framework\\\" %%# in (\"*csc.exe\") do  set \"csc=%%#\"\nif not exist \"%csc%\" (\n   echo no .net framework installed\n   exit /b 10\n)\nif not exist \"%~n0.exe\" (\n   call %csc% /nologo /warn:0 /out:\"%~n0.exe\" \"%~dpsfnx0\" || (\n      exit /b %errorlevel% \n   )\n)\n%~n0.exe %*\nendlocal & exit /b %errorlevel%\n*/\nusing System;\nusing System.Runtime.InteropServices;\nusing System.Diagnostics;\nusing System.Collections.Generic;\nclass HadlerWrapper {\n public System.IntPtr handler;\n public HadlerWrapper(System.IntPtr handler) {\n  this.handler = handler;\n }\n}\npublic class ScreenCapture {\n static Int32 mode = 1;\n static Dictionary < String, Int32 > modes = new Dictionary < String, Int32 > ();\n static String title = null;\n static Int32 pid = -1;\n [DllImport(\"user32.dll\")]\n private static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);\n public static void Main(String[] args) {\n  modes.Add(\"hidden\", 0);\n  modes.Add(\"normal\", 1);\n  modes.Add(\"minimized\", 2);\n  modes.Add(\"maximized\", 3);\n  modes.Add(\"force_minimized\", 11);\n  modes.Add(\"maximize_next\", 6);\n  modes.Add(\"restore\", 9);\n  modes.Add(\"show\", 5);\n  modes.Add(\"show_default\", 10);\n  modes.Add(\"no_active_minimized\", 7);\n  modes.Add(\"no_active_show\", 8);\n  modes.Add(\"no_active_normal\", 4);\n  parseArgs();\n  if (!string.IsNullOrEmpty(title)) {\n   HadlerWrapper hw = windowByString(title);\n   if (hw != null) {\n    ShowWindowAsync(hw.handler, mode);\n   } else {\n    Console.WriteLine(\"Cannot find a window with title [\" + title + \"]\");\n    Environment.Exit(6);\n   }\n  } else if (pid != -1) {\n   HadlerWrapper hw = windowByPID(pid);\n   if (hw != null) {\n    ShowWindowAsync(hw.handler, mode);\n   } else {\n    Console.WriteLine(\"Cannot find a window with pid [\" + pid + \"]\");\n    Environment.Exit(7);\n   }\n  } else {\n   Console.WriteLine(\"Neither process id not title were passed to the script\");\n   printHelp();\n   Environment.Exit(8);\n  }\n }\n static HadlerWrapper windowByString(String title) {\n  Process[] processlist = Process.GetProcesses();\n  foreach(Process process in processlist) {\n   if (process.MainWindowTitle != null) {\n    if (process.MainWindowTitle.Equals(title)) {\n     return new HadlerWrapper(process.MainWindowHandle);\n    }\n   }\n  }\n  foreach(Process process in processlist) {\n   if (!String.IsNullOrEmpty(process.MainWindowTitle)) {\n    if (process.MainWindowTitle.StartsWith(title)) {\n     return new HadlerWrapper(process.MainWindowHandle);\n    }\n   }\n  }\n  return null;\n }\n static HadlerWrapper windowByPID(Int32 pid) {\n  Process[] processlist = Process.GetProcesses();\n  foreach(Process process in processlist) {\n   if (process.MainWindowHandle!= null) {\n    if (process.Id == pid) {\n	 Console.WriteLine(\"process found with pid:\" + pid);\n     return new HadlerWrapper(process.MainWindowHandle);\n    }\n   } else {\n	 Console.WriteLine(\"main window handle is null for pid:\" + pid);\n   }\n  }\n  return null;\n }\n static void parseArgs() {\n  String[] args = Environment.GetCommandLineArgs();\n  if (args.Length == 1) {\n   printHelp();\n   Environment.Exit(0);\n  }\n  if (args.Length % 2 == 0) {\n   Console.WriteLine(\"Wrong arguments\");\n   Environment.Exit(1);\n  }\n  for (int i = 1; i < args.Length - 1; i = i + 2) {\n   switch (args[i].ToLower()) {\n    case \"-help\":\n    case \"-h\":\n    case \"/h\":\n    case \"/help\":\n    case \"/?\":\n     printHelp();\n     Environment.Exit(5);\n     break;\n    case \"-pid\":\n     if (int.TryParse(args[i + 1], out pid)) {} else {\n      Console.WriteLine(\"Process id should be a number\");\n      Environment.Exit(2);\n     }\n     break;\n    case \"-title\":\n     title = args[i + 1];\n     break;\n    case \"-mode\":\n     if (modes.TryGetValue(args[i + 1].ToLower(), out mode)) {} else {\n      Console.WriteLine(\"Invalid mode passed: \" + args[i + 1]);\n      Environment.Exit(3);\n     }\n     break;\n    default:\n     Console.WriteLine(\"Wrong parameter \" + args[i]);\n     Environment.Exit(4);\n     break;\n   }\n  }\n }\n public static void printHelp() {\n  String script = Environment.GetCommandLineArgs()[0];\n  Console.WriteLine(script + \" - changed the mode of a window by given process id or window title\");\n  Console.WriteLine(\"\");\n  Console.WriteLine(\"Usage:\");\n  Console.WriteLine(\"\");\n  Console.WriteLine(script + \" {[-title \\\"Title\\\"]|[-pid PID_Number]} [-mode mode]\");\n  Console.WriteLine(\"\");\n  Console.WriteLine(\"Possible modes are hidden,normal,minimized,maximized,force_minimized,\");\n  Console.WriteLine(\"  force_minimized,maximize_next,restore,show,show_default,no_active_minimized,\");\n  Console.WriteLine(\"  no_active_show,no_active_normal.\");\n  Console.WriteLine(\"If both title and pid are passed only the title will be taken into account\");\n  Console.WriteLine(\"If there\'s no title matching the given string a\");\n  Console.WriteLine(\"	title starting with it will be searched for\");\n  Console.WriteLine(\"\");\n  Console.WriteLine(\"Examples:\");\n  Console.WriteLine(\"\");\n  Console.WriteLine(\"	\" + script + \" -title \\\"Untitled - Notepad\\\" -mode normal\");\n  Console.WriteLine(\"	\" + script + \" -title \\\"Untitled\\\" -mode normal\");\n  Console.WriteLine(\"	\" + script + \" -pid 1313 -mode normal\");\n }\n}\n";

let root : string = "C:\\Users\\%USERNAME%\\AppData\\Local\\Programs\\\"Microsoft VS Code\"";

// File Names
const SendKeys = "sendKeys.bat";
const WindowMode = "windowMode.bat";

// let WriteFile_res : Function;
let WriteFile_res : (value: string | PromiseLike<string>) => void;

const {exec} = require("node:child_process"); // ComandLine Process

// File Status
let fileChanged : boolean = false;


// Returns True if mainString contains subString otherwise returns False
function ContainsSubStr(mainString : string, subString: string) : boolean
{
	for (let i = 0; i < mainString.length - subString.length + 1; i++)
	{
		let res : boolean = true;
		for (let j = 0; j < subString.length; j++)
		{
			if (mainString[i + j] !== subString[j]) 
			{
				res = false;
				break;
			}
		}
		if (res) { return true; }
	}
	return false;
}

// Returns True if there's not content in string otherwise returns False
function EmptyOrSpace(value: string) : boolean
{
	for (let i : number = 0; i < value.length; i++) { if (value[i] !== ' ') { return false; } };
	return true;
}

function StandardPath(path: string) : string
{
	let result : string = "";
	let firstBS : boolean = false;
	for (let i = 0; i < path.length; i++)
	{
		if (path[i] === '\\')
		{
			if (!firstBS) 
			{
				firstBS = true;
				result += '\\\"';
			}
			else { result += '\"\\\"'; }
		}
		else { result += path[i]; }
		if (i === path.length - 1 && result[-1] !== '\\') { result += '\"'; }
	}
	return result;
}

async function WriteFile(dir: string, fileName: string, content: string) : Promise<void>
{
	let errorIteration : number = -1;
	let res : (value: string | PromiseLike<string>) => void;
	let rej : (reason? : any) => void;

	// Go to Directory 
	const responeHandler = (err: any, stdout: any, stderr: any) =>  // changeDirHandler
	{
		if (err)
		{
			// Error modified for Iteration
			if (rej !== null) { rej(`Couldn't Write in File: + ${stderr}` + (errorIteration === -1) ? "" : ` i = ${errorIteration}`); }
			return; 
		}
		if (res !== null) { res("Wrote in File Successfully!"); } 
	};

	// Redirecting
	await new Promise<string>((resolve, reject) => {
		// Set Resolve Method Reference
		res = resolve;
		rej = reject;
		exec(`cd /d ${dir}`, responeHandler);
	}).catch((err) => {console.log(err);});

	// Creating / Empty File
	await new Promise<string>((resolve, reject) => {
		// Set Resolve Method Reference
		res = resolve;
		rej = reject;
		exec(`echo. > ${fileName}`, responeHandler);
	}).catch((err) => {console.log(err);});


	// Writing Process
	let temp : string = "";
	for (let i = 0; i < content.length; i++)
	{
		errorIteration = i; // Update Status

		// Last Character
		if (i === content.length - 1)
		{
			if (content[i] !== '\n') { temp += content[i]; }

			if (EmptyOrSpace(temp)) { break; } // Do not write last line if it is empty

			await new Promise((resolve, reject) => {
				// Set Resolve Method Reference
				res = resolve;
				rej = reject;
				if (EmptyOrSpace(temp)) { resolve("Wrote in File Successfully!"); }
				else { exec(`echo ${temp} >> ${fileName}`, responeHandler); }
			}).catch((err) => { console.log(err); });
			break;
		}

		// Other Characters
		if (content[i] === '\n')
		{
			if (EmptyOrSpace(temp)) { temp = ''; continue; } // Do not write empty lines

			await new Promise((resolve, reject) => {
				// Set Resolve Method Reference
				res = resolve;
				rej = reject;
				if (EmptyOrSpace(temp)) { resolve("Wrote in File Successfully!"); }
				else { exec(`echo ${temp} >> ${fileName}`, responeHandler); }
			}).catch((err) => { console.log(err); });
			temp = "";
		}
		else if (content[i] === '^' || content[i] === '<' || content[i] === '>' || content[i] === '|' || content[i] === '&') { temp += ((ContainsSubStr(temp, '\"')) ? '' : '^') + content[i]; }
		else { temp += content[i]; }
	}

	// Resolving WriteFile Promise
	if (WriteFile_res !== null) { WriteFile_res("WriteFile Completed!"); } 
}

async function CreateRequirements() 
{
	// Create Directory if it already doesn't exist
	let commandHandler = (err: any, stdout: any, stderr: any) => {
		if (err) 
		{ 
			vscode.window.showInformationMessage(`Something went wrong setting up requirement files: ${stderr}`);
		}
		if (ContainsSubStr(stdout, "yes")) 
		{
			exec("mkdir ${MainDir}"); // Create Main Directory
		}
	};

	// Check if Dir Exist
	exec(`IF NOT EXIST ${root} ECHO yes`, commandHandler);

	await new Promise<string>((resolve, reject) => {
		// Set WriteFile Resolve Reference
		WriteFile_res = resolve;
		WriteFile(root, SendKeys, SendKeys_code);
	}).catch((err) => { console.log(err); });

	await new Promise<string>((resolve, reject) => {
		// Set WriteFile Resolve Reference
		WriteFile_res = resolve;
		WriteFile(root, WindowMode, WindowMode_code);
	}).catch((err) => { console.log(err); });
}

function GetFileName(path : string | undefined) : string
{
	if (path === '' || path === undefined) { return ""; }
	let result : string = "";
	for (let i = path.length - 1; i >= 0; i--)
	{
		if (path[i] === '\\') { break; }
		result = path[i].concat(result);
	}
	return result;
}

function GetFileFormat(path : string | undefined) : string | undefined
{
	if (path === '' || path === undefined) { return undefined; }
	let format : string = '';
	for (let i = path.length - 1; i >= 0; i--)
	{
		if (path[i] === '.') { return format; }
		else if (path === '\\') { break; }
		else { format = path[i].concat(format); }
	}
	return undefined;
}

var Timer : NodeJS.Timeout | undefined = undefined;

export function activate(context: vscode.ExtensionContext) 
{
	CreateRequirements(); // Create sendKeys.bat & windowMode.bat files

	
	vscode.workspace.onDidChangeTextDocument((e) => {
		if (e.document.isDirty) 
		{ 
			fileChanged = true; 
			if (Timer !== undefined) { Timer.refresh(); }
		}
		else 
		{ 
			if (e.contentChanges.length !== 0) { fileChanged = false; } // Change File Status if Save Command is not Called
		}
	});
	
	// Activation Command
	context.subscriptions.push(
		vscode.commands.registerCommand("unity-auto-compile.activeExtension", 
			() => { vscode.window.showInformationMessage("Extension is Active!"); }
		)
	);

	let winModeCommand : string = `call ${root}\\${WindowMode} -title "${vscode.workspace.name} -" -mode maximized`;
	const winModeHandler = (err: any, stdout: any, stderr: any) => {
		if (err)
		{
			console.log(`winModeHandler(err): ${stderr} : ${winModeCommand}`);
			return;
		}
	};

	// Main Action
	let action = async () => 
	{
		const activeEditor : vscode.TextEditor | undefined = vscode.window.activeTextEditor;
		if (activeEditor === undefined || Timer !== undefined) { return; }

		// Check Active Editor File Format
		const fileFormat : string | undefined = GetFileFormat(activeEditor.document.fileName);
		if (fileFormat === undefined || fileFormat !== 'cs') { return; }

		let isUnityWorkspace : boolean = false;

		// Checking if Workspace is a Unity folder
		await new Promise<string>((resolve, reject) => {
			if (vscode.workspace.workspaceFolders !== undefined)
			{
				const folders_count : number = vscode.workspace.workspaceFolders.length;
				for (let i = 0; i < folders_count; i++)
				{
					let current_ws : vscode.WorkspaceFolder = vscode.workspace.workspaceFolders[i];
					if (vscode.workspace.workspaceFolders[i].name === vscode.workspace.name)
					{
						exec(`IF EXIST ${StandardPath(current_ws.uri.fsPath)}\\Assets ECHO yes`, 
							(err: any, stdout: any, stderr: any) => {
								if (err) { console.log(`error : ${stderr}`); }
								isUnityWorkspace = ContainsSubStr(stdout, 'yes');
								resolve("Checked Workspace");
						});
						break;
					}
				}
			}
			else { return; }
		});

		if (!isUnityWorkspace || !fileChanged) { return; }
		fileChanged = false; // Update Status

		Timer = setTimeout(() => { act(); }, 3000); // Delay After Save File
		let act = () => 
		{
			let command : string = `call ${root}\\${SendKeys} "${vscode.workspace.name} -" ""`;
			exec(command, (err: any, stdout: any, stderr: any) => {
				if (err) 
				{ 
					vscode.window.showErrorMessage(`${stderr} : ${command}`);
					exec(winModeCommand);
					return; 
				}
				if (ContainsSubStr(stdout, "Failed")) { exec(winModeCommand, winModeHandler); }
			});
			setTimeout(() => { exec(`call ${root}\\${SendKeys} "${GetFileName(vscode.window.activeTextEditor?.document.fileName)}" ""`, 
				(err: any, stdout: any, stderr: any) => {
					if (ContainsSubStr(stdout, "Failed"))
					{
						// In Extension host
						exec(`call ${root}\\${SendKeys} "[Extension" ""`); 
						return;
					}
				}
				); 
			vscode.window.activeTextEditor = activeEditor;
			}, 400 ); // Delay After Focus
			Timer = undefined;
		};
	};

	// Set OnSave Event
	vscode.workspace.onDidSaveTextDocument((e) => { 
		if (vscode.window.activeTextEditor !== undefined && vscode.window.activeTextEditor.document === e) { action(); } 
	});

	context.subscriptions.push(
		vscode.commands.registerCommand("unity-auto-compile.action", action)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
