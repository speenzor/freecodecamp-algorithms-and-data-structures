// You may add additional external JS and CSS as needed to complete the project, however the current external resource MUST remain in place for the tests to work. BABEL must also be left in place. PLEASE NOTE: Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

let quotesData;
let randomNum = Math.floor(Math.random()*102);
(() => {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      quotesData = JSON.parse(this.responseText);
      document.getElementById("quote").innerHTML = quotesData.quotes[randomNum].quote;
      document.getElementById("testauthor").innerHTML = quotesData.quotes[randomNum].author;
    }
  };
  xhttp.open('GET', 'https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json', true);
  xhttp.send();
})();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotes: [{quote: 'This is Sparta!', author: 'me'}]
    }
    this.handleNewQuote = this.handleNewQuote.bind(this);
    this.handleTweet = this.handleTweet.bind(this);
  }
  
  handleNewQuote() {
    
  }
  
  handleTweet() {
    
  }

  render() {
    return (
      <div>
        <p id="text">{this.state.quotes[0].quote}</p>
        <p id="author">{this.state.quotes[0].author}</p>
        <New func={this.handleNewQuote}/>
        <Tweet func={this.handleTweet}/>
      </div>
    );
  }
}

class New extends React.Component {
  render() {
    return (
      <a onClick={this.props.func} id="new-quote">New Quote</a>
    )
  }
}

class Tweet extends React.Component {
  render() {
    return (
      <a href="twitter.com/intent/tweet" id="tweet-quote">Tweet Quote</a>
    )
  }
}


ReactDOM.render(<App />, document.getElementById('quote-box'));
