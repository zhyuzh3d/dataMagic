/*
基于codemirror的代码编辑器
默认支持js,css,html基础代码提示，其他语言的提示需要传入hintEngine属性
props:{
    value,//待编辑的代码字符串
    fontSize://显示文字大小，可动态调整
    options:{//编辑器设置项，参照codemirror官方文档
        mode, //编码模式，可选以下
        htmlmixed,javascript,text/jsx,text/css,text/html,text/html,text/x-go,text/x-csrc,text/x-c++src,text/x-java,text/x-objectivec,text/x-swift,python,markdown
        theme,//主题，仅支持'default'和'monokai'
        lineWrapping,//是否换行
        lineNumbers,//是否显示左侧行数字
        hintEngine(editor, opts),//代码提示引擎，参见codemirror官方文档addon:hint
    },
    onChange(editor, metadata, value),//value文字变化事件回调函数
    public, //向外输出方法
}
自动注册搜索相关快捷键
Ctrl-/ / Cmd-/ 注释掉选择行，开关
Ctrl-Alt-/ / / Cmd-Alt-/ 注释掉选择块，需手工恢复
Ctrl-F / Cmd-F Start searching
Ctrl-G / Cmd-G Find next
Shift-Ctrl-G / Shift-Cmd-G Find previous
Shift-Ctrl-F / Cmd-Option-F Replace
Shift-Ctrl-R / Shift-Cmd-Option-F Replace all
*/

import React from 'react';
import { Component } from 'react';
import h from 'react-hyperscript';

import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

import CodeMirror from 'codemirror';
import ReactCodeMirror from 'react-codemirror2';

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';

import 'codemirror/mode/xml/xml';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/go/go.js';
import 'codemirror/mode/clike/clike.js';
import 'codemirror/mode/swift/swift.js';
import 'codemirror/mode/jsx/jsx.js';
import 'codemirror/mode/python/python.js';
import 'codemirror/mode/markdown/markdown.js';

import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/hint/show-hint.js';
import 'codemirror/addon/hint/javascript-hint.js';
import 'codemirror/addon/hint/xml-hint.js';
import 'codemirror/addon/hint/html-hint.js';
import 'codemirror/addon/hint/css-hint.js';
import 'codemirror/addon/hint/anyword-hint.js';

import 'codemirror/addon/edit/matchbrackets.js';
import 'codemirror/addon/edit/closebrackets.js';
import 'codemirror/addon/edit/matchtags.js';
import 'codemirror/addon/edit/closetag.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/comment/comment.js';

import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/search/matchesonscrollbar.css';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/jump-to-line.js';

import formatEngine from 'beautify';


var $fn = {};
const _style = theme => ({
    reactCM: {
        width: '100%',
        height:'100%',
    }
});

class MyComponent extends Component {
    state = {
        reactVersion: React.version, //去除unuse警告
        editor: undefined,
        editorDom: undefined,
        optionsDefault: { //编辑器预设
            mode: 'javascript',
            theme: 'default',
            lineNumbers: true,
            lineWrapping: true,
            matchBrackets: true, //addon,自动高亮对应的括号
            autoCloseBrackets: true, //addon,自动输入封闭的括号
            matchTags: true, //addon,高亮对应的tag，仅在text／html模式有效
            autoCloseTags: true, //addon,自动输入封闭的tag
            styleActiveLine: true, //addon,高亮显示当前行
            extraKeys: {},
        },
        fontSize: 14, //字体大小
        hintMaps: {
            'javascript': 'javascript',
            'text/jsx': 'javascript',
            'text/css': 'css',
            'text/html': 'html',
            'htmlmixed': 'html',
            'text/xml': 'xml',
        },
        formatMaps: {
            'javascript': 'js',
            'text/css': 'css',
            'text/html': 'html',
            'text/xml': 'xml',
        },
    };

    //自动完成提示
    autoHint = (editor, event) => {
        let that = this;
        let char = String.fromCharCode(event.keyCode);
        let keyValid = /[0-9A-Za-z]/.test(char) && !event.altKey && !event.ctrlKey;

        if(!editor.state.completionActive && keyValid) {
            let options = that.props.options || {};
            options = Object.assign(that.state.optionsDefault, options);
            CodeMirror.showHint(editor, (edtr, opts) => {
                let hintMod = that.state.hintMaps[options.mode];
                let hint = that.props.hintEngine || CodeMirror.hint[hintMod];
                let res = hint ? hint(edtr, opts) : undefined;

                res = CodeMirror.hint.anyword(edtr, {
                    list: (res && res.list) ? res.list : []
                });
                return res;
            }, {
                completeSingle: false
            });
        }
    };


    //提前生成editorDom，不重复生产
    componentWillMount() {
        this.setState({ editorDom: this.genEditorDom() });
    };

    //输出所有方法
    componentDidMount() {
        let that = this;
        if(that.props.public) {
            for(let key in that) {
                that.props.public[key] = that[key];
            }
        };
    };

    //生成editorDom
    genEditorDom = () => {
        let that = this;
        const css = that.props.classes;

        let options = that.props.options || {};
        options = Object.assign(that.state.optionsDefault, options);
        let dom = h(ReactCodeMirror, {
            className: css.reactCM,
            value: that.props.value ? that.props.value : '',
            options: options,
            optionChange: (editor, str) => {},
            onChange: (editor, metadata, value) => {
                that.props.onChange && that.props.onChange(editor, metadata, value);
            },
            onKeyUp: (editor, evt) => {
                that.autoHint(editor, evt);
                that.props.onKeyUp && that.props.onChange(editor, evt);
            },
            onSelection: (editor, data) => {
                that.props.onSelection && that.props.onSelection(editor, data);
            },
            onCursor: (editor, data) => {
                that.props.onCursor && that.props.onCursor(editor, data);
            },
            onScroll: (editor, data) => {
                that.props.onCursor && that.props.onCursor(editor, data);
            },
            editorDidMount: (editor) => {
                that.setState({ editor: editor });
                //添加注释快捷键
                editor.addKeyMap({
                    'Ctrl-/': that.toggleComment,
                    'Cmd-/': that.toggleComment,
                    'Ctrl-Alt-/': that.blockComment,
                    'Cmd-Alt-/': that.blockComment,
                    'Ctrl-B': that.beautifyCode,
                    'Cmd-B': that.beautifyCode,
                });
            },
        });
        return dom;
    }

    //自动格式化，默认格式化所有代码，如果未指定就使用默认引擎
    beautifyCode = (editor) => {
        let that = this;
        let code = editor.getValue();
        if(that.props.formatEngine) {
            code = that.props.formatEngine(code);
        } else {
            let options = that.props.options || {};
            options = Object.assign(that.state.optionsDefault, options);
            var mod = that.state.formatMaps[options.mode];
            code = formatEngine(code, { format: mod });
        };
        editor.setValue(code);
    };

    //注释掉当前行
    toggleComment = (editor) => {
        var range = {
            from: editor.getCursor(true),
            to: editor.getCursor(false)
        };
        editor.toggleComment(range.from, range.to);
    };

    //注释掉选择块
    blockComment = (editor) => {
        //检查开始行是否/*开头
        var range = {
            from: editor.getCursor(true),
            to: editor.getCursor(false)
        };
        editor.blockComment(range.from, range.to);
    };

    //设置代码
    setValue = (value) => {
        let editor = this.state.editor;
        if(editor) {
            editor.setValue(value);
        };
    };

    //执行选择
    setSelection = (data) => {
        let editor = this.state.editor;
        if(editor) {
            editor.setSelections(data);
        };
    };

    //执行选择
    setCursor = (data) => {
        let editor = this.state.editor;
        if(editor) {
            editor.setCursor(data);
        };
    };


    //渲染每次都刷新全部options,如果props带有value刷新value
    render() {
        let that = this;
        let options = that.props.options || {};
        let fontSize = that.props.fontSize || that.state.fontSize;
        options = Object.assign(that.state.optionsDefault, options);

        let editor = that.state.editor;
        if(editor) {
            for(var attr in options) {
                editor.setOption(attr, options[attr]);
            };
            editor.getWrapperElement().style["font-size"] = fontSize + "px";
            editor.getWrapperElement().style["width"] = "100%";
            editor.getWrapperElement().style["height"] = "100%";
            editor.refresh();

            //确保同步代码
            //that.props.value && editor.setValue(that.props.value);
        };
        return that.state.editorDom;
    }
}

MyComponent.propTypes = {
    classes: PropTypes.object.isRequired,
};
MyComponent = withStyles(_style)(MyComponent);
MyComponent.CodeMirror = CodeMirror;
MyComponent.fn = $fn;


export default MyComponent;
