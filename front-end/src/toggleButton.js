import { Component } from "react"
import axios from "axios"
import { host } from "./App.js"
import "./button.css"

class toggleButton extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    async componentDidMount(){
        
    }

    render() { 
        return ( 
            <div className="hitbox" onClick={()=>{let element = document.getElementById(this.props.id);element.classList.toggle("toggled");axios.post(`http://${host}/toggle`, {id : this.props.id})}}>
                <div className="buttonOuter">
                    <div className="buttonInner" id = {this.props.id}>

                    </div>
                </div>
            </div>
         );
    }
}
 
export default toggleButton;