import React from "react"
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  Media,
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
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
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { BaseURL, postAPICall } from "../../../redux/helpers/api_functions"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { connect } from "react-redux"

class DepositList extends React.Component {
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
        headerName: "ScreenShot",
        field: "tx_id",
        width: 200,
        cellRendererFramework: params => {
          return (
            <Media className="mr-2 my-25" left target="_blank" href={BaseURL+params.data.tx_id}>
              show Screenshot
            </Media>
          )
      }
      },
      {
        headerName: "Payment Id",
        field: "request_no",
        width: 150
      },
      {
        headerName: "Amount",
        field: "amount",
        width: 150
      },
      {
        headerName: "Type",
        field: "type",
        width: 150
      },
      {
        headerName: "user",
        field: "from_address",
        editable: true,
        width: 300
      },
      {
        headerName: "Date",
        field: "createdAt",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
              return (
                <div className="badge badge-pill badge-light-success">
                  {new Date(params.value).toLocaleString()}
                </div>
              )
            }
      },
      {
        headerName: "Action",
        field: "status",
        filter: true,
        width: 200,
        cellRendererFramework: params => {
              return (
                <div className="actions cursor-pointer">
                  {params.value ==0 ? <> 
                    <Button.Ripple className="mr-1 btn-sm" color="success" onClick={() => {this.getApprove(params.data.user_id, params.data.transection_id)}}>Approve</Button.Ripple>
                    <Button.Ripple className="mr-1 btn-sm" color="danger" onClick={() => {this.getDelete(params.data.user_id, params.data.transection_id)}}>Reject</Button.Ripple>
                  </>:params.value == 1?"Approved":params.value == -2?"Reject":null }
              </div>
              )
            }
      },
    ]
  }

  async componentDidMount() {
    const body = {
      admin_user_id : this.state.currentUserId,
      user_id: this.state.currentUserId,
      type: 'deposit'
    }
    postAPICall('deposit-inr-history', body).then((response) => {
      console.log("data", response.data);
      const rowData = response.data;
      if(rowData.status != 400 ){
        this.setState({ rowData });
      }
    })
  }

  getApprove = (user_id, transection_id) => {
    const body = {
      admin_user_id: this.state.currentUserId,
      user_id: user_id,
      type: 'deposit',
      transaction_id: transection_id
    }
    postAPICall('deposit-inr-status', body).then((response) => {
      const result = response.data;
      if(result.status === 200) {
        NotificationManager.success(result.message)
        document.location.reload();
      } else {
        NotificationManager.error(result.message)
      }
    })
  }
  getDelete = (user_id, transection_id) => {
    const body = {
      admin_user_id: this.state.currentUserId,
      transaction_id: transection_id,
      user_id: user_id,
    }
    postAPICall('deposit-inr-delete', body).then((response) => {
      const result = response.data;
      if(result.status === 200) {
        NotificationManager.success(result.message)
        document.location.reload();
      } else {
        NotificationManager.error(result.message)
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
  updateQUERY = (token_symbol,action,status) => {
    const alltxtData = {
        token_symbol: token_symbol,
        [action]: status,
    }
    postAPICall('updatecrptosetting',alltxtData)
    .then(response => {
        console.log(response)
    })
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    return (
      <Row className="app-user-list">
      <Col sm="12">
      </Col>
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
                  <div className="h2 float-left">Total Deposit : {rowData !== null ? rowData.length : 0 }</div>
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
              {rowData !== null ? (
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
              ) : null}
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
    )
  }
}


const mapStateToProps = state => {
  return {
    currentUserId: state.auth.login.user.user_id
  }
}
export default connect(mapStateToProps)(DepositList)