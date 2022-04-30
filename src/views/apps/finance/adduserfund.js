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
import axios from "axios"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  RotateCw,
  X
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import Select from "react-select"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import NotificationManager from "react-notifications/lib/NotificationManager"

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
    alluser: null,
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
        headerName: "Name",
        field: "first_name",
        width: 250,
        filter: true,
        cellRendererFramework: params => {
          return (
            <div className=""> {params.data.first_name} {params.data.middle_name} {params.data.last_name}</div>
          )
        }
      },
      {
        headerName: "email",
        field: "email",
        width: 350,
        editable: true,
        filter: true,
      },
      {
        headerName: "Coin",
        field: "wallet_type",
        width: 300,
        filter: true,
      },
      {
        headerName: "Price",
        field: "amount",
        width: 200,
        filter: true,
      },
      {
        headerName: "Date & Time",
        field: "createdAt",
        width: 250,
        filter: true,
        cellRendererFramework: params => {
          return (
            <>
                {new Date(params.value).toLocaleString()}
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
        const gettoken = response.data;
        if(gettoken){
          this.setState({ gettoken });
        }
    })
    getAPICall('fundtranfer_history?admin_user_id='+this.state.currentUserId)
    .then(response => {
      const rowData = response.data.history;
      if(rowData){
        this.setState({rowData});
      }
    })
    getAPICall('getactivekyc?kyc=1&admin_user_id='+this.state.currentUserId)
    .then(response => {
        const alluser = response.data.table;
        if(alluser){
          this.setState({ alluser });
        }
    })
  }
  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('addfundtouser',alltxtData)
        .then(response => {
          const rowData = response.data.history;
          if(response.data.query_status == 1){
            NotificationManager.success(response.data.message)
            this.setState({rowData});
          }else{
            NotificationManager.error(response.data.message)
          }
        })
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    let token_list = null;
    let AllUser = null;
    if(this.state.gettoken != null){
        token_list = this.state.gettoken && this.state.gettoken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    if(this.state.alluser != null){
        AllUser = this.state.alluser && this.state.alluser.map(tokn =>{
          let username = '';
          if(tokn){
            username = tokn.first_name ? tokn.first_name+' ' : '';
            username = tokn.middle_name ? username+ tokn.middle_name+ ' ' : username;    
            username = tokn.last_name ? username+ tokn.last_name+' ' : username;    
          }
            return {label: username+" ("+tokn.email+") ", value: tokn.user_id}
        })
    }
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="tokendata">
                            <Col md="4" sm="12">
                                <FormGroup>
                                    {AllUser != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">All User ({AllUser.length})</Label>
                                        <Select
                                            className="React"
                                            id="user_id"
                                            classNamePrefix="select"
                                            name="user_id"
                                            options={AllUser}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {token_list != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Coin</Label>
                                        <Select
                                            className="React"
                                            id="wallet_type"
                                            classNamePrefix="select"
                                            name="wallet_type"
                                            options={token_list}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="amount" className="label-text h6">Amount</Label>
                                    <Input type="number" name="amount" id="amount" placeholder="Enter amount..." />
                                    <Input type="hidden" name="from_user" value='Admin'/>
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
                                        Add Fund
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
                        <h2 className="float-left ml-1">System is Calculating transferred fund.</h2>
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