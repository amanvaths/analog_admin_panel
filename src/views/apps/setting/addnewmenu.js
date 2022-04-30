import React from "react"
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
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
  UncontrolledTooltip,
  Collapse,
  Button,
  Spinner
} from "reactstrap"
import axios from "axios"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
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
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import * as Icon from "react-feather"
import { history } from "../../../history"
import Axios from "axios"
import Select from "react-select"
import Toggle from "react-toggle"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"

class UsersList extends React.Component {
  state = {
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
    validPassword:true,
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
        headerName: "No",
        field: "id",
        width: 90,
      },
      {
        headerName: "Wallet Coin",
        field: "wallet_type",
        width: 150,
      },
      {
        headerName: "Wallet Address",
        field: "wallet_address",
        filter: false,
        width: 350,
      },
      {
        headerName: "Private Key",
        field: "private_key",
        filter: false,
        width: 350
      },
      {
        headerName: "Funds",
        field: "total_funds",
        filter: false,
        width: 100,
      },
      {
        headerName: "status",
        width: 100,
        cellRendererFramework: params => {
          return (
            <label className="react-toggle-wrapper w-25">
              <Toggle
                defaultChecked={this.state.isChecked}
                className="switch-danger mt-1"
              />
            </label>
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
              <Edit
                className="mr-50"
                size={30}
                onClick={() => {
              }}
              />
            </div>
          )
        }
      },
      {
        headerName: "Capture Fund",
        filter: false,
        width: 150,
        cellRendererFramework: params => {
          return (
            <div className="actions cursor-pointer">
              <Button.Ripple className="mr-1 btn-sm" color="success" > Capture Fund </Button.Ripple>
            </div>
          )
        }
      },
    ]
  }

  async componentDidMount() {

  }
  updateQUERY = (wallet_type,wallet_address,private_key,enter_password) => {

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
    const { rowData, columnDefs, defaultColDef, pageSize } = this.state;
    // const colourOptions = [
    //     { value: "ocean", label: "Ocean" },
    //     { value: "blue", label: "Blue" },
    //     { value: "purple", label: "Purple" },
    //     { value: "red", label: "Red" },
    //     { value: "orange", label: "Orange" }
    //   ]
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
                    <h2>Coming Soon</h2>
                </CardBody>
          </Card>
        </Col>
      </Row>
      </React.Fragment>
    )
  }
}

export default UsersList
