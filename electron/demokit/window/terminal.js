
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

module.exports.clear = async function clear({ window }) {
    const selector = 'textarea#capture'
    const value = ''
    await set({window, selector, value});
}
