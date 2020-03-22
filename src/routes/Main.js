import React, { Component } from "react";
import { View, Vibration } from "react-native";
import Modal from "react-native-modal";
import Device from "react-native-device-detection";

import Board from "./Board";
import Header, { headerHeight } from "./Header";
import Menu from "./Menu";
import Purchase from "./Purchase";
import { HorizontalSeparator } from "./Separator";
import Bar from "./Bar";

// redux
import { connect } from "react-redux";

// lib
import { minesLogic, normalize } from "src/lib";

// config
import { params } from "src/config";

const Modal_ = React.memo(
  ({ visible, children }) => <Modal isVisible={visible}>{children}</Modal>,
  (prevProps, nextProps) => prevProps.visible === nextProps.visible,
);

const minMenuHeight = normalize(30);
export const minBarHeight = normalize(30);
const levelFactor = params.levelFactor;
const purchaseInterval = params.purchaseInterval;

export default
@connect(store => ({
  windowSize: store.general.windowSize,
  orientation: store.general.orientation,
  fieldSize: store.general.fieldSize,
  level: store.general.level,
  vibrate: store.general.vibrate,
  flavour: store.general.flavour,
  gameCounter: store.general.gameCounter,
  purchased: store.general.purchased,
  gameState: store.game.gameState,
  time: store.game.time,
  inputMode: store.game.inputMode,
  mineField: store.game.mineField,
  dims: store.game.dims,
}))
class Main extends Component {
  static navigationOptions = {
    header: null,
  };

  state = {
    counter: 0,
    requestedPurchase: false,
  };

  getNFields(fieldSize) {
    if (Device.isTablet) return 8 + fieldSize * 4;
    else return 5 + fieldSize * 2;
  }

  getAvailableSize = props => {
    const { windowSize, flavour } = props;
    // const nVerSeparators = flavour ? 3 : 2;
    const nVerSeparators = 2;
    // const nHorSeparators = flavour ? 2 : 0;
    let availableHeight =
      windowSize.height -
      nVerSeparators * HorizontalSeparator.separatorWidth -
      headerHeight -
      minBarHeight;
    if (flavour) availableHeight -= minMenuHeight;
    const availableWidth = windowSize.width; //- nHorSeparators * HorizontalSeparator.separatorWidth;
    return { availableHeight, availableWidth };
  };

  getDimensions = props => {
    const { windowSize, fieldSize, orientation } = props;
    let buttonSize, nFields1, nFields2;
    const { availableHeight, availableWidth } = this.getAvailableSize(props);

    if (orientation === "PORTRAIT") {
      nFields1 = this.getNFields(fieldSize);
      buttonSize = availableWidth / nFields1;
      nFields2 = Math.floor(availableHeight / buttonSize);
    } else {
      nFields2 = Math.ceil(
        (availableHeight / windowSize.height) * this.getNFields(fieldSize),
      );
      const buttonSizeTemp = availableHeight / nFields2;
      nFields1 = Math.ceil(availableWidth / buttonSizeTemp);
      buttonSize = availableWidth / nFields1;
    }

    return {
      buttonSize,
      dimensions: [nFields2, nFields1],
      delta: availableHeight - nFields2 * buttonSize,
    };
  };

  getBoardSize = () => {
    const { dimensions, buttonSize, delta } = this.getDimensions(this.props);
    return {
      boardWidth: dimensions[1] * buttonSize,
      boardHeight: dimensions[0] * buttonSize,
      delta,
    };
  };

  startTimer = () => {
    this.timerId = setInterval(
      () =>
        this.props.dispatch({
          type: "TIME_CHANGE",
          payload: this.props.time + 1,
        }),
      1000,
    );
  };

  stopTimer = () => clearInterval(this.timerId);

  clearTimer = () => {
    this.stopTimer();
    this.props.dispatch({
      type: "TIME_CHANGE",
      payload: 0,
    });
  };

  restartTimer = () => {
    this.clearTimer();
    this.startTimer();
  };

  initMines(props, mount = true) {
    const dims = this.getDimensions(props);
    const nMines = Math.round(
      levelFactor[props.level] * dims.dimensions[0] * dims.dimensions[1],
    );
    const mines = minesLogic.create({
      dimensions: dims.dimensions,
      mine_count: nMines,
      mines: mount ? props.mineField : null,
    });

    mines.onGameStateChange((state, oldState) => {
      if (state != oldState) {
        this.props.dispatch({
          type: "GAME_STATE_CHANGE",
          payload: state,
        });
        if (oldState == "NOT_STARTED" && state == "STARTED") {
          this.startTimer();
        }
        if (state == "WON" || state == "LOST") this.stopTimer();
        if (this.props.vibrate && state == "WON")
          Vibration.vibrate([0, 200, 100, 200, 100, 500]);
        if (this.props.vibrate && state == "LOST") Vibration.vibrate();
        if (state == "NOT_STARTED") {
          this.props.dispatch({
            type: "TIME_CHANGE",
            payload: 0,
          });
          this.stopTimer();
        }
      }
    });

    if (!mount) this.clearTimer();

    mines.onRemainingMineCountChange(mineCount =>
      props.dispatch({
        type: "MINE_COUNT_CHANGE",
        payload: mineCount,
      }),
    );

    props.dispatch({
      type: "SET_STATE",
      payload: {
        mineCount: mines.mine_count,
        dims,
      },
    });

    return mines;
  }

  constructor(props) {
    super(props);
    this.state.mines = this.initMines(props);
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (
      nextProps.fieldSize !== this.props.fieldSize ||
      nextProps.level !== this.props.level ||
      (nextProps.flavour !== this.props.flavour &&
        (nextProps.flavour == 0 || this.props.flavour == 0)) ||
      nextProps.windowSize.width !== this.props.windowSize.width ||
      nextProps.windowSize.height !== this.props.windowSize.height
    ) {
      this.setState({ mines: this.initMines(nextProps, false) });
    }
  }

  _close = () =>
    this.setState({
      counter: this.state.requestedPurchase
        ? this.state.counter
        : this.state.counter + 1,
      requestedPurchase: false,
    });

  render() {
    const { dims, flavour } = this.props;
    const modalVisible =
      this.state.requestedPurchase ||
      (!this.props.purchased &&
        this.props.gameCounter < params.adFactor * params.purchaseInterval &&
        (this.props.gameCounter + this.state.counter) % purchaseInterval === 0);
    const { boardWidth, boardHeight } = this.getBoardSize();
    return (
      <View>
        {flavour ? (
          <Bar height={minBarHeight + dims.delta * 0.3} flavour={flavour} />
        ) : null}
        <Menu
          height={dims.delta * (flavour ? 0.7 : 1) + minMenuHeight}
          purchase={() => this.setState({ requestedPurchase: true })}
        />
        <HorizontalSeparator />
        <Header mines={this.state.mines} clearTimer={this.clearTimer} />
        <HorizontalSeparator />
        <Board
          mines={this.state.mines}
          size={{ width: boardWidth, height: boardHeight }}
          flavour={flavour}
        />
        {/*flavour ? <HorizontalSeparator /> : null*/}
        <Modal_ visible={modalVisible}>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
            }}
          >
            <Purchase close={this._close} />
          </View>
        </Modal_>
      </View>
    );
  }
}
