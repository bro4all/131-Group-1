import React, { Component } from "react";
import {
  Layout,
  Row,
  Col,
  Tag,
  InputNumber,
  Tooltip,
  Icon,
  Modal,
  Input,
  Button,
  Menu,
} from "antd";
import { SketchPicker } from "react-color";
import { Chart } from "client/components";
import { filter, orderBy, map, compact } from "lodash";
import Select from "react-select";
const SubMenu = Menu.SubMenu;
const ti = [
  { id: "sma", name: "Simple Moving Average" },
  { id: "ema", name: "Estimated Moving Average" },
  { id: "wma", name: "Weighted Moving Average" },
  { id: "tma", name: "Triangular Moving Average" },
  { id: "bb", name: "Bollinger Bands" },
  { id: "rsi", name: "RSI" },
];
import { Props, State } from "client/interfaces";
export default class ChartContainer extends Component<Props, State> {
  rootSubmenuKeys = ti.map(d => d.id);
  constructor(props: any) {
    super(props);
    this.state = {
      selectedOption: "",
      indicators: [],
      pair: "",
      list: [],
      kline: {},
      modifier: null,
      openKeys: [],
      visible: false,
      loading: false,
      color: { hex: "#000000", rgb: { r: 0, g: 0, b: 0, a: 1 } },
      enableFib: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handlePair = this.handlePair.bind(this);
    this.fetchPair = this.fetchPair.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
    this.disableFib = this.disableFib.bind(this);
  }
  disableFib() {
    this.setState({ enableFib: false });
  }
  onOpenChange(openKeys: any) {
    if (this.state.openKeys.length > 0) {
      const latestOpenKey = openKeys.find(
        (key: any) => this.state.openKeys.indexOf(key) === -1
      );
      if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
        this.setState({ openKeys });
      } else {
        this.setState({
          openKeys: latestOpenKey ? [latestOpenKey] : [],
        });
      }
    } else {
      this.setState({ openKeys });
    }
  }
  handleInterval(i: any) {
    this.setState({ modifier: i.target.innerHTML });
  }
  handlePair(i: any) {
    this.fetchPair(i.value);
    this.setState({ pair: i, modifier: null });
  }
  addFib = () => {
    this.setState({ enableFib: true });
  };
  handleClose = (removedTag: any) => {
    let indicators = this.state.indicators;
    indicators = filter(indicators, tag => tag.tooltip !== removedTag);
    this.setState({ indicators });
  };

  handleChange(selectedOption: any) {
    let indicators: Array<any> = [];
    selectedOption.map((k: any) => {
      indicators.push(k.value);
    });
    this.setState({
      selectedOption: selectedOption,
      indicators: indicators,
    });
  }
  fetchPair(symbol: any) {
    this.setState({ loading: true }, () => {
      fetch("http://167.99.173.251:8888/binance/" + symbol)
        .then(res => res.json())
        .then(res => {
          let { result: klines } = res;
          this.setState({ kline: klines, loading: false });
        });
    });
  }
  componentDidMount() {
    fetch("http://167.99.173.251:8888/binance/list")
      .then(res => res.json())
      .then(res => {
        let { result: list } = res;
        this.setState({ list: list });
      });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  };
  getRgba({ r, g, b, a }) {
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  handleOk = () => {
    let pushto: any = {
      color: this.getRgba(this.state.color.rgb),
      type: this.state.openKeys[0],
      window: !["bb", "rsi"].includes(this.state.openKeys[0])
        ? document.getElementById(this.state.openKeys[0] + "-window").value
        : undefined,
      tooltip: `${this.state.openKeys[0]}${
        !["bb", "rsi"].includes(this.state.openKeys[0])
          ? document.getElementById(this.state.openKeys[0] + "-window").value
          : ""
      }`,
    };
    console.log(pushto);
    let newindicators = this.state.indicators;
    newindicators.push(pushto);
    console.log(newindicators);
    this.setState({
      loading: false,
      visible: false,
      indicators: newindicators,
    });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  handleChangeComplete = color => {
    this.setState({ color: color });
  };
  render() {
    let { kline, modifier, indicators, visible, loading } = this.state;
    return (
      <Layout.Content style={{ padding: "0 50px" }}>
        <Row gutter={16}>
          <Col
            span={12}
            style={{
              height: 80,
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              justifyContent: "center",
            }}
          >
            <Row
              type="flex"
              justify="space-around"
              gutter={16}
              style={{
                margin: "30px inherit",
              }}
            >
              <Col span={24}>
                <Select
                  name="form-field-name"
                  value={this.state.pair}
                  onChange={this.handlePair}
                  options={this.state.list.map(l => ({ label: l, value: l }))}
                  styles={{
                    menu: style => ({
                      ...style,
                      zIndex: 100,
                      backgroundColor: "#222",
                      color: "#fff",
                    }),
                    input: style => ({ ...style, color: "#fff" }),
                    control: (style, state) => {
                      return {
                        ...style,
                        color: "#fff",
                        backgroundColor: "#222",
                        borderColor: !state.isFocused ? "#222" : "#1187ee",
                        ":hover": { borderColor: "#1187ee", cursor: "pointer" },
                        boxShadow: "none",
                        borderWidth: 2,
                      };
                    },
                    multiValue: style => ({
                      ...style,
                      backgroundColor: "#1187ee",
                    }),
                    singleValue: style => ({ ...style, color: "#fff" }),
                    multiValueRemove: style => ({
                      ...style,
                      ":hover": {
                        backgroundColor: "transparent",
                        color: "#ff0000",
                      },
                    }),
                    clearIndicator: style => ({
                      ...style,
                      color: "#fff",
                      ":hover": { color: "#ff0000" },
                    }),
                    dropdownIndicator: style => ({
                      ...style,
                      ":hover": { color: "#fff" },
                    }),
                    option: (style, state) => ({
                      ...style,
                      color:
                        state.isFocused || state.isSelected ? "#fff" : null,
                    }),
                  }}
                  theme={theme => ({
                    ...theme,
                    borderRadius: 6,
                    colors: {
                      ...theme.colors,
                      primary25: "#1187ee",
                      primary: "#1187ee",
                    },
                  })}
                />
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row
              type="flex"
              justify="space-around"
              gutter={16}
              style={{
                margin: "30px inherit",
                height: "80px",
              }}
            >
              {this.state.loading ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  {" "}
                  <Button type="primary" shape="circle" loading />
                </div>
              ) : (
                orderBy(
                  orderBy(Object.keys(kline), o => [o.slice(0, 1)], "asc"),
                  o => {
                    return [o.slice(-1)];
                  },
                  ["desc"]
                ).map(k => (
                  <Col
                    span={4}
                    onClick={this.handleInterval}
                    key={k}
                    className={modifier == k ? "col selected" : "col"}
                  >
                    {k}
                  </Col>
                ))
              )}
            </Row>
          </Col>
        </Row>

        {modifier ? (
          <Row
            style={{
              padding: "20px",
            }}
          >
            {indicators.map(({ tooltip: tag, color }, index) => {
              const isLongTag = tag.length > 20;
              const tagElem = (
                <Tag
                  style={{ color: color }}
                  key={tag}
                  closable
                  afterClose={() => this.handleClose(tag)}
                >
                  {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                </Tag>
              );
              return isLongTag ? (
                <Tooltip title={tag} key={tag}>
                  {tagElem}
                </Tooltip>
              ) : (
                tagElem
              );
            })}

            <Tag
              onClick={this.showModal}
              style={{
                background: "#1890ff",
                color: "#fff",
              }}
            >
              <Icon type="plus" style={{ fill: "#fff" }} /> Add Indicator
            </Tag>
            <Tag
              onClick={this.addFib}
              style={{
                background: "#1890ff",
                color: "#fff",
              }}
            >
              <Icon type="plus" style={{ fill: "#fff" }} /> Add Fibonacci
              Retracements
            </Tag>
            <Modal
              width="70%"
              visible={visible}
              title="Title"
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              footer={[
                <Button key="back" onClick={this.handleCancel}>
                  Return
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={loading}
                  onClick={this.handleOk}
                >
                  Submit
                </Button>,
              ]}
            >
              <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
              >
                {ti.map(indicator => {
                  return (
                    <SubMenu
                      key={indicator.id}
                      title={
                        <span>
                          <span>{indicator.name}</span>
                        </span>
                      }
                    >
                      <SubMenu
                        key={indicator.id + "-color"}
                        title={<Input readOnly value={this.state.color.hex} />}
                      >
                        <Menu.Item
                          key={indicator.id + "-alpha"}
                          className="color-menu-item"
                        >
                          <SketchPicker
                            style={{
                              height: "auto",
                              lineHeight: "10px",
                              alignSelf: "center",
                            }}
                            color={this.state.color.rgb}
                            onChangeComplete={this.handleChangeComplete}
                          />
                        </Menu.Item>
                      </SubMenu>

                      {!["bb", "rsi"].includes(indicator.id) ? (
                        <SubMenu
                          disabled
                          title={
                            <div style={{ display: "flex" }}>
                              <h5>Window</h5>
                              <InputNumber
                                style={{ marginLeft: "20px", flexGrow: "1" }}
                                defaultValue={20}
                                id={indicator.id + "-window"}
                              />
                            </div>
                          }
                        />
                      ) : null}
                    </SubMenu>
                  );
                })}
              </Menu>
            </Modal>
          </Row>
        ) : null}
        <Row>
          <Col>
            {modifier ? (
              <div className="main-chart">
                <Chart
                  enableFib={this.state.enableFib}
                  disableFib={this.disableFib}
                  data={compact(
                    map(kline[modifier], k => {
                      return {
                        date: k.openTime,
                        close: parseFloat(k.close),
                        open: parseFloat(k.open),
                        high: parseFloat(k.high),
                        low: parseFloat(k.low),
                        volume: parseFloat(k.volume),
                      };
                    })
                  )}
                  indicators={indicators}
                  color={"#ffffff"}
                />
              </div>
            ) : null}
          </Col>
        </Row>
      </Layout.Content>
    );
  }
}
