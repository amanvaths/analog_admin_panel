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
        headerName: "User",
        field: "name",
        filter : true,
        width: 450,
    },
      {
        headerName: "Reffreal Volume",
        field: "valume",
        filter : true,
        width: 200,
    },
    {
      headerName: "Coin",
      field: "wallet_type",
      filter : true,
      width: 200,
    },
    {
      headerName: "KYC Status",
      field: "kyc_status",
      filter : true,
      width: 250,
      cellRendererFramework: params => {
        return params.value === 1 ? ( // for active
          <div className="badge badge-pill badge-light-success">Done</div>
        ) : params.value === 0 ? ( // Not submitted
          <div className="badge badge-pill badge-light-warning">Not Filled </div>
        ) : params.value === 2 ? ( // rejecetd
          <div className="badge badge-pill badge-light-danger">Rejected</div>
        ) : params.value === -1 ? ( // submitted but not approve
          <div className="badge badge-pill badge-light-warning">Filled but not Verified</div>
        ) : (
          <div className="badge badge-pill badge-light-warning">Not Filled</div>
        )
        }
      },
      {
        headerName: "Date",
        field: "time",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
              return (
                <div>
                  {Number(params.value) ? new Date(Number(params.value)).toLocaleString() : new Date(params.value).toLocaleString()}
                </div>
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
    getAPICall('user/get-referal-info'+window.location.search+'&admin_user_id='+this.state.currentUserId)
    .then(response => {
      const rowData = response.data?.params?.total_referals ? response.data?.params?.total_referals : false;
      const referral_code = response.data?.params?.referral_code;
      this.setState({ rowData });
      if(referral_code){
        this.setState({ referral_code });
      }
    })
    getAPICall('settings?admin_user_id='+this.state.currentUserId)
    .then(response => {
        const website_setting = response.data;
        this.setState({website_setting:website_setting});
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
    const {rowData, referral_code,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    
    let token_list = null;
    if(this.state.gettoken != null){
        token_list = this.state.gettoken && this.state.gettoken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    return (
    <React.Fragment>
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
                      <div className="h2 float-left">User Referral Code : {referral_code ? referral_code : 0 }</div>
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
                    {this.state.rowData !== null && this.state.rowData !== false ? (
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
                    ) : (
                      <>
                        <div className="float-left">
                              <Spinner color="primary" />
                            </div>
                            <h2 className="float-left ml-1">System is Calculating All Reffreal.</h2>
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