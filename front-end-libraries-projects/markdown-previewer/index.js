// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markdown: placeholder
    }
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    this.setState({
      markdown: e.target.value
    })
    e.preventDefault();
  }
  
  render() {
    return (
      <div>
        <Editor
          markdown={this.state.markdown}
          onChange={this.handleChange}
          />
        <Preview
          markdown={this.state.markdown}
          />
      </div>
    )
  }
}

class Toolbar extends React.Component {
  render() {
    return (
      <div id="toolbar">
        {this.props.text}
      </div>
    )
  }
}

class Editor extends React.Component {
  render() {
    return (
      <div id="editorContainer">
      <Toolbar text="Markdown Editor"/>
      <textarea
        autofocus
        id="editor"
        value={this.props.markdown}
        onChange={this.props.onChange}
        type="test"
        wrap="hard">
      </textarea>
      </div>
    )
  }
}

class Preview extends React.Component {
  render() {
    marked.setOptions({
      breaks: true,
      gfm: true
    });
    let markdown = marked(this.props.markdown);
    return (
      <div id="previewContainer">
        <Toolbar text="Markdown Previewer"/>
      <div id="preview" dangerouslySetInnerHTML={{__html:markdown}} />
      </div>
    )
  }
}

const placeholder = 
`# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:
  
Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`
  
You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | ------------- 
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want! 
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`


ReactDOM.render(<App />, document.getElementById("app"));
