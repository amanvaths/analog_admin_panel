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
import QRCode from "qrcode.react"
import { ContextLayout } from "../../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import SweetAlert from 'react-bootstrap-sweetalert'
import {
  Edit,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  RotateCw,
  X
} from "react-feather"
import classnames from "classnames"
import "../../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../../assets/scss/pages/users.scss"
import * as Icon from "react-feather"
import { postAPICall, userFund } from "../../../../redux/helpers/api_functions"
import NotificationManager from "react-notifications/lib/NotificationManager"
class Fundlist extends React.Component {
  state = {
    titleAlert: false,
    wallet_addr: '',
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
        headerName: "Currency",
        field: "wallet_type",
        filter: true,
        width: 250
      },
      {
        headerName: "Wallet Address", 
        field: "wallet_address",
        filter: true,
        width: 400
      },
      {
        headerName: "Actual Balance",
        field: "b_balance",
        filter: true,
      },
      {
        headerName: "Virtual Balance",
        field: "balance",
        filter: true,
        width: 250
      },
      {
        headerName: "Locked",
        field: "locked",
        filter: true,
        width: 250
      },
      {
        headerName: "Capture Fund",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Button.Ripple className="mr-1 btn-sm" color="success" onClick={() => this.captureFund(params.data.wallet_address, params.data.wallet_type)} disabled={params.data.b_balance === 0?true:false} > Capture Fund </Button.Ripple>
            </div>
          )
        }
      },
      {
        headerName: "QR code",
        filter: false,
        width: 100,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer" onClick={() => this.handleAlert("titleAlert", true, "wallet_addr", params.data.wallet_address)}>
              <QRCode
                  value={params.data.wallet_address}
                  size={20}
                />
            </div>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get('user_id');
    userFund(user_id).then((d) => {
      if (d.status === 200) {
          this.setState({ rowData: d.params.wallet });
        }
    })
    .catch((e) => console.log(e));
  }
  captureFund = (wallet_address, wallet_type) =>{
    const params = new URLSearchParams(window.location.search);
    const user_id = params.get('user_id');
    const body = {
      user_id: user_id,
      wallet_address: wallet_address,
      wallet_type: wallet_type
    }
    postAPICall('user-fund-transfer', body).then((d)=>{
      if(d.status === 200){
        const fund_data = d.data;
        if(fund_data.status === 200) {
          NotificationManager.success(fund_data.message);
        } else {
          NotificationManager.error(fund_data.message);
        }
      }
    }).catch((e) => console.log(e));
  }
  
  handleAlert = (state, value, state1, value1) => {
    this.setState({ [state] : value, [state1]: value1 })
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

  render() {
    const {  rowData, columnDefs, defaultColDef, pageSize } = this.state
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
                    <div className="h2 float-left">Fund Details : {this.state.rowData !== null ? this.state.rowData.length : 0 }</div>
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
                        <h2 className="float-left ml-1">System is Calculating Your Funds.</h2>
                  </>
                )}
              </div>
              <SweetAlert
                show={this.state.titleAlert} 
                onConfirm={() => this.handleAlert("titleAlert", false)}
              >
                  <p className="sweet-alert-text">
                  <QRCode
                  value={this.state.wallet_addr}
                  size={200}
                /></p>
              </SweetAlert>
            </CardBody>
          </Card>
        </Col>
      </Row>
    )
  }
}

export default Fundlist
