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
} from "reactstrap"
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
import Toggle from "react-toggle"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { NotificationManager } from "react-notifications"
import { connect } from "react-redux"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

const marks = {
  0: {
    style: {
      color: "#d10000"
    },
    label: <strong>100/0</strong>
  },
  10: {
    style: {
      color: "#f90000"
    },
    label: <strong>90/10</strong>
  },
  20: {
    style: {
      color: "#ff4848"
    },
    label: <strong>80/20</strong>
  },
  30: {
    style: {
      color: "#fd6060"
    },
    label: <strong>70/30</strong>
  },
  40: {
    style: {
      color: "#f39b87"
    },
    label: <strong>60/40</strong>
  },
  50: {
    style: {
      color: "#808080"
    },
    label: <strong>50/50</strong>
  },
  60: {
    style: {
      color: "#28c76f"
    },
    label: <strong>40/60</strong>
  },
  70: {
    style: {
      color: "#1f9d57"
    },
    label: <strong>30/70</strong>
  },
  80: {
    style: {
      color: "#1b874b"
    },
    label: <strong>20/80</strong>
  },
  90: {
    style: {
      color: "green"
    },
    label: <strong>10/90</strong>
  },
  100: {
    style: {
      color: "green"
    },
    label: <strong>0/100</strong>
  }
}
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
    cPaired: null,
    growth_rate: 50,
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
    blockchain_radio:0,
    is_coin:false,
    columnDefs: [
      {
        headerName: "ID",
        field: "id",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true
      },
      {
        headerName: "Token Name(Symbol)",
        field: "currency_type",
        width: 250,
        cellRendererFramework: params => {
          return (
            <>
                {params.value}/{params.data.compare_currency}
            </>
          )
        }
      },
      {
        headerName: "Price",
        field: "price",
        width: 200,
      },
      {
        headerName: "Minimum Low",
        field: "low",
        width: 170
      },
      {
        headerName: "Maximum High",
        width: 170,
        field: "high",
      },
      {
        headerName: "Growth Rate %",
        width: 170,
        field: "growth_rate",
      },
      {
        headerName: "Date & Time",
        field: "updatedAt",
        width: 250,
        cellRendererFramework: params => {
          return (
            <>
                {params.value ? new Date(params.value).toLocaleString() : ''}
            </>
          )
        }
      },
      {
        headerName: "Status",
        field: "status",
        width: 150,
        cellRendererFramework: params => {
          return (
            <label className="react-toggle-wrapper w-25">
              <Toggle
                defaultChecked={params.value}
                className="switch-danger mt-1"
                onClick={() => {
                    this.updateStatusQUERY(params.data.currency_type, params.data.compare_currency,'status',!params.value)
                }}
              />
            </label>
          )
        }
      },
      {
        headerName: "Sync Price",
        field: "update_price",
        width: 200,
        cellRendererFramework: params => {
          return (
            <label className="react-toggle-wrapper w-25">
              <Toggle
                defaultChecked={params.value}
                className="switch-danger mt-1"
                onClick={() => {
                    this.updateStatusQUERY(params.data.currency_type, params.data.compare_currency,'update_price',!params.value)
                }}
              />
            </label>
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
      admin_user_id : this.state.currentUserId,
      token_type : "self"
    }
    postAPICall('gettoken',alltxtData)
    .then(response => {
        const gettoken = response.data;
        if(gettoken){
          this.setState({ gettoken });
        }
    })
    getAPICall('getremotetrading?admin_user_id='+this.state.currentUserId)
    .then(response => {
        const rowData = response.data;
        if(rowData){
          this.setState({ rowData });
        }
    })
    getAPICall('paired_currency?status=1&admin_user_id='+this.state.currentUserId)
    .then(response => {
      let cPaired = response.data;

      if(cPaired){
        this.setState({ cPaired });
      }
    })
  }
  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData.admin_user_id = this.state.currentUserId;
    alltxtData.status = 1;
    alltxtData.growth_rate = this.state.growth_rate;
    if(alltxtData.currency_type && alltxtData.compare_currency && alltxtData.low && alltxtData.high){
      postAPICall('updateremotetrading',alltxtData)
      .then(response => {
        if(response.data.query_status){
          getAPICall('getremotetrading?admin_user_id='+this.state.currentUserId)
          .then(response => {
              const rowData = response.data;
              if(rowData){
                this.setState({ rowData });
              }
          })
          NotificationManager.success("Setting updated successfully")             
        }else{
          NotificationManager.error(response.data.message)
        }  
      })
    }else if(!alltxtData.currency_type || !alltxtData.compare_currency){
      NotificationManager.error("Please Select Token and Coin.")             
    }else if(!alltxtData.high || !alltxtData.low){
      NotificationManager.error("Please enter high and low price")
    }else{
      NotificationManager.error("Please fill all data.")
    }
  }
  updateStatusQUERY = (token_symbol,compare_currency,index_change,status) => {
    const alltxtData = {
        currency_type: token_symbol,
        compare_currency: compare_currency,
        [index_change]: status,
        action : "change_status",
        admin_user_id: this.state.currentUserId
    }
    postAPICall('updateremotetrading',alltxtData)
    .then(response => {
      if(response.data.query_status){
        getAPICall('getremotetrading?admin_user_id='+this.state.currentUserId)
        .then(response => {
            const rowData = response.data;
            if(rowData){
              this.setState({ rowData });
            }
        })
        NotificationManager.success("Setting updated Successfully")             
      }else{
        NotificationManager.error("Setting not updated")
      }
    })
  }
  getTokenPrice = (wallet_type, compare_currency) => {
    console.log("growth_rate: ",this.state.growth_rate);
    let alltoken = this.state.gettoken;
    if(wallet_type && alltoken && compare_currency){
      let getprice = alltoken.find((W) => (W.symbol == wallet_type))
      let getcurrency = compare_currency.toLocaleLowerCase()+"_price";
      document.getElementById("price").value = getprice[getcurrency] ? getprice[getcurrency] : 0 ;
    }
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    let token_list = null;
    let paired_list = null;
    if(this.state.gettoken != null){
        token_list = this.state.gettoken && this.state.gettoken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    if(this.state.cPaired != null){
        paired_list = this.state.cPaired && this.state.cPaired.map(tokn =>{
            return {label: tokn.currency_name+" ("+tokn.currency_coin+") ", value: tokn.currency_coin}
        })
    }
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="tokendata">
                            <Col md="3" sm="12">
                                <FormGroup>
                                    {token_list != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Token</Label>
                                        <Select
                                            className="React"
                                            id="currency_type"
                                            classNamePrefix="select"
                                            name="currency_type"
                                            options={token_list}
                                            onChange = {(e) => {
                                              this.getTokenPrice(e.value,document.querySelector("[name='compare_currency']").value)
                                            }}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {paired_list != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Currency</Label>
                                        <Select
                                            className="React"
                                            id="compare_currency"
                                            classNamePrefix="select"
                                            name="compare_currency"
                                            options={paired_list}
                                            onChange = {(e) => {
                                              this.getTokenPrice(document.querySelector("[name='currency_type']").value,e.value)
                                            }}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="price" className="label-text h6">Price</Label>
                                    <Input type="number" name="price" readOnly id="price" defaultValue={0} placeholder="Enter price..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="low" className="label-text h6">Minimum Low</Label>
                                    <Input type="number" id="low" name="low" placeholder="Enter low price ..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="high" className="label-text h6">Maximum High</Label>
                                    <Input type="number" id="high" name="high" placeholder="Enter high price ..." />
                                </FormGroup>
                            </Col>
                            <Col md="7" sm="12" className="">
                                <FormGroup>
                                <Label for="high" className="label-text h6">Growth Rate % (Down/Up)</Label>
                                  <div className="ml-2 mr-2">
                                  <Slider
                                      min={0}
                                      max={100}
                                      marks={marks}
                                      step={10}
                                      defaultValue={this.state.growth_rate}
                                      className="pb-2"
                                      onChange={(value) => {
                                        this.setState({growth_rate : value})
                                      }}
                                      name="growth_rate"
                                      // tipProps={{
                                      //   prefixCls: "rc-slider-tooltip"
                                      // }}
                                    />
                                  </div>
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
                                        Add Remote Trading
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
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
                        <h2 className="float-left ml-1">System is Loading All Settings.</h2>
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