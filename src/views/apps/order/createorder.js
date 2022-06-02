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
         filter : true,
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
        headerName: "Email",
        field: "email",
        filter: true,
        width: 250,
      },
      {
        headerName: "Coin (Currency) ",
        field: "currency_type",
        filter: true,
        width: 200,
        // cellRendererFramework: params => {
        //   return (
        //     <div className=""> {params.value.toUpperCase()} ({params.data.compare_currency.toUpperCase()})</div>
        //   )
        // }
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: true,
        width: 150,
      },
      {
        headerName: "Price",
        field: "raw_price",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="badge badge-pill badge-light-success">
              {params.value ? params.value : ''}
            </div>
          )
        }
      },
      {
        headerName: "Compare Currency",
        field: "compair_currency",
        filter: true,
        width: 200,
      },
      {
        headerName: "Coin Volume",
        field: "cVolume",
        filter: true,
        width: 200,
      },
      {
        headerName: "Date",
        field: "createdAt",
        filter: true,
        width: 220,
      
      },
      {
        headerName: "Actions",
        field: "order_id",
        width: 130,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Trash2
                size={15}
                onClick={() => {
                  let selectedData = this.gridApi.getSelectedRows()
                  this.gridApi.updateRowData({ remove: selectedData })
                  console.log(params,"paraa")
                  this.DeleteOrder(params.data._id)
                }}
              />
            </div>
          )
        }
      }
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
    getAPICall('getAllOrder')
    .then(response => {
      const rowData = response.data.order;
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
  DeleteOrder = (_id) => {
    
    if(_id){
      getAPICall('deleteOrders?id='+_id)
      .then(response => {
        // const rowData = response.data;
        if(response.status == 200){
          this.gridApi.updateRowData({ remove: _id });
          NotificationManager.success(response.data.message)             
        }else{
          NotificationManager.error(response.data.message)             
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
  
  clear(){
    // let self = this;
    let dataSource = {
        getRows(rowData) {
            rowData.successCallback([],0);
        }
    };
    this.state.gridApi.setDatasource(dataSource);
}

  updateQUERY(start,end){
    const sDate =new Date(start).toISOString().substring(0,10)
    const eDate = new Date(end).toISOString().substring(0,10)
   
    // this.clear();
 
    if(start==null || end ==null){
      NotificationManager.error("Missing credentials.")
    }else{
      getAPICall("getAllOrder?start="+sDate +"&endDate="+eDate).then((res)=>{
    
        // if(res.data.status == 200) {
        //   let dataSource = {
        //     getRows(rowData) {
        //         rowData.successCallback(res.data.order,res.data.order.length);
        //     }
        // };
    
        //   this.state.gridApi.setDatasource(dataSource);
        //   //  this.setState({ rowData:res.data.order });
        // }
        this.setState({rowData:res.data.order})
        this.setState({total_order:res.data.order.length})
      }
      ).catch((err)=> console.log(err,"err"))
    }
   
  
  
    
  };
  

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
       {/*  <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="orderdata">
                            <input type='hidden' name="token_type" value='self'/>
                            <Col md="2" sm="12">
                              <FormGroup>
                                {token_list != null ? (
                                    <>
                                    <Label for="basicInput" className="h5">Select Coin</Label>
                                    <Select
                                        className="React"
                                        id="currency_type"
                                        classNamePrefix="select"
                                        defaultValue={token_list[0]}
                                        name="currency_type"
                                        options={token_list}
                                    />
                                    </>
                                ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                              <FormGroup>
                                {paired_list != null ? (
                                    <>
                                    <Label for="basicInput" className="h5">Select Paired Currency</Label>
                                    <Select
                                        className="React"
                                        id="compare_currency"
                                        classNamePrefix="select"
                                        defaultValue={paired_list[0]}
                                        name="compare_currency"
                                        options={paired_list}
                                    />
                                    </>
                                ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="1" sm="12">
                                <FormGroup>
                                    {CoinSetting != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h5">Order Type</Label>
                                        <Select
                                            className="React"
                                            id="action"
                                            classNamePrefix="select"
                                            defaultValue={CoinSetting[0]}
                                            name="action"
                                            options={CoinSetting}
                                            onChange={(e) => {
                                              this.setState({ is_coin: e.value })
                                          }}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="inc_order" className="label-text h6">Increasing Or Decreasing Price</Label>
                                    <NumericInput id="inc_order" value={0} step={0.01} precision={2} name="inc_order" mobile style={mobileStyle} />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="total_order" className="label-text h6">Total Order</Label>
                                    <NumericInput id="total_order" min={0} max={100} value={0} name="total_order" step={1} precision={2} mobile style={mobileStyle} />
                                </FormGroup>
                            </Col>
                            <Col md="1" sm="12">
                                <FormGroup>
                                    <Label for="volume" className="label-text h6">Volume</Label>
                                    <Input type="number" min='0' id="volume" name="volume" placeholder="Enter Volume" />
                                </FormGroup>
                            </Col>
                            <Col md="1" sm="12">
                                <FormGroup>
                                    <Label for="raw_price" className="label-text h6"> Price</Label>
                                    <Input type="number" min='0' id="raw_price" name="raw_price" placeholder="Enter Price" />
                                </FormGroup>
                            </Col>
                            <Col md="1" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.updateQUERY( )
                                        }}
                                    >
                                        Create
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row> */}
        <Row className="app-user-list">

        <Col sm="12">
        <Card>
              <CardBody>
                <Form className="row">
        
                  <Col md="3" sm="12">
                    <FormGroup>
                      <Label for="from" className="h5">
                       FROM
                      </Label>
                      <Input
                        type="date"
                        id="from"
                        placeholder="From Date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3" sm="12">
                    <FormGroup>
                      <Label for="to" className="h5">
                        To
                      </Label>
                      <Input
                        type="date"
                        id="to"
                        placeholder="To Date"
                        // invalid={this.state.validPassword === false}
                      />
                      
                    </FormGroup>
                  </Col>
                  <Col md="3" sm="12">
                    <FormGroup>
                      <Button.Ripple
                        color="primary"
                        type="button"
                        className="mt-2"
                        onClick={() => {
                          this.updateQUERY(
                            document.querySelector("#from").value? document.querySelector("#from").value:null,
                            document.querySelector("#to").value? document.querySelector("#to").value:null
                          );
                        }}
                      >
                        Find Order
                      </Button.Ripple>
                    </FormGroup>
                  </Col>
                </Form>
              </CardBody>
            </Card>
        </Col>
       
          
          {/* hellooooooooooo */}
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
                    <div className="">
                      <div className="h2 float-left">Total Order : {this.state.total_order}</div>
                    </div>
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
                        <h2 className="float-left ml-1">System is Loading All Token settings.</h2>
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