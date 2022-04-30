import React from "react"
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Spinner,
} from "reactstrap"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
} from "react-feather"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { getAPICall, postAPICall } from "../../../../redux/helpers/api_functions"
import { connect } from "react-redux"

class UsersList extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (
      props.currentUserId !== state.currentUserId
    ) {
      return {
        currentUserId: props.currentUserId
      }
    }
    // Return null if the state hasn't changed
    return null
  }
  state = {
    referral_code: null,
    referal_earning: null,
    referral_count: null,
    investment: null,
    harvest: null,
    rowData: null,
    allToken: null,
    pageSize: 20,
    isVisible: true,
    reload: true,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    validPassword:true,
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true
    },
    searchVal: "",
    blockchain_radio:null,
    website_setting:null,
    gettoken:null,
    columnDefs: [
      {
        headerName: "#",
        field: "rowIndex",
        filter : false,
        width : 50,
        cellRendererFramework: params => {
          return (
            <>
              {1+params.rowIndex}   
            </>
          )
        }
      },
      {
        headerName: "Invest Type",
        field: "invest_type",
        filter : false,
        width: 200,
    },
    {
      headerName: "Coin",
      field: "wallet_type",
      filter : false,
      width: 200,
    },
    {
      headerName: "Harvest",
      field: "harvest",
      filter : false,
      width: 200,
    },
    {
      headerName: "Type",
      field: "type",
      filter : false,
      width: 200,
    }, 
    {
      headerName: "Status",
      field: "status",
      filter : false,
      width: 200,
    }, 
    {
      headerName: "Date",
      field: "createdAt",
      filter : false,
      width: 200,
    },
    // {
    //   headerName: "Percent",
    //   field: "percent",
    //   filter : false,
    //   width: 200,
    // },
    // {
    //   headerName: "Per Second ROI",
    //   field: "per_second_ry",
    //   filter : false,
    //   width: 200,
    // },
    // {
    //   headerName: "Pools Type",
    //   field: "pools_type",
    //   filter : false,
    //   width: 200,
    // },
    // {
    //   headerName: "KYC Status",
    //   field: "kyc_status",
    //   filter : false,
    //   width: 250,
    //   cellRendererFramework: params => {
    //     return params.value === 1 ? ( // for active
    //       <div className="badge badge-pill badge-light-success">Done</div>
    //     ) : params.value === 0 ? ( // Not submitted
    //       <div className="badge badge-pill badge-light-warning">Not Filled </div>
    //     ) : params.value === 2 ? ( // rejecetd
    //       <div className="badge badge-pill badge-light-danger">Rejected</div>
    //     ) : params.value === -1 ? ( // submitted but not approve
    //       <div className="badge badge-pill badge-light-warning">Filled but not Verified</div>
    //     ) : (
    //       <div className="badge badge-pill badge-light-warning">Not Filled</div>
    //     )
    //     }
    //   },
    //   {
    //     headerName: "Date",
    //     field: "time",
    //     filter: true,
    //     width: 250,
    //     cellRendererFramework: params => {
    //           return (
    //             <div>
    //               {Number(params.value) ? new Date(Number(params.value)).toLocaleString() : new Date(params.value).toLocaleString()}
    //             </div>
    //           )
    //         }
    //   },
    ],
    columnDefs1: [
      {
        headerName: "#",
        field: "rowIndex",
        filter : false,
        width : 50,
        cellRendererFramework: params => {
          return (
            <>
              {1+params.rowIndex}   
            </>
          )
        }
      },
      {
        headerName: "Invest Type",
        field: "invest_type",
        filter : false,
        width: 200,
      cellRendererFramework: params => {
        return params.data.only_btex ? "BTEX" : params.value
        }
    },
    {
      headerName: "Tnvest Btex",
      field: "invest_btex",
      filter : false,
      width: 200,
    },
    {
      headerName: "Per Second Roi",
      field: "per_second_ry",
      filter : false,
      width: 200,
    },
     {
      headerName: "Percent",
      field: "percent",
      filter : false,
      width: 200,
    },
    {
      headerName: "Pools Type",
      field: "pools_type",
      filter : false,
      width: 200,
    },
    {
      headerName: "Staked",
      field: "staked",
      filter : false,
      width: 200,
    },
    {
      headerName: "Coin",
      field: "wallet_type",
      filter : false,
      width: 200,
    },
    {
      headerName: "Type",
      field: "type",
      filter : false,
      width: 200,
    }, 
    {
      headerName: "Date",
      field: "createdAt",
      filter : false,
      width: 200,
    },
    // {
    //   headerName: "Percent",
    //   field: "percent",
    //   filter : false,
    //   width: 200,
    // },
    // {
    //   headerName: "Per Second ROI",
    //   field: "per_second_ry",
    //   filter : false,
    //   width: 200,
    // },
  
    // {
    //   headerName: "KYC Status",
    //   field: "kyc_status",
    //   filter : false,
    //   width: 250,
    //   cellRendererFramework: params => {
    //     return params.value === 1 ? ( // for active
    //       <div className="badge badge-pill badge-light-success">Done</div>
    //     ) : params.value === 0 ? ( // Not submitted
    //       <div className="badge badge-pill badge-light-warning">Not Filled </div>
    //     ) : params.value === 2 ? ( // rejecetd
    //       <div className="badge badge-pill badge-light-danger">Rejected</div>
    //     ) : params.value === -1 ? ( // submitted but not approve
    //       <div className="badge badge-pill badge-light-warning">Filled but not Verified</div>
    //     ) : (
    //       <div className="badge badge-pill badge-light-warning">Not Filled</div>
    //     )
    //     }
    //   },
    //   {
    //     headerName: "Date",
    //     field: "time",
    //     filter: true,
    //     width: 250,
    //     cellRendererFramework: params => {
    //           return (
    //             <div>
    //               {Number(params.value) ? new Date(Number(params.value)).toLocaleString() : new Date(params.value).toLocaleString()}
    //             </div>
    //           )
    //         }
    //   },
    ]
  }
  onGridReady = params => {
    this.gridApi = params.api
    this.gridColumnApi = params.columnApi
  }
  filterData = (column, val) => {
    var filter = this.gridApi.getFilterInstance(column)
    var modelObj = null
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val
      }
    }
    filter.setModel(modelObj)
    this.gridApi.onFilterChanged()
  }

  filterSize = val => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val))
      this.setState({
        pageSize: val
      })
    }
  }
  updateSearchQuery = val => {
    this.gridApi.setQuickFilter(val)
    this.setState({
      searchVal: val
    })
  }

  refreshCard = () => {
    this.setState({ reload: true })
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All"
      })
    }, 500)
  }

  toggleCollapse = () => {
    this.setState(state => ({ collapse: !state.collapse }))
  }
  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onEntering = () => {
    this.setState({ status: "Opening..." })
  }

  onEntered = () => {
    this.setState({ status: "Opened" })
  }
  onExiting = () => {
    this.setState({ status: "Closing..." })
  }
  onExited = () => {
    this.setState({ status: "Closed" })
  }
  removeCard = () => {
    this.setState({ isVisible: false })
  }
  async componentDidMount() {
    getAPICall('user/get-referal-info'+window.location.search+'&admin_user_id='+this.state.currentUserId)
    .then(response => {
      // const rowData = response.data?.params?.total_referals ? response.data?.params?.total_referals : false;
      const referral_code = response.data?.params?.referral_code;
      const referral_count = response.data?.params?.total_referals.length
      const referal_earning = response.data?.params?.total_referal_earning;
      // this.setState({ rowData });
      if(referral_count){
        this.setState({ referral_count });
      }
      if(referral_code){
        this.setState({ referral_code });
      }
      if(referal_earning){
        this.setState({ referal_earning });
      }
    })
    let d=window.location.search.split("user_id=")
    d = d[1].split("&")[0]
    getAPICall('stake_history_by_user?user_id='+d)
    .then(response => {
      if(response.data.harvest && response.data.investment){
        const harvest = response.data?.harvest ? response.data?.harvest: false;
        const investment =  response.data?.investment ? response.data?.investment: false;
        console.log("harvest", harvest)
        console.log("investment", investment)
        this.setState({ harvest });
        this.setState({ investment });
        console.log("userStakeData", response)
      }
   
    })
   
  }
    updateQUERY = () => {
        const serialize = require('form-serialize');
        const form = document.querySelector('#tokendata');
        let alltxtData = serialize(form, { hash: true });
        alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('updatesettings',alltxtData)
        .then(response => {
            const website_setting = response.data.setting;
            this.setState({website_setting:website_setting});
        })
    }
  render() {
    const { harvest, investment, columnDefs1, columnDefs, referral_count,  defaultColDef, pageSize, referal_earning } = this.state;
    
   
    return (
    <React.Fragment>
      <Row className="app-user-list">
            <Col className="h1 card badge bg-primary text-wrap m-2 font-weight-bold" sm="2">
            Total Referral: {referral_count ? referral_count : 0 }
            </Col>
            <Col className="card badge bg-primary text-wrap m-2 font-weight-bold" sm="2">
            Total Referal Earning : {referal_earning ? referal_earning : 0 }
            </Col>
            <Col className="card badge bg-primary text-wrap m-2 font-weight-bold" sm="2">
            Total Harvest: {harvest?.[0]?.TotalHarvest ? harvest?.[0]?.TotalHarvest: 0}
            </Col>
            <Col className="card badge bg-primary text-wrap m-2 font-weight-bold" sm="2">
            Total Invest: {investment?.[0]?.TotalInvest ? investment?.[0]?.TotalInvest: 0}
            </Col>
            <Col className="card badge bg-primary text-wrap m-2 font-weight-bold" sm="2">
            Total Invest_btex: {investment?.[0]?.TotalInvest_btex ? investment?.[0]?.TotalInvest_btex: 0}
            </Col>
         </Row>
     
    
         <Row className="app-user-list">
            <Col className="card" sm="12">
           
            

            
            </Col>
         </Row>
         <Row className="app-user-list">
            <Col sm="6">
            <Card>
                <CardBody>
                <div className="ag-theme-material ag-grid-table">
                    <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="">
                      <div className="h1 text-white float-left card bg-primary p-1 font-weight-bold">Harvasting</div>
                    </div>
                    </div>
                    {this.state.harvest !== null && this.state.harvest !== false  && this.state.harvest.length > 0? (
                    <ContextLayout.Consumer>
                        {context => (
                        <AgGridReact
                            gridOptions={{}} 
                            rowSelection="multiple"
                            defaultColDef={defaultColDef}
                            columnDefs={columnDefs}
                            rowData={harvest[0].harvest ? harvest[0].harvest : 0 }
                            onGridReady={this.onGridReady}
                            colResizeDefault={"shift"}
                            animateRows={true}
                            floatingFilter={true}
                            pagination={true}
                            pivotPanelShow="always"
                            paginationPageSize={pageSize}
                            resizable={true}
                            enableRtl={context.state.direction === "rtl"}
                        />
                        )}
                    </ContextLayout.Consumer>
                    ) : (
                      <>
                        <div className="float-left">
                              {/* <Spinner color="primary" /> */}
                            </div>
                            <h2 className="float-left ml-1">No record.</h2>
                      </>
                    )}
                </div>
                </CardBody>
            </Card>
            </Col>
            <Col sm="6">
              <Card>
                  <CardBody>
                  <div className="ag-theme-material ag-grid-table">
                      <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                      <div className="">
                        <div className="h2 float-left h1 text-white float-left card bg-primary p-1 font-weight-bold">Investment</div>
                      </div>
                      </div>
                      {this.state.investment !== null && this.state.investment !== false  &&  this.state.investment.length > 0? (
                      <ContextLayout.Consumer>
                          {context => (
                          <AgGridReact
                              gridOptions={{}}
                              rowSelection="multiple"
                              defaultColDef={defaultColDef}
                              columnDefs={columnDefs1}
                              rowData={investment[0].invest ? investment[0].invest : 0}
                              onGridReady={this.onGridReady}
                              colResizeDefault={"shift"}
                              animateRows={true}
                              floatingFilter={true}
                              pagination={true}
                              pivotPanelShow="always"
                              paginationPageSize={pageSize}
                              resizable={true}
                              enableRtl={context.state.direction === "rtl"}
                          />
                          )}
                      </ContextLayout.Consumer>
                      ) : (
                        <>
                            <div className="float-left">
                            {/* <Spinner color="primary" /> */}
                          </div>
                          <h2 className="float-left ml-1">No record.</h2>
                        </>
                      )}
                  </div>
                  </CardBody>
              </Card>
            </Col>
        </Row>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUserId: state.auth.login.user.user_id
  }
}
export default connect(mapStateToProps)(UsersList)




// import React from "react"
// import { Row, Col, Button, Form, Input, Label, FormGroup } from "reactstrap"
// import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
// import Radio from "../../../../components/@vuexy/radio/RadioVuexy"
// import { Check, User, MapPin } from "react-feather"
// import Select from "react-select"
// import chroma from "chroma-js"
// import Flatpickr from "react-flatpickr";

// import "flatpickr/dist/themes/light.css";
// import "../../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"


// const languages = [
//   { value: "english", label: "English", color: "#7367f0" },
//   { value: "french", label: "French", color: "#7367f0" },
//   { value: "spanish", label: "Spanish", color: "#7367f0" },
//   { value: "russian", label: "Russian", color: "#7367f0" },
//   { value: "italian", label: "Italian", color: "#7367f0" }
// ]

// const colourStyles = {
//   control: styles => ({ ...styles, backgroundColor: "white" }),
//   option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//     const color = data.color ? chroma(data.color) : "#7367f0"
//     return {
//       ...styles,
//       backgroundColor: isDisabled
//         ? null
//         : isSelected
//         ? data.color
//         : isFocused
//         ? color.alpha(0.1).css()
//         : null,
//       color: isDisabled
//         ? "#ccc"
//         : isSelected
//         ? chroma.contrast(color, "white") > 2
//           ? "white"
//           : "black"
//         : data.color,
//       cursor: isDisabled ? "not-allowed" : "default",

//       ":active": {
//         ...styles[":active"],
//         backgroundColor: !isDisabled && (isSelected ? data.color : "#7367f0")
//       }
//     }
//   },
//   multiValue: (styles, { data }) => {
//     const color = data.color ? chroma(data.color) : "#7367f0"
//     return {
//       ...styles,
//       backgroundColor: color.alpha(0.1).css()
//     }
//   },
//   multiValueLabel: (styles, { data }) => ({
//     ...styles,
//     color: data.color ? data.color : "#7367f0"
//   }),
//   multiValueRemove: (styles, { data }) => ({
//     ...styles,
//     color: data.color,
//     ":hover": {
//       backgroundColor: data.color ? data.color : "#7367f0",
//       color: "white"
//     }
//   })
// }
// class UserInfoTab extends React.Component {
//   state = {
//     dob: new Date("1995-05-22")
//   }
//   handledob = date => {
//     this.setState({
//       dob: date
//     })
//   }
//   render() {
//     return (
//       <Form onSubmit={e => e.preventDefault()}>
//         <Row className="mt-1">
//         <Col md="12">
//           <h2>Coming Soon</h2>
//         </Col>
//         </Row>
//       </Form>
//     )
//   }
// }
// export default UserInfoTab
