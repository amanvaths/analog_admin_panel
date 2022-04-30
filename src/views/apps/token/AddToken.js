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
  CustomInput,
  Media
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import {
  Edit,
  Trash2,
  ChevronDown,
  Clipboard,
  Printer,
  Download,
} from "react-feather"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import { history } from "../../../history"
import Select from "react-select"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import Toggle from "react-toggle"
import Radio from "../../../components/@vuexy/radio/RadioVuexy"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import queryString from "query-string"
class UsersList extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let {wallet_type} = queryString.parse(props.location.search)
    if (
      props.currentUserId !== state.currentUserId
    ) {
      return {
        currentUserId: props.currentUserId,
        load_wallet_type : wallet_type 
      }
    }
    // Return null if the state hasn't changed
    return null
  }
  state = {
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
    blockchain_radio:0,
    is_coin:false,
    columnDefs: [
      {
        headerName: "ID",
        field: "id",
        width: 50,
        checkboxSelection: true,
        headerCheckboxSelectionFilteredOnly: true,
        headerCheckboxSelection: true
      },
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
        headerName: "Logo",
        field: "icon",
        width: 100,
        cellRendererFramework: params => {
          return (
              <>
                <Media
                  className="users-avatar-shadow rounded"
                  object
                  src={params.value}
                  alt="user profile image"
                  height="25"
                  width="25"
                  />
              </>
              )
          }
      },
      {
        headerName: "Token Name(Symbol)",
        field: "name",
        filter : true,
        width: 400,
        cellRendererFramework: params => {
          return (
              <>
                  {params.value} ({params.data.symbol})
              </>
              )
          }
      },
      {
        headerName: "Block Chain",
        field: "blockchain",
        filter : true,
        width: 200,
      },
      {
        headerName: "Token Type/Precision",
        field: "contract_type",
        filter : true,
        width: 200,
        cellRendererFramework: params => {
          return (
            <div>
              {params.value} - {params.data.precision}
            </div>
          )
        }
      },
      // {
      //   headerName: "status",
      //   width: 150,
      //   field: "status",
      //   cellRendererFramework: params => {
      //     return (
      //       <label className="react-toggle-wrapper w-25">
      //         <Toggle
      //           defaultChecked={!this.state.isChecked}
      //           className="switch-danger mt-1"
      //         />
      //       </label>
      //     )
      //   }
      // },
      {
        headerName: "Actions",
        field: "transactions",
        width: 120,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Edit
                className="mr-50"
                size={30}
                onClick={() => {
                  if(params.data.contract_type != ''){
                    let editurl = "/app/token/edittoken?action=modify&_id="+params.data._id+"&wallet_type="+params.data.symbol;
                    history.push(editurl)
                  }else{
                    NotificationManager.info("You can not modify main Currency, Only modify tokens")
                  }
              }}
              />
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
    let alltxtData = {
      admin_user_id : this.state.currentUserId
    }
    postAPICall('gettoken',alltxtData)
    .then(response => {
      const rowData = response.data;
      this.setState({ rowData });
    })
  }
  updateStatusQUERY = (token_symbol,action,status) => {
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
  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData['icon'] = document.getElementById('token_img').src;
    
    if(!alltxtData.blockchain || !alltxtData.contract_type){
      NotificationManager.error("Please Select Blockchain and Contract type")
    } else if(!alltxtData.name && !alltxtData.symbol && !alltxtData.precision && !alltxtData.supply && !alltxtData.inr_price){
      NotificationManager.error("Please Fill All Information")
    }else{
      alltxtData.admin_user_id = this.state.currentUserId;
        postAPICall('addtoken',alltxtData)
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
    }
  }
    uploadIMG = (input) => {
        let uploadsrc = null;
        if (input.target.files && input.target.files[0]) {
          let files = input.target.files[0];
            var reader = new FileReader();
             reader.onload = function (e) {
              document.getElementById('token_img').src = e.target.result;
            };
            
            reader.readAsDataURL(files); // convert to base64 string
            this.setState({token_logo:files});
        }
    }
  render() {
    const { rowData,columnDefs, blockchain_radio, defaultColDef, pageSize } = this.state;
    const CoinSetting = [{"label":"Coin","value":"coin"},{"label":"Token","value":"token"}];
    
    const BlockchainSetting = [{"label":"Please Select","value":0},{"label":"Self Blockchain","value":0},{"label":"Ethereum","value":"ethereum"},{"label":"Binance","value":"binance"},{"label":"Polygon","value":"polygon"},{"label":"Tron","value":"tron"}]
    const StatndardSetting = {
        0: "Self Coin",
        "ethereum":"ERC20,ERC721",
        "binance": "BEP20,BEP21",
        "polygon": "ERC20,ERC721",
        "tron": "TRC10,TRC20,TRC721"
      }
    let token_list = null;
    if(this.state.alltoken != null){
        token_list = this.state.alltoken && this.state.alltoken.map(tokn =>{
            return {label: tokn.name+" ("+tokn.symbol+") ", value: tokn.symbol}
        })
    }
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="tokendata">
                            <input type='hidden' name="token_type" value='self'/>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {CoinSetting != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Coin</Label>
                                        <Select
                                            className="React"
                                            id="wallet_type"
                                            classNamePrefix="select"
                                            defaultValue={CoinSetting[0]}
                                            name="coin"
                                            options={CoinSetting}
                                            onChange={(e) => {
                                              this.setState({ is_coin: e.value })
                                          }}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    {BlockchainSetting != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Blockchain</Label>
                                        <Select
                                            className="React"
                                            id="Blockchain"
                                            classNamePrefix="select"
                                            defaultValue={BlockchainSetting[0]}
                                            name="blockchain"
                                            onChange={(e) => {
                                                this.setState({ blockchain_radio: StatndardSetting[e.value] })
                                            }}
                                            options={BlockchainSetting}
                                        />
                                        </>
                                    ) : null}
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                              
                                <FormGroup className="mt-2">
                                    {((blockchain_radio != 0 ) && (this.state.is_coin == 'token')) 
                                    ? blockchain_radio.split(',').map((item,i) => (
                                    <>
                                        <div className="d-inline-block mr-1">
                                            <Radio
                                            label={item}
                                            color="primary"
                                            value={item.toLowerCase()}
                                            name="contract_type"
                                            />
                                        </div>
                                    </>
                                    )):null}
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                              {this.state.is_coin == 'token' ? (
                                <>
                                  <FormGroup>
                                      <Label for="contract_address" className="label-text h6">Contract/Id</Label>
                                      <Input type="text" id="contract_address" name="contract_address" placeholder="Enter Contract Address or token Id ..." />
                                  </FormGroup>
                                </>
                              ): null}
                            </Col>
                            <Col md="1" sm="12">
                          
                                <>
                                  <FormGroup>
                                      <Label for="inr_price" className="label-text h6">INR Price</Label>
                                      <Input type="number" id="inr_price" name="inr_price" required placeholder="Enter price ..." />
                                  </FormGroup>
                                </>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Logo</Label>
                                    <img className="hidden" id="token_img" name="token_img" />
                                    <CustomInput type="file" accept="image/*" name="token_logo" id="logo_img" onChange={(e) => {this.uploadIMG(e)}}/>
                                </FormGroup>
                                
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Name</Label>
                                    <Input type="text" name="name" id="name" placeholder="Enter name..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Symbol</Label>
                                    <Input type="text" name="symbol" id="symbol" placeholder="Enter symbol..." />
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="precision" className="label-text h6">Precision (ex: 6,8,12,16)</Label>
                                    <Input type="number" id="precision" name="precision" placeholder="Enter precision number..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="supply" className="label-text h6">Supply</Label>
                                    <Input type="text" id="supply" name="supply" placeholder="Enter Supply ..." />
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
                                        Add Token
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
                        <h2 className="float-left ml-1">System is Loading All Token settings.</h2>
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