import React from "react";
import { render } from "react-dom";
import Router from "./router";
import history from "./history";
import { Navbar } from "client/components";
import { Layout } from "antd";
import BankDash from "./components/BankDash";

import "./scss/index.scss";
import "./less/override.less";
// ant design pro stylesheet// Import whole style

const Index = () => (
  <Layout
    style={{
      backgroundColor: "black"
    }}
  >
    <Navbar history={history} />

    <Layout.Content style={{ padding: "0 50px" }}>
      <Router />
    </Layout.Content>
    <Layout.Footer style={{ textAlign: "center" }}>
      Silicon Valley Bank
    </Layout.Footer>
  </Layout>
);
render(<Index />, document.getElementById("root"));
