import React, { Dispatch, SetStateAction } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, $getRoot, $getSelection } from 'lexical';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

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
            />
            <OnChangePlugin onChange={onChange} />
            <HistoryPlugin />
            </div>
        </LexicalComposer>
    );
};

export default LexicalEditor;
