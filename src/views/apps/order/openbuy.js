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
  Media
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
import { NotificationManager } from "react-notifications"
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard"
import { createSocketClient } from "../utils/functions"
import { connect } from "react-redux"
import { mul } from "../utils/Math"

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
    total_fees:null,
    total_price:null,
    total_volume:null,
    total_count:null,
    count: null,
    rowData: null,
    cmcDATA: null,
    cPaired: null,
    rowDataSell: null,
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
        width: 300,
        filter: true,
      },
      {
        headerName: "Coin (Currency) ",
        field: "currency_type",
        width: 200,
        filter: true,
        cellRendererFramework: params => {
          return (
            <div className=""> {params?.value?.toUpperCase()} ({params.data?.compare_currency?.toUpperCase()})</div>
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
              {params?.value ? params?.value : ''}
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
        headerName: "Total",
        field: "total",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className=""> 
              {params.data?.raw_price ? mul(Number(params.data?.raw_price) , Number(params.data?.volume)) : 0}
            </div>
          )
        }
      },
      {
        headerName: "Date",
        field: "createdAt",
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
      {
        headerName: "Actions",
        field: "order_id",
        width: 130,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Trash2
                size={15}
                onClick={() => {
                  let selectedData = this.gridApi.getSelectedRows()
                  this.gridApi.updateRowData({ remove: selectedData })
                  this.DeleteOrder(params.value,params.data.user_id)
                }}
              />
            </div>
          )
        }
      }
    ]
  }
  onGridReady = (params) => {
    this.gridApi = params.api;
    this.setState({ gridApi: params.api });
    this.gridColumnApi = params.columnApi;
  };
  
  async componentDidMount() {
    const socket = new createSocketClient("kujgwvfq-a-ghosttown-z-1fhhup0p6");
    socket.on("cmc_updated", (res) => {
      if(res){
        this.setState({ cmcDATA : res });
      }
    });
    const params = "&per_page=" + this.state.pageSize + "&page=1"
    getAPICall('get-all-order?action=buy&status=0&admin_user_id='+this.state.currentUserId + params)
    .then(response => {
      let rowData = response.data.result;
      let total_price = response.data.total_price;
      let total_volume = response.data.total_volume;
      let total_count = response.data.total_count;
      let count = response.data.orderLength
      if(rowData){
        this.setState({ rowData });
      }
      if(count){
        this.setState({ count });
      }
      if(total_price){
        this.setState({ total_price });
      }
      if(total_volume){
        this.setState({ total_volume });
      }
      if(total_count){
        this.setState({ total_count });
      }
    })
    getAPICall('paired_currency?status=1&admin_user_id='+this.state.currentUserId)
    .then(response => {
      let cPaired = response.data;

      if(cPaired){
        this.setState({ cPaired });
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
          let params = '?action=buy&status=0&admin_user_id='+this.state.currentUserId+"&per_page=" + this.state.pageSize + "&page=" + page;
          models.forEach((field)=>{
            const f = field[0];
            const fV = field[1]?.filter;
            // params[f] = fV;
            params = `${params}&${f}=${fV}`;
          })
          getAPICall('get-all-order' + params).then((res) => {
            rowData.successCallback([...res.data.result], res.data.orderLength);
          });
        },
      };

      this.state.gridApi.setDatasource(dataSource);
    }
  }
  DeleteOrder = (order_id,user_id) => {
    const data = {
      order_id : order_id,
      user_id : user_id,
      action_by : "admin",
      admin_user_id: this.state.currentUserId
    }
    if(order_id && user_id){
      postAPICall('cancle-order',data)
      .then(response => {
        const rowData = response.data;
        if(rowData.status == 200){
          NotificationManager.success(response.data.message)             
        }else{
          NotificationManager.error(response.data.message)             
        }
      })
    }else{
      NotificationManager.error("order_id OR user_id Not Found")             
    }
  }
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
    const { rowData, rowDataSell,total_price,cPaired, cmcDATA , total_volume, total_count, columnDefs, defaultColDef, pageSize, orderLength } = this.state;
    let getPrice =  {}; 
    const isFloat = (x) => { return !!(x % 1); }
    (cmcDATA != null) && cmcDATA.map(item => {
      if(item.is_paired){
        if(item?.symbol == 'BTC'){
          getPrice.is_paired_btc = item?.current_price_inr;
        }else if(item?.symbol == 'USDT'){
          getPrice.is_paired_usdt = item?.current_price_inr;
        }else if(item?.symbol == 'INR'){
          getPrice.is_paired_inr = 1;
        } else {
          getPrice.is_paired_vrx = item?.current_price_inr;
        }
        
      }
    })
    const PCard =  total_count && (total_count != null) && total_price && (total_price != null )  && cmcDATA && (cmcDATA != null) && cmcDATA?.map(item => {
      let tc = total_count[item?.symbol] ? total_count[item?.symbol] : 1
      let totl = total_price[item?.symbol] ? Number(total_price[item?.symbol]/tc).toFixed(2) : 0
      return (
        <>
          {totl ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                key= {item.name}
                hideChart
                iconRight
                icon={<Media  object src={item.icon} height="25" width="25" />}
                stat={item.symbol}
                total= {totl}
                statTitle={false}
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    const VCard = total_volume && (total_volume != null ) && cmcDATA && (cmcDATA != null) && cmcDATA?.map(item => {
      let totl = total_volume[item?.symbol] ? Number(total_volume[item?.symbol]).toFixed(2) : 0
      
      return (
        <>
          {totl ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                key= {item.name}
                hideChart
                iconRight
                icon={<Media  object src={item.icon} height="25" width="25" />}
                stat={item.symbol}
                total= {totl}
                statTitle=''
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    const TCard = total_count && (total_count != null ) && cmcDATA && (cmcDATA != null) && cmcDATA?.map(item => {
      let totl = total_count[item?.symbol] ? total_count[item?.symbol] : 0
      

      return (
        <>
          {totl ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                key= {item.name}
                hideChart
                iconRight
                icon={<Media  object src={item.icon} height="25" width="25" />}
                stat={item.symbol}
                total= {totl}
                statTitle=''
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    return (
      <React.Fragment>
        {PCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Average Trade Price</h2>
            </Col>
            {PCard}
          </Row>
        ) : ''}
        {VCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Trade Volume</h2>
            </Col>
            {VCard}
          </Row>
        ) : ''}
        {TCard ? (
          <Row className="app-user-list">
            <Col sm="12">
              <h2>Total Coin Count</h2>
            </Col>
            {TCard}
          </Row>
        ) : ''}
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
                    <div className="h2 float-left">Total Open Buy : {this.state.count !== null ? this.state.count : 0 }</div>
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
                      rowHeight={60}
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
