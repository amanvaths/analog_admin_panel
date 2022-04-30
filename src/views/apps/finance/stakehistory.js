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
    basicPicker: new Date(),
    from_date: '',
    to_date: '',
    rowData: null,
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
        headerName: "Email",
        field: "email",
        editable: true,
        filter : true,
        width : 300,
        cellRendererFramework: params => {
         
          return (
            <div className="actions cursor-pointer">
              {params.data.data && params.data.data.length ? (
                <Badge color="light-success">{params.value}</Badge>
                ) : (
                  <Badge color="light-primary">{params.value}</Badge>
                )}
            </div>
          )
        }
      }, 
      {
        headerName: "Symbol / Days / %",
        field: "wallet_type",
        width : 200,
        filter : true,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              {params.data.wallet_type} / {params.data.type} / {params.data.percent}%
            </div>
          )
        }
      },
      {
        headerName: "Invest Type",
        field: "invest_type",
        width : 150,
        filter : true,
      },
      {
        headerName: "Total Income",
        field: "staked",
        width : 150,
        filter : true,
        cellRendererFramework: params => {
          let usdtPrice = params.value ? params.value : 0
          return (
            <div className="actions cursor-pointer">
              {usdtPrice ? round(usdtPrice) : 0} 
            </div>
          )
        }
      },
      {
        headerName: "Per Sec RY",
        field: "per_second_ry",
        width : 150,
        filter : true,
        cellRendererFramework: params => {
          let usdtPrice = params.value ? params.value : 0
          return (
            <div className="actions cursor-pointer">
              {usdtPrice ? round(usdtPrice) : 0} 
            </div>
          )
        }
      },
      
      {
        headerName: "BTEX / USDT Price",
        field: "usdtprice",
        width : 200,
        filter : false,
        cellRendererFramework: params => {
          let usdtPrice = params.value ? round(params.value) : 0
          let btexPrice = params.data.btexprice ? round(params.data.btexprice) : 0
          return (
            <div className="actions cursor-pointer">
              {btexPrice} / <span className={`${!params.data.only_btex ? 'text-success' : ''}`}>{usdtPrice} </span>
            </div>
          )
        }
      },
      {
        headerName: "Invested (BTEX/USDT)",
        field: "btex_invest",
        width : 210,
        filter : false,
        cellRendererFramework: params => {
          let usdt_invest = params.data.invest ? round(params.data.invest) : 0
          let btex_invest = params.data.invest_btex ? round(params.data.invest_btex) : 0
          return (
            <div className="actions cursor-pointer">
              {btex_invest} / <span className={`${!params.data.only_btex ? 'text-success' : ''}`}>{usdt_invest} </span> 
            </div>
          )
        }
      },
      {
        headerName: "Created date",
        field: "harvestedAt",
        width: 220,
        filter : true,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              {params.data.stake_completed ? (
                <Badge color="light-success">Stake Completed</Badge>
              ) : params.data.data && params.data.data.length ? ( 
                <Badge color="light-success">
                  {params.data.createdAt ? new Date(params.data.createdAt).toDateString() : ''}
                </Badge>
              ) : (
                <Badge color="light-primary">
                  {params.data.createdAt ? new Date(params.data.createdAt).toDateString() : ''}
                </Badge>
              )}
            </div>
          )
        }
      },
      {
        headerName: "Harvested",
        field: "data",
        width: 400,
        cellRendererFramework: params => {
          // console.log("params: ", params.rowIndex)
          let totalHarvest = 0
          let allHarvest = params.value.map((res,index) => {
            totalHarvest = totalHarvest+res.harvest
            return  (
              <>
                <div className="float-left" id={`tooltip_${params.rowIndex}${index}`}>{res.harvest ? round(res.harvest)+" , " : ''}</div>
                {/* <UncontrolledTooltip
                  placement="top"
                  target={`tooltip_${params.rowIndex}${index}`}
                >
                  Hello World !
                </UncontrolledTooltip> */}
              </>
            )
          });
          return (
            <div className="actions cursor-pointer">
              {params.value && params.value.length ? (
                <div>
                  <Badge color="light-success">
                    {allHarvest}
                  </Badge>
                  <div className="ml-1">
                    Total: {totalHarvest}
                  </div>
                </div>
                ) : (
                  <Badge color="light-primary">
                    Not Harvested
                  </Badge>
                )}
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
    postAPICall('stake-history?admin_user_id='+this.state.currentUserId)
    .then(response => {
      if(response.status === 200){
        console.log(response.data.result);
        const rowData = response.data.result;
        if(rowData){
          this.setState({ rowData });
        }
      }
    }).catch(e=>console.log(e));
  }
  getDateWiseHistory = (action,from,to) => {
    if(from && to){
      let alltxtData = {
        action  : action,
        from_date    : from,
        to_date      : to,
        admin_user_id : this.state.currentUserId
      } 
      postAPICall('stake-history',alltxtData)
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
    const { rowData,columnDefs, basicPicker, from_date, to_date, defaultColDef, pageSize } = this.state;
    
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