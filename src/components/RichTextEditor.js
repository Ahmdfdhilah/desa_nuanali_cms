import React, { useRef, useEffect, useState } from 'react';
import DOMPurify from 'dompurify';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaAlignLeft, FaAlignCenter, FaAlignRight } from 'react-icons/fa';

const RichTextEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);
    const [editorContent, setEditorContent] = useState(value);

    useEffect(() => {
        if (editorRef.current && editorContent !== value) {
            // Preserve cursor position
            const selection = window.getSelection();
            const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;

            // Add class to <p> tags
            const updatedContent = addClassToParagraphs(value);
            setEditorContent(updatedContent);
            
            // Restore cursor position if needed
            if (range) {
                const newRange = document.createRange();
                newRange.setStart(editorRef.current.firstChild || editorRef.current, 0);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        }
    }, [value]);

    const addClassToParagraphs = (html) => {
        // Parse and add class to each <p> tag
        const div = document.createElement('div');
        div.innerHTML = html;
        const paragraphs = div.querySelectorAll('p');
        paragraphs.forEach(p => p.classList.add('description-text'));
        return DOMPurify.sanitize(div.innerHTML); 
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '<br><br>');
        }
    };

    const handleBold = () => {
        document.execCommand('bold', false, null);
    };

    const handleItalic = () => {
        document.execCommand('italic', false, null);
    };

    const handleUnderline = () => {
        document.execCommand('underline', false, null);
    };

    const handleStrikethrough = () => {
        document.execCommand('strikethrough', false, null);
    };

    const handleAlignLeft = () => {
        document.execCommand('justifyLeft', false, null);
    };

    const handleAlignCenter = () => {
        document.execCommand('justifyCenter', false, null);
    };

    const handleAlignRight = () => {
        document.execCommand('justifyRight', false, null);
    };

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    };

    return (
        <div>
            <div className="mb-4 flex gap-2">
                <button
                    type="button"
                    onClick={handleBold}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Bold"
                >
                    <FaBold />
                </button>
                <button
                    type="button"
                    onClick={handleItalic}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Italic"
                >
                    <FaItalic />
                </button>
                <button
                    type="button"
                    onClick={handleUnderline}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Underline"
                >
                    <FaUnderline />
                </button>
                <button
                    type="button"
                    onClick={handleStrikethrough}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Strikethrough"
                >
                    <FaStrikethrough />
                </button>
                <button
                    type="button"
                    onClick={handleAlignLeft}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Align Left"
                >
                    <FaAlignLeft />
                </button>
                <button
                    type="button"
                    onClick={handleAlignCenter}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Align Center"
                >
                    <FaAlignCenter />
                </button>
                <button
                    type="button"
                    onClick={handleAlignRight}
                    className="px-4 py-2 bg-gray-300 rounded flex items-center justify-center border border-gray-400 hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    title="Align Right"
                >
                    <FaAlignRight />
                </button>
            </div>
            <div
                ref={editorRef}
                contentEditable
                className="border p-4 min-h-[200px] bg-white rounded"
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                dangerouslySetInnerHTML={{ __html: editorContent }}
            />
        </div>
    );
};

export default RichTextEditor;
