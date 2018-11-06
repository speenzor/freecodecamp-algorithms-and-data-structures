// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [{quote: 'Loading quotes...', author: ''}],
      randomNum: 0,
      prevNum: 0
    }
    this.handleNewQuote = this.handleNewQuote.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
  }
  
  componentDidMount() {
    const URL = 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json';
    const fetchQuotes = ((url) => {
  return fetch(url)
    .then(response => response.json());
})(URL)
    .then(response => {this.setState({
      quotes: response.quotes,
      randomNum: Math.floor(Math.random()*102)
    })});
  }
  
  handleNewQuote() {
    this.setState({
      randomNum: Math.floor(Math.random()*102),
      prevNum: this.state.randomNum
    })
  }
  
  handlePrev() {
    this.setState({
      randomNum: this.state.prevNum
    })
  }

  render() {
    return (
      <div id="container">
      <div id="quote-box">
        <div id="quote">
          <p id="text">{this.state.quotes[this.state.randomNum].quote}</p>
          <p id="author">{'-'+this.state.quotes[this.state.randomNum].author}</p>
        </div>
        <div id="buttons">
          <New func={this.handleNewQuote}/>
          <Prev func={this.handlePrev}/>
          <Tweet currentQuote={'"' + this.state.quotes[this.state.randomNum].quote + '" -' + this.state.quotes[this.state.randomNum].author}/>
        </div>
      </div>
        <p id="attribution">by <a href="http://spencercorwin.com" target="_blank">Spencer Corwin</a></p>
      </div>
    );
  }
}

class New extends React.Component {
  render() {
    return (
      <button onClick={this.props.func} id="new-quote">New Quote</button>
    )
  }
}

class Tweet extends React.Component {
  render() {
    let tweetLink = 'https://twitter.com/intent/tweet?hashtags=quotes&related=freecodecamp&text=' + this.props.currentQuote;
    return (
      <a href={tweetLink} target="_blank" id="tweet-quote">Tweet Quote</a>
    )
  }
}

class Prev extends React.Component {
  render() {
    return (
      <button onClick={this.props.func} id="prev-quote">Previous Quote</button>
    )
  }
}


ReactDOM.render(<App />, document.getElementById("app"));
