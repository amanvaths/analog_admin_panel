import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
  Collapse,
  Spinner
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Eye,
  User,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  UserCheck,
  X
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { history } from "../../../history"
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
    pageSize: 20,
    isVisible: true,
    reload: true,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
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
      // {
      //   headerName: "Profile Pic",
      //   field: "username",
      //   width: 100,
      //   cellRendererFramework: params => {
      //     return params.value == '' ? (
      //       <div className="d-flex align-items-center cursor-pointer" >
      //         <img
      //           className="rounded-circle mr-50"
      //           src={params.data.avatar}
      //           alt="user avatar"
      //           height="30"
      //           width="30"
      //         />
      //       </div>
      //     ) : (
      //       <User size={30} />
      //     )
      //   }
      // },
      {
        headerName: "Email",
        field: "email",
        filter: true,
        editable: true,
        width: 250      
      },
 
      {
        headerName: "Status",
        field: "status",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return params.value === 1 ? (
            <div className="badge badge-pill badge-light-success">
              Active
            </div>
          ) : params.value === 0 ? (
            <div className="badge badge-pill badge-light-warning">
              Not Active
            </div>
          ) : params.value === 2 ? (
            <div className="badge badge-pill badge-light-danger">
              Blocked
            </div>
          ) : null
        }
      },
     
      // {
      //   headerName: "KYC Verified",
      //   field: "is_kyc_verified",
      //   filter: true,
      //   width: 130,
      //   cellRendererFramework: params => {
      //     return params.value === 1 ? (
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : params.value === 0 ? (
      //       <div className="bullet bullet-sm bullet-danger"></div>
      //     ) : null
      //   }
      // },
      // {
      //   headerName: "Bank Verified",
      //   field: "is_bank_verified",
      //   filter: true,
      //   width: 130,
      //   cellRendererFramework: params => {
      //     return params.value === 1 ? (
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : params.value === 0 ? (
      //       <div className="bullet bullet-sm bullet-danger"></div>
      //     ) : null
      //   }
      // },
      // {
      //   headerName: "Mobile Number",
      //   field: "mobile_number",
      //   filter: true,
      //   width: 125,
      //   cellRendererFramework: params => {
      //     return params.value === 0 ? (
      //       <div className=""> </div>
      //     ) :  (
      //       <div className="">{params.value}</div>
      //     )
      //   }
      // },
      {
        headerName: "Edit/Active/Delete",
        field: "transactions",
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Eye
                className="mr-2"
                size={28}
                onClick={() => history.push("/app/user/edit/UserEdit?email="+params.data.email)}
              />
              <UserCheck
                className="mr-2"
                size={28}
                onClick={() => {
                  this.unBlockUser("update_profile",params.data.email,1)
                }}
              />
              {/* <Trash2
                
                size={28}
                onClick={() => {
                  this.deleteUser("delete_user",params.data.user_id,-2)
                }}
              /> */}
            </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    // let params = "?action=blockuser&raw=0&admin_user_id="+this.state.currentUserId;
    getAPICall('getUser?status=2')
    .then(response => {
      const rowData = response.data.user;
      
        this.setState({ rowData });
      
    }).catch(err=>console.log(err,"errororor"))
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
  deleteUser = (action,user_id,status) => {
    let alltxtData = {}
    if(!action && !user_id){
      NotificationManager.error("Please Fill All Information")
    }else{
        alltxtData.action    = action;
        alltxtData.user_id    = user_id;
        alltxtData.status    = status;
        alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('permanent_delete_user',alltxtData)
        .then(response => {
          if(response.data.status == 200){
            let selectedData = this.gridApi.getSelectedRows()
            this.gridApi.updateRowData({ remove: selectedData })
            NotificationManager.success("Employee Deleted Successfully")             
          }else{
            NotificationManager.error(response.data.message)
          }
        })
        this.setState({validPassword:true});
    }
  }
  unBlockUser = (action,email,status) => {
    let alltxtData = {}
    if(!email){
      NotificationManager.error("Please Fill All Information")
    }else{
        alltxtData.action    = action;
        alltxtData.email    = email;
        alltxtData.status    = status;
        alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('blockuser',alltxtData)
        .then(response => {
          if(response.status == 200){
            let selectedData = this.gridApi.getSelectedRows()
            this.gridApi.updateRowData({ remove: selectedData })
            NotificationManager.success(response.data.message)
          }else{
            NotificationManager.error(response.data.message)
          }
        })
        this.setState({validPassword:true});
    }
  }
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
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
                    <div className="h2 float-left">Total Blocked User: {this.state.rowData !== null ? this.state.rowData.length : 0 }</div>
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
                        overlayNoRowsTemplate="No User Blocked."
                        enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : <div><h3>No blocked user Found.</h3></div>}
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
export default connect(mapStateToProps)(UsersList)