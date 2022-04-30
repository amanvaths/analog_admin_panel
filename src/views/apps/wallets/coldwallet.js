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
  Edit,
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
import Toggle from "react-toggle"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import { history } from "../../../history"
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
    alltoken: null,
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
    columnDefs: [
      {
        headerName: "#",
        field: "rowIndex",
        filter : true,
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
        headerName: "Coin",
        field: "wallet_type",
        width: 200,
      },
      {
        headerName: "Contract Type",
        width: 200,
        field: "contract_type",
      },
      {
        headerName: "Wallet Address",
        field: "wallet_address",
        editable: true,
        filter: false,
        width: 400
      },
      {
        headerName: "Total Funs",
        field: "total_funds",
        filter: false,
        width: 200
      },
      // {
      //   headerName: "status",
      //   width: 150,
      //   cellRendererFramework: params => {
      //     return (
      //       <label className="react-toggle-wrapper w-25">
      //         <Toggle
      //           defaultChecked={!this.state.isChecked}
      //           className="switch-danger mt-1"
      //         />
      //       </label>
      //     )
      //   }
      // },
      {
        headerName: "Capture Fund",
        filter: false,
        field: "wallet_type",
        width: 150,
        cellRendererFramework: params => {
          let capture_fund = params.data.capture_fund ? params.data.capture_fund : false;
          return (
            <div className="actions cursor-pointer">
              <Button.Ripple className="mr-1 btn-sm" color="success" 
              onClick={() => {
                this.captureColdWalllet(
                  params.value,
                  capture_fund
                )
              }}
              disabled={!capture_fund}
              > Capture Fund </Button.Ripple>
            </div>
          )
        }
      },
      {
        headerName: "Capture Detail",
        field: "transactions",
        width: 200,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-2"
                size={28}
                onClick={() => {
                  let editurl = "/app/wallets/capturehits?wallet_type="+params.data.wallet_type;
                  history.push(editurl)
              }}
              />
            </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    getAPICall('coldwallet?admin_user_id='+this.state.currentUserId)
    .then(response => {
      const rowData = response.data;
      if(rowData){
        this.setState({ rowData });
      }
    })
    getAPICall('getallcoin?admin_user_id='+this.state.currentUserId)
    .then(response => {
      const alltoken = response.data;
      if(alltoken){
        this.setState({ alltoken });
      }
    })
    getAPICall('settings?admin_user_id='+this.state.currentUserId)
    .then(response => {
      const settings = response.data;
      if(settings){
        this.setState({ settings });
      }
    })
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
  captureColdWalllet = (currency,capture_fund) => {

    const user_id = this.state.currentUserId;
    const data = {
      wallet_type: currency,
      user_id: user_id,
      admin_user_id: this.state.currentUserId
    }
    console.log("data: ", data)
    if(!capture_fund){
      NotificationManager.info('Capture fund feature is Coming soon for this Coin')
    } else if(currency && user_id){
      NotificationManager.success("Capture Fund Activated and It will take 5-10 minutes. ")  
      postAPICall('capture_all_wallet',data)
        .then(response => {
          
          if(response.data.status == 400){
            NotificationManager.error(response.data.message)
          } else if(response.data.query_status){
            NotificationManager.success(response.data.message)             
          }
        })
    }else{
      NotificationManager.error("currency & user_id not found")             
    }
  }
  updateQUERY = (wallet_type,wallet_address,enter_password) => {
    const wlt_password = this.state.settings.wallet_password;
    const data = {
        wallet_type : wallet_type,
        wallet_address : wallet_address,
        admin_user_id: this.state.currentUserId
    }
    if(wallet_address){
      if(wlt_password == enter_password){
        postAPICall('updatecoldwallet',data)
        .then(response => {
          const rowData = response.data.table;
          if(response.data.query_status){
            getAPICall('coldwallet?admin_user_id='+this.state.currentUserId)
            .then(response => {
              const rowData = response.data;
              if(rowData){
                this.setState({ rowData });
              }
            })
            NotificationManager.success(response.data.message)             
          }else{
            NotificationManager.error("Wallet address not Added")             
          }
        })
        this.setState({validPassword:true});
      }else{
        NotificationManager.error("Please Fill correct Password")             
        this.setState({validPassword:false});
      }
    }else{
      NotificationManager.error("Please Fill Cold Wallet Address")             
    }
  }
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    // const colourOptions = [
    //     { value: "ocean", label: "Ocean" },
    //     { value: "blue", label: "Blue" },
    //     { value: "purple", label: "Purple" },
    //     { value: "red", label: "Red" },
    //     { value: "orange", label: "Orange" }
    //   ]
    let token_list = null;
    if(this.state.alltoken != null){
        token_list = this.state.alltoken && this.state.alltoken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                            <Form className="row">
                            <Col md="3" sm="12">
                            <FormGroup>
                                {token_list != null ? (
                                    <>
                                    <Label for="basicInput" className="h5">Coin</Label>
                                    <Select
                                        className="React"
                                        id="wallet_type"
                                        classNamePrefix="select"
                                        defaultValue={token_list[0]}
                                        name="wallet_type"
                                        options={token_list}
                                    />
                                    </>
                                ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="wallet_address" className="h5">Wallet Address</Label>
                                    <Input type="text" id="wallet_address" placeholder="Enter wallet address..." />
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="enter_password" className="h5">Enter Password</Label>
                                    <Input type="password" id="enter_password" placeholder="Enter Password..." 
                                      invalid={this.state.validPassword === false}
                                  />
                                    {!this.state.validPassword ? (
                                      <span className="invalid-tooltip ml-1">Wrong Password.</span>
                                    ) : (
                                      ""
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.updateQUERY(document.querySelector('[name = "wallet_type"]').value,document.querySelector('#wallet_address').value,
                                            document.querySelector('#enter_password').value
                                            
                                            )
                                        }}
                                    >
                                        Add Wallet Address
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
                        <h2 className="float-left ml-1">System is Loading All Wallet settings.</h2>
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