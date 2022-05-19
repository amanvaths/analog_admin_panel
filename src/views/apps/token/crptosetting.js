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
  Media
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
import Toggle from "react-toggle"
import { NotificationManager } from "react-notifications"
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
      // {
      //   headerName: "ID",
      //   field: "id",
      //   width: 50,
      //   checkboxSelection: true,
      //   headerCheckboxSelectionFilteredOnly: true,
      //   headerCheckboxSelection: true
      // },
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
      //   headerName: "Logo",
      //   field: "icon",
      //   width: 100,
      //   cellRendererFramework: params => {
      //     return (
      //         <>
      //           <Media
      //             className="users-avatar-shadow rounded"
      //             object
      //             src={params.value}
      //             alt="user profile image"
      //             height="25"
      //             width="25"
      //             />
      //         </>
      //         )
      //     }
      // },
      {
        headerName: "Token Name",
        field: "name",
        width: 400,
        cellRendererFramework: params => {
            return (
                <>
                    {params.value} ({params.data.symbol}) - {params.data.contract_type}
                </>
            )
        }
      },
      {
        headerName: "Buy",
        field: "is_buy",
        width: 150,
        cellRendererFramework: params => {
            return (
                <label className="react-toggle-wrapper w-25">
                <Toggle
                    defaultChecked={params.value == 0 || params.value == -1 ? false : params.value == 1 ? true : false}
                    disabled={params.value == -1 ? true : false}
                    className="switch-danger mt-1"
                    onClick={() => {
                        this.updateQUERY(params.data.symbol,'is_buy',params.value)
                    }}
                />
                </label>
            )
        }
      },
      {
        headerName: "Sell",
        field: "is_sell",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
            return (
                <label className="react-toggle-wrapper w-25">
                <Toggle
                    defaultChecked={params.value == 0 || params.value == -1 ? false : params.value == 1 ? true : false}
                    disabled={params.value == -1 ? true : false}
                    className="switch-danger mt-1"
                    onClick={() => {
                        this.updateQUERY(params.data.symbol,'is_sell',params.value)
                    }}
                />
                </label>
            )
        }
      },
      {
        headerName: "Withdrawal",
        field: "is_withdrawal",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
            return (
                <label className="react-toggle-wrapper w-25">
                <Toggle
                    defaultChecked={params.value == 0 || params.value == -1 ? false : params.value == 1 ? true : false}
                    disabled={params.value == -1 ? true : false}
                    className="switch-danger mt-1"
                    onClick={() => {
                        this.updateQUERY(params.data.symbol,'is_withdrawal',params.value)
                    }}
                />
                </label>
            )
        }
      },
      {
        headerName: "Deposite",
        field: "is_deposite",
        filter: false,
        width: 320,
        cellRendererFramework: params => {
            return (
                <label className="react-toggle-wrapper w-25">
                <Toggle
                    defaultChecked={params.value == 0 || params.value == -1 ? false : params.value == 1 ? true : false}
                    disabled={params.value == -1 ? true : false}
                    className="switch-danger mt-1"
                    onClick={() => {
                        this.updateQUERY(params.data.symbol,'is_deposite',params.value)
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
    
    getAPICall('getCryptoSetting')
    .then(response => {
      const rowData = response.data.crypto;
      this.setState({ rowData });
    })
  }
  updateQUERY = (token_symbol,action,status) => {
    status = status ? false : true;
    console.log(status,"status")
    const alltxtData = {
        symbol: token_symbol,
        [action]: status,

    }
    postAPICall('cryptoSetting',alltxtData)
    .then(response => {
      if(response.status==200){
    console.log(response.data.message,"success")
        getAPICall('getCryptoSetting')
        .then(response => {
          const rowData = response.data.crypto;
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
  render() {
    const { rowData,columnDefs, defaultColDef, pageSize } = this.state;

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