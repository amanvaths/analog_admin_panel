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
  Media,
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import Select from "react-select"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import { createSocketClient } from "../utils/functions"

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
    cmcDATA: null,
    onlyToken: null,
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
    columnDefs: [
      {
          headerName: "Logo",
          field: "icon",
          width: 100,
          cellRendererFramework: params => {
            return (
                <>
                  <Media
                    className="users-avatar-shadow rounded"
                    object
                    src={params.value}
                    alt="user profile image"
                    height="25"
                    width="25"
                    />
                </>
                )
            }
        },
        {
            headerName: "Token Name",
            field: "name",
            filter: true,
            width: 250,
            cellRendererFramework: params => {
                return (
                    <>
                        {params.value} ({params.data.symbol})
                    </>
                )
            }
        },
      {
        headerName: "Min Deposite",
        field: "min_deposite_limit",
        width: 180,
        filter: true,
      },
      {
        headerName: "Withdraw (Min/Max)",
        field: "max_withdraw_limit",
        width: 220,
        filter: false,
        cellRendererFramework: params => {
          return (
              <>
                  {params.data.min_withdraw_limit} / {params.data.max_withdraw_limit}
              </>
          )
        }
      },
      {
        headerName: "Max Daily Withdraw",
        field: "daily_withdraw_limit",
        width: 220,
        filter: true,
      },
      {
        headerName: "Capping Price (INR/USDT/BTC)",
        field: "order_low_limit",
        width: 300,
        filter: false,
        cellRendererFramework: params => {
          return (
              <>
                  {params.data.capping_price_inr} / {params.data.capping_price_usdt} / {params.data.capping_price_btc}
              </>
          )
        }
      },
      {
        headerName: "low(%) / high (%)",
        field: "order_low_limit",
        width: 180,
        filter: false,
        cellRendererFramework: params => {
          return (
              <>
                  {params.data.order_low_limit}% / {params.data.order_high_limit}%
              </>
          )
        }
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
    let alltxtData = {
      admin_user_id : this.state.currentUserId
    }
    postAPICall('gettoken',alltxtData)
    .then(response => {
      const rowData = response.data;
      if(rowData){
        this.setState({ rowData });
      }
    })
    let alltxtData2 = {
      admin_user_id : this.state.currentUserId,
      token_type : "self"
    }
    postAPICall('gettoken',alltxtData2)
    .then(response => {
      const onlyToken = response.data;
      if(onlyToken){
        this.setState({ onlyToken });
      }
    })
    const socket = new createSocketClient("kujgwvfq-a-ghosttown-z-1fhhup0p6");
    socket.on("cmc_updated", (res) => {
      if(res){
        this.setState({ cmcDATA : res });
      }
    });
  }
  updateQUERY = () => {
      const serialize = require('form-serialize');
      const form = document.querySelector('#tokendata');
      let alltxtData = serialize(form, { hash: true });
      alltxtData.admin_user_id = this.state.currentUserId;
      if(alltxtData.token_symbol){
        postAPICall('updatecrptosetting',alltxtData)
        .then(response => {
            const rowData = response.data.table;
            if(response.data.query_status){
              NotificationManager.success(response.data.message)             
              this.setState({rowData:rowData});
            }else{
              NotificationManager.error("limit not Added")             
            }
        })
      }else{
        NotificationManager.error("Please Select the coin")
      }
  }
  updateCappingQUERY = () => {
      const serialize = require('form-serialize');
      const form = document.querySelector('#cappingdata');
      let alltxtData = serialize(form, { hash: true });
      if(alltxtData.token_symbol){
        let getToken = this.state.cmcDATA.find((W) => (W.symbol == alltxtData.token_symbol));
        alltxtData.admin_user_id = this.state.currentUserId;
  
        alltxtData.capping_price_inr = getToken.current_price_inr
        alltxtData.capping_price_usdt = getToken.current_price_usdt;
        alltxtData.capping_price_btc = getToken.current_price_btc;
        alltxtData.capping_price_vrx = getToken.current_price_vrx;
        // console.log("alltxtData: ",alltxtData)
        postAPICall('updatecrptosetting',alltxtData)
        .then(response => {
            const rowData = response.data.table;
            if(response.data.query_status){
              NotificationManager.success(response.data.message)             
              this.setState({rowData:rowData});
            }else{
              NotificationManager.error("Capping not Added")             
            }
        })
      }else{
        NotificationManager.error("Please Select the coin")
      }
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    
    let token_list = null;
    let onlyToken_list = null;
    if(this.state.rowData != null){
        token_list = this.state.rowData && this.state.rowData.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    if(this.state.onlyToken != null){
      onlyToken_list = this.state.onlyToken && this.state.onlyToken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                      <div>
                        <Form className="row" id="tokendata">
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {token_list != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Select Coin</Label>
                                        <Select
                                            className="React"
                                            id="token_symbol"
                                            classNamePrefix="select"
                                            name="token_symbol"
                                            options={token_list}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="min_deposite_limit" className="label-text h6">Minimum Deposite Limit</Label>
                                    <Input type="number" name="min_deposite_limit" id="min_deposite_limit" placeholder="Enter limit amount..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="min_withdraw_limit" className="label-text h6">Minimum withdrawal Limit</Label>
                                    <Input type="number" name="min_withdraw_limit" id="min_withdraw_limit" placeholder="Enter limit amount..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="max_withdraw_limit" className="label-text h6">Maximum withdrawal Limit</Label>
                                    <Input type="number" id="max_withdraw_limit" name="max_withdraw_limit" placeholder="Enter limit amount..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="daily_withdraw_limit" className="label-text h6">Max daily withdrawal Limit</Label>
                                    <Input type="number" id="daily_withdraw_limit" name="daily_withdraw_limit" placeholder="Enter limit amount ..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.updateQUERY( )
                                        }}
                                    >
                                        Add Limit
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            
                          </Form>
                          <Form className="row" id="cappingdata">
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {onlyToken_list != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Select Coin</Label>
                                        <Select
                                            className="React"
                                            id="token_symbol"
                                            classNamePrefix="select"
                                            name="token_symbol"
                                            options={onlyToken_list}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                             </Col>
                              <Col md="2" sm="12">
                                  <FormGroup>
                                      <Label for="order_low_limit" className="label-text h6">Order Price Max Lose(%) </Label>
                                      <Input type="number" id="order_low_limit" name="order_low_limit" placeholder="Enter limit amount ..." />
                                  </FormGroup>
                              </Col>
                              <Col md="2" sm="12">
                                  <FormGroup>
                                      <Label for="order_high_limit" className="label-text h6">Order Price Max Jump(%) </Label>
                                      <Input type="number" id="order_high_limit" name="order_high_limit" placeholder="Enter limit amount ..." />
                                  </FormGroup>
                              </Col>
                              <Col md="2" sm="12">
                                  <FormGroup>
                                      <Button.Ripple
                                          color="primary"
                                          type="button"
                                          className="mt-2"
                                          onClick={() => {
                                              this.updateCappingQUERY( )
                                          }}
                                      >
                                          Add Capping
                                      </Button.Ripple>
                                  </FormGroup>
                              </Col>
                            </Form>
                            </div>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row className="app-user-list">
            <Col sm="12">
            <Card>
                <CardBody>
                <div className="ag-theme-material ag-grid-table">
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