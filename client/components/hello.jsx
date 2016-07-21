import React from "react";
import smiley from "../images/smiley.jpg";

class Hello extends React.Component{
  render() {
    return <div>
      <img src={smiley} />
      Hello {this.props.name}
    </div>;
  }
}

export default Hello;