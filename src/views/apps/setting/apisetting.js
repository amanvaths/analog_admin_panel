import React from "react"
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  Spinner,
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"

class ApiSetting extends React.Component {
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
    logo: null, 
    sort_logo: null, 
    favicon: null,
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
    is_coin:false,
    columnDefs: [
      {
        headerName: "CMC KEY",
        field: "cms_key",
        width: 250
      },
      {
        headerName: "Rozarpay Key",
        field: "rozarpay_key",
        width: 250
      },
      {
        headerName: "Msg 91 key",
        field: "msg91_smskey",
        width: 250
      },
      {
        headerName: "Msg 91 email key",
        field: "msg91_emailkey",
        width: 250
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
    getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
    .then(response => {
      if(response.status === 200){
        let rowData = []; 
        rowData[0] = response.data.params.website;
        this.setState({ rowData });
      }
    }).catch(e=>console.log(e));
  }

  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData.user_id = this.state.currentUserId;
      postAPICall("update-key", alltxtData).then((d)=>{
        if(d.status === 200) {
          if(d.data.status === 200) {
            NotificationManager.success(d.data.message);
            getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
            .then(response => {
              if(response.status === 200){
                let rowData = []; 
                rowData[0] = response.data.params.website;
                this.setState({ rowData });
              }
            }).catch(e=>console.log(e));
          } else {
            NotificationManager.error(d.data.message);
          }
        } else {
          NotificationManager.error("Something Went Wrong!!");
        }
      }).catch(e=>console.log(e))
   
  }
  render() {
    const { rowData,columnDefs, defaultColDef, pageSize } = this.state;
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="tokendata">
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Set CMC Key</Label>
                                    <Input type="text" name="cmc_key" id="cmc_key" placeholder="Enter cmc key..." />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Rozarpay Key</Label>
                                    <Input type="text" name="rozarpay_key" id="rozarpay_key" placeholder="Enter Rozorpay key..." />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Msg 91 key</Label>
                                    <Input type="text" name="msg_key" id="msg_key" placeholder="Enter Msg 91 key..." />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Msg 91 email key</Label>
                                    <Input type="text" name="msg_email_key" id="msg_email_key" placeholder="Enter Msg 91 email key..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.updateQUERY( )
                                        }}
                                    >
                                        Update Key
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        <Row className="app-user-list">
            <Col sm="12">
            <Card>
                <CardBody>
                <div className="ag-theme-material ag-grid-table">
                    <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    {/* <div className="sort-dropdown">
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
                    </div> */}
                    <div className="filter-actions d-flex">
                        WebSite Details
                        {/* <Input
                        className="w-50 mr-1 mb-1 mb-sm-0"
                        type="text"
                        placeholder="search..."
                        onChange={e => this.updateSearchQuery(e.target.value)}
                        value={this.state.searchVal}
                        /> */}
                        {/* <div className="dropdown actions-dropdown">
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
                                <span className="align-middle ml-50">CSV</span>
                            </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        </div> */}
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
                           <div className="text-center">
                          <Spinner color="primary" />
                        </div>
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
export default connect(mapStateToProps)(ApiSetting)