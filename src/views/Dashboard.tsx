import React, { Component } from "react";
import axios from "axios";
import { proxy } from "package.json";
import { ChartContainer } from "client/components";
import history from "client/history";
import { Card } from "antd";
import { Props, State } from "client/interfaces";
import BankDash from "../components/BankDash.js";
class Dashboard extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      books: []
    };
  }

  componentDidMount() {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    axios
      .get("http://" + proxy + "/api/book")
      .then(res => {
        this.setState({ books: res.data });
        console.log(this.state.books);
      })
      .catch(error => {
        if (error.response.status === 401) {
          history.push("/login");
        }
      });
  }

  logout = e => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };
  render() {
    console.log(proxy);
    return (
      <div
        className="dashboard code"
        style={{
          padding: "10px"
        }}
      >
        <Card title="Graphs" bordered={false}>
          <BankDash />
        </Card>
      </div>
    );
  }
}

export default Dashboard;
