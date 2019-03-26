import * as React from "react";
import history from "client/history";
import { Menu, Icon, Layout } from "antd";
import { Props, State } from "client/interfaces";
import { NoticeIcon } from "ant-design-pro";
import moment from "moment";
import groupBy from "lodash/groupBy";
import { Tag } from "antd";

// notif demo start
const data = [
  {
    id: "000000001",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "RSI past 60",
    datetime: "2017-08-09",
    type: "Trading"
  },
  {
    id: "000000002",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "RSI past 60",
    datetime: "2017-08-09",
    type: "Trading"
  },
  {
    id: "000000003",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "RSI past 60",
    datetime: "2017-08-09",
    type: "Trading"
  },
  {
    id: "000000004",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "New Sentiment Analysis",
    datetime: "2017-08-09",
    type: "Sentiment"
  },
  {
    id: "000000005",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "New Sentiment Analysis",
    datetime: "2017-08-09",
    type: "Sentiment"
  },
  {
    id: "000000006",
    avatar:
      "https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png",
    title: "New Sentiment Analysis",
    datetime: "2017-08-09",
    type: "Sentiment"
  }
];

function onItemClick(item, tabProps) {
  console.log(item, tabProps);
}

function onClear(tabTitle) {
  console.log(tabTitle);
}

function getNoticeData(notices) {
  if (notices.length === 0) {
    return {};
  }
  const newNotices = notices.map(notice => {
    const newNotice = { ...notice };
    if (newNotice.datetime) {
      newNotice.datetime = moment(notice.datetime).fromNow();
    }
    // transform id to item key
    if (newNotice.id) {
      newNotice.key = newNotice.id;
    }
    if (newNotice.extra && newNotice.status) {
      const color = {
        todo: "",
        processing: "blue",
        urgent: "red",
        doing: "gold"
      }[newNotice.status];
      newNotice.extra = (
        <Tag color={color} style={{ marginRight: 0 }}>
          {newNotice.extra}
        </Tag>
      );
    }
    return newNotice;
  });
  return groupBy(newNotices, "type");
}

const noticeData = getNoticeData(data);

// notif demo end

class Navbar extends React.Component<Props, State> {
  state = {
    current: history.location.pathname == "/app" ? "graph" : "home"
  };

  handleClick = (e: any) => {
    switch (e.key) {
      case "home":
        history.push("/");
        break;
      case "login":
        history.push("/login");
        break;
      case "logout":
        localStorage.removeItem("jwtToken");
        history.push("/");
        // window.location.reload();
        break;
      case "register":
        history.push("/register");
        break;
      case "graphs":
        history.push("/app");
        break;
    }
    console.log("click ", e);
  };
  render() {
    return (
      <Layout.Header>
        <div className="navbar">
          <div className="navHeader">SV Bank</div>
          <Menu
            className={"navMenu"}
            theme="dark"
            onClick={this.handleClick}
            mode="horizontal"
          >
            <Menu.Item key="home">
              <Icon type="home" />
              Home
            </Menu.Item>
            {history.location.pathname == "/app" ? (
              <Menu.Item key="notifications">
                <div style={{}}>
                  <NoticeIcon
                    className="notice-icon"
                    count={2}
                    onItemClick={onItemClick}
                    onClear={onClear}
                  >
                    <NoticeIcon.Tab
                      list={noticeData["Trading"]}
                      title="Trading"
                      emptyText="empty"
                    />
                    <NoticeIcon.Tab
                      list={noticeData["Sentiment"]}
                      title="Sentiment"
                      emptyText="Empty"
                    />
                  </NoticeIcon>
                </div>
              </Menu.Item>
            ) : null}
            {history.location.pathname == "/app" ? (
              <Menu.Item key="graphs">
                <Icon type="area-chart" />
                Graphs
              </Menu.Item>
            ) : null}
            {history.location.pathname == "/app" ? (
              <Menu.Item key="logout">
                <Icon type="logout" />
                Logout
              </Menu.Item>
            ) : (
              <Menu.Item key="login">
                <Icon type="login" />
                Login
              </Menu.Item>
            )}
            {history.location.pathname != "/app" ? (
              <Menu.Item key="register">
                <Icon type="user-add" />
                Register
              </Menu.Item>
            ) : null}
          </Menu>
        </div>
      </Layout.Header>
    );
  }
}

export default Navbar;
