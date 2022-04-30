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
  UncontrolledDropdown,
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  Button,
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
import navigationConfig from "../../../configs/navigationConfig"

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
    defaultColDef: {
      sortable: true
    },
    searchVal: "",
    blockchain_radio:0,
    is_coin:false,
    user_role_checked: false,
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
        headerName: "Profile Pic",
        field: "username",
        width: 100,
        cellRendererFramework: params => {
          return params.value == '' ? (
            <div className="d-flex align-items-center cursor-pointer" >
              <img
                className="rounded-circle mr-50"
                src={params.data.avatar}
                alt="user avatar"
                height="30"
                width="30"
              />
            </div>
          ) : (
            <Icon.User size={30} />
          )
        }
      },
      {
        headerName: "Email",
        field: "email",
        editable: true,
        filter: true,
        width: 250,
      },
      {
        headerName: "Status",
        field: "user_status",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return params.value == 1 ? ( // for active
            <div className="badge badge-pill badge-light-success">
              Active
            </div>
          ) : params.value == 0 ? ( 
            <div className="badge badge-pill badge-light-danger">
              Not Active
            </div>
          ) : params.value == -2 ? ( 
            <div className="badge badge-pill badge-light-danger">
              Deleted
            </div>
          ) : params.value == 2 ? ( 
            <div className="badge badge-pill badge-light-warning">
              Archive
            </div>
          ) : params.value == -1 ? ( 
            <div className="badge badge-pill badge-light-danger">
              Blocked
            </div>
          ) : null
        }
      },
      {
        headerName: "Permission",
        field: "admin_permission",
        filter: true,
        width: 520,
        cellRendererFramework: params => {
          return (
            <div className="">
              {params.valueFormatted}
            </div>
          )
        }
      },
      {
        headerName: "Role",
        field: "user_role",
        filter: true,
        width: 150,
        cellRendererFramework: params => {
          return params.value === 2 ? ( // for active
            <>
              ADMIN
            </>
          ) : params.value === 0 ? ( // Not submitted
            <>
              User
            </>
          ) : params.value === 1 ? ( // rejecetd
            <>
              Employee
            </>
          ) : params.value === -1 ? ( // submitted but not approve
            <div className="bullet bullet-sm bullet-warning"></div>
          ) : null
        }
      },
      {
        headerName: "Mobile Number",
        field: "mobile_number",
        filter: true,
        editable: true,
        width: 200,
        cellRendererFramework: params => {
          return params.value === 0 ? (
            <div className=""> </div>
          ) :  (
            <div className="">{params.value}</div>
          )
        }
      },
      {
        headerName: "Actions",
        field: "transactions",
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Trash2
                size={15}
                onClick={() => {
                  this.deleteUser("update_profile",params.data.email,-2)
                }}
              />
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
    getAPICall('alluser?user_role=1&admin_user_id='+this.state.currentUserId)
    .then(response => {
      const rowData = response.data;
      this.setState({ rowData });
    })
  }
  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#employeedata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData.confirm_password = alltxtData.password;
    if(!alltxtData.name && !alltxtData.email && !alltxtData.password){
      NotificationManager.error("Please Fill All Information")
    }else{
      alltxtData.admin_user_id = this.state.currentUserId;
      if(this.state.user_status == 2){
        alltxtData.user_id = this.state.currentUserId;
        alltxtData.action = 'update_profile';
        
        alltxtData.user_role = this.state.user_role_checked ? 1 : 0;
        if(!this.state.user_role_checked){
          // 
          NotificationManager.info("Please select user role Checkbox!!")
          return false;
        }else{
          // this.setState({ user_status : 0 });
          // return false;
        }
        
      }
      let action = this.state.user_status ? "modify_user_profile" : "register-user";
        postAPICall(action,alltxtData)
        .then(response => {
          
          getAPICall('alluser?user_role=1&admin_user_id='+this.state.currentUserId)
          .then(response2 => {
            const rowData = response2.data;
            if (rowData){
              this.setState({ rowData });
            }
          })
          if(response.data.status == 200){
            NotificationManager.success("Employee Added Successfully")             
            document.getElementById("employeedata").reset();
          }else{
            let user_status = response.data.user_status ? response.data.user_status : 0;
            if(user_status){
              this.setState({ user_status });
            }
            NotificationManager.error(response.data.message)
          }
        })
        this.setState({validPassword:true});
    }
  }
  deleteUser = (action,email,status) => {
    let alltxtData = {}
    if(!action && !email){
      NotificationManager.error("Please Fill All Information")
    }else{
        alltxtData.action    = action;
        alltxtData.email    = email;
        alltxtData.status    = status;
        alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('modify_user_profile',alltxtData)
        .then(response => {
          getAPICall('alluser?user_role=1&admin_user_id='+this.state.currentUserId)
          .then(response => {
            const rowData = response.data;
            if (rowData){
              this.setState({ rowData });
            }
          })
          if(response.data.status == 200){
            NotificationManager.success("Employee Deleted Successfully")             
          }else{
            NotificationManager.error(response.data.message)
          }
        })
        this.setState({validPassword:true});
    }
  }
  render() {
    const { rowData,columnDefs, blockchain_radio, user_status, defaultColDef, pageSize } = this.state;
    const navMenu = [] 
    let navMainMenu = ''; 
    let navigationMenu = navigationConfig.map((res) => {
      let arr = {}
      if(res.type == "groupHeader"){
        navMainMenu = res.groupTitle;
        arr.label = res.groupTitle+ " (menu)"
        arr.value = res && res.parentof ? res.parentof : ''
        navMenu.push(arr)
        return arr
      }else if(res.type == 'item'){
        arr.label = res.title+ " < "+navMainMenu
        arr.value = res && res.id ? res.id : '';
        navMenu.push(arr)
        return arr  
      }
      
    }) 
    console.log("navigationConfig: ", navMenu ,navigationMenu,navigationConfig)

    // const navigationMenu = [
    //   { label: "Dashboard", value: "dashboard", isFixed: true },
    //   { label: "Users", value: "users",  isFixed: true },
    //   { label: "Coin & Token", value: "coinandtoken",  isFixed: true },
    //   { label: "Wallets", value: "wallet",  isFixed: true },
    //   { label: "Order", value: "order",  isFixed: true },
    //   { label: "Finance", value: "finance",  isFixed: false },
    //   { label: "Bonus", value: "bonus",  isFixed: false },
    //   { label: "Master Setting", value: "mastersetting",  isFixed: false },
    //   { label: "Setting", value: "settings",  isFixed: false }
    // ]
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="employeedata">
                            
                            <input type='hidden' name="employee" value='5'/>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="email" className="label-text h6">Email</Label>
                                    <Input type="text" name="email" id="email" placeholder="Enter Email..." 
                                      onChange={e => this.setState({user_status:0})}
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="mobile_number" className="label-text h6">Mobile No</Label>
                                    <Input type="text" id="mobile_number" name="mobile_number" placeholder="Enter Mobile no..." />
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="admin_permission" className="label-text h6">Select Permission</Label>
                                    <Select
                                      name="admin_permission"
                                      closeMenuOnSelect={false}
                                      isMulti
                                      options={navMenu}
                                      className="React"
                                      classNamePrefix="select"
                                    />
                                </FormGroup>
                            </Col>
                            {user_status && (user_status == 2) ? (
                                <>
                                  <Col md="2" sm="12">
                                    <Label className="label-text h6">&nbsp;</Label>
                                    <Checkbox color="success" icon={<Check className="vx-icon" size={16} />} 
                                      label="Do You want to Change role of this User" 
                                      defaultChecked={false}
                                      onChange={e => this.setState({user_role_checked:e.target.checked})}
                                    />
                                  </Col>
                              </>
                            ) : (
                              <>
                                <input type='hidden' name="user_role" value='1'/>
                                <Col md="2" sm="12">
                                    <FormGroup>
                                        <Label for="password" className="label-text h6">Password</Label>
                                        <Input type="text" id="password" name="password" placeholder="Enter Password..." />
                                    </FormGroup>
                                </Col>
                              </>
                            )}
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
                                        Add Employee
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
                        <h2 className="float-left ml-1">System is Loading All Employees.</h2>
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