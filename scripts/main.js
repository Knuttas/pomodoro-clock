class Controls extends React.Component {
    render() {
      return (
        <div className="length-control">
          <div id={this.props.titleID}>
            {this.props.title}
          </div>
          <div className="row">
          <button id={this.props.decID}
            className="btn-level" value="-" onClick={this.props.onClick}>
            <i className="fa fa-arrow-circle-down fa-2x"/>
            </button>
          <div id={this.props.lengthID} classname="btn-level">
            {this.props.length}
          </div>
          <button id={this.props.incID}
            className="btn-level" value="+" onClick={this.props.onClick}>
            <i className="fa fa-arrow-circle-up fa-2x"/>
            </button>
          </div>
        </div>
      )
    }
  };
  
  class PomodoroClock extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        breakLength: 5,
        sessionLength: 25,
        timerState: "stopped",
        timerType: "Session",
        timeInSeconds: 1500,
        interval: ""
      }
      this.setBreakLength = this.setBreakLength.bind(this);
      this.setSessionLength = this.setSessionLength.bind(this);
      this.lengthControl = this.lengthControl.bind(this);
      this.clickStartStop = this.clickStartStop.bind(this);
      this.startTimer = this.startTimer.bind(this);
      this.tick = this.tick.bind(this);
      this.switchTimer = this.switchTimer.bind(this);
      this.displayInMinutesAndSeconds = this.displayInMinutesAndSeconds.bind(this);
      this.reset = this.reset.bind(this);
    }
    
    setBreakLength(e) {
      this.lengthControl("breakLength", e.currentTarget.value, this.state.breakLength, "Break");
    }
    
    setSessionLength(e) {
      this.lengthControl("sessionLength", e.currentTarget.value, this.state.sessionLength, "Session");
    }
    
    lengthControl(stateToChange, sign, currentLength, timerType) {
      if (this.state.timerState == "running") return;
      if (this.state.timerType == timerType) {
        if (sign == "-" && currentLength != 1) {
          this.setState({[stateToChange]: currentLength - 1,
                        timeInSeconds: currentLength * 60 - 60});
        } else if (sign == "+" && currentLength != 60) {
          this.setState({[stateToChange]: currentLength + 1,
                        timeInSeconds: currentLength * 60 + 60});
        }
      } else if (this.state.timerType != timerType) {
        if (sign == "-" && currentLength != 1) {
          this.setState({[stateToChange]: currentLength - 1});
        } else if (sign == "+" && currentLength != 60) {
          this.setState({[stateToChange]: currentLength + 1});
        }
      }
    }
    
    clickStartStop() {
      if (this.state.timerState == "stopped") {
        this.startTimer(),
        this.setState({timerState: "running"})
      } else if (this.state.timerState == "running") {
        this.setState({timerState: "stopped"}),
        clearInterval(this.state.interval)
      }
    }
    
    startTimer() {
      this.setState({
        interval: setInterval(() => this.tick(), 1000)
      })
    }
    
    tick() {
      this.setState({timeInSeconds: this.state.timeInSeconds - 1});
      let timer = this.state.timeInSeconds;
      if (timer < 0 && this.state.timerType == "Session") {
        clearInterval(this.state.interval),
          this.switchTimer(this.state.breakLength * 60, "Break"),
          this.startTimer()
      } else if (timer < 0 && this.state.timerType == "Break") {
        clearInterval(this.state.interval),
          this.switchTimer(this.state.sessionLength * 60, "Session"),
          this.startTimer()
      } else if (timer == 0) {
          this.audioBeep.play();
      }
    }
    
    switchTimer(num, str) {
      this.setState({
        timeInSeconds: num,
        timerType: str
      })
    }
    
    displayInMinutesAndSeconds() {
      let minutes = Math.floor(this.state.timeInSeconds / 60);
      let seconds = this.state.timeInSeconds - minutes * 60;
      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return minutes + ":" + seconds;
    }
    
    reset() {
      this.setState({
        breakLength: 5,
        sessionLength: 25,
        timerState: "stopped",
        timerType: "Session",
        timeInSeconds: 1500,
        interval: ""
      });
      clearInterval(this.state.interval);
      this.audioBeep.pause();
      this.audioBeep.currentTime = 0;
    }
    
    render() {
      return (
        <div>
          <div className="project-title">
            <h1>My Pomodoro Clock</h1>
          </div>
          <Controls 
            titleID="break-label"   decID="break-decrement"
            incID="break-increment" lengthID="break-length"
            title="Break Length"    length={this.state.breakLength}
            onClick={this.setBreakLength}/>
          <Controls 
            titleID="session-label"   decID="session-decrement"
            incID="session-increment" lengthID="session-length"
            title="Session Length"    length={this.state.sessionLength}
            onClick={this.setSessionLength}/>
          <div className="timer">
            <div className="timer-wrapper">
              <div id="timer-label">
                {this.state.timerType}
              </div>
              <div id="time-left">
                {this.displayInMinutesAndSeconds()}
              </div>
            </div>
          </div>
          <div className="timer-control">
            <button id="start_stop" onClick={this.clickStartStop}>
              <i className="fa fa-play fa-2x"/>
              <i className="fa fa-pause fa-2x"/>
            </button>
            <button id="reset" onClick={this.reset}>
              <i className="fa fa-sync-alt fa-2x"/>
            </button>
          </div>
          <audio id="beep" preload="auto" ref={(audio) =>{this.audioBeep = audio; }} src="https://goo.gl/65cBl1"/>
        </div>
      )
    }
  };
  
  ReactDOM.render(<PomodoroClock />, document.getElementById("pomodoro"));