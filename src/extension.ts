import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const removeJavaLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "Please open a file to remove comments from."
      );
      return;
    }

    const document = editor.document;

    const selection = editor.selection;
    const text = document.getText(selection);

    if (text === "") {
      vscode.window.showInformationMessage(
        "Please select a block of code to remove comments from."
      );
      return;
    }

    const singleLineCommentRegex = /\/\/.*$/gm;
    const multiLineCommentRegex = /\/\*[\s\S]*?\*\//gm;
    const newText = text
      .replace(singleLineCommentRegex, "")
      .replace(multiLineCommentRegex, "");

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, newText);
    });
  };

  const removePythonLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "Please open a file to remove comments from."
      );
      return;
    }

    const document = editor.document;

    const selection = editor.selection;
    const text = document.getText(selection);

    if (text === "") {
      vscode.window.showInformationMessage(
        "Please select a block of code to remove comments from."
      );
      return;
    }

    const singleLineCommentRegex = /#.*$/gm;
    const newText = text.replace(singleLineCommentRegex, "");

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, newText);
    });
  };

  const removeHTMLLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showInformationMessage(
        "Please open a file to remove comments from."
      );
      return;
    }

    const document = editor.document;

    const selection = editor.selection;
    const text = document.getText(selection);

    if (text === "") {
      vscode.window.showInformationMessage(
        "Please select a block of code to remove comments from."
      );
      return;
    }

    const singleLineCommentRegex = /<!--.*?-->/gm;
    const newText = text.replace(singleLineCommentRegex, "");

    editor.edit((editBuilder) => {
      editBuilder.replace(selection, newText);
    });
  };

  const commentRemoverJavaLike = vscode.commands.registerCommand(
    "comment-remover.removeJavaLikeComments",
    () => removeJavaLikeComments()
  );

  const commentRemoverPythonLike = vscode.commands.registerCommand(
    "comment-remover.removePythonLikeComments",
    () => removePythonLikeComments()
  );

  const commentRemoverHTMLLike = vscode.commands.registerCommand(
    "comment-remover.removeHTMLLikeComments",
    () => removeHTMLLikeComments()
  );

  const commentRemoverMenu = vscode.commands.registerCommand(
    "comment-remover.removeCommentsMenu",
    async () => {
      const commentType = await vscode.window.showQuickPick([
        "Java-like",
        "Python-like",
        "HTML-like",
      ]);

      switch (commentType) {
        case "Java-like":
          removeJavaLikeComments();
          break;
        case "Python-like":
          removePythonLikeComments();
          break;
        case "HTML-like":
          removeHTMLLikeComments();
          break;
      }
    }
  );

  context.subscriptions.push(commentRemoverJavaLike);
  context.subscriptions.push(commentRemoverPythonLike);
  context.subscriptions.push(commentRemoverHTMLLike);
  context.subscriptions.push(commentRemoverMenu);
}

export function deactivate() {}
