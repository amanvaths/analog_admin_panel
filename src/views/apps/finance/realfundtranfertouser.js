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
import { connect } from "react-redux"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  Edit,
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import Select from "react-select"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { NotificationManager } from "react-notifications"
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
    allToken: null,
    alluser: null,
    spinner:0,
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
        headerName: "Email",
        field: "email",
        filter: true,
        editable: true,
        width: 350,
      },
      {
        headerName: "Name",
        field: "first_name",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              {params.data.first_name} {params.data.middile_name} {params.data.last_name} 
            </div>
          )
        }
      },
      {
        headerName: "Coin",
        field: "wallet_type",
        width: 150,
        filter: true,
      },
      {
        headerName: "Contract Type",
        field: "type",
        width: 170,
        filter: true,
      },
      {
        headerName: "Volume",
        field: "ac_balance",
        width: 200,
        filter: true,
      },
      {
        headerName: "Fund Last Update",
        field: "ac_last_update",
        width: 250,
        filter: true,
        cellRendererFramework: params => {
          return (
            <>
                {params.value ? new Date(Number(params.value)).toLocaleString() : new Date(Number(params.data.ac_transfer_last_update)).toLocaleString()}
            </>
          )
        }
      },
      {
        headerName: "Actions",
        field: "transactions",
        width: 150,
        
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-50"
                size={15}
                onClick={() => {
                  let editurl = "/app/user/edit/UserEdit?user_id="+params.data.user_id+"&active_tab=9";
                  history.push(editurl)
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
  }
  RefreshAllWallet = (wallet_type) => {
    const alltxtData =  {
      action : 'refresh_all',
      user_id: this.state.currentUserId,
      wallet_type: wallet_type,
      admin_user_id: this.state.currentUserId
    }
    if(wallet_type){
      NotificationManager.success("System is synchronizing all wallets and It will take 10-15 Min. ")  
      postAPICall('get_actual_bal',alltxtData)
      .then(response => {
        const res = response.data;
        if(res.status == 200 ){
          NotificationManager.success(res.message)
        }else if(res.status == 400 ){
          NotificationManager.error(res.message)
        }
      })
    }else{
      NotificationManager.error("Please Select a Coin")
    }
  }
  showAllUsers = (wallet_type) => {
    let alltxtData = {
      wallet_type : wallet_type,
      action      : 'ac_balance_sep',
      admin_user_id: this.state.currentUserId
    }
    this.setState({spinner : 1});
    if(wallet_type){
      postAPICall('get-user-wallets',alltxtData)
      .then(response => {
        const rowData = response.data.wallets;
        this.setState({spinner : 0});
        if(rowData){
          this.setState({rowData});
        }
      })

    }else{
      NotificationManager.error("Please Select a Coin")
    }
  }
  SendMoneyToAll = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData.admin_user_id = this.state.currentUserId;
    postAPICall('addfundtouser',alltxtData)
    .then(response => {
      const rowData = response.data.history;
      if(rowData){
        this.setState({rowData});
      }
    })
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    let token_list = null;
    if(this.state.gettoken != null){
        token_list = this.state.gettoken && this.state.gettoken.map(tokn =>{
            let type = tokn.contract_type ? ' - '+tokn.contract_type : '';
            let name = tokn.name+" ("+tokn.symbol+") "+type
            return {label: name, value: tokn.symbol}
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
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.showAllUsers(document.querySelector('[name = "wallet_type"]').value)
                                        }}
                                    >
                                        Show All Users
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.RefreshAllWallet(document.querySelector('[name = "wallet_type"]').value)
                                        }}
                                    >
                                        Sync All User Wallets
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
                    <div className="">
                      <div className="h2 float-left">Total Users : {this.state.rowData !== null ? this.state.rowData.length : 0 }</div>
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
                            floatingFilter={true}
                            pagination={true}
                            pivotPanelShow="always"
                            paginationPageSize={pageSize}
                            resizable={true}
                            enableRtl={context.state.direction === "rtl"}
                        />
                        )}
                    </ContextLayout.Consumer>
                    ) : ''}
                    {this.state.spinner == 1 ? (
                      <>
                        <div className="float-left">
                          <Spinner color="primary" />
                        </div>
                        <h2 className="float-left ml-1">System is Calculating transferred fund.</h2>
                      </>
                    ) : ''}
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
