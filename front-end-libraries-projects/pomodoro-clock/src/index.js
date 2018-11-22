import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerType: 'Session',
      timerID: '',
      start: false
    }
    
    this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
    this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
    this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
    this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
    this.toggleCountdown = this.toggleCountdown.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.clockify = this.clockify.bind(this);
    this.decrementTimer = this.decrementTimer.bind(this);
  }
  
  handleBreakDecrement(e) {
    if (this.state.start || this.state.breakLength <= 1) {
      return;
    } else {
      if (this.state.timerType === 'Break') {
        this.setState((prevState) => {
          return {
            breakLength: prevState.breakLength - 1,
            timeLeft: (prevState.breakLength - 1) * 60
          }
        }); 
      } else {
        this.setState((prevState) => {
          return {
            breakLength: prevState.breakLength - 1
          }
        })
      }
    } 
   e.preventDefault(); 
  }
  
  handleBreakIncrement(e) {
    if (this.state.start || this.state.breakLength >= 60) {
      return;
    } else {
      if (this.state.timerType === 'Break') {
        this.setState((prevState) => {
          return {
            breakLength: prevState.breakLength + 1,
            timeLeft: (prevState.breakLength + 1) * 60
          }
        }); 
      } else {
        this.setState((prevState) => {
          return {
            breakLength: prevState.breakLength + 1
          }
        })
      }
    } 
   e.preventDefault(); 
  }
  
  handleSessionIncrement(e) {
    if (this.state.start || this.state.sessionLength >= 60) {
      return;
    } else {
      if (this.state.timerType === 'Session') {
        this.setState((prevState) => {
          return {
            sessionLength: prevState.sessionLength + 1,
            timeLeft: (prevState.sessionLength + 1) * 60
          }
        }); 
      } else {
        this.setState((prevState) => {
          return {
            sessionLength: prevState.sessionLength + 1
          }
        })
      }
    } 
   e.preventDefault(); 
  }
  
  handleSessionDecrement(e) {
    if (this.state.start || this.state.sessionLength <= 1) {
      return;
    } else {
      if (this.state.timerType === 'Session') {
        this.setState((prevState) => {
          return {
            sessionLength: prevState.sessionLength - 1,
            timeLeft: (prevState.sessionLength - 1) * 60
          }
        }); 
      } else {
        this.setState((prevState) => {
          return {
            sessionLength: prevState.sessionLength - 1
          }
        })
      }
    } 
   e.preventDefault(); 
  }
  
  toggleCountdown(e) {
    this.setState((prevState) => {
      return {start: prevState.start ? false : true}
    }, () => {
      if (this.state.start) {
        this.handleCountdown();
      } else {
        clearInterval(this.state.timerID);
      }
    })
    e.preventDefault();
  }
  
  handleCountdown() {
    const timerVariable = setInterval(() => {
      if (this.state.timeLeft > 0) {
        this.decrementTimer()
      } else {
        this.audioBeep.play();
        this.setState({
          timeLeft: this.state.timerType === 'Session' ? this.state.breakLength * 60 : this.state.sessionLength * 60,
          timerType: this.state.timerType === 'Session' ? 'Break' : 'Session'
        })
      }
    }, 1000)
    this.setState({
      timerID: timerVariable
    })
  }
  
  decrementTimer() {
    this.setState((prevState) => {
      return {timeLeft: prevState.timeLeft - 1}
    })
  }
  
  handleReset(e) {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timeLeft: 1500,
      timerType: 'Session',
      start: false
    })
    clearInterval(this.state.timerID);
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
    e.preventDefault();
  }
  
  clockify() {
    let minutes = Math.floor(this.state.timeLeft / 60);
    let seconds = this.state.timeLeft - (minutes * 60);
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ':' + seconds;
  }
  
  render() {
    return (
      <div id="app-container">
        <h1>Pomodoro Clock</h1>
        <div id="flex-container">
          <Break
            breakLength={this.state.breakLength}
            breakDecrement={this.handleBreakDecrement}
            breakIncrement={this.handleBreakIncrement}
          />
          <Session
            sessionLength={this.state.sessionLength}
            sessionDecrement={this.handleSessionDecrement}
            sessionIncrement={this.handleSessionIncrement}
          />
        </div>
        <div id="timer-container">
          <h2 id="timer-label">{this.state.timerType}</h2>
          <p id="time-left" style={this.state.timeLeft <= 60 ? {color:'red'}:{color:'black'}}>{this.clockify()}</p>
          <button id="start_stop" onClick={this.toggleCountdown}>Start/Stop</button>
          <button id="reset" onClick={this.handleReset}>Reset</button>
          <audio id="beep" preload="auto" src="https://spencercorwin.com/assets/gong.mp3"
            ref={(audio) => { this.audioBeep = audio; }} />
        </div>
      </div>
    )
  }
}

class Break extends React.Component {
  render() {
    return(
      <div id="break-container">
        <h2 id="break-label">Break Length</h2>
        <p id="break-length">{this.props.breakLength}</p>
        <button id="break-decrement" onClick={this.props.breakDecrement}>-</button>
        <button id="break-increment" onClick={this.props.breakIncrement}>+</button>
      </div>
    )
  }
}

class Session extends React.Component {
  render() {
    return(
      <div id="session-container">
        <h2 id="session-label">Session Length</h2>
        <p id="session-length">{this.props.sessionLength}</p>
        <button id="session-decrement" onClick={this.props.sessionDecrement}>-</button>
        <button id="session-increment" onClick={this.props.sessionIncrement}>+</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById("app"))