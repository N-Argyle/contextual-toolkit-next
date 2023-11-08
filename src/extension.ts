// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import fs from "fs";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  let createNextPage = vscode.commands.registerCommand(
    "contextual-toolkit-next.createNextPage",
    async (uri: vscode.Uri) => {
      vscode.window.showInformationMessage(uri.fsPath);
      const pageName = await vscode.window.showInputBox({
        placeHolder: "Page name…",
        prompt: "Enter a page name",
        value: "",
      });
      if (!pageName) return;
      const pagePath = `${uri.fsPath}/${pageName}`;
      fs.mkdirSync(pagePath);
      const template = NextPage.replace(/#name#/g, pageName?.toString() || "");
      fs.writeFileSync(`${pagePath}/index.tsx`, template);
    }
  );

  let createNextPageSlug = vscode.commands.registerCommand(
    "contextual-toolkit-next.createNextPageSlug",
    async (uri: vscode.Uri) => {
      vscode.window.showInformationMessage(uri.fsPath);
      const pageName = await vscode.window.showInputBox({
        placeHolder: "Page name…",
        prompt: "Enter a page name",
        value: "",
      });
      if (!pageName) {
        return;
      }
      const pagePath = `${uri.fsPath}/${pageName}`;
      fs.mkdirSync(pagePath);
      const template = NextPageSlug.replace(
        /#name#/g,
        pageName?.toString() || ""
      );
      fs.writeFileSync(`${pagePath}/[id].tsx`, template);
    }
  );

  context.subscriptions.push(createNextPage);
  context.subscriptions.push(createNextPageSlug);
}

// This method is called when your extension is deactivated
export function deactivate() {}

const NextPage = `import { type GetServerSidePropsContext } from "next";

const #name# = ({}) => {
	return (
		<>
		</>
	);
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
	return {
		props: {},
	};
}

export default #name#;
`;

const NextPageSlug = `import { GetServerSideProps } from 'next';

interface Props {}

const #name# = ({}: Props) => {
	return (
		<>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<Props> = async (
  context
) => {
  const { id } = context.query as { id: string };

  return {
    props: {},
  };
};

export default #name#;
`;
