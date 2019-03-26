import React, { Component } from "react";
import NumberInfo from "ant-design-pro/lib/NumberInfo";
import { Row, Col } from "antd";
import numeral from "numeral";

class Stats extends Component {
  render() {
    return (
      <Row
        style={{
          padding: "60px 0",
          background: "#222",
          margin: "60px 0"
        }}
        gutter={16}
        type="flex"
        justify="space-around"
      >
        <Col>
          <NumberInfo
            subTitle={<span>Total number of accounts</span>}
            total={numeral(200000).format("0,0")}
            status="up"
            subTotal={17.1}
          />
        </Col>
        <Col>
          <NumberInfo
            subTitle={<span>Users</span>}
            total={numeral(30452).format("0,0")}
            status="up"
            subTotal={3.5}
          />
        </Col>
        <Col>
          <NumberInfo
            subTitle={<span>Transfers Completed</span>}
            total={numeral(12321).format("0,0")}
            status="up"
            subTotal={17.1}
          />
        </Col>
        <Col>
          <NumberInfo
            subTitle={<span>Total Volume</span>}
            total={"$0.01"}
            status="down"
            subTotal={15.1}
          />
        </Col>
        <Col>
          <NumberInfo
            subTitle={<span>API Access</span>}
            total={numeral(12321).format("0,0")}
            status="up"
            subTotal={17.1}
          />
        </Col>
      </Row>
    );
  }
}

export default Stats;

/* <article className='pa3 pa5-ns tc' data-name='slab-stat'>

        <dl className='dib mr5'>
          <dd className='f6 f5-ns b ml0'>Signals T222oday</dd>
          <dd className='f3 f2-ns b ml0'>1,024</dd>
        </dl>
        <dl className='dib mr5'>
          <dd className='f6 f5-ns b ml0'>Users</dd>
          <dd className='f3 f2-ns b ml0'>30,000</dd>
        </dl>
        <dl className='dib mr5'>
          <dd className='f6 f5-ns b ml0'>Trades Completed</dd>
          <dd className='f3 f2-ns b ml0'>3.5k</dd>
        </dl>
        <dl className='dib mr5'>
          <dd className='f6 f5-ns b ml0'>Total Volume</dd>
          <dd className='f3 f2-ns b ml0'>4,000 BTC</dd>
        </dl>
        <dl className='dib mr5'>
          <dd className='f6 f5-ns b ml0'>Pairs covered</dd>
          <dd className='f3 f2-ns b ml0'>350</dd>
        </dl>
        <dl className='dib'>
          <dd className='f6 f5-ns b ml0'>API Access</dd>
          <dd className='f3 f2-ns b ml0'>Yes</dd>
        </dl>
      </article> */
