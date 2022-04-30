import React from "react";
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
} from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
import {
  Edit,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
  UserX,
  UserCheck,
} from "react-feather";
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import * as Icon from "react-feather";
import { history } from "../../../history";
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions";
import { connect } from "react-redux";
import NotificationManager from "react-notifications/lib/NotificationManager";
class UsersList extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (props.currentUserId !== state.currentUserId) {
      return {
        currentUserId: props.currentUserId,
      };
    }
    // Return null if the state hasn't changed
    return null;
  }
  state = {
    rowData: null,
    gridApi: null,
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
      sortable: true,
    },
    searchVal: "",
    columnDefs: [
      {
        headerName: "#",
        field: "rowIndex",
        // filter : true,
        width: 50,
        cellRendererFramework: (params) => {
          return <>{1 + params?.rowIndex}</>;
        },
      },
      // {
      //   headerName: "Profile Pic",
      //   field: "username",
      //   width: 100,
      //   cellRendererFramework: (params) => {
      //     return params.value == "" ? (
      //       <div className="d-flex align-items-center cursor-pointer">
      //         <img
      //           className="rounded-circle mr-50"
      //           src={params.data.avatar}
      //           alt="user avatar"
      //           height="30"
      //           width="30"
      //         />
      //       </div>
      //     ) : (
      //       <Icon.User size={30} />
      //     );
      //   },
      // },
      {
        headerName: "Email",
        field: "email",
        filter: true,
        editable: true,
        width: 250,
      },
      // {
      //   headerName: "Name",
      //   field: "first_name",
      //   editable: true,
      //   filter: true,
      //   width: 250,
      //   cellRendererFramework: (params) => {
      //     return (
      //       <div className="actions cursor-pointer">
      //         {params.data?.first_name} {params.data?.middle_name}{" "}
      //         {params.data?.last_name}
      //       </div>
      //     );
      //   },
      // },
      {
        headerName: "Status",
        field: "status",
        filter: true,
        width: 150,
        // cellRendererFramework: (params) => {
        //   return params.value == 1 || params.value == 0 ? ( // for active
        //     <div className="badge badge-pill badge-light-success">Active</div>
        //   ) : params.value == 0 ? (
        //     <div className="badge badge-pill badge-light-danger">
        //       Not Active
        //     </div>
        //   ) : params.value == -2 ? (
        //     <div className="badge badge-pill badge-light-danger">Deleted</div>
        //   ) : params.value == -1 ? (
        //     <div className="badge badge-pill badge-light-warning">Archive</div>
        //   ) : params.value == 2 ? (
        //     <div className="badge badge-pill badge-light-danger">Blocked</div>
        //   ) : null;
        // },
        
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
      {
        headerName: "Total Wallet Fund",
        field: "wallet_balance",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Total Buying",
        field: "wallet_balance",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Total Bonus",
        field: "wallet_balance",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Total Withdrawal",
        field: "wallet_balance",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Date",
        field: "createdAt",
        filter: true,
        editable: true,
        width: 250,
      },
      // {
      // {
      //   headerName: "Email Verified",
      //   field: "is_email_verified",
      //   filter: true,
      //   width: 150,
      //   cellRendererFramework: (params) => {
      //     return params.value === 1 ? ( // for active
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : params.value === 0 ? ( // Not submitted
      //       <div className="bullet bullet-sm bullet-secondary"></div>
      //     ) : params.value === 2 ? ( // rejecetd
      //       <div className="bullet bullet-sm bullet-danger"></div>
      //     ) : params.value === -1 ? ( // submitted but not approve
      //       <div className="bullet bullet-sm bullet-warning"></div>
      //     ) : null;
      //   },
      // },
      // {
      //   headerName: "KYC Verified",
      //   field: "is_kyc_verified",
      //   filter: true,
      //   width: 150,
      //   cellRendererFramework: (params) => {
      //     return params.value === 1 ? ( // for active
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : params.value === 0 ? ( // Not submitted
      //       <div className="bullet bullet-sm bullet-secondary"></div>
      //     ) : params.value === 2 ? ( // rejecetd
      //       <div className="bullet bullet-sm bullet-danger"></div>
      //     ) : params.value === -1 ? ( // submitted but not approve
      //       <div className="bullet bullet-sm bullet-warning"></div>
      //     ) : null;
      //   },
      // },
      // {
      //   headerName: "Auto KYC",
      //   field: "auto_verify",
      //   filter: true,
      //   width: 130,
      //   cellRendererFramework: (params) => {
      //     return params.value == true ? ( // for active
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : (
      //       // Not submitted
      //       <div className="bullet bullet-sm bullet-secondary"></div>
      //     );
      //   },
      // },
      // {
      //   headerName: "Bank Verified",
      //   field: "is_bank_verified",
      //   filter: true,
      //   width: 150,
      //   cellRendererFramework: (params) => {
      //     return params.value === 1 ? ( // for active
      //       <div className="bullet bullet-sm bullet-success"></div>
      //     ) : params.value === 0 ? ( // Not submitted
      //       <div className="bullet bullet-sm bullet-secondary"></div>
      //     ) : params.value === 2 ? ( // rejecetd
      //       <div className="bullet bullet-sm bullet-danger"></div>
      //     ) : params.value === -1 ? ( // submitted but not approve
      //       <div className="bullet bullet-sm bullet-warning"></div>
      //     ) : null;
      //   },
      // },
      // {
      //   headerName: "Mobile Number",
      //   field: "mobile_number",
      //   editable: true,
      //   filter: true,
      //   width: 150,
      //   cellRendererFramework: (params) => {
      //     return params.value === 0 ? (
      //       <div className=""> </div>
      //     ) : (
      //       <div className="">{params.value}</div>
      //     );
      //   },
      // },
      {
        headerName: "Edit/Block/Delete",
        field: "transactions",
        width: 200,
        cellRendererFramework: (params) => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-2"
                size={28}
                onClick={() => {
                  let editurl =
                    "/app/user/edit/UserEdit?user_id=" + params.data.user_id;
                  history.push(editurl);
                }}
              />
              {params.data?.user_status == 2 ? (
                <UserCheck
                  className="mr-2"
                  size={28}
                  onClick={() => {
                    this.BlockUser("update_profile", params.data.email, 1);
                  }}
                />
              ) : (
                <UserX
                  className="mr-2"
                  size={28}
                  onClick={() => {
                    this.BlockUser("update_profile", params.data.email, 2);
                  }}
                />
              )}
              <Trash2
                size={28}
                onClick={() => {
                  this.deleteUser("delete_user", params.data.user_id, -2);
                }}
              />
            </div>
          );
        },
      },
    ],
  };

  async componentDidMount() {
     let params1 = "?per_page=" + this.state.pageSize + "&page=1";
    getAPICall("alluser"+ params1).then((response) => {
      const rowData = response.data;
      this.setState({ rowData });
    });
  }

  onGridReady = (params) => {
    this.gridApi = params.api;
    this.setState({ gridApi: params.api });
    this.gridColumnApi = params.columnApi;
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.state.gridApi !== prevState.gridApi) {
      const dataSource = {
        getRows: (rowData) => {
          // Use startRow and endRow for sending pagination to Backend
          // params.startRow : Start Page
          // params.endRow : End Page
          console.log("params", rowData, rowData.filterModel);
          const models = Object.entries(rowData.filterModel);
          console.log(models,"models")
          
          const page = rowData.endRow / this.state.pageSize;
          let params = "?per_page=" + this.state.pageSize + "&page=" + page;
          models.forEach((field)=>{
            const f = field[0];
            const fV = field[1]?.filter;
            params = `${params}&${f}=${fV}`;
          })
          getAPICall("alluser"+params).then((res) => {
          console.log(params,"pauihfhed"); 

            console.log("Ressss:: ", res)
            rowData.successCallback([...res.data.user_data], res.data.totalCount);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }
  filterData = (column, val) => {
    console.log("Column :: "+column, val)
    var filter = this.gridApi.getFilterInstance(column);
    console.log("filter");
    var modelObj = null;
    if (val !== "all") {
      modelObj = {
        type: "equals",
        filter: val,
      };
    }
    filter.setModel(modelObj);
    this.gridApi.onFilterChanged();
  };

  filterSize = (val) => {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(Number(val));
      this.setState({
        pageSize: val,
      });
    }
  };
  updateSearchQuery = (val) => {
    console.log(val);
     let params = "?per_page=" + this.state.pageSize + "&page=1" + "&keyword="+val; 
    getAPICall("alluser"+ params).then((response) => {
      const rowData = response.data;
      this.setState({ rowData });
    });
    /* this.gridApi.setQuickFilter(val)
    this.setState({
      searchVal: val
    }) */
  };

  refreshCard = () => {
    this.setState({ reload: true });
    setTimeout(() => {
      this.setState({
        reload: false,
        role: "All",
        selectStatus: "All",
        verified: "All",
        department: "All",
      });
    }, 500);
  };
  toggleCollapse = () => {
    this.setState((state) => ({ collapse: !state.collapse }));
  };
  onEntered = () => {
    this.setState({ status: "Opened" });
  };
  onEntering = () => {
    this.setState({ status: "Opening..." });
  };

  onEntered = () => {
    this.setState({ status: "Opened" });
  };
  onExiting = () => {
    this.setState({ status: "Closing..." });
  };
  onExited = () => {
    this.setState({ status: "Closed" });
  };
  removeCard = () => {
    this.setState({ isVisible: false });
  };
  deleteUser = (action, user_id, status) => {
    let alltxtData = {};
    if (!action && !user_id) {
      NotificationManager.error("Please Fill All Information");
    } else {
      alltxtData.action = action;
      alltxtData.user_id = user_id;
      alltxtData.status = status;
      alltxtData.admin_user_id = this.state.currentUserId;
      postAPICall("permanent_delete_user", alltxtData).then((response) => {
        if (response.data.status == 200) {
          let selectedData = this.gridApi.getSelectedRows();
          this.gridApi.updateRowData({ remove: selectedData });
          NotificationManager.success("Employee Deleted Successfully");
        } else {
          NotificationManager.error(response.data.message);
        }
      });
      this.setState({ validPassword: true });
    }
  };
  BlockUser = (action, email, status) => {
    let alltxtData = {};
    if (!action && !email) {
      NotificationManager.error("Please Fill All Information");
    } else {
      alltxtData.action = action;
      alltxtData.email = email;
      alltxtData.status = status;
      alltxtData.admin_user_id = this.state.currentUserId;
      postAPICall("modify_user_profile", alltxtData).then((response) => {
        if (response.data.status == 200) {
          let selectedData = this.gridApi.getSelectedRows();
          this.gridApi.updateRowData({ remove: selectedData });
          NotificationManager.success(response.data.message);
        } else {
          NotificationManager.error(response.data.message);
        }
      });
      this.setState({ validPassword: true });
    }
  };
  render() {
    const { rowData, columnDefs, defaultColDef, pageSize, gridApi } =
      this.state;
    return (
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12">
          <Card>
            <CardBody style={{ height: "85vh" }}>
              <div
                className="ag-theme-material ag-grid-table"
                style={{ height: "80vh" }}
              >
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
                    <div className="h2 float-left">
                      Total Users :{" "}
                      {this.state.rowData !== null
                        ? this.state.rowData.totalCount
                        : 0}
                    </div>
                  </div>
                  <div className="filter-actions d-flex">
                    <Input
                      className="w-50 mr-1 mb-1 mb-sm-0"
                      type="text"
                      placeholder="search..."
                      onBlur={(e) => this.updateSearchQuery(e.target.value)}
                      defaultValue={this.state.searchVal}
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
                            <span
                              className="align-middle ml-50"
                              onClick={() => this.gridApi.exportDataAsCsv()}
                            >
                              CSV
                            </span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </div>
                </div>
                {this.state.rowData !== null ? (
                  <ContextLayout.Consumer>
                    {(context) => (
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
                        rowModelType={"infinite"}
                        onPageChage={this.handleChange}
                        rowHeight={60}
                        resizable={true}
                        //gridAutoHeight={true}
                        //enableRtl={context.state.direction === "rtl"}
                      />
                    )}
                  </ContextLayout.Consumer>
                ) : (
                  <>
                    <div className="float-left">
                      <Spinner color="primary" />
                    </div>
                    <h2 className="float-left ml-1">
                      System is Calculating All Users.
                    </h2>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    currentUserId: state.auth.login.user.user_id,
  };
};
export default connect(mapStateToProps)(UsersList);
