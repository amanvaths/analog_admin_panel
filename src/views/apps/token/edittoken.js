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
    let { wallet_type, action, _id} = queryString.parse(props.location.search)
    if (
      props.currentUserId !== state.currentUserId
    ) {
      return {
        currentUserId: props.currentUserId,
        wallet_type : wallet_type ,
        action : action,
        _id: _id
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
    is_coin:false,
    blockchain_radio: 0,
    columnDefs: []
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
      admin_user_id : this.state.currentUserId,
      wallet_type : this.state.wallet_type,
      action : this.state.action
    }
    postAPICall('gettoken',alltxtData)
    .then(response => {
      const rowData = response.data;
      if(rowData){
          this.setState({ rowData });
          if(rowData.blockchain){
              this.setState({ blockchain_radio: rowData.blockchain });
          }

      }
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
    })
  }
  updateQUERY = () => {
    const serialize = require('form-serialize');
    const form = document.querySelector('#tokendata');
    let alltxtData = serialize(form, { hash: true });
    alltxtData['icon'] = document.getElementById('token_img').src;
    if(!alltxtData.name && !alltxtData.symbol && !alltxtData.precision && !alltxtData.supply && !alltxtData.inr_price){
      NotificationManager.error("Please Fill All Information")
    }else{
      alltxtData.admin_user_id = this.state.currentUserId;
      alltxtData._id = this.state._id;
        postAPICall('updatetoken',alltxtData)
        .then(response => {
          const rowData = response.data.table;
          if(rowData){
            this.setState({rowData:rowData});
          }
          if(response.data.query_status){
            NotificationManager.success(response.data.message)             
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
      let select_block_chain = rowData && rowData.blockchain && BlockchainSetting.find((w) =>{
          if(w.value == rowData.blockchain){
              return w;
          }
      })
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
                                    {BlockchainSetting != null ? (
                                        <>
                                        <Label for="basicInput" className="label-text h6">Blockchain</Label>
                                        <Select
                                            className="React"
                                            id="Blockchain"
                                            classNamePrefix="select"
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
                                <Label for="basicInput" className="label-text h6">Contract Type</Label>
                                <FormGroup className="">
                                    {((blockchain_radio != 0 )) 
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
                                  <FormGroup>
                                      <Label for="contract_address" className="label-text h6">Contract/Id</Label>
                                      <Input type="text" id="contract_address" name="contract_address" placeholder="Enter Contract Address or token Id ..." 
                                        defaultValue={rowData && rowData.contract_address ? rowData.contract_address : '' }
                                      />
                                  </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <>
                                  <FormGroup>
                                      <Label for="inr_price" className="label-text h6">INR Price</Label>
                                      <Input type="number" id="inr_price" name="inr_price" required placeholder="Enter price ..." 
                                        defaultValue={rowData && rowData.inr_price ? rowData.inr_price : '' }
                                      />
                                  </FormGroup>
                                </>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Logo</Label>
                                    <img className="hidden" id="token_img" src={rowData && rowData.icon ? rowData.icon : ''} name="token_img" />
                                    <CustomInput type="file" accept="image/*" name="token_logo" id="logo_img" onChange={(e) => {this.uploadIMG(e)}}/>
                                </FormGroup>
                                
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Name</Label>
                                    <Input type="text" name="name" id="name" placeholder="Enter name..." 
                                        defaultValue={rowData && rowData.name ? rowData.name : '' }
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Symbol</Label>
                                    <Input type="text" name="symbol" id="symbol" placeholder="Enter symbol..." 
                                        defaultValue={rowData && rowData.symbol ? rowData.symbol : '' }
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="precision" className="label-text h6">Precision</Label>
                                    <Input type="text" id="precision" name="precision" placeholder="Enter precision name..." 
                                        defaultValue={rowData && rowData.precision ? rowData.precision : '' }
                                    />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="supply" className="label-text h6">Supply</Label>
                                    <Input type="text" id="supply" name="supply" placeholder="Supply name ..." 
                                        defaultValue={rowData && rowData.supply ? rowData.supply : '' }
                                    />
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
                                        update Token
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
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