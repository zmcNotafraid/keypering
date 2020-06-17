import React from "react";
import { Button, Card, Flex, Icon, List, Modal, NavBar, WhiteSpace, WingBlank } from "antd-mobile";
import { Bytes, Output, RawTransaction, Script, scriptToAddress } from "@keyper/specs";
import { withRouter } from "react-router";
import styles from "./transaction_request.module.scss";
import Address from "../../widgets/address";
import Balance from "../../widgets/balance";
import { sendAck } from "../../services/messaging";
import Storage from "../../services/storage";
import { WalletManager } from "../../services/wallet";

interface Cell {
  capacity: string;
  lock: Script;
  type?: Script | null;
  data: Bytes;
}

interface TransactionRequestParams {
  id: any;
  token: string;
  tx: RawTransaction;
  requestFrom: string;
  inputCells: Cell[];
  meta: string;
  target: string;
  config: any;
}

const InputOutput = ({ capacity, lock, type, data }: Cell) => {
  const address = scriptToAddress(lock);
  let algorithm;
  if (lock.codeHash === "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8") {
    algorithm = "secp256k1";
  } else if (lock.codeHash === "0x390e1c7cb59fbd5cf9bfb9370acb0d2bbbbbcf4136c90b2f3ea5277b4c13b540") {
    algorithm = "anypay";
  } else {
    algorithm = "unknown";
  }

  return (
    <div>
      <List.Item
        multipleLine
        extra={
          <div>
            <Balance value={capacity} />
            CKB
          </div>
        }
      >
        <Address className={styles.address} value={address} />
        <WhiteSpace />
        <Button size="small" type={(type && "primary") || undefined} inline>
          type
        </Button>
        <Button size="small" type={(data !== "0x" && "primary") || undefined} inline>
          data
        </Button>
        <Button size="small" disabled inline>
          {algorithm}
        </Button>
      </List.Item>
    </div>
  );
};

class TransactionRequestPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { request } = Storage.getStorage();
    this.setState({
      request,
    });
  }

  handleDecline = () => {
    const { request } = this.state;
    const { history } = this.props;
    const { token: wsToken, data } = request;
    const { id } = data;
    sendAck(wsToken, {
      id,
      jsonrpc: "2.0",
      error: {
        code: 1,
        message: "declined",
      },
    });
    history.push("/");
  };

  handleApprove = async () => {
    const { request } = this.state;
    const { history } = this.props;
    const { token: wsToken, data } = request;
    const { id, params } = data;
    const { target, tx, config, meta } = params;
    const manager = WalletManager.getInstance();
    const context = {
      lockHash: target,
    };
    const txSigned = await manager.sign(context, tx, config);
    sendAck(wsToken, {
      id,
      jsonrpc: "2.0",
      result: {
        tx: txSigned,
      },
    });
    history.push("/");
  };

  render() {
    const { request } = this.state;
    if (!request) {
      return null;
    }
    const {
      token: wsToken,
      data: { id, params },
    } = request;
    const { tx, requestFrom, meta, config, target } = params as TransactionRequestParams;
    const { inputs, outputs, outputsData } = tx;
    return (
      <div className={styles.page}>
        <NavBar icon={<Icon type="left" />} onLeftClick={this.handleDecline}>
          Transaction Request
        </NavBar>
        <Flex>
          <Flex.Item>
            <div className={styles.line}>
              <span className={styles.label}>Request from:</span>
              <a className={styles.link} href={requestFrom}>
                {requestFrom}
              </a>
            </div>
            <div className={styles.line}>
              <span className={styles.label}>Meta Info: </span>
              <span>{meta}</span>
            </div>
            <div className={styles.line}>Transaction to sign:</div>
            <List renderHeader={<div className={styles.inputLabel}>Inputs</div>}>
              {inputs.map((input) => (
                // <InputOutput {...input} />
                <div>{input.previousOutput}</div>
              ))}
            </List>
            <List renderHeader={<div className={styles.outputLabel}>Outputs</div>}>
              {outputs.map((output, index) => (
                <InputOutput {...output} data={outputsData[index]} />
              ))}
            </List>
          </Flex.Item>
        </Flex>
        <div className={styles.footer}>
          <Button inline className={styles.declineButton} onClick={this.handleDecline}>
            Decline
          </Button>
          <Button inline type="primary" className={styles.approveButton} onClick={this.handleApprove}>
            Approve
          </Button>
        </div>
      </div>
    );
  }
}

export default withRouter(TransactionRequestPage);
