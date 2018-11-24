import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drumpads: {
        Q: {id: 'Q', name: 'Heater-1', trigger: 81, src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'},
        W: {id: 'W', name: 'Heater-2', trigger: 87, src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'},
        E: {id: 'E', name: 'Heater-3', trigger: 69, src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'},
        A: {id: 'A', name: 'Heater-4', trigger: 65, src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'},
        S: {id: 'S', name: 'Clap', trigger: 83, src: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'},
        D: {id: 'D', name: 'Open-HH', trigger: 68, src: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'},
        Z: {id: 'Z', name: "Kick-n'-Hat", trigger: 90, src: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'},
        X: {id: 'X', name: 'Kick', trigger: 88, src: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'},
        C: {id: 'C', name: 'Closed-HH', trigger: 67, src: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'}
      },
      lastSound: ''
    }
    
    this.handleClick = this.handleClick.bind(this);
  }
  
  handleClick(button) {
    this.setState({
      lastSound: this.state.drumpads[button].name
    })
  }
  
  render() {
    return (
      <div>
        <Display display={this.state.lastSound} />
        <div id="pad-container">
          <Drumpad pad={this.state.drumpads.Q} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.W} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.E} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.A} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.S} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.D} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.Z} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.X} click={this.handleClick} />
          <Drumpad pad={this.state.drumpads.C} click={this.handleClick} />
        </div>
      </div>
    )
  }
}

class Display extends React.Component {
  render() {
    return (
      <div id="display">
        <span>React Drum Machine</span>
        <p id="audio-name-container">Last beat played: {this.props.display}</p>
      </div>
    )
  }
}

class Drumpad extends React.Component {
  componentDidMount() {
    document.addEventListener('keydown', (e) => this.handleKeyPress(e, this.props.pad.trigger));
  }
  
  /*componentDidUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
  }*/
  
  handleKeyPress(e, trigger) {
    if (e.keyCode === trigger) {
      this.playSound(this.props.pad.id);
    }
  }
  
  playSound(source) {
    const sound = document.getElementById(source);
    sound.currentTime = 0;
    sound.play();
    this.props.click(source);
  }
  
  render() {
    return (
      <div class="drum-pad"  id={this.props.pad.name} onClick={() => this.playSound(this.props.pad.id)}>
        {this.props.pad.id}
        <audio class="clip" preload="auto" id={this.props.pad.id} src={this.props.pad.src} type="audio/mpeg" />
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("drum-machine"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
