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
        headerName: "Level Name",
        field: "levelname",
        filter: true,
        editable: true,
        width: 250,
      },
      {
      headerName: "Status",
      field: "status",
      filter: true,
      width: 150,
      cellRendererFramework: params => {
        return params.value == true ? ( // for active
          <div className="badge badge-pill badge-light-success">Active</div>
        ) : params.value == false ? ( // Not submitted
          <div className="badge badge-pill badge-light-danger">In-active</div>
        ) : null
      }
    },
      {
        headerName: "Coin Quantity",
        field: "coinquantity",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Coin Remaining",
        field: "coinremaining",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Price",
        field: "price",
        filter: true,
        editable: true,
        width: 250,
      },
      {
        headerName: "Duration(Days)",
        field: "duration",
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
    
      {
        headerName: "Edit/Delete",
        field: "transactions",
        width: 200,
        cellRendererFramework: (params) => {
          console.log(params,"paramsf")

          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-2"
                size={28}
                 onClick={() => {
                   let editurl =
                     "/app/user/editpresale:" + params.data._id;
                   history.push(editurl);
                 }}
              />
              <Trash2
                size={28}
                onClick={() => {
                  this.deleteUser("delete_user", params.data._id, -2);
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
    getAPICall("getpresale"+ params1).then((response) => {
        console.log(response,"resp..")
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
          //console.log(params);  + params
          getAPICall("getpresale",params).then((res) => {
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
    getAPICall("getpresale"+ params).then((response) => {
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
      getAPICall("deletepresale?_id="+user_id).then((response) => {
        console.log(response.data,"responsedata")
        if (response.data.status == 'true') {
          let selectedData = this.gridApi.getSelectedRows();
          this.gridApi.updateRowData({ remove: selectedData });
          NotificationManager.success("Employee Deleted Successfully");
          setTimeout(()=>{ window.location.reload()},1500)
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
                      Pre-sale  :{" "}
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
                        overlayNoRowsTemplate="No Pre-sale Details found. "
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
