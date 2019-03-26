import React, { Component } from "react";
import { Link } from "react-router-dom";
const svg = require("./runchase.svg");

import { Row, Col, Button } from "antd";
export default class Hero extends Component {
  render() {
    return (
      <div
        style={{
          fontFamily: "monospace",
          color: "#fff",
          padding: "20px",
          textAlign: "center",
          marginBottom: "60px"
        }}
      >
        <Row
          style={{
            minHeight: "calc(60vh)"
          }}
        >
          <Col
            span={24}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              height: "300px"
            }}
          >
            <h1
              className="f2 f1-l fw2 white-90 mb0 lh-title"
              style={{ fontSize: "30px" }}
            >
              RUN from Chase!
            </h1>
            {/* <div style={{display: 'block'; margin: auto}}>
            <img src={svg} alt="" width="200px" height="200px" />
            </div> */}
            <h2 className="fw1 f3 white-80 mt3 mb4">
              Instantly create a new account, fund it and look for nearby ATM
              machines
            </h2>
          </Col>
        </Row>
        <Row
          type="flex"
          justify="center"
          style={{
            textAlign: "center"
          }}
          gutter={15}
        >
          <Col>
            <Button type="primary" size="large">
              <Link to="/register">Sign Up Now!</Link>
            </Button>
          </Col>
        </Row>
      </div>
    );
  }
}
