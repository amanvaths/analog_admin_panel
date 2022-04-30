import React from "react";
import {
  Collapse,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  TabContent,
  TabPane,
  Badge,
  Table,
  Col,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import { connect } from "react-redux";
import { Eye, Code, ChevronDown } from "react-feather";
import { postAPICall } from "../../../../redux/helpers/api_functions";
import Toggle from "react-toggle";
import { NotificationManager } from "react-notifications";

class Activity extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.currentUserId !== state.currentUserId) {
      return {
        currentUserId: props.currentUserId,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  state = {
    google_auth : -1,
    activeTab: "1",
    collapseItems: [],
    status: "Closed",
  };

  toggleTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({ activeTab: tab });
    }
  };

  toggleCollapse = (collapseID) => {
    let index = this.state.collapseItems.indexOf(collapseID);
    if (index >= 0) {
      let items = this.state.collapseItems;
      items.splice(index, index + 1);
      this.setState({ collapseItems: items });
    } else {
      let items = this.state.collapseItems;
      items.push(collapseID);
      this.setState({ collapseItems: items });
    }
  };
  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("user_id");
    const body = {
      user_id: this.state.currentUserId,
      c_user_id: user_id,
    };
    postAPICall("get-user-activity", body).then((response) => {
      const res = response.data;
      if (res.status === 200) {
        const collapseItems = res.params.info;
        this.setState({ collapseItems });
      }
      const google_auth = response.data.google_auth ? response.data.google_auth : 0;
      this.setState({google_auth})
    });
  }
  onEntered = (id) => {
    if (this.state.collapseItems.includes(id))
      this.setState({ status: "Opened" });
  };
  onEntering = (id) => {
    if (this.state.collapseItems.includes(id))
      this.setState({ status: "Opening..." });
  };

  onExited = (id) => {
    if (this.state.collapseItems.includes(id))
      this.setState({ status: "Closed" });
  };

  onExiting = (id) => {
    if (this.state.collapseItems.includes(id))
      this.setState({ status: "Closing..." });
  };
  updateQUERY = (action,key,status) => {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get("user_id");
    if(status == 1){
      NotificationManager.error('You can only turn off this setting')
      return false
    }
    const alltxtData = {
        action : action,
        sub_action : key,
        [key]: status,
        c_user_id: user_id,
        admin_user_id: this.state.currentUserId
    }
    postAPICall('modify_user_profile',alltxtData)
    .then(response => {
      if(response.data.query_status){
        NotificationManager.success(response.data.message)             
      }else{
        NotificationManager.error(response.data.message)
      }
    })
  }
  render() {
    const { collapseItems, google_auth } = this.state;

    const renderCollapse = collapseItems.map((collapseItem, i) => {
      let tradeData =
        Array.isArray(collapseItem.trades) && collapseItem.trades.length > 0
          ? collapseItem.trades.map((trade, i) => {
            let rowDesign;
            if(i%2===0){
              rowDesign = "table-active";
            } else {
              rowDesign = "table-light";
            }
              return (
                <tr className={rowDesign}>
              <th scope="row">{collapseItem.type === "Buy"
                        ? trade.sell_user_id
                        : trade.buy_user_id}</th>
              <td>{trade.history_id}</td>
              <td>{trade.volume}</td>
              <td>{new Date(trade.createdAt).toLocaleString()}</td>
            </tr>
              );
            })
          : null;
      return (
        <Card
          key={i}
          onClick={() => this.toggleCollapse(i)}
          className={classnames({
            "collapse-collapsed":
              this.state.status === "Closed" &&
              this.state.collapseItems.includes(i),
            "collapse-shown":
              this.state.status === "Opened" &&
              this.state.collapseItems.includes(i),
            closing:
              this.state.status === "Closing..." &&
              this.state.collapseItems.includes(i),
            opening:
              this.state.status === "Opening..." &&
              this.state.collapseItems.includes(i),
          })}
          style={{
            borderTop: "solid 1px",
            borderRight: "none",
            borderBottom: "none",
            borderLeft: "none",
            borderColor: "#0005",
          }}
        >
          <CardHeader>
            <CardTitle
              className="lead collapse-title collapsed"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
                alignItems: "center",
              }}
            >
              <div
                className="badge"
                style={{
                  color: "#121314",
                  fontWeight: "600",
                  fontSize: "large",
                }}
              >
                {collapseItem.type}
              </div>
              <div
                className="badge"
                style={{ color: "#121314", fontWeight: "600" }}
              >
                {collapseItem.symbol?.toUpperCase()}
              </div>
              <Badge
                className="badge-glow" color="secondary"
              >
                {collapseItem.type === "Buy" || collapseItem.type === "Sell"
                  ? collapseItem.info.raw_price+' / '+collapseItem.info.volume
                  : collapseItem.amount}
              </Badge>
              
              {collapseItem.type === "Buy" || collapseItem.type === "Sell" ? (
                collapseItem.info.order_status === 1 ? (
                  <Badge className="badge-glow" color="success">
                    Success
                  </Badge>
                ) : collapseItem.info.order_status === 2 ? (
                  <Badge className="badge-glow" color="danger">
                    Cancel
                  </Badge>
                ) : collapseItem.info.order_status === 0 ? (
                  <Badge className="badge-glow" color="warning">
                    Pending
                  </Badge>
                ) : null
              ) : null}
              {collapseItem.type === "deposit" ? (
                collapseItem.status ? (
                  <Badge className="badge-glow" color="success">
                    Success
                  </Badge>
                ) : (
                  <Badge className="badge-glow" color="danger">
                    Cancel
                  </Badge>
                )
              ) : null}
              {collapseItem.type === "withdrawal" ? (
                collapseItem.status === 1 ? (
                  <Badge className="badge-glow" color="success">
                    Success
                  </Badge>
                ) : (
                  <Badge className="badge-glow" color="danger">
                    Cancel
                  </Badge>
                )
              ) : null}
              <Badge
                className="badge-glow"
                color="primary"
              >
                {new Date(collapseItem.createdAt).toLocaleString()}
              </Badge>
              <ChevronDown size={15} className="collapse-icon" />
            </CardTitle>
          </CardHeader>
          <Collapse
            isOpen={this.state.collapseItems.includes(i)}
            onEntering={() => this.onEntering(i)}
            onEntered={() => this.onEntered(i)}
            onExiting={() => this.onExiting(i)}
            onExited={() => this.onExited(i)}
          >
            <CardBody>
              <Table responsive>
              <thead className="thead-dark">
            <tr>
              <th>User ID</th>
              <th>Transection ID</th>
              <th>Volume</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
          {collapseItem.type === "Buy" || collapseItem.type === "Sell"
                ? tradeData
                  ? tradeData
                  : null
                : null}
          </tbody>
              </Table>
            </CardBody>
          </Collapse>
        </Card>
      );
    });

    return (
      <React.Fragment>
        <Card>
          <CardHeader>
            <Col md="6">User Activity</Col>
            <Col md="6">
              <CardTitle className="float-left"> Google or Mobile Authenticator </CardTitle> 
              {google_auth !== -1 ? (
                <Toggle
                      defaultChecked={google_auth ? google_auth : 0}
                      className="switch-danger ml-1"
                      onClick={() => {
                          let authenticator = google_auth ? 0 : 1;
                          this.updateQUERY("update_profile",'authenticator',authenticator)
                      }}
                    />
              ) : (
                <Spinner color="primary" className="ml-1" />
              )}
            </Col>
          </CardHeader>
          <CardBody>
            <TabContent activeTab={this.state.activeTab}>
              <TabPane tabId="1">
                <div className="vx-collapse collapse-bordered">
                  {renderCollapse}
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </React.Fragment>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    currentUserId: state.auth.login.user.user_id,
  };
};
export default connect(mapStateToProps)(Activity);
