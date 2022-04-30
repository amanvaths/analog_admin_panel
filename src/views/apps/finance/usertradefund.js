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
import StatisticsCard from "../../../components/@vuexy/statisticsCard/StatisticsCard"
import {createSocketClient} from "../utils/functions"
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
    cmcDATA:null,
    cPaired:null,
    sCurrency:null,
    tCurrency:null,
    rowData: null,
    allToken: null,
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
    blockchain_radio:null,
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
        filter: true,
        width: 250,
        editable: true,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              { params.value}
            </div>
          )
        }
      },
      {
        headerName: "Name",
        field: "name",
        filter: true,
        width: 250,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              {params.data.first_name +' '+ params.data.middle_name +' '+ params.data.last_name } 
            </div>
          )
        }
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
    const socket = new createSocketClient("kujgwvfq-a-ghosttown-z-1fhhup0p6");
    socket.on("cmc_updated", (res) => {
      if(res){
        this.setState({ cmcDATA : res });
      }
    });
    const formdata = {
      action : 'v_balance',
      admin_user_id: this.state.currentUserId
    } 
    postAPICall('get-user-wallets',formdata)
    .then(response => {
      let rowData = response.data.wallets;
      let sCurrency = response.data.currency;
      let tCurrency = response.data.total_currency;
      let columnDefs = '';
      if(response.data.currency){
        sCurrency && sCurrency.map(wlt =>{
          let _id = wlt;
          let cBal = 0;
          columnDefs = this.state.columnDefs;
          let col =   { 
              headerName: _id,
              field: _id,
              width: 100, 
              filter: true,
              cellRendererFramework: params => {
                cBal = 0;
                let ui = params.data._id;
                (params.data.all_wallet != null) && params.data.all_wallet.map(item => {
                  if(_id == item.wallet_type){
                    cBal = item.balance;
                  }
                })
                  return (
                      <>
                        <div className="react-toggle-wrapper w-25" id={'wl_'+ui+'_'+_id}>
                          {cBal}
                        </div>
                      </>
                  )
              }
            }
            // if(cBal){
              columnDefs.push(col);
            // }
        })
      }
      this.setState({ columnDefs });
      if(rowData){
        this.setState({ rowData });
      }
      if(sCurrency){
        this.setState({ sCurrency });
      }
      if(tCurrency){
        this.setState({ tCurrency });
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
  
  updateQUERY = (token_symbol,action,status) => {
    const alltxtData = {
        token_symbol: token_symbol,
        [action]: status,
        admin_user_id: this.state.currentUserId
    }
    postAPICall('updatecrptosetting',alltxtData)
    .then(response => {
        console.log(response)
    })
  }
  render() {
    const { rowData, cmcDATA, cPaired, tCurrency,sCurrency,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    let getPrice =  {}; 
    const isFloat = (x) => { return !!(x % 1); }
    (cmcDATA != null) && cmcDATA.map(item => {
      if(item.is_paired){
        if(item.symbol == 'BTC'){
          getPrice.is_paired_btc = item.current_price_inr;
        }else if(item.symbol == 'USDT'){
          getPrice.is_paired_usdt = item.current_price_inr;
        }else if(item.symbol == 'INR'){
          getPrice.is_paired_inr = 1;
        } else {
          getPrice.is_paired_vrx = item.current_price_inr;
        }
        
      }
    })
    const NCard = (tCurrency != null ) && (cmcDATA != null) && cmcDATA.map(item => {
      let totl = tCurrency[item.symbol] ? Number(tCurrency[item.symbol]).toFixed(2) : 0
      
      const cPairedCurrency = (cPaired != null) && cPaired.map((i2) => {
        let price = 1;
        if(getPrice[i2.paired_with]){
          price = getPrice[i2.paired_with];
        }
        let raw_price =  item.current_price_inr ? item.current_price_inr : 1;
        let inrPrice = parseFloat(totl)*parseFloat(raw_price) / parseFloat(price);
        inrPrice = isFloat(inrPrice) ? parseFloat(inrPrice.toFixed(2)) : inrPrice; 
        let d = i2.currency_coin+": "+inrPrice+', ';
        return d;
      })
      return (
        <>
          {totl ? 
            (
              <Col xl="2" lg="4" sm="6">
              <StatisticsCard
                hideChart
                iconRight
                icon={<Media  object src={item.icon} height="25" width="25" />}
                stat={item.symbol}
                total= {totl}
                statTitle={cPairedCurrency}
              />
            </Col>
            )
          : ''}
        </>
      )
    })
    return (
    <React.Fragment>
        <Row className="app-user-list">
          {NCard}
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
                        <h2 className="float-left ml-1">System is Calculating All Wallets.</h2>
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