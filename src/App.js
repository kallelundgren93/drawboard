import React, { Component } from "react";
import { render } from "react-dom";
import { Stage, Layer, Rect, Image, Group } from "react-konva";
import officeOverview from "./images/office-overview.png";

class Drawing extends Component {
  state = {
    isDrawing: false,
    mode: "brush"
  };

  componentDidMount() {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 800;
    const context = canvas.getContext("2d");

    this.setState({ canvas, context });
  }

  handleMouseDown = () => {
    console.log("mousedown");
    this.setState({ isDrawing: true });

    // TODO: improve
    const stage = this.image.parent.parent;
    this.lastPointerPosition = stage.getPointerPosition();
  };

  handleMouseUp = () => {
    console.log("mouseup");
    this.setState({ isDrawing: false });
  };

  handleMouseMove = () => {
    // console.log('mousemove');
    const { context, isDrawing, mode } = this.state;

    if (isDrawing) {
      console.log("drawing");

      // TODO: Don't always get a new context
      context.strokeStyle = "#df4b26";
      context.lineJoin = "round";
      context.lineWidth = 5;

      if (mode === "brush") {
        context.globalCompositeOperation = "source-over";
      } else if (mode === "eraser") {
        context.globalCompositeOperation = "destination-out";
      }
      context.beginPath();

      var localPos = {
        x: this.lastPointerPosition.x - this.image.x(),
        y: this.lastPointerPosition.y - this.image.y()
      };
      console.log("moveTo", localPos);
      context.moveTo(localPos.x, localPos.y);

      // TODO: improve
      const stage = this.image.parent.parent;

      var pos = stage.getPointerPosition();
      localPos = {
        x: pos.x - this.image.x(),
        y: pos.y - this.image.y()
      };
      console.log("lineTo", localPos);
      context.lineTo(localPos.x, localPos.y);
      context.closePath();
      context.stroke();
      this.lastPointerPosition = pos;
      this.image.getLayer().draw();
    }
  };

  render() {
    const { canvas } = this.state;
    console.log("canvas", canvas);

    return (
      <Image
        image={canvas}
        ref={node => (this.image = node)}
        stroke={"black"}
        width={1000}
        height={800}
        onMouseDown={this.handleMouseDown}
        onMouseUp={this.handleMouseUp}
        onMouseMove={this.handleMouseMove}
      />
    );
  }
}

class MapImage extends React.Component {
  state = {
    image: new window.Image()
  };

  componentDidMount() {
    this.state.image.src = officeOverview;

    this.state.image.onload = () => {
      // calling set state here will do nothing
      // because properties of Konva.Image are not changed
      // so we need to update layer manually
      this.imageNode.getLayer().batchDraw();
    };
  }

  render() {
    return (
      <Image
        image={this.state.image}
        y={0}
        ref={node => {
          this.imageNode = node;
        }}
        width={1000}
        height={800}
      />
    );
  }
}

class Toolbar extends React.Component {
  render() {
    return (
      <div>
        <button
          type="button"
          id="sidbarPush"
          onClick={this.props.handleClick}
          profile={this.props.profileCollapsed}
        />

        <Stage width={1000} height={800}>
          <Layer>
            <MapImage />
            <Drawing />
          </Layer>
        </Stage>
      </div>
    );
  }
}

class App extends Component {
  render() {
    return <Toolbar />;
  }
}

export default App;
