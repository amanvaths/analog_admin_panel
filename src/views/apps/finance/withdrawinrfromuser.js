import React from "react"
import {
  Card,
  CardBody,
  Input,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
  Spinner,
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  ChevronDown,
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { postAPICall } from "../../../redux/helpers/api_functions"
import NotificationManager from "react-notifications/lib/NotificationManager"
import { connect } from "react-redux"

class WithdrawList extends React.Component {
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
        headerName: "payarrowUserId",
        field: "user_id",
        editable: true,
        width: 250
      },
      {
        headerName: "Name",
        field: "name",
        width: 150
      },
      {
        headerName: "Email",
        field: "email",
        editable: true,
        width: 300
      },
      {
        headerName: "Mobile No",
        field: "mobile_no",
        editable: true,
        width: 150
      },
      {
        headerName: "Bank_Name",
        field: "bank_name",
        width: 150
      },
      {
        headerName: "Account_No",
        field: "account_number",
        editable: true,
        width: 150
      },
      {
        headerName: "IFSC_Code",
        field: "ifsc",
        editable: true,
        width: 150
      },
      {
        headerName: "Amount",
        field: "amount",
        width: 120,
      },
      {
        headerName: "Password",
        field: "deposit_id",
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className=""> {params.value?params.value : '123456'}</div>
          )
        }
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
                    <Button.Ripple className="mr-1 btn-sm" color="success" onClick={() => {this.getApprove(params.data.user_id, params.data.transection_id, params.data.amount, params.data.email)}}>Approve</Button.Ripple>
                    <Button.Ripple className="mr-1 btn-sm" color="danger" onClick={() => {this.getDelete(params.data.user_id, params.data.transection_id, params.data.amount, params.data.email)}}>Reject</Button.Ripple>
                  </>:params.value == 1?"Approved":params.value == -2?"Reject":null }
              </div>
              )
            }
      },
    ]
  }

  async componentDidMount() {
    const body = {
      user_id: this.state.currentUserId,
      type: 'withdraw'
    }
    postAPICall('inr-history', body).then((response) => {
      const rowData = response.data.result;
      if(rowData){
        this.setState({ rowData });
      }
    })
  }

  getApprove = (user_id, transection_id, amount, email) => {
    const body = {
      admin_user_id: this.state.currentUserId,
      user_id: user_id,
      type: 'withdraw',
      amount: amount,
      email: email,
      transection_id: transection_id
    }
    postAPICall('change-inr-status', body).then((response) => {
      const result = response.data;
      if(result.status === 200) {
        NotificationManager.success(result.message)
        document.location.reload();
      } else {
        NotificationManager.error(result.message)
      }
    })
  }
  getDelete = (user_id, transection_id, amount, email) => {
    const body = {
      admin_user_id: this.state.currentUserId,
      transection_id: transection_id,
      amount: amount,
      email: email,
      type: 'withdraw',
      user_id: user_id,
    }
    postAPICall('inr-reject', body).then((response) => {
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
    const { rowData,columnDefs, defaultColDef, pageSize } = this.state;
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
                  <div className="h2 float-left">Total Withdraw : {rowData !== null ? rowData.length : 0 }</div>
                </div>
                <div className="d-flex flex-wrap justify-content-between mb-1">
                    <div className="table-input mr-1">
                      <Input
                        className="w-50 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={e => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                      />
                  </div>
                  <div className="export-btn">
                    <Button.Ripple
                      color="primary"
                      onClick={() => this.gridApi.exportDataAsCsv()}
                    >
                      Export as CSV
                    </Button.Ripple>
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
              ) : (
                <>
                     <div className="float-left">
                    <Spinner color="primary" />
                  </div>
                  <h2 className="float-left ml-1">System is All Calculating Withdraw Users.</h2>
                </>
              )}
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
export default connect(mapStateToProps)(WithdrawList)