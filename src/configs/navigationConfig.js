import React from "react"
import * as Icon from "react-feather"
const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "collapse",
    icon: <Icon.Home size={20} />,
    badge: "warning",
    badgeText: "2",
    parentof:'dashboard',
    children: [
      {
        id: "statistics",
        title: "Statistics",
        type: "item",
        icon: <Icon.Circle size={12} />,
        permissions: ["admin","editor"],
        parentof:'dashboard',
        navLink: "/cards/statistics"
      },
      {
        id: "analytics",
        title: "Analytics",
        type: "item",
        parentof:'dashboard',
        icon: <Icon.Circle size={12} />,
        
        navLink: "/cards/analytics"
      },
      {
        id: "email",
        title: "Email",
        type: "item",
        parentof:'dashboard',
        icon: <Icon.Mail size={20} />,
        
        navLink: "/email/:filter",
        filterBase: "/email/inbox"
      },
      {
        id: "chat",
        title: "Chat",
        type: "item",
        parentof:'dashboard',
        icon: <Icon.MessageSquare size={20} />,
        
        navLink: "/chat"
      },
      {
        id: "todo",
        title: "Todo",
        type: "item",
        icon: <Icon.CheckSquare size={20} />,
        parentof:'dashboard',
        
        navLink: "/todo/:filter",
        filterBase: "/todo/all"
      },
    ]
  },
  {
    type: "groupHeader",
    groupTitle: "Notification & News",
    parentof: 'notification',
  },
  // {
  //   id: "notificationandNews",
  //   parentof: 'notification',
  //   title: "Create News & Notification",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
    
  //   navLink: "/app/notificationform"
  // },
  {
    id: "notification",
    parentof: 'notification',
    title: "Notifications",
    type: "item",
    icon: <Icon.Circle size={12} />,
    
    navLink: "/app/notification"
  },
  {
    id: "news",
    parentof: 'notification',
    title: "News",
    type: "item",
    icon: <Icon.Circle size={12} />,
    
    navLink: "/app/news"
  },
  {
    type: "groupHeader",
    groupTitle: "Users",
    parentof: 'users',
  },
  //  {
  //   id: "pendingkyc",
  //   title: "Pending KYC",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'users',
  //   navLink: "/app/user/pendinguser",
  // },
  //  {
  //   id: "verifiedkyc",
  //   title: "Verified KYC",
  //   type: "item",
  //   parentof: 'users',
  //   icon: <Icon.User size={20} />,
  //   navLink: "/app/user/verifieduser",
  // },
  // {
  //   id: "userrejectedkyc",
  //   parentof: 'users',
  //   title: "User Rejected KYC",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
    
  //   navLink: "/app/user/rejecteduser"
  // },
  {
    id: "alluser",
    parentof: 'users',
    title: "All Users",
    type: "item",
    icon: <Icon.Circle size={12} />,
    
    navLink: "/app/user/alluser"
  },
  {
    id: "blockuser",
    title: "Blocked Users",
    type: "item",
    icon: <Icon.Circle size={12} />,
    parentof: 'users',
    navLink: "/app/user/blockuser"
  },
  {
  id: "levelreport",
  title: "Level Report",
  type: "item",
  icon: <Icon.Circle size={12} />,
  parentof: 'users',
  navLink: "/app/user/levelreport"
},
{
  type: "groupHeader",
  groupTitle: "Pre-sale",
  parentof: 'addpresale',
},
{
  id: "addpresale",
  title: "Add Presale",
  type: "item",
  icon: <Icon.Circle size={12} />,
  parentof: 'Pre-sale',
  navLink: "/app/user/addpresale"
},
{
  id: "presalelist",
  title: "Presale List",
  type: "item",
  icon: <Icon.Circle size={12} />,
  parentof: 'Pre-sale',
  navLink: "/app/user/presalelist"
},
{
  id: "bonuspercent",
  title: "Bonus Percent",
  type: "item",
  icon: <Icon.Circle size={12} />,
  parentof: 'Pre-sale',
  navLink: "/app/user/bonuspercent"
},
  // {
  //   id: "topreffred",
  //   title: "Top Reffered",
  //   type: "item",
  //   icon: <Icon.CheckSquare size={20} />,
  //   
  //   filterBase: "/app/user/bankuser?action=blockuser&raw=0"
  // },
  //  {
  //   id: "userbankkyc",
  //   title: "Bank Verified KYC",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
  //   parentof: 'users',
  //   navLink: "/app/user/bankverified"
  // },
  // {
  //   id: "bankrejectedkyc",
  //   title: "Bank Rejected KYC",
  //   type: "item",
  //   parentof: 'users',
  //   icon: <Icon.Circle size={12} />,
    
  //   navLink: "/app/user/bankrejected"
  // },
  //  {
  //   id: "bankpendingkyc",
  //   title: "Bank Pending KYC",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
  //   parentof: 'users',
  //   navLink: "/app/user/bankpending"
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "Withdraw Request",
  //   parentof: 'withdrawrequest',
  // },
  // {
  //   id: "pendingwithdraw",
  //   title: "Pending Withdraw",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'withdrawrequest',
  //   navLink: "/app/withdraw/pendingwithdraw",
  // },
  // {
  //   id: "verifiedwithdraw",
  //   title: "Verified Withdraw",
  //   type: "item",
  //   parentof: 'withdrawrequest',
  //   icon: <Icon.User size={20} />,
  //   navLink: "/app/withdraw/verifiedwithdraw",
  // },
  // {
  //   id: "rejectedwithdraw",
  //   parentof: 'withdrawrequest',
  //   title: "Rejected Withdraw ",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
    
  //   navLink: "/app/withdraw/rejectedwithdraw"
  // },
  {
    type: "groupHeader",
    parentof: 'coinandtoken',
    groupTitle: "Coin & Token"
  },
  // {
  //   id: "addtoken",
  //   title: "Add token",
  //   type: "item",
  //   parentof: 'coinandtoken',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",

  //   navLink: "/app/token/addtoken"
  // },
  {
    id: "crptosetting",
    title: "Cypto Setting",
    type: "item",
    parentof: 'coinandtoken',
    icon: <Icon.Eye size={20} />,
    
    navLink: "/app/token/crptosetting"
  },
  // {
  //   id: "crptolimit",
  //   title: "Cypto Limit/Capping",
  //   type: "item",
  //   parentof: 'coinandtoken',
  //   icon: <Icon.Eye size={20} />,
    
  //   navLink: "/app/token/crptolimit"
  // },
  // {
  //   id: "createpairing",
  //   title: "Create Pairing",
  //   type: "item",
  //   icon: <Icon.Eye size={20} />,
  //   parentof: 'coinandtoken',
  //   navLink: "/app/token/createpairing"
  // },
  // {
  //   id: "setpairing",
  //   title: "Set Pairing",
  //   type: "item",
  //   parentof: 'coinandtoken',
  //   icon: <Icon.Eye size={20} />,
    
  //   navLink: "/app/token/setpairing"
  // },
  {
    type: "groupHeader",
    groupTitle: "Wallet Settings",
    parentof: 'wallet',
  },
  {
    id: "coldwallet",
    title: "Cold Wallet",
    type: "item",
    parentof: 'wallet',
    icon: <Icon.CreditCard size={20} />,
    
    navLink: "/app/wallets/coldwallet"
  },
  // {
  //   id: "capturehits",
  //   title: "Capture History",
  //   type: "item",
  //   parentof: 'wallet',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",
  //   navLink: "/app/wallets/capturehits"
  // },
  // {
  //   id: "adminsendcapture",
  //   title: "Admin Send Capture",
  //   type: "item",
  //   parentof: 'wallet',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",
  //   navLink: "/app/wallets/adminsendcapture"
  // },
  // {
  //   id: "capturefundhistory",
  //   title: "User Capture History",
  //   type: "item",
  //   parentof: 'wallet',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",
  //   navLink: "/app/wallets/capturefundhistory"
  // },


  // {
  //   id: "hotwallet",
  //   title: "Hot Wallet",
  //   type: "item",
  //   icon: <Icon.CreditCard size={20} />,
  //   parentof: 'wallet',
  //   navLink: "/app/wallets/hotwallet"
  // },
  // {
  //   id: "tradefeeswallet",
  //   title: "Trade Fees",
  //   type: "item",
  //   parentof: 'wallet',
  //   icon: <Icon.Droplet size={20} />,
    
  //   navLink: "/app/wallets/tradefeeswallet"
  // },
  // {
  //   id: "withdrawfeeswallet",
  //   title: "With/Dep Fees",
  //   type: "item",
  //   parentof: 'wallet',
  //   icon: <Icon.Eye size={20} />,
    
  //   navLink: "/app/wallets/withdrawfeeswallet"
  // },
  {
    type: "groupHeader",
    groupTitle: "Order Report",
    parentof: 'order',
  },
  // {
  //     id: "Order",
  //     title: "Order",
  //     type: "item",
  //     icon: <Icon.Copy size={20} />,
  //     parentof: 'order',
  //     navLink: "/app/order"
  //   },
  // {
  //   id: "openbuy",
  //   title: "Open Buy",
  //   type: "item",
  //   icon: <Icon.Copy size={20} />,
  //   parentof: 'order',
  //   navLink: "/app/order/openbuy"
  // },
  // {
  //   id: "opensell",
  //   title: "Open Sell",
  //   type: "item",
  //   icon: <Icon.Copy size={20} />,
  //   parentof: 'order',
  //   navLink: "/app/order/opensell"
  // },
  // {
  //   id: "excutedbuysell",
  //   title: "Executed Order",
  //   type: "item",
  //   icon: <Icon.Box size={20} />,
  //   parentof: 'order',
  //   navLink: "/app/order/excutedbuysell"
  // },
  // {
  //   id: "canclebuyorder",
  //   title: "Cancled Buy Orders",
  //   type: "item",
  //   icon: <Icon.MoreHorizontal size={20} />,
  //   parentof: 'order',
  //   navLink: "/app/order/canclebuyorder"
  // },
  // {
  //   id: "canclesellorder",
  //   title: "Cancled Sell Orders",
  //   type: "item",
  //   icon: <Icon.MoreHorizontal size={20} />,
  //   parentof: 'order',
  //   navLink: "/app/order/canclesellorder"
  // },
   {
    id: "createorder",
    title: "Order",
    type: "item",
    icon: <Icon.MoreHorizontal size={20} />,
    parentof: 'order',
    navLink: "/app/order/createorder"
  },
  {
    type: "groupHeader",
    groupTitle: "Finance Report",
    parentof: 'finance',
  },
  // {
  //   id: "usertradefund",
  //   title: "User Trade Fund",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/usertradefund",
  // },
  // {
  //   id: "userwalletfund",
  //   title: "User Wallet Fund",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/userwalletfund",
  // },
  {
    id: "deposithistory",
    title: "Deposite History",
    type: "item",
    icon: <Icon.User size={20} />,
    parentof: 'finance',
    navLink: "/app/finance/deposithistory",
  },
  // {
  //   id: "withdrawistory",
  //   title: "Withdraw History",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/withdrawistory",
  // },
  // {
  //   id: "userdeposithistory",
  //   title: "User Deposite History",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/userdeposithistory",
  // },
  // {
  //   id: "userwithdrawistory",
  //   title: "User Withdraw History",
  //   type: "item",
  //   icon: <Icon.User size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/userwithdrawistory",
  // },
  // {
  //   id: "adduserfund",
  //   title: "Add Fund to User",
  //   type: "item",
  //   icon: <Icon.Settings size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/adduserfund"
  // },
  // {
  //   id: "depositinrfromuser",
  //   title: "Deposit Inr From User",
  //   type: "item",
  //   icon: <Icon.HelpCircle size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/depositinrfromuser",
  // },
  // {
  //   id: "withdrawinrfromuser",
  //   title: "Withdraw Inr From User",
  //   type: "item",
  //   icon: <Icon.HelpCircle size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/withdrawinrfromuser"
  // },
  // {
  //   id: "capturefundfromuser",
  //   title: "INR History",
  //   type: "item",
  //   icon: <Icon.HelpCircle size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/capturefundfromuser"
  // },
  // {
  //   id: "realfundtranfertouser",
  //   title: "Real Fund User",
  //   type: "item",
  //   icon: <Icon.Info size={20} />,
  //   parentof: 'finance',
  //   navLink: "/app/finance/realfundtranfertouser",
  // },
  // {
  //   id: "withdrawalfeesreport",
  //   title: "Withdrawal Fees List",
  //   type: "item",
  //   icon: <Icon.Eye size={20} />,
  //   navLink: "/app/finance/withdrawalfeesreport",
  //   parentof: 'finance',
  // },
  // {
  //   id: "stakehistory",
  //   title: "Stake History",
  //   icon: <Icon.Info size={20} />,
  //   type: "item",
  //   parentof: 'settings',
  //   navLink: "/app/finance/stakehistory"
  // },
  // {
  //   id: "stakehistorydaily",
  //   title: "Daily Stake History",
  //   icon: <Icon.Info size={20} />,
  //   type: "item",
  //   parentof: 'finance',
  //   navLink: "/app/finance/stakehistorydaily"
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "Bonus (Report)",
  //   parentof: 'bonus',
  // },
  // {
  //   id: "refferrellist",
  //   title: "Referral List",
  //   type: "item",
  //   parentof: 'bonus',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",
  //   navLink: "/app/bonus/refferrellist",
  //   parentof: 'bonus',
  // },
  // {
  //   id: "refferrellistnotkyc",
  //   title: "Referral (Not KYC)",
  //   type: "item",
  //   parentof: 'bonus',
  //   icon: <Icon.CreditCard size={20} />,
  //   badge: "primary",
  //   navLink: "/app/bonus/refferrellistnotkyc",
  //   parentof: 'bonus',
  // },
  // {
  //   id: "airdroplist",
  //   title: "AirDrop List",
  //   type: "item",
  //   icon: <Icon.Eye size={20} />,
  //   navLink: "/app/bonus/airdroplist",
  //   parentof: 'bonus',
  // },
  // {
  //   type: "groupHeader",
  //   groupTitle: "Master Setting",
  //   parentof: 'mastersetting',
  // },
  // {
  //   id: "addemployee",
  //   title: "Add Employee",
  //   icon: <Icon.Map size={20} />,
  //   type: "item",
  //   parentof: 'mastersetting',
  //   navLink: "/app/master/addemployee"
  // },
  // {
  //   id: "mastersetting",
  //   title: "Personal Setting",
  //   icon: <Icon.Map size={20} />,
  //   type: "item",
  //   parentof: 'mastersetting',
  //   navLink: "/app/master/mastersetting"
  // },
  {
    type: "groupHeader",
    groupTitle: "Settings",
    parentof: 'settings',
  },
  {
    id: "logobanner",
    title: "Logo/Banner/Favicon",
    icon: <Icon.AlertCircle size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/logobanner"
  },
  {
    id: "addnewpage",
    title: "Add New Page",
    icon: <Icon.Zap size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/addnewpage"
  },
  {
    id: "addnewmenu",
    title: "Add New Menu",
    icon: <Icon.Zap size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/addnewmenu"
  },
  {
    id: "apisetting",
    title: "API Setting",
    icon: <Icon.Sliders size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/apisetting"
  },
  {
    id: "stakesetting",
    title: "Stake Setting",
    icon: <Icon.Settings size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/stakesetting"
  },
  {
    id: "remotetrading",
    title: "Remote Trading",
    icon: <Icon.UploadCloud size={20} />,
    type: "item",
    parentof: 'settings',
    navLink: "/app/setting/remotetrading"
  },
]

export default navigationConfig
