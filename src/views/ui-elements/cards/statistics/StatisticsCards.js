import React from "react"
import { Row, Col, Spinner, Media } from "reactstrap"
import Breadcrumbs from "../../../../components/@vuexy/breadCrumbs/BreadCrumb"
import StatisticsCard from "../../../../components/@vuexy/statisticsCard/StatisticsCard"
import {
  Users
} from "react-feather"
import { postAPICall } from "../../../../redux/helpers/api_functions"
import {createSocketClient} from "../../../../views/apps/utils/functions"
import { Redirect } from "react-router-dom"

class StatisticsCards extends React.Component {
  state = {
    users: null,
    coins: null,
    pairedCur: null,
    funds: null,
    tradeFunds: null,
    airdrop: null,
    referral: null,
    status: false,
  }
  async componentDidMount() {
    const socket = new createSocketClient("kujgwvfq-a-ghosttown-z-1fhhup0p6");
    socket.on("cmc_updated", (res) => {
      if(res){
       this.setState({coins: res});
      }
    });
    postAPICall('dashboard-data')
      .then(response => {
      const users = response.data.users;
      const funds = response.data.funds;
      const pairedCur = response.data.pairedCur;
      const tradeFunds = response.data.tradeFunds;
      const airdrop = response.data.airdrop;
      const referral =  response.data.referral
     
      if(users || funds || tradeFunds || airdrop || referral || pairedCur){
        this.setState({ users });
        this.setState({ funds });
        this.setState({ pairedCur });
        this.setState({ tradeFunds });
        this.setState({ airdrop });
        this.setState({ referral });
        this.setState({ status: true });
      }
    })
  }
  render() {
    const { users, funds, tradeFunds, airdrop,  referral, coins, pairedCur} = this.state;
    const LCard =pairedCur && pairedCur.map(item => {
      const price = coins && coins.find((coin) => coin.symbol == item.currency_coin);
      const inrprice = 1 / parseFloat(price && price.raw_current_price_inr?price.raw_current_price_inr:1);
      var total_liquidity = 0;
      funds && funds.map(item => {
        let coin_data = coins.find((c)=>{if (c.symbol == item.symbol) return c.raw_current_price_inr;});
        let c_price = coin_data && coin_data.raw_current_price_inr?coin_data.raw_current_price_inr: 0;
        let coin_price = parseFloat(c_price) * inrprice;
        total_liquidity += (coin_price * parseFloat(item.total));
      })
      return (
        <>
          {item ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                hideChart
                iconBg="success"
                icon={<Media  object src={item.currency_logo} height="25" width="25" />}
                stat={(total_liquidity).toFixed(6)}
                statTitle={item.currency_coin}
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    const NCard =funds && funds.map(item => {
      return (
        <>
          {item ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                hideChart
                iconBg="success"
                icon={<Media  object src={item.icon} height="25" width="25" />}
                stat={item?item.total:'0'}
                statTitle={item.symbol}
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    const MCard =tradeFunds && tradeFunds.map(item => {
      let cPairedCurrency = item.map((data)=>{
        let paireddata = data.compare_currency?data.compare_currency+": ":'';
        let ttl = data.compare_currency?(data.total).toFixed(6)+', ':data.total;
        let d = paireddata+ttl;
        return d;
      })
      return (
        <>
          {item ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                hideChart
                iconRight
                icon={<Media  object src={item[0].icon} height="25" width="25" />}
                stat={item[0].symbol}
                statTitle={cPairedCurrency}
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    return (
      <React.Fragment>
        <Breadcrumbs
          breadCrumbTitle="Statistics Cards"
          breadCrumbParent="Card"
          breadCrumbActive="Statistics Cards"
        />
         {(this.state.status) ? (
           <>
        <h1>Users Details</h1> 
        <Row>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.allUsers:'0'}
              statTitle="All Users"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.approvedKyc:'0'}
              statTitle="Active Users"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.pendingKyc:'0'}
              statTitle="Pending Kyc"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.rejectKyc:'0'}
              statTitle="Reject Kyc"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.approvedBank:'0'}
              statTitle="Approved Bank"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.pendingBank:'0'}
              statTitle="Pending Bank"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={users?users.rejectBank:'0'}
              statTitle="Reject Bank"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={500}
              statTitle="Today Instant Bonus"
            />
          </Col>
          <Col xl="2" lg="4" sm="6">
            <StatisticsCard
              hideChart
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={500}
              statTitle="Total instant bonus"
            />
          </Col>
        </Row>
        <h1>Total liquidity</h1> 
        <Row>
          {LCard}
        </Row>
        <h1>Funds</h1> 
        <Row>
          {NCard}
        </Row>
        <h1>Total Trade</h1> 
        <Row>
          {MCard}
        </Row>
        <Row>
        <Col xl="2" lg="4" sm="6">
        <h1>Airdrop</h1>
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={airdrop?airdrop.total:'0'}
              statTitle={airdrop.airdopcoin}
            />
          </Col>
        <Col xl="2" lg="4" sm="6">
        <h1>Referral</h1>
            <StatisticsCard
              hideChart
              iconRight
              iconBg="primary"
              icon={<Users className="primary" size={22} />}
              stat={referral?referral.total:'0'}
              statTitle={referral.referralcoin}
            />
          </Col>
          </Row>
        </>
         ):(
         <>
          <center>
            <Spinner color="primary" />
          </center>
        </>
        )}
      </React.Fragment>
    )
  }
}

export default StatisticsCards
