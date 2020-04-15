const path = require('path')
const fs = require('fs')
const amdLoader = require('../../node_modules/monaco-editor/min/vs/loader.js')
const parseTmTheme = require('monaco-themes').parseTmTheme
const amdRequire = amdLoader.require
const amdDefine = amdLoader.require.define

function uriFromPath (_path) {
    pathName = path.resolve(_path).replace(/\\/g, '/')
    if (pathName.length > 0 && pathName.charAt(0) !== '/')
        pathName = '/' + pathName
    return encodeURI('file://' + pathName)
}

amdRequire.config({
    baseUrl: uriFromPath(path.join(__dirname, '../../node_modules/monaco-editor/min'))
})

// workaround monaco-css not understanding the environment
self.module = undefined


amdRequire(['vs/editor/editor.main'], () => {
    
    // Register a new language
    monaco.languages.register({ id: '$cpp' })
    monaco.languages.setMonarchTokensProvider('$cpp', CPP_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$cpp', CPP_CONFIG)
    
    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('$cpp', {
        provideCompletionItems: () => {
            return { suggestions: [
                    {
                        label: 'string',
                        kind: monaco.languages.CompletionItemKind.Text,
                        insertText: 'string'
                    }, 
                    {
                        label: 'cout',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'cout << ${1:condition} << \'\\n\';$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }, 
                    {
                        label: 'ifelse',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'if (${1:condition}) {',
                            '\t$0',
                            '} else {',
                            '\t',
                            '}'
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }
                ] 
            }
        },
    })
    
    monaco.languages.register({ id: '$js', mimetypes: ['text/$js'] })
    monaco.languages.setMonarchTokensProvider('$js', JS_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$js', JS_CONFIG)

    // Register a completion item provider for the new language
    monaco.languages.registerCompletionItemProvider('$js', {
        provideCompletionItems: () => {
            return { suggestions: [
                    {
                        label: 'log',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'console.log($0)',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }, 
                    {
                        label: 'if',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'if (${1:condition}) {',
                            '\t$0',
                            '}',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'for',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'for (const ${1:item} of ${2:array}) {',
                            '\t$0',
                            '}',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'class',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'class ${1:name} {',
                            '\tconstructor() {',
                            '\t\t$0',
                            '\t}',
                            '}',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'qs',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'document.querySelector(\'$0\')',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }, 
                    {
                        label: 'qsa',
                        kind: monaco.languages.CompletionItemKind.Keyword,
                        insertText: 'document.querySelectorAll(\'$0\')',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    }, 
                    {
                        label: 'addEvent',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'addEventListener(\'${1:event}\', e => {',
                            '\t$0',
                            '})',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'setTimeout',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'setTimeout(() => {',
                            '\t$0',
                            '}, ${1:time})',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                    {
                        label: 'setInterval',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: [
                            'setInterval(() => {',
                            '\t$0',
                            '}, ${1:time})',
                        ].join('\n'),
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
                    },
                ] 
            }
        },
    })
    
    
    monaco.languages.register({ id: '$sass', mimetypes: ['text/$sass'] })
    monaco.languages.setMonarchTokensProvider('$sass', SASS_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$sass', SASS_CONFIG)
    
    monaco.languages.register({ id: '$json', mimetypes: ['text/$json'] })
    monaco.languages.setMonarchTokensProvider('$json', JSON_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$json', JSON_CONFIG)
    
    monaco.languages.register({ id: '$ts', mimetypes: ['text/$ts'] })
    monaco.languages.setMonarchTokensProvider('$ts', TS_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$ts', TS_CONFIG)

    monaco.languages.register({ id: '$vue', mimetypes: ['text/$vue'] })
    monaco.languages.setMonarchTokensProvider('$vue', VUE_LANGUAGE)
    monaco.languages.setLanguageConfiguration('$vue', VUE_CONFIG)
	
    window.editorThemes = {}
    // Grayscale theme
    window.editorThemes.BLAZE_GRAYSCALE = {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'comment', foreground: '555555', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'cc6bc4' },
            { token: 'identifier', foreground: 'ec5656' },
            { token: 'number', foreground: 'ff851a' },
            { token: 'string', foreground: '79c534' },
            { token: 'type', foreground: '00d66b' },
            { token: 'function', foreground: '5DA3F2' },
            { token: 'delimiter', foreground: '888888' },
            { token: 'special', foreground: 'E09C4F' },
            { token: 'regexp', foreground: '7971e2' },
            { background : '2a2522'},
            // { background : '271C25'},
            { token: 'tag', foreground: 'ec5a5d' },
            { token: 'attribute.name', foreground: 'FF7700' },
            { token: 'attribute.value', foreground: '79c534' },
            { token: 'metatag', foreground: 'ec5a5d' },
            { token: 'metatag.content', foreground: 'ec5a5d' },
            
        ]
    }

    // Colorful theme
    window.editorThemes.BLAZE_COLORFUL = {
        base: 'vs-dark', // can also be vs-dark or hc-black
        inherit: true, // can also be false to completely replace the builtin rules
        rules: [
            { token: 'comment', foreground: '555555', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'cc6bc4' },
            { token: 'identifier', foreground: 'ec5656' },
            { token: 'number', foreground: 'ff851a' },
            { token: 'string', foreground: '79c534' },
            { token: 'type', foreground: '00d66b' },
            { token: 'function', foreground: '5DA3F2' },
            { token: 'delimiter', foreground: '888888' },
            { token: 'special', foreground: 'E09C4F' },
            { token: 'regexp', foreground: '7971e2' },
            // { background : '2a2522'},
            { background : '271C25'},
            { token: 'tag', foreground: 'ec5a5d' },
            { token: 'attribute.name', foreground: 'FF7700' },
            { token: 'attribute.value', foreground: '79c534' },
            { token: 'metatag', foreground: 'ec5a5d' },
            { token: 'metatag.content', foreground: 'ec5a5d' },
            
        ]
    }

    // Config Theme
    monaco.editor.defineTheme('blaze-grayscale', editorThemes.BLAZE_GRAYSCALE)
    monaco.editor.defineTheme('blaze-colorful', editorThemes.BLAZE_COLORFUL)

    window.editor = monaco.editor.create($('#editor'), {
        value: '',
        language: '$cpp',
        theme: 'blaze-grayscale',
        contextmenu: false,
        renderIndentGuides: false,
        accessibilitySupport: 'auto',
        smoothScrolling: true,
        cursorSmoothCaretAnimation: true,
        scrollbar: {
            useShadows: false,
            verticalHasArrows: false,
            horizontalHasArrows: false,
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 5,
            horizontalScrollbarSize: 5
        }
    })

    // console.log(monaco.KeyCode)
    // editor.addCommand(monaco.KeyCode.F1, function() {
    //     console.log('command')
    // })

    // Hello World in Command Palette
    editor.addAction({
        id: 'hello-world',
        label: 'Hello World',
        run() {console.log('Hello World!')}
    })

    // super(nls.localize('quickCommandActionInput', "Type the name of an action you want to execute"), {
    //     id: 'editor.action.quickCommand',
    //     label: nls.localize('QuickCommandAction.label', "Command Palette"),
    //     alias: 'Command Palette',
    //     precondition: null,
    //     kbOpts: {
    //         kbExpr: EditorContextKeys.focus,
    //         primary: (browser.isIE ? KeyMod.Alt | KeyCode.F1 : KeyCode.F1)
    //     },
    //     menuOpts: {
    //     }
    // });
    
    setTimeout(() => {
        let style = $('.monaco-list style')
        style.remove()
        EDITOR_LOAD.val = true
    }, 1000)


})
