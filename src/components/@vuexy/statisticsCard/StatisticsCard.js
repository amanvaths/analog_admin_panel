import React from "react"
import { Card, CardBody } from "reactstrap"
import Chart from "react-apexcharts"
import {RefreshCw} from "react-feather"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall, } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"

class StatisticsCards extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let currentUserId = props.currentUserId ? props.currentUserId : undefined;
    return {
      currentUserId: currentUserId
    }
  }
  
  syncActualWallet = (currency,syncWawllet) => {
    // const { user_id } = useSelector((state) => state.auth.login.user);
    let user_id = this.state.currentUserId;
    const formdata = {
      user_id: user_id,
      wallet_type: currency,
      action  : 'refresh_all'
    }
    console.log(currency , user_id,syncWawllet)
    if(currency && user_id && syncWawllet){
      NotificationManager.success("Wallet synchronization Activated and It will take 10-15 Min to update "+currency+" this balance.") 
      postAPICall('get_actual_bal',formdata)
        .then(response => {
          if(response.data.status == 200){
            NotificationManager.success("Wallet synchronization completed for "+currency+" this balance.") 
          }else if (response.data.status == 400){
            NotificationManager.error(response.data.message) 
          }
        })
    }else{
      NotificationManager.info("Wallet synchronization feature is Coming soon for this Coin")          
    }
  }
  render() {
    return (
      <Card>
        <CardBody
          className={`${this.props.className ? this.props.className : "stats-card-body"} d-flex ${
            !this.props.iconRight && !this.props.hideChart
              ? "flex-column align-items-start"
              : this.props.iconRight
              ? "justify-content-between flex-row-reverse align-items-center"
              : this.props.hideChart && !this.props.iconRight
              ? "justify-content-center flex-column text-center"
              : null
          } ${!this.props.hideChart ? "pb-0" : "pb-2"} pt-2`}
        >
          <div className="icon-section">
            <div
              className={`avatar avatar-stats p-50 m-0 ${
                this.props.iconBg
                  ? `bg-rgba-${this.props.iconBg}`
                  : "bg-rgba-primary"
              }`}
            >
              <div className="avatar-content">{this.props.icon}</div>
            </div>
            {this.props.syncWalletlogo ?
              <>
                <div onClick={() => {
                this.syncActualWallet(
                  this.props.stat,
                  this.props.syncWallet
                )
              }} className={`avatar avatar-stats p-50 m-0 bg-rgba-white`} >
                  <div className="avatar-content"><RefreshCw className="primary" size={22} /></div>
                </div>
              </>
            : ''}
          </div>
          <div className="title-section">
            <div style={{display:'inline-block'}}>
              <div class="bold h3 mb-25 float-left" style={{marginRight:'5px'}}>{this.props.stat}  </div>
              {Number(this.props.total) > 0 ? (
                <div class="text-success float-left h4 "> ({this.props.total})</div>
              ) : (
                <></>
                // <div class=" float-left h4 "> ({this.props.total})</div>
              )}
            </div>
            <p className="mb-0">{this.props.statTitle}</p>
          </div> 
        </CardBody>
        {!this.props.hideChart && (
          <Chart
            options={this.props.options}
            series={this.props.series}
            type={this.props.type}
            height={this.props.height ? this.props.height : 100}
          />
        )}
      </Card>
    )
  }
}
const mapStateToProps = state => {
  return {
    currentUserId: state.auth.login.user.user_id
  }
}
export default connect(mapStateToProps)(StatisticsCards)
