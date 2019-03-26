import * as React from 'react'
import { Row, Col } from 'antd'

class Features extends React.Component {
  render () {
    return (
      <div
        style={{
          padding: '30px 20px'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <h2 className='f5 f4-ns fw6 mb0'>Reusable</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Clear documentation helps create a shared understanding of design
              patterns amongst your team. This helps promote reuse and reduces
              the amount of redundancy in a codebase.
            </p>
          </Col>
          <Col span={12}>
            <h2 className='f5 f4-ns fw6 mb0'>Telegram Alerts</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Choose from over 49 indicators, twitter activity coupled with
              realtime market data to create telegram alerts!
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <h2 className='f5 f4-ns fw6 mb0'>Portfolio Trakcer</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Keep a check on your portfolio, track orders and analyse your
              trading activity.
            </p>
          </Col>
          <Col span={12}>
            <h2 className='f5 f4-ns  fw6 mb0'>Backtesting Engine</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Test your trading strategies and assess profitability and returns.
              We cover Bittrex, Binance, Poloniex, Coinbase and Kraken.
            </p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <h2 className='f5 f4-ns fw6 mb0'>Trade Ideas</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Get alerts based on market movements for potential trade setups.
            </p>
          </Col>
          <Col span={12}>
            <h2 className='f5 f4-ns  fw6 mb0'>Order Flow</h2>
            <p className='f6 f5-ns measure lh-copy mt0'>
              Analyse buying and selling pressure, market microstructure and
              affect on position size
            </p>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Features
/*
 <div className="features">

<div className="tl bt b--black-10 pa3 pa5-ns bg-lightest-blue navy code" id="principles">
            <div className="mw9 center">
            <h3 className="f1 center tc">Features</h3>
              <section className="lh-copy">
                <div className="cf">
                  <article className="fl pv2 w-100 w-third-l pr4-l">

                  </article>
                  <article className="pv2 fl w-100 w-third-l ph3-l">

                  </article>
                  <article className="pv2 fl w-100 w-third-l pl4-l">

                  </article>
</div>
<div className="cf w-100">
                  <article className="pv2 fl w-100 w-third-l pl0 pr4-l">

                  </article>
                  <article className="pv2 fl w-100 w-third-l ph3-l">

                  </article>
                  <article className="pv2 fl w-100 w-third-l pl4-l">

                  </article>
                </div>
              </section>
            </div>
          </div>
        </div>  */
