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
  Spinner,
  Button
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  User,
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
import { history } from "../../../history"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
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
    rowData: null,
    pageSize: 50,
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
      {
        headerName: "Email",
        field: "email",
        filter: true,
        editable: true,
        width: 280,
      },
      {
        headerName: "Coin",
        field: "symbol",
        filter: true,
        editable: true,
        width: 150,
      },
      {
        headerName: "Amount",
        field: "amount",
        filter: true,
        editable: true,
        width: 150,
      },
      {
        headerName: "Remark",
        field: "remark",
        filter: true,
        editable: true,
        width: 200,
      },
      {
        headerName: "Date",
        field: "createdAt",
        filter: true,
        width: 200,
        cellRendererFramework: params => {
              return (
                <div >
                  {new Date(params.value).toLocaleString()}
                </div>
              )
            }
      },
      {
        headerName: "Actions/Fund",
        width: 350,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <span className="mr-2 text-danger">Rejected</span>
              <Edit
                className="mr-50"
                size={28}
                onClick={() => history.push("/app/user/edit/UserEdit?user_id="+params.data.user_id+"&active_tab=9")}
              />
            </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    let params =  {
            action : "withdraw_request",
            admin_user_id : this.state.currentUserId,
            status : -2,
            page: 1,
            per_page: this.state.pageSize
        }
        postAPICall('withdraw_history',params)
    .then(response => {
      const rowData = response.data;
      this.setState({ rowData });
    })
  }

  onGridReady = params => {
    this.gridApi = params.api
    this.setState({gridApi: params.api});
    this.gridColumnApi = params.columnApi
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gridApi !== prevState.gridApi) {
      const dataSource = {
        getRows: (rowData) => {
          // Use startRow and endRow for sending pagination to Backend
          // params.startRow : Start Page
          // params.endRow : End Page
          console.log("params", rowData, rowData.filterModel);
          const models = Object.entries(rowData.filterModel);
          
          const page = rowData.endRow / this.state.pageSize;
          let params =  {
            action : "withdraw_request",
            admin_user_id : this.state.currentUserId,
            status :-2,
            page: page,
            per_page: this.state.pageSize
        }
          models.forEach((field)=>{
            const f = field[0];
            const fV = `${field[1]?.filter}`;
            params[f] = fV;
          })
          postAPICall('withdraw_history',params).then((res) => {
            // console.log("Ressss:: ", res)
            // console.log(" res.data.result.t:: ", res.data.result.t)

            rowData.successCallback([...res.data.result.result], res.data.result.t);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }

  // async componentDidMount() {
  //   // let params = "?action=pending&raw=0&admin_user_id="+this.state.currentUserId;
  //   let params = {
  //       action : "withdraw_request",
  //       admin_user_id : this.state.currentUserId,
  //       status : -2
  //   }
  //   postAPICall('withdraw_history',params)
  //   .then(response => {
  //     const rowData = response.data.result;
  //     if(rowData){
  //         this.setState({ rowData });
  //     }
  //   })
  // }

  // onGridReady = params => {
  //   this.gridApi = params.api
  //   this.gridColumnApi = params.columnApi
  // }

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
  updateStatusQUERY = (token_symbol,action,status) => {
    const alltxtData = {
        token_symbol: token_symbol,
        [action]: status,
        admin_user_id: this.state.currentUserId
    }
    postAPICall('updatecrptosetting',alltxtData)
    .then(response => {
        console.log(response)
    })
  }
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state
    return (
      <Row className="app-user-list">
        <Col sm="12">
        </Col>
        <Col sm="12">
          <Card>
          <CardBody style={{ height: "85vh" }}>
              <div className="ag-theme-material ag-grid-table" style={{ height: "80vh" }}>
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
                    <div className="h2 float-left">Total Withdrawal : {this.state.rowData !== null ? this.state.rowData.result.t : 0 }</div>
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
                      cacheBlockSize={pageSize}
                      rowModelType={'infinite'}
                      onPageChage={this.handleChange}
                      rowHeight={false}
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
                        <h2 className="float-left ml-1">System is Calculating All withdraw.</h2>
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
export default connect(mapStateToProps)(UsersList)