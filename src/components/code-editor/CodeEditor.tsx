import "./code-editor.css";
import "./syntax.css";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import { useRef } from "react";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";

interface CodeEditorProps {
	initialValue: string;
	onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
	const editorRef = useRef<any>();

	const onEditorDidMount: EditorDidMount = (getValue, MonacoEditor) => {
		editorRef.current = MonacoEditor;
		MonacoEditor.onDidChangeModelContent(() => {
			onChange(getValue());
		});
		MonacoEditor.getModel()?.updateOptions({ tabSize: 2 });

		const highlighter = new Highlighter(
			// @ts-ignore
			window.monaco,
			codeShift,
			MonacoEditor
		);

		highlighter.highLightOnDidChangeModelContent(
			() => {},
			() => {},
			undefined,
			() => {}
		);
	};

	const onFormatClick = () => {
		// get current value from editor
		const unFormatted = editorRef.current.getModel().getValue();
		// format that value
		const formatted = prettier
			.format(unFormatted, {
				parser: "babel",
				plugins: [parser],
				useTabs: false,
				semi: true,
				singleQuote: true,
			})
			.replace(/\n$/, "");
		// set the formatted value
		editorRef.current.setValue(formatted);
	};

	return (
		<div className="editor-wrapper">
			<button
				className="button button-format is-primary is-small "
				onClick={onFormatClick}
			>
				format
			</button>
			<MonacoEditor
				editorDidMount={onEditorDidMount}
				value={initialValue}
				language="javascript"
				theme="dark"
				height="100%"
				options={{
					wordWrap: "on",
					showUnused: false,
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true,
				}}
			/>
		</div>
	);
};

export default CodeEditor;
