import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  const removeJavaLikeComments = (text: string) => {
    const singleLineCommentRegex = /\/\/.*$/gm;
    const multiLineCommentRegex = /\/\*[\s\S]*?\*\//gm;
    return text
      .replace(singleLineCommentRegex, "")
      .replace(multiLineCommentRegex, "");
  };

  const removePythonLikeComments = (text: string) => {
    const singleLineCommentRegex = /#.*$/gm;
    return text.replace(singleLineCommentRegex, "");
  };

  const removeHTMLLikeComments = (text: string) => {
    const singleLineCommentRegex = /<!--.*?-->/gm;
    return text.replace(singleLineCommentRegex, "");
  };

  const hasJavaLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return false;
    }

    const document = editor.document;
    const languageId = document.languageId;
    return (
      languageId === "java" ||
      languageId === "javascript" ||
      languageId === "typescript" ||
      languageId === "javascriptreact" ||
      languageId === "typescriptreact" ||
      languageId === "csharp" ||
      languageId === "c" ||
      languageId === "cpp" ||
      languageId === "php" ||
      languageId === "css" ||
      languageId === "scss"
    );
  };

  const hasPythonLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return false;
    }

    const document = editor.document;
    const languageId = document.languageId;
    return languageId === "python" || languageId === "yaml";
  };

  const hasHTMLLikeComments = () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return false;
    }

    const document = editor.document;
    const languageId = document.languageId;
    return (
      languageId === "html" || languageId === "xml" || languageId === "vue"
    );
  };

  const commentRemover = vscode.commands.registerCommand(
    "comment-remover.removeComments",
    () => {
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

      let newText = "";
      if (hasJavaLikeComments()) {
        newText = removeJavaLikeComments(text);
      } else if (hasPythonLikeComments()) {
        newText = removePythonLikeComments(text);
      } else if (hasHTMLLikeComments()) {
        newText = removeHTMLLikeComments(text);
      } else {
        const actions = vscode.window.showInformationMessage(
          "This language is not supported.",
          "Request language support"
        );
        actions.then((value) => {
          if (value === "Request language support") {
            vscode.env.openExternal(
              vscode.Uri.parse(
                "https://github.com/DanielCaz/comment-remover/issues"
              )
            );
          }
        });
        return;
      }

      editor.edit((editBuilder) => {
        editBuilder.replace(selection, newText);
      });
    }
  );

  context.subscriptions.push(commentRemover);
}

export function deactivate() {}
