import React from "react"
import {
  Card,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane
} from "reactstrap"
import classnames from "classnames"
import { User, Info } from "react-feather"
import AccountTab from "./Account"
import DipositTab from "./Deposit"
import WithdrawTab from "./Withdraw"
import TradeTab from "./Trade"
import FundTab from "./Fund"
import InfoTab from "./Information"
//import OrderTab from "./Order"
//import KYCTab from "./KYCTab"
//import BankTab from "./BankTab"
import RefferelTab from "./RefferelTab"
import "../../../../assets/scss/pages/users.scss"
import Activity from "./Activity"
import queryString from "query-string"
import UserBuy from "./UserBuy";
import UserIncome from "./UserIncome";
import UserLevelIncome from "./UserLevelIncome"

class UserEdit extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let {active_tab} = queryString.parse(props.location.search)
    // Return null if the state hasn't changed
    active_tab = active_tab ? active_tab : "1";
    return {
      active_tab: active_tab
    }
  }
  state = {
    activeTab: "1"
  }
  toggle = tab => {
    this.setState({
      activeTab: tab
    })
  }
  async componentDidMount() {
    if(this.state.active_tab){
      this.toggle(this.state?.active_tab);
    }
  }
  render() {
    return (
      <Row>
        <Col sm="12">
          <Card>
            <CardBody className="pt-2">
              <Nav tabs>
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "1"
                    })}
                    onClick={() => {
                      this.toggle("1")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">KYC</span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">Bank</span>
                  </NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "1"
                    })}
                    onClick={() => {
                      this.toggle("1")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">Reffrel List</span>
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">User Activity</span>
                  </NavLink>
                </NavItem> */}

                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "2"
                    })}
                    onClick={() => {
                      this.toggle("2")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">User Buy</span>
                  </NavLink>
                </NavItem>

                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "3"
                    })}
                    onClick={() => {
                      this.toggle("3")
                    }}
                  >
                    <User size={16} />
                    <span className="align-middle ml-50">User Income</span>
                  </NavLink>
                </NavItem>
                
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "3"
                    })}
                    onClick={() => {
                      this.toggle("3")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Account Activity</span>
                  </NavLink>
                </NavItem> */}
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "4"
                    })}
                    onClick={() => {
                      this.toggle("4")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Deposit History</span>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "5"
                    })}
                    onClick={() => {
                      this.toggle("5")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">User Level Income</span>
                  </NavLink>
                </NavItem>
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "5"
                    })}
                    onClick={() => {
                      this.toggle("5")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Withdraw History</span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "6"
                    })}
                    onClick={() => {
                      this.toggle("6")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Trade History</span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "7"
                    })}
                    onClick={() => {
                      this.toggle("7")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Funds</span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "10"
                    })}
                    onClick={() => {
                      this.toggle("10")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">Orders</span>
                  </NavLink>
                </NavItem> */}
                {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "8"
                    })}
                    onClick={() => {
                      this.toggle("8")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">BONUS</span>
                  </NavLink>
                </NavItem> */}
                 {/* <NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state?.activeTab == "9"
                    })}
                    onClick={() => {
                      this.toggle("9")
                    }}
                  >
                    <Info size={16} />
                    <span className="align-middle ml-50">PNL</span>
                  </NavLink>
                </NavItem> */}
                {/*<NavItem>
                  <NavLink
                    className={classnames({
                      active: this.state.activeTab == "13"
                    })}
                    onClick={() => {
                      this.toggle("13")..
                    }}
                  >
                    <Share size={16} />
                    <span className="align-middle ml-50">Social</span>
                  </NavLink>
                </NavItem> */}
              </Nav>
              <TabContent activeTab={this.state?.activeTab}>
                {/* <TabPane tabId="1">
                  <KYCTab />
                </TabPane> */}
                {/* <TabPane tabId="2">
                  <BankTab />
                </TabPane> */}
                <TabPane tabId="1">
                  <RefferelTab />
                </TabPane>
                {/* <TabPane tabId="2">
                  <Activity />
                </TabPane> */}
                {/* <TabPane tabId="3">
                  <AccountTab />
                </TabPane> */}
                <TabPane tabId="4">
                  <DipositTab />
                </TabPane>
                <TabPane tabId="5">
                 <UserLevelIncome/>
                </TabPane>
                {/* <TabPane tabId="5">
                  <WithdrawTab />
                </TabPane> */}
                {/* <TabPane tabId="6">
                  <TradeTab />
                </TabPane> */}
                {/* <TabPane tabId="7">
                  <FundTab />
                </TabPane> */}
                {/* <TabPane tabId="10">
                  <OrderTab />
                </TabPane> */}
                {/* <TabPane tabId="8">
                  <InfoTab />
                </TabPane> */}
               {/* <TabPane tabId="9">
                  comming soon..
                </TabPane> */}
                <TabPane tabId="2">
                  <UserBuy/>
                </TabPane>
                <TabPane tabId="3">
                  <UserIncome/>
                </TabPane>
                 {/* <TabPane tabId="13">
                  <SocialTab />
                </TabPane> */}
              </TabContent>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}
export default UserEdit