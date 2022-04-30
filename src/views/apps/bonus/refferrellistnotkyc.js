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
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import {  postAPICall } from "../../../redux/helpers/api_functions"
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
    totalEarned: null,
    allToken: null,
    pageSize: 100,
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
        headerName: "Email",
        field: "email",
        filter: true,
        editable: true,
        width: 350,
    },
    {
      headerName: "KYC Status",
      field: "is_kyc_verified",
      filter: true,
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
        headerName: "Referrel Code",
        field: "parent_ref_code",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
              return (
                <div >
                  {params.value}
                </div>
              )
            }
      },
    {
        headerName: "Referral User",
        field: "parent_detail",
        filter: true,
        width: 350,
        cellRendererFramework: params => {
          return (
            <div >
              {params.value && params.value[0] ? params.value[0].email : ''}
            </div>
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
                <div >
                  {new Date(params.value).toLocaleString()}
                </div>
              )
            }
      },
    ]
  }
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

  async componentDidMount() {
    let params =  {
            action : "all_referal",
            admin_user_id : this.state.currentUserId,
            page: 1,
            per_page: this.state.pageSize
        }
        postAPICall('user/get-referal-notkyc',params)
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
          // console.log("params", rowData, rowData.filterModel);
          const models = Object.entries(rowData.filterModel);
          
          const page = rowData.endRow / this.state.pageSize;
          let params =  {
            action : "all_referal",
            admin_user_id : this.state.currentUserId,
            page: page,
            per_page: this.state.pageSize
        }
          models.forEach((field)=>{
            const f = field[0];
            const fV = `${field[1]?.filter}`;
            params[f] = fV;
            // delete params.action
            // delete params.admin_user_id
            // delete params.page
            // delete params.per_page
          })
         

          console.log("paramsparams",params)
          postAPICall('user/get-referal-notkyc',params).then((res) => {
            rowData.successCallback([...res?.data?.result?.user_data], res?.data?.result?.total_Count);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }

  // async componentDidMount() {
  //   let formData = {
  //     action: "all_referal",
  //     admin_user_id: this.state.currentUserId
  //   }
  //   postAPICall('user/get-referal-notkyc',formData)
  //   .then(response => {
  //       const rowData = response.data.result;
  //       if(rowData){
  //         this.setState({rowData});
  //       }
  //   })
  // }
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
    const {rowData, gettoken, website_setting,columnDefs, totalEarned, blockchain_radio, defaultColDef, pageSize } = this.state;
    
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
                    <div>
                      <h3 className="float-left mr-1">Total User: {this.state.rowData !== null ? this.state.rowData.result.total_Count : 0 }  </h3>
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
                        cacheBlockSize={pageSize}
                        rowModelType={'infinite'}
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
                        <h2 className="float-left ml-1">System is Loading All users.</h2>
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