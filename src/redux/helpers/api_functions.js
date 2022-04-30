import $ from "jquery";
// import { browserName } from "react-device-detect";
import { NotificationManager } from "react-notifications";
import axios from "axios";

// const url = "http://localhost:5000/api/";
// const url = "https://api.bullsiex.io/api/";
// const url = "https://api.bitflash.io/api/";
// const url = "https://api.kingvrx.com/api"
//export const BaseURLAPI =  'https://adminapi.btexapi.cloud/api';
 export const BaseURLAPI =  'http://localhost:3001/api';

export const BaseURL =  'https://btexapi.cloud' ;
export const WebsiteURL =  'https://bitflash.io' ;
export const OrderURL =  'https://order.btexapi.cloud/' ;
let url = BaseURLAPI+'/';
export function userFund(user_id) {
    return fetch(`${url}user-fund-history`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then((d) => d.json())
      .catch((e) => e);
  }

  // export function userDeposit(user_id) {
  //   return fetch(`${url}admin-deposit-history`, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "no-cache",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify({
  //       user_id: user_id,
  //     }),
  //   })
  //     .then((d) => d.json())
  //     .catch((e) => e);
  // }

  // export function userWithdraw(user_id) {
  //   return fetch(`${url}admin-withdraw-history`, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "no-cache",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify({
  //       user_id: user_id,
  //     }),
  //   })
  //     .then((d) => d.json())
  //     .catch((e) => e);
  // }

  export function userTrade(user_id) {
    return fetch(`${url}admin-trade-history`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then((d) => d.json())
      .catch((e) => e);
  }

  export function userOrder(user_id) {
    return fetch(`${url}admin-order-history`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "cache-control": "no-cache",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        user_id: user_id,
      }),
    })
      .then((d) => d.json())
      .catch((e) => e);
  }
  // export function activityLog(user_id) {
  //   return fetch(`${url}activity-log`, {
  //     method: "POST",
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "no-cache",
  //       "Access-Control-Allow-Origin": "*",
  //     },
  //     body: JSON.stringify({
  //       user_id: user_id,
  //       action: 'get_report'
  //     }),
  //   })
  //     .then((d) => d.json())
  //     .catch((e) => e);
  // }

  // export function getWebsiteData(user_id) {
  //   return fetch(`${url}get-website-data`, {
  //     method: "GET",
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "no-cache",
  //       "Access-Control-Allow-Origin": "*",
  //     }
  //   })
  //     .then((d) => d.json())
  //     .catch((e) => e);
  // }


  export function getAPICall(urlslug) {
    const urlaction = url+urlslug
    return axios.get(urlaction);
  }
  export function postAPICall(urlslug,fomdata,order) {
    console.log("urlslug",urlslug)
    url = order ? OrderURL : url; 
    const urlaction = url+urlslug
    return axios.post(urlaction,fomdata);
  }

  export function sendMobileOTP (user_id,mobile_no){
    const data = {
        user_id : user_id,
        mobile_no : mobile_no,
    }
    if(user_id && mobile_no){
      NotificationManager.success("otp sending");
      postAPICall('send-mobile-varification-otp',data)
      .then(response => {
        if(response.status = 200){
          NotificationManager.success("otp sent");
        }
      })
    }else{
      NotificationManager.error("Please enter Mobile Number");
    }
  }
  export function verifyMobileOTP (user_id,otp){
    const data = {
        user_id : user_id,
        otp : otp,
    }
    if(user_id && otp){
      postAPICall('varifie/mobile',data)
      .then(response => {
        if(response.status = 200){
          NotificationManager.success("otp verified");
        }else{

        }
      })
    }else{
      console.log("Please enter Correct otp");
      NotificationManager.error("Please enter Correct otp ");
    }
  }