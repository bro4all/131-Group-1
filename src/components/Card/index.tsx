import React from "react";
import _ from 'lodash'

class MainChart extends React.Component {
  constructor(props) {
    super(props);

    this.saveCanvasNode = this.saveCanvasNode.bind(this);
    this.state = {
    };
  }
  saveCanvasNode(node) {
    this.canvasNode = node;
  }
  componentDidMount() {
    document.addEventListener("keyup", this.onKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keyup", this.onKeyPress);
  }
  render() {
    return (
      
    )
  }
}



export {
};