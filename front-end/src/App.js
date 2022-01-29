import { Component } from "react"
import axios from "axios"
import ToggleButton from "./toggleButton.js"
import './app.css'
// export const host = window.location.host

//only for debugging purposes
export const host = "192.168.2.187" 

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      buttonNames: []
     }
  }

  async componentDidMount(){
    let state = await axios.get(`http://${host}/state`);
    state = state.data;
    let buttonNames = [];
    for(let i = 0; i < state.length; i++){
      buttonNames.push(state[i].name);
    }
    this.setState({buttonNames: buttonNames});

    for(let i = 0; i < state.length; i++){
      if(state[i].toggleBool === true){
        let element = document.getElementById(i);
        element.classList.add("toggled");
      }
    }
  }

  render() { 
    return ( 
      <div className = "Full">
        <div className = "Title">
        Preserve State
        </div>
        <div className = "toggleContainer">
          {this.state.buttonNames.map((name, i) => {
            return (
              <div className="toggle" key = {i}>
                <div className="toggleCaption">{name}</div>
                <ToggleButton id = {i}/>
              </div>
            )
          })}
        </div>
      </div>
     );
  }
}
 
export default App;
