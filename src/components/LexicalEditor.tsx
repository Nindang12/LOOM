import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, $getRoot, $getSelection } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { useLexicalIsTextContentEmpty } from '@lexical/react/useLexicalIsTextContentEmpty';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';


// Define the editor configuration interface
const editorConfig = {
    namespace: 'LexicalEditor',
    theme: {
        paragraph: 'editor-paragraph', // Change this to a string
    },
    // Handle any error that occurs in Lexical
    onError(error: Error) {
        throw error;
    },
};

export function PlaceholderPlugin(props: { placeholder: string | undefined }) {
    const [editor] = useLexicalComposerContext();
    const isEmpty = useLexicalIsTextContentEmpty(editor);

    /* Set the placeholder on root. */
    useEffect (() => {
        const rootElement = editor.getRootElement() as HTMLElement;
        if (rootElement) {
            if (isEmpty && props.placeholder) {
                rootElement.setAttribute('placeholder', props.placeholder);
            } else {
                rootElement.removeAttribute('placeholder');
            }
        }
    }, [editor, isEmpty]); // eslint-disable-line

    return null;
}

// Define the Lexical Editor functional component
const LexicalEditor = ({setOnchange}: {setOnchange: Dispatch<SetStateAction<string>>}) => {
    const onChange = (editorState: EditorState) => {
        editorState.read(() => {
        // Get the root and selection of the editor state
        const root = $getRoot();
        const selection = $getSelection();

        setOnchange(root.getTextContent());
        // console.log(root.getTextContent());

        });
    };


    return (
        <LexicalComposer initialConfig={editorConfig}>
        <div className="editor-container">
            <RichTextPlugin
                contentEditable={<ContentEditable className="editor-input" />}
                ErrorBoundary={LexicalErrorBoundary}
                placeholder={<div className="editor-placeholder">Nhập nội dung...</div>}
            />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            </div>
        </LexicalComposer>
    );
};

export default LexicalEditor;
