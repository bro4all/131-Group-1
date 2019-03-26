import React from "react";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { fitWidth } from "react-stockcharts/lib/helper";
import {
  BarSeries,
  CandlestickSeries,
  LineSeries,
  AreaSeries,
  BollingerSeries,
  MACDSeries,
  RSISeries,
  StochasticSeries,
  StraightLine
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { ChartCanvas, Chart } from "react-stockcharts";
import { last } from "react-stockcharts/lib/utils";
import {
  wma,
  ema,
  sma,
  tma,
  bollingerBand,
  macd,
  rsi,
  atr,
  stochasticOscillator
} from "react-stockcharts/lib/indicator";
import {
  OHLCTooltip,
  MovingAverageTooltip,
  BollingerBandTooltip,
  MACDTooltip,
  RSITooltip,
  SingleValueTooltip,
  StochasticTooltip,
  HoverTooltip
} from "react-stockcharts/lib/tooltip";
import {
  EdgeIndicator,
  CrossHairCursor,
  MouseCoordinateX,
  MouseCoordinateY,
  CurrentCoordinate
} from "react-stockcharts/lib/coordinates";
import {
	saveInteractiveNodes,
	getInteractiveNodes,
} from "./interactiveutils";
import { FibonacciRetracement, DrawingObjectSelector } from "react-stockcharts/lib/interactive";

import _ from 'lodash'

class MainChart extends React.Component {
  constructor(props) {
		super(props);
		this.onKeyPress = this.onKeyPress.bind(this);
		this.onFibComplete1 = this.onFibComplete1.bind(this);
		this.onFibComplete3 = this.onFibComplete3.bind(this);
		this.handleSelection = this.handleSelection.bind(this);

		this.saveInteractiveNodes = saveInteractiveNodes.bind(this);
		this.getInteractiveNodes = getInteractiveNodes.bind(this);

		this.saveCanvasNode = this.saveCanvasNode.bind(this);
		this.state = {
			retracements_1: [],
			retracements_3: [],
		};
	}
	saveCanvasNode(node) {
		this.canvasNode = node;
  }
  componentDidMount() {
		document.addEventListener("keyup", this.onKeyPress);
	}
	componentWillUnmount() {
		document.removeEventListener("keyup", this.onKeyPress);
	}
	handleSelection(interactives) {
		const state = toObject(interactives, each => {
			return [
				`retracements_${each.chartId}`,
				each.objects,
			];
		});
		this.setState(state);
	}
	onFibComplete1(retracements_1) {
    this.props.disableFib()
		this.setState({
			retracements_1
		});
	}
	onFibComplete3(retracements_3) {
    this.props.disableFib()
		this.setState({
			retracements_3
		});
	}
	onKeyPress(e) {
		const keyCode = e.which;
		switch (keyCode) {
		case 46: { // DEL
			const retracements_1 = this.state.retracements_1
				.filter(each => !each.selected);
			const retracements_3 = this.state.retracements_3
				.filter(each => !each.selected);

			this.canvasNode.cancelDrag();
			this.setState({
				retracements_1,
				retracements_3,
			});
			break;
		}
		case 27: { // ESC
			this.canvasNode.cancelDrag();
			this.node_1.terminate();
			this.node_3.terminate();
			this.props.disableFib()
			break;
		}
		}
	}
  shouldComponentUpdate(nextProps) {
    return true;
  }
  render() {
    const bbStroke = {
      top: "#8b572a",
      middle: "#8b572a",
      bottom: "#8b572a"
    };
    let ma = [];
    let bb = [];
    let rsiCalc = [];
    const bbFill = 'rgba(219, 189, 39, 0.05)';
    const { data: initialData, width, indicators, color } = this.props;
    const type = "hybrid";
    const ratio = window.devicePixelRatio;
    let calculatedData = initialData
    indicators.length != 0 ? indicators.map(k => {
      switch (k.type) {
        case 'wma':
          k.i = wma()
            .options({ windowSize: parseInt(k.window) })
            .merge((d, c) => {
              d[`${k.type}${k.window}`] = c;
            })
            .accessor(d => d[`${k.type}${k.window}`])
            .stroke(k.color);

          ma.push(k)
          break;
        case 'tma':
          k.i = tma()
            .options({ windowSize: parseInt(k.window) })
            .merge((d, c) => {
              d[`${k.type}${k.window}`] = c;
            })
            .accessor(d => d[`${k.type}${k.window}`])
            .stroke(k.color);

          ma.push(k)
          break;
        case 'sma':
          k.i = sma()
            .options({ windowSize: parseInt(k.window) })
            .merge((d, c) => {
              d[`${k.type}${k.window}`] = c;
            })
            .accessor(d => d[`${k.type}${k.window}`])
            .stroke(k.color);

          ma.push(k)
          break;
        case 'ema':
          k.i = ema()
            .options({ windowSize: parseInt(k.window) })
            .merge((d, c) => {
              d[`${k.type}${k.window}`] = c;
            })
            .accessor(d => d[`${k.type}${k.window}`])
            .stroke(k.color);;

          ma.push(k)
          break;
        case 'bb':
          k.i = bollingerBand()
            .merge((d, c) => {
              d.bb = c;
            })
            .accessor(d => d.bb)

          bb.push(k)
          break;
        case 'rsi':
          k.i = rsi()
            .options({ windowSize: 14 })
            .merge((d, c) => {
              d.rsi = c;
            })
            .accessor(d => d.rsi);
          rsiCalc.push(k)
          break;
      }
      calculatedData = k.i(calculatedData);
    }) : null

    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(new Date(d.date).toISOString())
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[width > 1000 ? Math.max(0, data.length - 150) : width > 768 ? Math.max(0, data.length - 100) : width > 400 ? Math.max(0, data.length - 30) : Math.max(0, data.length - 10)]);
    const xExtents = [start, end];
    return (
      <ChartCanvas
      ref={this.saveCanvasNode}
        height={rsiCalc.length > 0 ? 725 : 600}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 10, bottom: 30 }}
        type={type}
        seriesName="Chart"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          yExtents={d => [d.high, d.low].concat(_.map(indicators, k => {
            return k.i.accessor();
          }))}
          padding={{ bottom: 300, top: 50 }}
          height={560}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            stroke={color}
            tickStroke={color}
            ticks={width > 400 ? 10 : 0}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            stroke={color}
            tickStroke={color}
          />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <CandlestickSeries
            widthRatio={0.5}
            fill={"transparent"}
            wickStroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
            stroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          {
            indicators.map(k => k.type != 'bb' ? k.type == 'rsi' ? null : (
              <LineSeries yAccessor={k.i.accessor()} stroke={k.i.stroke()} />
            ) : (<BollingerSeries
              yAccessor={k.i.accessor()}
              stroke={bbStroke}
              fill={bbFill}
            />))
          }

          <OHLCTooltip
            origin={[-30, 0]}
            textFill={color}
            labelFill={"#9ec1ff"}
          />
          <MovingAverageTooltip
            origin={[-38, 15]}
            options={
              _.map(ma, k => {
                return {
                  yAccessor: k.i.accessor(),
                  type: k.type,
                  stroke: k.i.stroke(),
                  windowSize: k.i.options().windowSize,
                  echo: "some echo here"
                }
              })}
            textFill={color}
            labelFill={"#9ec1ff"}
          />
          	<FibonacciRetracement
						ref={this.saveInteractiveNodes("FibonacciRetracement", 1)}
						enabled={this.props.enableFib}
						retracements={this.state.retracements_1}
						onComplete={this.onFibComplete1}
            appearance={{
              stroke: "#DDDDDD",
		strokeWidth: 1,
		strokeOpacity: 1,
		fontFamily: "Souce Code Pro, monospace",
		fontSize: 11,
		fontFill: "#FFFFFF",
		edgeStroke: "#1187ee",
		edgeFill: "#FFFFFF",
		nsEdgeFill: "#1187ee",
		edgeStrokeWidth: 1,
		r: 3,
            }}
					/>
          {bb.length > 0 ? <BollingerBandTooltip
            origin={[-38, 60]}
            yAccessor={d => d.bb}
            options={bb[0].i.options()}
            textFill={color}
            labelFill={"#9ec1ff"}
          /> : null}
        </Chart>
        <Chart
          id={2}
          yExtents={[d => d.volume]}
          height={300}
          origin={(w, h) => rsiCalc.length > 0 ? [0, h - 425] : [0, h - 300]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".3s")}
            stroke={color}
            tickStroke={color}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d - %H:%M")}
          />
          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />

          <BarSeries
            yAccessor={d => d.volume}
            stroke={true}
            opacity={0}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />

        </Chart>
        {rsiCalc.length > 0 ? (<Chart
          id={3}
          yExtents={[0, 100]}
          height={125}
          origin={(w, h) => [0, h - 125]}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            invert
            stroke={color}
            tickStroke={color}
          />
          <YAxis
            axisAt="right"
            orient="right"
            tickValues={[30, 50, 70]}
            invert
            stroke={color}
            tickStroke={color}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <RSISeries
            yAccessor={d => d.rsi}
            stroke={{
              line: color,
              middle: color,
              top: color,
              bottom: color
            }}
          />

          <RSITooltip
            origin={[-38, 15]}
            yAccessor={d => d.rsi}
            options={rsiCalc[0].i.options()}
            textFill={color}
            labelFill={"#9ec1ff"}
          />
        </Chart>) : null}
        <CrossHairCursor snapX={true} stroke={"#999999"} />
      </ChartCanvas>
    )
  }
}


class CandleChartWithRsi extends React.Component {
  render() {
    const ema26 = ema()
      .id(0)
      .options({ windowSize: 26 })
      .merge((d, c) => {
        d.ema26 = c;
      })
      .accessor(d => d.ema26);

    const ema12 = ema()
      .id(1)
      .options({ windowSize: 12 })
      .merge((d, c) => {
        d.ema12 = c;
      })
      .accessor(d => d.ema12);

    const smaVolume50 = sma()
      .id(3)
      .options({ windowSize: 50, sourcePath: "volume" })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor(d => d.smaVolume50);

    const rsiCalculator = rsi()
      .options({ windowSize: 14 })
      .merge((d, c) => {
        d.rsi = c;
      })
      .accessor(d => d.rsi);

    const atr14 = atr()
      .options({ windowSize: 14 })
      .merge((d, c) => {
        d.atr14 = c;
      })
      .accessor(d => d.atr14);

    const { data: initialData, width } = this.props;
    const type = "hybrid";
    const ratio = 1;
    const calculatedData = ema26(
      ema12(smaVolume50(rsiCalculator(atr14(initialData))))
    );
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(d.date)
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];

    return (
      <ChartCanvas
        height={600}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          height={300}
          yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
          padding={{ bottom: 150, top: 45 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <CandlestickSeries
            widthRatio={0.5}
            fill={"transparent"}
            wickStroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
            stroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />

          <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fill={ema26.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema12.accessor()}
            fill={ema12.stroke()}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />

          <OHLCTooltip
            origin={[-40, 0]}
            textFill={"#eeeeee"}
            labelFill={"#9ec1ff"}
          />

          <MovingAverageTooltip
            origin={[-38, 15]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: "EMA",
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize
              },
              {
                yAccessor: ema12.accessor(),
                type: "EMA",
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize
              }
            ]}
            textFill={"#eeeeee"}
            labelFill={"#9ec1ff"}
          />
        </Chart>
        <Chart
          id={2}
          height={150}
          yExtents={[d => d.volume, smaVolume50.accessor()]}
          origin={(w, h) => [0, h - 400]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".0s")}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />

          <BarSeries
            yAccessor={d => d.volume}
            stroke={true}
            opacity={0}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <AreaSeries
            yAccessor={smaVolume50.accessor()}
            stroke={smaVolume50.stroke()}
            fill={smaVolume50.fill()}
          />
        </Chart>
        <Chart
          id={3}
          yExtents={[0, 100]}
          height={125}
          origin={(w, h) => [0, h - 250]}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            tickValues={[30, 50, 70]}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <RSISeries
            yAccessor={d => d.rsi}
            stroke={{
              line: "#eeeeee",
              middle: "#eeeeee",
              top: "#eeeeee",
              bottom: "#eeeeee"
            }}
          />

          <RSITooltip
            origin={[-38, 15]}
            yAccessor={d => d.rsi}
            options={rsiCalculator.options()}
            textFill={"#eeeeee"}
            labelFill={"#9ec1ff"}
          />
        </Chart>
        <Chart
          id={8}
          yExtents={atr14.accessor()}
          height={125}
          origin={(w, h) => [0, h - 125]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={2}
            invert
            stroke={"#eeeeee"}
            tickStroke={"#eeeeee"}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <LineSeries yAccessor={atr14.accessor()} stroke={atr14.stroke()} />
          <SingleValueTooltip
            yAccessor={atr14.accessor()}
            yLabel={`ATR (${atr14.options().windowSize})`}
            yDisplayFormat={format(".2f")}
            textFill={"#eeeeee"}
            labelFill={"#9ec1ff"}
            valueFill={"#eeeeee"}
            labelStroke="#9ec1ff"
            origin={[-40, 15]}
          />
        </Chart>
        <CrossHairCursor snapX={true} />
      </ChartCanvas>
    );
  }
}
class CandleChartWithBb extends React.Component {
  render() {
    const bbStroke = {
      top: "#964B00",
      middle: "#fff000",
      bottom: "#964B00"
    };

    const bbFill = "#4682B4";
    var ratio = 1,
      type = "hybrid";
    const { data: initialData, width } = this.props;
    const ema20 = ema()
      .options({
        windowSize: 20, // optional will default to 10
        sourcePath: "close" // optional will default to close as the source
      })
      .skipUndefined(true) // defaults to true
      .merge((d, c) => {
        d.ema20 = c;
      }) // Required, if not provided, log a error
      .accessor(d => d.ema20) // Required, if not provided, log an error during calculation
      .stroke("blue"); // Optional

    const sma20 = sma()
      .options({ windowSize: 20 })
      .merge((d, c) => {
        d.sma20 = c;
      })
      .accessor(d => d.sma20);

    const ema50 = ema()
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor(d => d.ema50);

    const smaVolume50 = sma()
      .options({ windowSize: 20, sourcePath: "volume" })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor(d => d.smaVolume50)
      .stroke("#4682B4")
      .fill("#4682B4");

    const bb = bollingerBand()
      .merge((d, c) => {
        d.bb = c;
      })
      .accessor(d => d.bb);

    const calculatedData = ema20(sma20(ema50(smaVolume50(bb(initialData)))));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(d.date)
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];
    return (
      <div>
        {typeof this.props.data[0] !== "undefined" ? (
          <ChartCanvas
            height={600}
            width={width}
            ratio={ratio}
            margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
            type={type}
            seriesName="MSFT"
            data={data}
            xScale={xScale}
            xAccessor={xAccessor}
            displayXAccessor={displayXAccessor}
            xExtents={xExtents}
          >
            <Chart
              id={1}
              yExtents={[
                d => [d.high, d.low],
                sma20.accessor(),
                ema20.accessor(),
                ema50.accessor(),
                bb.accessor()
              ]}
              padding={{ top: 40, bottom: 150 }}
              onContextMenu={(...rest) => {
              }}
            >
              <XAxis
                axisAt="bottom"
                orient="bottom"
                stroke={"#eeeeee"}
                tickStroke={"#eeeeee"}
              />
              <YAxis
                axisAt="right"
                orient="right"
                ticks={5}
                onDoubleClick={(...rest) => {

                }}
                onContextMenu={(...rest) => {

                }}
                stroke={"#eeeeee"}
                tickStroke={"#eeeeee"}
              />

              <MouseCoordinateX
                at="bottom"
                orient="bottom"
                displayFormat={timeFormat("%Y-%m-%d")}
              />
              <MouseCoordinateY
                at="right"
                orient="right"
                displayFormat={format(".2f")}
              />

              <CandlestickSeries
                widthRatio={0.5}
                fill={"transparent"}
                wickStroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
                stroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
              />
              <BollingerSeries
                yAccessor={d => d.bb}
                stroke={bbStroke}
                fill={bbFill}
              />

              <LineSeries
                yAccessor={sma20.accessor()}
                stroke={sma20.stroke()}
              />
              <LineSeries
                yAccessor={ema20.accessor()}
                stroke={ema20.stroke()}
              />
              <LineSeries
                yAccessor={ema50.accessor()}
                stroke={ema50.stroke()}
              />
              <CurrentCoordinate
                yAccessor={sma20.accessor()}
                fill={sma20.stroke()}
              />
              <CurrentCoordinate
                yAccessor={ema20.accessor()}
                fill={ema20.stroke()}
              />
              <CurrentCoordinate
                yAccessor={ema50.accessor()}
                fill={ema50.stroke()}
              />

              <OHLCTooltip
                origin={[-40, 0]}
                textFill={"#333333"}
                labelFill={"#9ec1ff"}
              />

              <MovingAverageTooltip
                origin={[-38, 15]}
                options={[
                  {
                    yAccessor: sma20.accessor(),
                    type: sma20.type(),
                    stroke: sma20.stroke(),
                    windowSize: sma20.options().windowSize
                  },
                  {
                    yAccessor: ema20.accessor(),
                    type: ema20.type(),
                    stroke: ema20.stroke(),
                    windowSize: ema20.options().windowSize
                  },
                  {
                    yAccessor: ema50.accessor(),
                    type: ema50.type(),
                    stroke: ema50.stroke(),
                    windowSize: ema50.options().windowSize
                  }
                ]}
                textFill={"#333333"}
                labelFill={"#9ec1ff"}
              />
              <BollingerBandTooltip
                origin={[-38, 60]}
                yAccessor={d => d.bb}
                options={bb.options()}
                textFill={"#333333"}
                labelFill={"#9ec1ff"}
              />
            </Chart>
            <Chart
              id={2}
              yExtents={[d => d.volume, smaVolume50.accessor()]}
              height={150}
              origin={(w, h) => [0, h - 150]}
            >
              <YAxis
                axisAt="left"
                orient="left"
                ticks={5}
                tickFormat={format(".2s")}
                stroke={"#333333"}
                tickStroke={"#333333"}
              />

              <MouseCoordinateY
                at="left"
                orient="left"
                displayFormat={format(".4s")}
              />

              <BarSeries
                yAccessor={d => d.volume}
                stroke={true}
                opacity={0}
                fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
              />
              <AreaSeries
                yAccessor={smaVolume50.accessor()}
                stroke={smaVolume50.stroke()}
                fill={smaVolume50.fill()}
              />
              <CurrentCoordinate
                yAccessor={smaVolume50.accessor()}
                fill={smaVolume50.stroke()}
              />
              <CurrentCoordinate yAccessor={d => d.volume} fill="#9B0A47" />
            </Chart>
            <CrossHairCursor snapX={true} />
          </ChartCanvas>
        ) : null}
      </div>
    );
  }
}
class CandleChartWithMACD extends React.Component {
  render() {
    const mouseEdgeAppearance = {
      textFill: "#333333",
      stroke: "#05233B",
      strokeOpacity: 1,
      strokeWidth: 3,
      arrowWidth: 5,
      fill: "#BCDEFA"
    };
    const macdAppearance = {
      stroke: {
        macd: "#ff2133",
        signal: "#00F300"
      },
      fill: {
        divergence: "#4682B4"
      }
    };
    const { data: initialData, width } = this.props;
    const type = "hybrid";
    const ratio = 1;
    const ema26 = ema()
      .id(0)
      .options({ windowSize: 26 })
      .merge((d, c) => {
        d.ema26 = c;
      })
      .accessor(d => d.ema26);

    const ema12 = ema()
      .id(1)
      .options({ windowSize: 12 })
      .merge((d, c) => {
        d.ema12 = c;
      })
      .accessor(d => d.ema12);

    const macdCalculator = macd()
      .options({
        fast: 12,
        slow: 26,
        signal: 9
      })
      .merge((d, c) => {
        d.macd = c;
      })
      .accessor(d => d.macd);

    const smaVolume50 = sma()
      .id(3)
      .options({
        windowSize: 50,
        sourcePath: "volume"
      })
      .merge((d, c) => {
        d.smaVolume50 = c;
      })
      .accessor(d => d.smaVolume50);

    const calculatedData = smaVolume50(
      macdCalculator(ema12(ema26(initialData)))
    );
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(d.date)
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    return (
      <ChartCanvas
        height={600}
        width={width}
        ratio={ratio}
        margin={{ left: 70, right: 70, top: 20, bottom: 30 }}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
      >
        <Chart
          id={1}
          height={400}
          yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
          padding={{ top: 45, bottom: 150 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            stroke={"#333333"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
            {...mouseEdgeAppearance}
          />

          <CandlestickSeries
            widthRatio={0.5}
            fill={"transparent"}
            wickStroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
            stroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()} />
          <LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()} />

          <CurrentCoordinate
            yAccessor={ema26.accessor()}
            fill={ema26.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema12.accessor()}
            fill={ema12.stroke()}
          />

          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#A2F5BF" : "#F9ACAA")}
            stroke={d => (d.close > d.open ? "#0B4228" : "#6A1B19")}
            textFill={d => (d.close > d.open ? "#0B4228" : "#420806")}
            strokeOpacity={1}
            strokeWidth={3}
            arrowWidth={2}
          />

          <OHLCTooltip
            origin={[-40, 0]}
            textFill={"#333333"}
            labelFill={"#9ec1ff"}
          />
          <MovingAverageTooltip
            origin={[-38, 15]}
            options={[
              {
                yAccessor: ema26.accessor(),
                type: "EMA",
                stroke: ema26.stroke(),
                windowSize: ema26.options().windowSize
              },
              {
                yAccessor: ema12.accessor(),
                type: "EMA",
                stroke: ema12.stroke(),
                windowSize: ema12.options().windowSize
              }
            ]}
            textFill={"#333333"}
            labelFill={"#9ec1ff"}
          />
        </Chart>
        <Chart
          id={2}
          height={150}
          yExtents={[d => d.volume, smaVolume50.accessor()]}
          origin={(w, h) => [0, h - 300]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
            {...mouseEdgeAppearance}
          />

          <BarSeries
            yAccessor={d => d.volume}
            stroke={true}
            opacity={0}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <AreaSeries
            yAccessor={smaVolume50.accessor()}
            stroke={smaVolume50.stroke()}
            fill={smaVolume50.fill()}
          />
        </Chart>
        <Chart
          id={3}
          height={150}
          yExtents={macdCalculator.accessor()}
          origin={(w, h) => [0, h - 150]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            stroke={"#333333"}
            ticks={5}
            tickStroke={"#333333"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            ticks={2}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
            rectRadius={5}
            {...mouseEdgeAppearance}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
            {...mouseEdgeAppearance}
          />

          <MACDSeries yAccessor={d => d.macd} {...macdAppearance} />
          <MACDTooltip
            origin={[-38, 15]}
            yAccessor={d => d.macd}
            options={macdCalculator.options()}
            appearance={macdAppearance}
            textFill={"#333333"}
            labelFill={"#9ec1ff"}
          />
        </Chart>
        <CrossHairCursor snapX={true} stroke={"#DDDDDD"} />
      </ChartCanvas>
    );
  }
}
class CandleChartWithFullStochasticsIndicator extends React.Component {
  render() {
    const stoAppearance = {
      stroke: Object.assign({}, StochasticSeries.defaultProps.stroke)
    };
    const height = 750;
    const { data: initialData, width } = this.props;
    const type = "hybrid",
      ratio = 1;
    const margin = { left: 70, right: 70, top: 20, bottom: 30 };

    const gridHeight = height - margin.top - margin.bottom;
    const gridWidth = width - margin.left - margin.right;

    const showGrid = true;
    const yGrid = showGrid
      ? { innerTickSize: -1 * gridWidth, tickStrokeOpacity: 0.1 }
      : {};
    const xGrid = showGrid
      ? { innerTickSize: -1 * gridHeight, tickStrokeOpacity: 0.1 }
      : {};

    const ema20 = ema()
      .id(0)
      .options({ windowSize: 20 })
      .merge((d, c) => {
        d.ema20 = c;
      })
      .accessor(d => d.ema20);

    const ema50 = ema()
      .id(2)
      .options({ windowSize: 50 })
      .merge((d, c) => {
        d.ema50 = c;
      })
      .accessor(d => d.ema50);

    const slowSTO = stochasticOscillator()
      .options({ windowSize: 14, kWindowSize: 3 })
      .merge((d, c) => {
        d.slowSTO = c;
      })
      .accessor(d => d.slowSTO);
    const fastSTO = stochasticOscillator()
      .options({ windowSize: 14, kWindowSize: 1 })
      .merge((d, c) => {
        d.fastSTO = c;
      })
      .accessor(d => d.fastSTO);
    const fullSTO = stochasticOscillator()
      .options({ windowSize: 14, kWindowSize: 3, dWindowSize: 4 })
      .merge((d, c) => {
        d.fullSTO = c;
      })
      .accessor(d => d.fullSTO);

    const calculatedData = ema20(ema50(slowSTO(fastSTO(fullSTO(initialData)))));
    const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
      d => new Date(d.date)
    );
    const { data, xScale, xAccessor, displayXAccessor } = xScaleProvider(
      calculatedData
    );

    const start = xAccessor(last(data));
    const end = xAccessor(data[Math.max(0, data.length - 150)]);
    const xExtents = [start, end];
    return (
      <ChartCanvas
        height={750}
        width={width}
        ratio={ratio}
        margin={margin}
        type={type}
        seriesName="MSFT"
        data={data}
        xScale={xScale}
        xAccessor={xAccessor}
        displayXAccessor={displayXAccessor}
        xExtents={xExtents}
      >
        <Chart
          id={1}
          height={325}
          yExtents={d => [d.high, d.low]}
          padding={{ top: 45, bottom: 150 }}
        >
          <YAxis
            axisAt="right"
            orient="right"
            ticks={5}
            {...yGrid}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />
          <CandlestickSeries
            widthRatio={0.5}
            fill={"transparent"}
            wickStroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
            stroke={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <LineSeries yAccessor={ema20.accessor()} stroke={ema20.stroke()} />
          <LineSeries yAccessor={ema50.accessor()} stroke={ema50.stroke()} />
          <CurrentCoordinate
            yAccessor={ema20.accessor()}
            fill={ema20.stroke()}
          />
          <CurrentCoordinate
            yAccessor={ema50.accessor()}
            fill={ema50.stroke()}
          />
          <EdgeIndicator
            itemType="last"
            orient="right"
            edgeAt="right"
            yAccessor={d => d.close}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
          <StraightLine type="vertical" xValue={608} />;
          <StraightLine type="vertical" xValue={558} strokeDasharray="Dot" />;
          <StraightLine
            type="vertical"
            xValue={578}
            strokeDasharray="LongDash"
          />;
          <OHLCTooltip
            origin={[-40, -10]}
            textFill={"#333333"}
            labelFill={"#9ec1ff"}
          />
          <MovingAverageTooltip
            origin={[-38, 5]}
            options={[
              {
                yAccessor: ema20.accessor(),
                type: ema20.type(),
                stroke: ema20.stroke(),
                windowSize: ema20.options().windowSize
              },
              {
                yAccessor: ema50.accessor(),
                type: ema50.type(),
                stroke: ema50.stroke(),
                windowSize: ema50.options().windowSize
              }
            ]}
            textFill={"#333333"}
            labelFill={"#9ec1ff"}
          />
        </Chart>
        <Chart
          id={2}
          yExtents={d => d.volume}
          height={100}
          origin={(w, h) => [0, h - 475]}
        >
          <YAxis
            axisAt="left"
            orient="left"
            ticks={5}
            tickFormat={format(".2s")}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />

          <MouseCoordinateY
            at="left"
            orient="left"
            displayFormat={format(".4s")}
          />

          <BarSeries
            yAccessor={d => d.volume}
            stroke={true}
            opacity={0}
            fill={d => (d.close > d.open ? "#42ff8a" : "#ff2133")}
          />
        </Chart>
        <Chart
          id={3}
          yExtents={[0, 100]}
          height={125}
          origin={(w, h) => [0, h - 375]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            stroke={"#333333"}
            tickStroke={"#333333"}
            tickValues={[20, 50, 80]}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <StochasticSeries yAccessor={d => d.fastSTO} {...stoAppearance} />
          <StochasticTooltip
            origin={[-38, 15]}
            yAccessor={d => d.slowSTO}
            options={slowSTO.options()}
            appearance={stoAppearance}
            label="Slow STO"
          />
        </Chart>
        <Chart
          id={4}
          yExtents={[0, 100]}
          height={125}
          origin={(w, h) => [0, h - 250]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            showTicks={false}
            outerTickSize={0}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            stroke={"#333333"}
            tickStroke={"#333333"}
            tickValues={[20, 50, 80]}
          />

          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />

          <StochasticSeries yAccessor={d => d.slowSTO} {...stoAppearance} />

          <StochasticTooltip
            origin={[-38, 15]}
            yAccessor={d => d.fastSTO}
            options={fastSTO.options()}
            appearance={stoAppearance}
            label="Fast STO"
          />
        </Chart>
        <Chart
          id={5}
          yExtents={[0, 100]}
          height={125}
          origin={(w, h) => [0, h - 125]}
          padding={{ top: 10, bottom: 10 }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            {...xGrid}
            stroke={"#333333"}
            tickStroke={"#333333"}
          />
          <YAxis
            axisAt="right"
            orient="right"
            stroke={"#333333"}
            tickStroke={"#333333"}
            tickValues={[20, 50, 80]}
          />

          <MouseCoordinateX
            at="bottom"
            orient="bottom"
            displayFormat={timeFormat("%Y-%m-%d")}
          />
          <MouseCoordinateY
            at="right"
            orient="right"
            displayFormat={format(".2f")}
          />
          <StochasticSeries yAccessor={d => d.fullSTO} {...stoAppearance} />

          <StochasticTooltip
            origin={[-38, 15]}
            yAccessor={d => d.fullSTO}
            options={fullSTO.options()}
            appearance={stoAppearance}
            label="Full STO"
          />
        </Chart>
        <CrossHairCursor snapX={true} />
      </ChartCanvas>
    );
  }
}

CandleChartWithFullStochasticsIndicator = fitWidth(
  CandleChartWithFullStochasticsIndicator
);
CandleChartWithRsi = fitWidth(CandleChartWithRsi);
CandleChartWithBb = fitWidth(CandleChartWithBb);
CandleChartWithMACD = fitWidth(CandleChartWithMACD);
MainChart = fitWidth(MainChart);

export {
  MainChart,
  CandleChartWithRsi,
  CandleChartWithBb,
  CandleChartWithMACD,
  CandleChartWithFullStochasticsIndicator
};