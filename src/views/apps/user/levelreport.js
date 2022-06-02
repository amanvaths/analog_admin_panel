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
  Button,
  Form,
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
// import { connect } from "react-redux";
import NotificationManager from "react-notifications/lib/NotificationManager";
class LevelReport extends React.Component {
 
  state = {
    rowData: null,
    gridApi: null,
    level:0,
    pageSize: 400,
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
    //   {
    //   headerName: "Status",
    //   field: "status",
    //   filter: true,
    //   width: 150,
    //   cellRendererFramework: params => {
    //     return params.value === 1 ? ( // for active
    //       <div className="badge badge-pill badge-light-success">Success</div>
    //     ) : params.value === 0 ? ( // Not submitted
    //       <div className="badge badge-pill badge-light-danger">Failed</div>
    //     ) : null
    //   }
    // },
    {
      headerName: "From User",
      field: "from_user",
      filter: true,
      editable: true,
      width: 200,
    },
    {
      headerName: "Level",
      field: "from_level",
      filter: true,
      editable: true,
      width: 250,
    },

    {
      headerName: "Token Quantity",
      field: "token_quantity",
      filter: true,
      editable: true,
      width: 250,
    },
    {
    headerName: "Token Price",
    field: "token_price",
    filter: true,
    editable: true,
    width: 200,
  },
  
    
    
    {
      headerName: "Bonus",
      field: "bonus",
      filter: true,
      editable: true,
      width: 250,
    },
    
 
    ],
  };

  componentDidMount() {
  let params1 = "?per_page=" + this.state.pageSize + "&page=1";
    getAPICall("getIncome"+ params1).then((response) => {
      
      const rowData = response.data.ref;
      // console.log(rowData,"ref")
      this.setState({rowData:rowData});
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
          getAPICall("getIncome" ).then((res) => {
            // console.log("Ressss:: ", res)
            const allIncome = res.data.ref.filter((data)=>data.from_level != 0);
            // console.log(allIncome,"allIncome")
            //  this.setState({rowData:[...allIncome]})
            console.log(allIncome,"ref")
           
               rowData.successCallback([...allIncome], allIncome.length);
          }).catch((err)=>NotificationManager("something went wrong."))
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
  // deleteUser = (action, user_id, status) => {
  //   let alltxtData = {};
  //   if (!action && !user_id) {
  //     NotificationManager.error("Please Fill All Information");
  //   } else {
  //     alltxtData.action = action;
  //     alltxtData.user_id = user_id;
  //     alltxtData.status = status;
  //     alltxtData.admin_user_id = this.state.currentUserId;
  //     getAPICall("deletepresale?_id="+user_id).then((response) => {
  //       console.log(response.data,"responsedata")
  //       if (response.data.status == 'true') {
  //         let selectedData = this.gridApi.getSelectedRows();
  //         this.gridApi.updateRowData({ remove: selectedData });
  //         NotificationManager.success("Employee Deleted Successfully");
  //         setTimeout(()=>{ window.location.reload()},1500)
  //       } else {
  //         NotificationManager.error(response.data.message);
  //       }
  //     });
  //     this.setState({ validPassword: true });
  //   }
  // };

  
  setlevel =  (value)=>{
    this.setState({
        level: value,
      });
      console.log(value,"value")
       getAPICall("getIncome?bonus_type=Level&from_level="+ value).then((d)=>{
         console.log(d,"dataaa")
        if(d.status === 200){
         
          const income = d.data.ref;
         
            this.setState({ rowData: income})
            let dataSource = {
             
              getRows(rowData) {
                  rowData.successCallback(d.data.ref,d.data.ref.length);
              }

          };
          this.state.gridApi.setDatasource(dataSource);

       
        }
      }).catch((e) => console.log(e));
  };

  updateQUERY(start,end){
    const sDate =new Date(start).toISOString().substring(0,10)
    const eDate = new Date(end).toISOString().substring(0,10)
   
    // this.clear();
 
    if(start==null || end ==null){
      NotificationManager.error("Missing credentials.")
    }else{
      getAPICall("getIncome?start="+sDate +"&endDate="+eDate).then((res)=>{
    
        if(res.data.status == 200) {
          let dataSource = {
            getRows(rowData) {
                rowData.successCallback(res.data.ref,res.data.ref.length);
            }
        };
    
          this.state.gridApi.setDatasource(dataSource);
          // this.setState({ rowData:res.data.user });
        }
      }
      ).catch((err)=> console.log(err,"err"))
    }
   
  
  
    
  };


  render() {
    const { rowData, columnDefs, defaultColDef, pageSize, gridApi } = this.state;
    return (
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12">
        <Card>
              <CardBody>
                <Form className="row">
        
                  <Col md="3" sm="12">
                    <FormGroup>
                      <Label for="from" className="h5">
                       FROM
                      </Label>
                      <Input
                        type="date"
                        id="from"
                        placeholder="From Date"
                      />
                    </FormGroup>
                  </Col>
                  <Col md="3" sm="12">
                    <FormGroup>
                      <Label for="to" className="h5">
                        To
                      </Label>
                      <Input
                        type="date"
                        id="to"
                        placeholder="To Date"
                        // invalid={this.state.validPassword === false}
                      />
                      
                    </FormGroup>
                  </Col>
                  <Col md="3" sm="12" >
                    <FormGroup>
                      <Button.Ripple
                        color="primary"
                        type="button"
                        className="mt-2"
                        onClick={() => {
                          this.updateQUERY(
                            document.querySelector("#from").value? document.querySelector("#from").value:null,
                            document.querySelector("#to").value? document.querySelector("#to").value:null
                          );
                        }}
                      >
                        Find Income
                      </Button.Ripple>
                    </FormGroup>
                  </Col>

                  <Col md="3" sm="12" style={{display:"flex",alignItems:"center"}}>
                  <div className="dropdown actions-dropdown">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle className="px-2 py-75" color="white">
                          select-Level
                          <ChevronDown className="ml-50" size={15} />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem tag="a">
                            <span className="align-middle ml-50" onClick={() => this.setlevel(1)}>Level-1</span>
                          </DropdownItem>
                          <DropdownItem tag="a">
                           
                            <span className="align-middle ml-50" onClick={() => this.setlevel(2)}>Level-2</span>
                          </DropdownItem>
                          <DropdownItem tag="a">
                            <span className="align-middle ml-50"onClick={() => this.setlevel(3)}>level-3</span>
                          </DropdownItem>
                         
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </Col>
                </Form>
              </CardBody>
            </Card>
        </Col>
        <Col sm="12">
          <Card>
            <CardBody>
              <div
                className="ag-theme-material ag-grid-table"
               
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
                     Level Report:{this.state.level==0?" All ": `${this.state.level}` }
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

// const mapStateToProps = (state) => {
//   return {
//     currentUserId: state.auth.login.user.user_id,
//   };
// };
// export default connect(mapStateToProps)(LevelReport);
export default LevelReport;

