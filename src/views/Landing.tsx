import React from "react";
import { Hero, Newsletter, Stats, Features } from "client/components";
class Landing extends React.Component {
  render() {
    return (
      <div
        className="App code"
        style={{
          fontFamily: "monospace",
          textAlign: "center",
        }}
      >
        <Hero />
        <Stats />
        <Features />
        <Newsletter />
      </div>
    );
  }
}

export default Landing;
