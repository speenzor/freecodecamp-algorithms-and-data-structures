import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

//Adding global style rules using the * selector, or by adding rules to body {..} or html {..}, or to all elements within body or html, i.e. h1 {..}, has the potential to pollute the test suite's CSS. Try adding: * { color: red }, for a quick example!

const projectName = 'javascript-calculator';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: ['0'],
      formula: [''],
    }
    this.handleClear = this.handleClear.bind(this);
    this.handleDigit = this.handleDigit.bind(this);
    this.handleOperator = this.handleOperator.bind(this);
    this.handleDecimal = this.handleDecimal.bind(this);
    this.handleEquals = this.handleEquals.bind(this);
  }
  
  handleClear() {
    this.setState({
      currentValue: ['0'],
      formula: [''],
    })
  }
  
  handleDigit(e) {
    const operatorRegex = /[-+*\/]/;
    const formulaOutput = this.state.formula.map(x => x.toString()).reduce((x, y) => x + y);
    const currentValueOutput = this.state.currentValue.map(x => x.toString()).reduce((x, y) => x + y);
    if (/=/.test(formulaOutput)) {
      this.setState({
        formula: [e.target.value],
        currentValue: [e.target.value]
      })
    } else if (this.state.currentValue.length >= 25) {
      alert('Max-digit length reached');
    } else if (currentValueOutput === '0' && e.target.value === '0') {
      return;
    } else if (currentValueOutput === '0' && e.target.value !== '0') {
      this.setState({
        formula: [...this.state.formula, e.target.value],
        currentValue: [e.target.value]
      })
    } else if (operatorRegex.test(currentValueOutput)) {
      this.setState({
        formula: [...this.state.formula, e.target.value],
        currentValue: [e.target.value]
      })
    } else {
      this.setState({
        formula: [...this.state.formula, e.target.value],
        currentValue: [...this.state.currentValue, e.target.value]
      }) 
    }
    e.preventDefault();
  }
  
  handleOperator(e) {
    const operatorRegex = /[-+*\/]/;
    const formulaOutput = this.state.formula.map(x => x.toString()).reduce((x, y) => x + y);
    const currentValueOutput = this.state.currentValue.map(x => x.toString()).reduce((x, y) => x + y);
    //This if statement deals with when user has already pressed + or - to begin calc
    if (/=/g.test(formulaOutput)) {
      this.setState({
        currentValue: [e.target.value],
        formula: [currentValueOutput, e.target.value] 
      })
    //Deals with beginning the formula/output with an operator
    } else if (currentValueOutput === '0' && formulaOutput === '0') {
      if (e.target.value === '-') {
        this.setState({
          formula: [e.target.value],
          currentValue: [e.target.value]
        })
      } else {
        return;
      }
    //This statement deals with pressing two operators consecutively
    } else if (operatorRegex.test(currentValueOutput)) {
      this.setState({
        currentValue: [e.target.value],
        formula: [...this.state.formula.slice(0,this.state.formula.length-1), e.target.value]
      })
    //This statement deals with when current value is 0
    } else if (currentValueOutput === '0') {
      if (e.target.value === '-') {
        this.setState({
          currentValue: [e.target.value],
          formula: [...this.state.formula, e.target.value]
        })
      } else {
        return;
      }
    //Deals with operators when equals has been hit already
    } else {
      this.setState({
        currentValue: [e.target.value],
        formula: [...this.state.formula, e.target.value]
      })
    }
    e.preventDefault();
  }
  
  handleEquals(e) {
    const formulaOutput = this.state.formula.map(x => x.toString()).reduce((x, y) => x + y);
    const next = formulaOutput.split(/([-+*\/])/);
    const nextnext = next.filter(x => x !== '');
    const preOutput = nextnext.map(x => {
      if (!/[\s-+*\/]/.test(x)) {
        return parseFloat(x);
      } else {
        return x;
      }}).join('');
    if (!/\d/.test(preOutput[preOutput.length-1])) {
      return;
    } else {
      const output = eval(preOutput);
      this.setState({
        currentValue: [output],
        formula: [preOutput, '=', output]
      })
    }
    e.preventDefault();
  }
  
  handleDecimal(e) {
    const decimalRegex = /\./g;
    const operatorRegex = /[-+*\/]/;
    const currentValueOutput = this.state.currentValue.map(x => x.toString()).reduce((x, y) => x + y);
    if (this.state.currentValue.length >= 25) {
      alert('Max digit length reached');
    } else if (decimalRegex.test(currentValueOutput)) {
      return;
    } else if (operatorRegex.test(currentValueOutput)) {
      this.setState({
        currentValue: ['0', '.'],
        formula: [...this.state.formula, '0', '.']
      })
    } else {
      this.setState({
        currentValue: [...this.state.currentValue, e.target.value],
        formula: [...this.state.formula, e.target.value]
      })
    }
    e.preventDefault();
  }
  
  render() {
    return (
      <div>
        <div id="output">
          <Formula
            formula={this.state.formula}
          />
          <Output
            currentValue={this.state.currentValue}
          />
        </div>
        <Buttons
          handleClear={this.handleClear}
          handleOperator={this.handleOperator}
          handleEquals={this.handleEquals}
          handleDigit={this.handleDigit}
          handleDecimal={this.handleDecimal}
        />
      </div>
    )
  }
}

class Buttons extends React.Component {
  render() {
    return (
      <div id="buttons">
        <button id="add" value="+" onClick={this.props.handleOperator}>+</button>
        <button id="subtract" value="-" onClick={this.props.handleOperator}>-</button>
        <button id="multiply" value="*" onClick={this.props.handleOperator}>x</button>
        <button id="divide" value="/" onClick={this.props.handleOperator}>/</button>
        <button id="one" value="1" onClick={this.props.handleDigit}>1</button>
        <button id="two" value="2" onClick={this.props.handleDigit}>2</button>
        <button id="three" value="3" onClick={this.props.handleDigit}>3</button>
        <button id="clear" onClick={this.props.handleClear} >AC</button>
        <button id="four" value="4" onClick={this.props.handleDigit}>4</button>
        <button id="five" value="5" onClick={this.props.handleDigit}>5</button>
        <button id="six" value="6" onClick={this.props.handleDigit}>6</button>
        <button id="seven" value="7" onClick={this.props.handleDigit}>7</button>
        <button id="eight" value="8" onClick={this.props.handleDigit}>8</button>
        <button id="nine" value="9" onClick={this.props.handleDigit}>9</button>
        <button id="equals" value="=" onClick={this.props.handleEquals}>=</button>
        <button id="zero" value="0" onClick={this.props.handleDigit}>0</button>
        <button id="decimal" value="." onClick={this.props.handleDecimal}>.</button>
      </div>
    )
  }
}

class Output extends React.Component {
  render() {
    const currentValueOutput = this.props.currentValue.map(x => x.toString()).reduce((x, y) => x + y);
    return (
      <div id="display">
        {currentValueOutput}
      </div>
    )
  }
}

class Formula extends React.Component {
  render() {
    const formulaOutput = this.props.formula.map(x => x.toString()).reduce((x, y) => x + y);
    return (
      <div id="formula">
        {formulaOutput}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('calculator-container'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
