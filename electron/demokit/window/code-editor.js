
const window = require("../window");
const execute = require("demokit/execute");
const { delay } = require("bluebird");

module.exports = async function codeEditorWindow({
    id,
    source,
    firstLineNumber = 1,
    mode = 'javascript',
    ...rest
}) {
    await window({ ...rest, id, contentURL: require.resolve("./code-editor/code-editor-content.html") });
    await execute(
    {
        window: id,
        script: function ({ source, firstLineNumber, mode }, resolve, reject)
        {
            window.editor.setValue(source || '');
            window.editor.setOption("firstLineNumber", firstLineNumber);
            window.editor.setOption("mode", mode);
            resolve();
        },
        args: [{ source, firstLineNumber, mode }]
    });
}
