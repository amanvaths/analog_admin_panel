import React from "react"
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Spinner,
  CustomInput,
  Media
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  Volume2, VolumeX
} from "react-feather"
import NumericInput from "react-numeric-input"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { history } from "../../../history"
import Select from "react-select"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import Toggle from "react-toggle"
import Radio from "../../../components/@vuexy/radio/RadioVuexy"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import { mobileStyle } from "../../forms/form-elements/number-input/InputStyles"

class NotificationList extends React.Component {
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
    rowData: null,
    allToken: null,
    gridApi:null,
    total_order: 0,
    total_sell_order: 0,
    b_total_price: null,
    b_total_volume: null,
    b_total_count: null,
    s_total_price: null,
    s_total_volume: null,
    s_total_count: null,
    pageSize: 20,
    buysellchecked: false,
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
    blockchain_radio:0,
    is_coin:false,
    columnDefs: [
      {
        headerName: "#",
        field: "rowIndex",
        // filter : true,
        width: 50,
        cellRendererFramework: (params) => {
          return <>{1 + params?.rowIndex}</>;
        },
      },
      
      // {
      //   headerName: "Order Type",
      //   field: "order_type",
      //   filter: true,
      //   width: 150,
      //   cellRendererFramework: params => {
      //     return (
      //       <>
      //         {params.value && params.value == 'buy' ? (
      //           <div className="badge badge-pill badge-light-success">
      //             Buy
      //           </div>
      //         ) : (
      //           <div className="badge badge-pill badge-light-danger">
      //             Sell
      //           </div>
      //         )}
      //       </>
      //     )
      //   }
      // },
  
      {
        headerName: "Banner",
        field: "banner",
        filter: true,
        width: 250,
      },
      {
        headerName: "Description",
        field: "description",
        filter: true,
        width: 250,
    
      },
    
      {
        headerName: "Date",
        field: "createdAt",
        filter: true,
        width: 220,
      
      },
      {
        headerName: "Delete",
        field: "transactions",
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              {/* <Edit
                className="mr-2"
                size={28}
                onClick={() => {
                  let editurl =
                    "/app/editnotification?id=" + params.data._id;
                  history.push(editurl);
                }}
              /> */}
              <Trash2
                size={28}
                onClick={() => {
                  this.deleteNotification(params.data._id);
                }}
              />
            </div>
          );
        },
      },
    
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
    getAPICall('getNotification')
    .then(response => {
      const rowData = response.data;
      if(rowData){
        this.setState({ rowData });
      }
      this.setState({total_order:rowData.length})
    }).catch((err)=>{
      NotificationManager.error("Something went wrong.")
    });
    // getAPICall('paired_currency?status=1&admin_user_id='+this.state.currentUserId)
    // .then(response => {
    //   let cPaired = response.data;

    //   if(cPaired){
    //     this.setState({ cPaired });
    //   }
    // })
    // getAPICall('get-all-order?action=buysell&status=0&admin_user_id='+this.state.currentUserId)
    // .then(response => {
    //   let rowData = response.data.result;
    //   let total_buy_order = response.data.total_buy_order;
    //   let total_sell_order = response.data.total_sell_order;
    //   let b_total_price = response.data.b_total_price;
    //   let b_total_volume = response.data.b_total_volume;
    //   let b_total_count = response.data.b_total_count;
    //   let s_total_price = response.data.s_total_price;
    //   let s_total_volume = response.data.s_total_volume;
    //   let s_total_count = response.data.s_total_count;
    //   if(rowData){
    //     this.setState({ rowData });
    //   }
    //   if(total_buy_order){
    //     this.setState({ total_buy_order });
    //   }
    //   if(total_sell_order){
    //     this.setState({ total_sell_order });
    //   }
    //   if(b_total_price){
    //     this.setState({ b_total_price });
    //   }
    //   if(b_total_volume){
    //     this.setState({ b_total_volume });
    //   }
    //   if(b_total_count){
    //     this.setState({ b_total_count });
    //   }
    //   if(s_total_price){
    //     this.setState({ s_total_price });
    //   }
    //   if(s_total_volume){
    //     this.setState({ s_total_volume });
    //   }
    //   if(s_total_count){
    //     this.setState({ s_total_count });
    //   }
    // })
  }
  // updateStatusQUERY = (token_symbol,action,status) => {
  //   const alltxtData = {
  //       token_symbol: token_symbol,
  //       [action]: status,
  //       admin_user_id: this.state.currentUserId
  //   }
  //   postAPICall('updatecrptosetting',alltxtData)
  //   .then(response => {
  //       console.log(response)
  //   })
  // }
  deleteNotification = (_id) => {
    
    if(_id){
      postAPICall("deleteNotification",{id:_id})
      .then(response => {
        
        if(response.status == 200){
          NotificationManager.success("deleted successfully")  ;
          window.location.reload();           
        }else{
          NotificationManager.error("something went wrong")             
        }
      })
    }else{
      NotificationManager.error("order_id OR user_id Not Found")             
    }
  }
  // updateQUERY = () => {
  //   const serialize = require('form-serialize');
  //   const form = document.querySelector('#orderdata');
  //   let alltxtData = serialize(form, { hash: true });
  //   if(!alltxtData.wallet_type && !alltxtData.paired_currency && !alltxtData.inc_order && !alltxtData.total_order && !alltxtData.start_price){
  //     NotificationManager.error("Please Fill All Information")
  //   }else{
  //       alltxtData.admin_user_id = this.state.currentUserId;
  //       alltxtData.user_id = this.state.currentUserId;
  //       postAPICall('create-multiple-order',alltxtData)
  //       .then(response => {
  //         const rowData = response.data.table;
  //         if(rowData){
  //           this.setState({rowData:rowData});
  //         }
  //         if(response.data.query_status){
  //           getAPICall('get-all-order?action=buysell&status=0&admin_user_id='+this.state.currentUserId)
  //           .then(response => {
  //             let rowData = response.data.result;
  //             if(rowData){
  //               this.setState({ rowData });
  //             }
  //           })
          
  //           NotificationManager.success(response.data.message)             
  //         }else{
  //           NotificationManager.error(response.data.message)
  //         }
  //       })
  //       this.setState({validPassword:true});
  //   }
  // }
  
//   clear(){
//     // let self = this;
//     let dataSource = {
//         getRows(rowData) {
//             rowData.successCallback([],0);
//         }
//     };
//     this.state.gridApi.setDatasource(dataSource);
// }


  

  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize,gridApi } = this.state;
    // const CoinSetting = [{"label":"Buy","value":"buy"},{"label":"Sell","value":"sell"}];
    // let token_list = ''; let paired_list = ''; 
    // if(this.state.alltoken != null){
    //   token_list = this.state.alltoken && this.state.alltoken.map(tokn =>{
    //       return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
    //   })
    // }
    // if(this.state.cPaired != null){
    //   paired_list = this.state.cPaired && this.state.cPaired.map(tokn =>{
    //       return {label: tokn.currency_name+" ("+tokn.currency_coin+") ", value: tokn.currency_coin}
    //   })
    // }
  
    return (
    <React.Fragment>
    
        <Row className="app-user-list">

            <Col sm="12">
            <Card>
                <CardBody>
                <div className="ag-theme-material ag-grid-table" >
                    <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    <div className="sort-dropdown">
                        <UncontrolledDropdown className="ag-dropdown p-1">
                        <DropdownToggle tag="div">
                            1 - {pageSize} of 150
                            <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(20)}
                            >
                            20
                            </DropdownItem>
                            <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(50)}
                            >
                            50
                            </DropdownItem>
                            <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(100)}
                            >
                            100
                            </DropdownItem>
                            <DropdownItem
                            tag="div"
                            onClick={() => this.filterSize(150)}
                            >
                            150
                            </DropdownItem>
                        </DropdownMenu>
                        </UncontrolledDropdown>
                    </div>
                    {/* <div className="">
                      <div className="h2 float-left">Total Buy Order : {this.state.total_buy_order}</div>
                    </div> */}
                    {/* <div className="">
                      <div className="h2 float-left">Total Order : {this.state.total_order}</div>
                    </div> */}
                    <div className="filter-actions d-flex">
                        <Input
                        className="w-50 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={e => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                        />
                        <div className="dropdown actions-dropdown">
                        <UncontrolledButtonDropdown>
                            <DropdownToggle className="px-2 py-75" color="white">
                            Actions
                            <ChevronDown className="ml-50" size={15} />
                            </DropdownToggle>
                            <DropdownMenu right>
                            <DropdownItem tag="a">
                                <Trash2 size={15} />
                                <span className="align-middle ml-50">Delete</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                                <Clipboard size={15} />
                                <span className="align-middle ml-50">Archive</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                                <Printer size={15} />
                                <span className="align-middle ml-50">Print</span>
                            </DropdownItem>
                            <DropdownItem tag="a">
                                <Download size={15} />
                                <span className="align-middle ml-50" onClick={() => this.gridApi.exportDataAsCsv()}>CSV</span>
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        </div>
                    </div>
                    </div>
                    {this.state.rowData !== null ? (
                    <ContextLayout.Consumer>
                        {context => (
                        <AgGridReact
                            gridOptions={{}}
                            rowSelection="multiple"
                            defaultColDef={defaultColDef}
                            columnDefs={columnDefs}
                            rowData={rowData}
                            onGridReady={this.onGridReady}
                            colResizeDefault={"shift"}
                            animateRows={true}
                            floatingFilter={false}
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
                          <Spinner color="primary" />
                        </div>
                        <h2 className="float-left ml-1">System is Loading All Notification.</h2>
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
export default connect(mapStateToProps)(NotificationList)