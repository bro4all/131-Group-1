import { Login as LoginComponent } from "ant-design-pro";
import { Alert, Checkbox, Row, Col } from "antd";
import React from "react";
import history from "client/history";
import axios from "axios";
import { proxy } from "package.json";
const { Tab, UserName, Password, Submit } = LoginComponent;

export default class Login extends React.Component {
  state = {
    notice: "",
    type: "login",
    autoLogin: true,
  };
  onSubmit = (err, values) => {
    console.log("value collected ->", {
      ...values,
      autoLogin: this.state.autoLogin,
    });
    this.setState(
      {
        notice: "",
      },
      () => {
        axios
          .post("/api/auth/login", values)
          .then(result => {
            localStorage.setItem("jwtToken", result.data.token);
            window.location.href = "/app";
          })
          .catch(error => {
            if (error.response.status === 401) {
              setTimeout(() => {
                this.setState({
                  notice:
                    "The combination of username and password is incorrect!",
                });
              }, 500);
            }
          });
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
            <Tab key="login" tab={"Login"}>
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

              <div>
                <Checkbox
                  checked={this.state.autoLogin}
                  onChange={this.changeAutoLogin}
                >
                  Keep me logged in
                </Checkbox>
              </div>
              <Submit>Login</Submit>
              <div>
                <a
                  style={{ float: "right" }}
                  href="/register"
                  onClick={e => {
                    e.preventDefault();
                    history.push("/register");
                  }}
                >
                  Register
                </a>
              </div>
            </Tab>
          </LoginComponent>
        </Col>
      </Row>
    );
  }
}
