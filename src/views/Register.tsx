import { Login as LoginComponent } from "ant-design-pro";
import { Alert, Checkbox, Row, Col, Card } from "antd";
import React from "react";
import history from "client/history";
import axios from "axios";
import { proxy } from "package.json";
const { Tab, UserName, Password, Submit } = LoginComponent;

export default class Register extends React.Component {
  state = {
    notice: "",
    type: "register",
  };
  onSubmit = (err, values) => {
    console.log("value collected ->", {
      ...values,
    });
    this.setState(
      {
        notice: "",
      },
      () => {
        if (values.password == values["password-confirm"]) {
          setTimeout(() => {
            this.setState({
              notice: "The combination of username and password is incorrect!",
            });
          }, 500);
        } else {
          axios
            .post("/api/auth/register", {
              username: values.username,
              password: values.password,
            })
            .then(result => {
              history.push("/login");
            });
        }
      }
    );
  };
  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };
  render() {
    return (
      <Row type="flex" justify="center">
        <Col span={16}>
          <LoginComponent
            defaultActiveKey={this.state.type}
            onSubmit={this.onSubmit}
          >
            <Tab key="register" tab={"Register"}>
              {this.state.notice && (
                <Alert
                  style={{ marginBottom: 24 }}
                  message={this.state.notice}
                  type="error"
                  showIcon
                  closable
                />
              )}
              <UserName name="username" placeholder="Email" />
              <Password name="password" placeholder="Password" />
              <Password
                name="password-confirm"
                placeholder="Confirm Password"
              />
              <Submit>Register</Submit>
            </Tab>
          </LoginComponent>
        </Col>
      </Row>
    );
  }
}
