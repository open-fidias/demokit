
const window = require("../window");
const { set } = window;

module.exports = async function terminalWindow(props)
{
    await window(
    {
        contentURL:require.resolve("./terminal/terminal-content.html"),
        title:props.title || "~ — bash — 80x24",
        ...props
    });
}

module.exports.clear = async function clear({ window, ps1 = '~ $ ' }) {
    const capture = 'textarea#capture'
    const content = 'input#ps1'
    const value = ''
    await set({window, selector: content, value: ps1});
    await set({window, selector: capture, value});
}
