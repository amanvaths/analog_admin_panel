import React from "react"
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  UncontrolledTooltip,
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
  Badge
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  Check
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import * as Icon from "react-feather"
import Select from "react-select"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import Checkbox from "../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { round } from "../utils/Math"
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/light.css";
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
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
    basicPicker: new Date(),
    from_date: '',
    to_date: '',
    rowData_usdt: null,
    allToken: null,
    pageSize: 20,
    user_status : 0,
    isVisible: true,
    reload: true,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    validPassword:true,
    verified: "All",
    department: "All",

    searchVal: "",
    blockchain_radio:0,
    is_coin:false,
    user_role_checked: false,
    defaultColDef: {
      sortable: true,
      readable: true,
      resizable: true,
      suppressMenu: true
    },
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
        headerName: "Date",
        field: "local_date",
        editable: true,
        filter : true,
        width : 180,
        cellRendererFramework: params => {
        let options = { month: 'short'};
         let dt = params.value && params.value ? new Date(params.value) : '';
         let shortMonth = dt ? new Intl.DateTimeFormat('en-US', options).format(dt) : '';
         let myDate = dt ? dt.getUTCDate() + " - "+shortMonth + " - " + dt.getFullYear()  : ''
          return (
            <div className="actions cursor-pointer">
              {params.value ? params.value : ''}
            </div>
          )
        }
      }, 
      {
        headerName: "BTEX invest",
        field: "total_btex",
        width : 180,
        filter : true,
      },
      {
        headerName: "USDT invest",
        field: "total_usdt_invest",
        width : 150,
        filter : true,
      },
      {
        headerName: "Total user",
        field: "total_user",
        width : 150,
        filter : false,
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
    postAPICall('stake-history-daily?admin_user_id='+this.state.currentUserId)
    .then(response => {
      if(response.status === 200){
        console.log(response.data.result);
        const rowData = response.data.btex_result;
        const rowData_usdt = response.data.usdt_result;
        if(rowData){
          this.setState({ rowData });
        }
        if(rowData){
          this.setState({ rowData_usdt });
        }
      }
    }).catch(e=>console.log(e));
  }
  getDateWiseHistory = (action,from,to) => {
    if(from && to){
      let alltxtData = {
        action  : action,
        from    : from,
        to      : to,
        admin_user_id : this.state.currentUserId
      } 
      postAPICall('stake-history-daily',alltxtData)
        .then(response => {
          const rowData = response.data.table;
          if(rowData){
            this.setState({rowData:rowData});
          }
          if(response.data.query_status){
            NotificationManager.success("Token Added Successfully")             
          }else{
            NotificationManager.error(response.data.message)
          }
        })
        this.setState({validPassword:true});
      }else{
      NotificationManager.error("Please Select Both start and end date")
    }
  }
  render() {
    const { rowData,columnDefs, rowData_usdt,from_date,to_date, basicPicker, defaultColDef, pageSize } = this.state;
    
    return (
    <React.Fragment>
        <Row className="app-user-list">
          <Col className="mb-3" md="3" sm="12">
            <h5 className="text-bold-500">From Date</h5>
            <Flatpickr
              className="form-control"
              value={basicPicker}
              onChange={date => {
                console.log("from date", date)
                this.setState({ from_date : date });
              }}
            />
          </Col>
          <Col className="mb-3" md="3" sm="12">
            <h5 className="text-bold-500">To date</h5>
            <Flatpickr
              className="form-control"
              value={basicPicker}
              onChange={date => {
                console.log("to date", date)
                this.setState({ to_date : date });
              }}
            />
          </Col>
          <FormGroup>
              <Button.Ripple
                  color="primary"
                  type="button"
                  className="mt-2"
                  onClick={() => {
                      this.getDateWiseHistory('stack_history',from_date,to_date)
                  }}
              >
                  Get History
              </Button.Ripple>
          </FormGroup>
        </Row>
        <Row className="app-user-list">
            <Col sm="6">
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
                        <div className="h2 float-left">Total BTEX Investment : {this.state.rowData !== null ? this.state.rowData.length : 0 }</div>
                      </div>
                      <div className="filter-actions d-flex">
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
                      ) : (
                        <>
                            <div className="float-left">
                            <Spinner color="primary" />
                          </div>
                          <h2 className="float-left ml-1">System is All Calculating Investment.</h2>
                        </>
                      )}
                  </div>
                  </CardBody>
              </Card>
            </Col>
            <Col sm="6">
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
                        <div className="h2 float-left">Total USDT Investment : {this.state.rowData_usdt !== null ? this.state.rowData_usdt.length : 0 }</div>
                      </div>
                      <div className="filter-actions d-flex">
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
                      {this.state.rowData_usdt !== null ? (
                      <ContextLayout.Consumer>
                          {context => (
                          <AgGridReact
                              gridOptions={{}}
                              rowSelection="multiple"
                              defaultColDef={defaultColDef}
                              columnDefs={columnDefs}
                              rowData={rowData_usdt}
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
                          <h2 className="float-left ml-1">System is All Calculating Stacking Users.</h2>
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