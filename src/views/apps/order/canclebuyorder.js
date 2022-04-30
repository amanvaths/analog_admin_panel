import React from "react"
import {
  Card,
  CardBody,
  Input,
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
    rowDataSell: null,
    count: null,
    pageSize: 100,
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
    validPassword:true,
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
            <div className=""> {params?.data?.first_name} {params?.data?.middle_name} {params?.data?.last_name}</div>
          )
        }
      },
      {
        headerName: "email",
        field: "email",
        editable: true,
        width: 350,
        filter: true,
        cellRendererFramework: params => {
          return (
            <div className=""> {params?.value ? params?.value : params?.data?.user_id}</div>
          )
        }
      },
      {
        headerName: "Coin (Currency) ",
        field: "currency_type",
        filter: true,
        width: 200,
        cellRendererFramework: params => {
          return (
            <div className=""> {params?.value?.toUpperCase()} ({params?.data?.compare_currency?.toUpperCase()})</div>
          )
        }
      },
      {
        headerName: "Price",
        field: "raw_price",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="badge badge-pill badge-light-success">
              {params.value ? params.value : ''}
            </div>
          )
        }
      },
      {
        headerName: "Volume",
        field: "volume",
        filter: true,
        width: 150,
      },
      {
        headerName: "Deleted Buy",
        field: "deleted_by",
        filter: true,
        width: 170,
        cellRendererFramework: params => {
          return (
            <div className="">
              {params.value ? params.value : 'self'}
            </div>
          )
        }
      },
      {
        headerName: "Date",
        field: "updatedAt",
        filter: true,
        width: 220,
        cellRendererFramework: params => {
          return (
            <>
              <div className=""> {params.value ? new Date(params.value).toLocaleString() : '' }</div>
            </>
            
          )
        }
      },
    ]
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.setState({ gridApi: params.api });
    this.gridColumnApi = params.columnApi;
  };
  
  async componentDidMount() {
    const params = "&per_page=" + this.state.pageSize + "&page=1"
    getAPICall('get-all-order?action=buy&status=2&admin_user_id='+this.state.currentUserId + params)
      .then(response => {
        // console.log("response",response)
        const rowData = response.data.result;
        const  count = response.data.orderLength

        if(rowData){
          this.setState({ rowData });
        }
        if(count){
          this.setState({ count });
        }
      })
   
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
          let params = '?action=buy&status=2&admin_user_id='+this.state.currentUserId + "&per_page=" + this.state.pageSize + "&page=" + page;
          models.forEach((field)=>{
            const f = field[0];
            const fV = field[1]?.filter;
            params = `${params}&${f}=${fV}`;
          })
          getAPICall('get-all-order'+ params).then((res) => {
            rowData.successCallback([...res.data.result], res.data.orderLength);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }

  // async componentDidMount() {
  //   getAPICall('get-all-order?action=buy&status=2&admin_user_id='+this.state.currentUserId)
  //   .then(response => {
  //     const rowData = response.data.result;
  //     if(rowData){
  //       this.setState({ rowData });
  //     }
  //   })
  // }
  updateQUERY = (wallet_type,wallet_address,private_key,enter_password) => {
    const wlt_password = this.state.settings.wallet_password;
    const data = {
        wallet_type : wallet_type,
        wallet_address : wallet_address,
        private_key : private_key,
        admin_user_id: this.state.currentUserId
    }
    if(wallet_address && private_key){
      if(wlt_password == enter_password){
        postAPICall('updatehotwallet',data)
        .then(response => {
          const rowData = response.data.table;
          this.setState({rowData:rowData});
        })
        this.setState({validPassword:true});
      }else{
        this.setState({validPassword:false});
      }
    }else{

    }
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

  render() {
    const { rowData, rowDataSell, columnDefs, defaultColDef, pageSize } = this.state;
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
        <Col md="12" className="float-left">
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
                    <div className="h2 float-left">Total Canceled Order : {this.state.count !== null ? this.state.count : 0 }</div>
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
                    <h2 className="float-left ml-1">System is Calculating All Orders.</h2>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
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