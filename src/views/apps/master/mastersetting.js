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
  InputGroup,
  InputGroupAddon
} from "reactstrap"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications";
import { postAPICall } from "../../../redux/helpers/api_functions"
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
    rowData: null,
    alltoken: null,
    pageSize: 20,
    isVisible: true,
    reload: true,
    collapse: true,
    status: "Opened",
    role: "All",
    selectStatus: "All",
    validPassword:true,
    otp_sent: false,
    otp_verify: false,
    verified: "All",
    department: "All",
    defaultColDef: {
      sortable: true
    },
    profile_info: null,
    searchVal: "",
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
        width: 150,
      },
      {
        headerName: "Admin Email",
        field: "email",
        width: 400,
      },
      {
        headerName: "Mobile Number",
        field: "mobile_number",
        filter: false,
        width: 450,
        cellRendererFramework: params => {
          return params.value === false ? ( // for active
            <div className=""> Not Added</div>
          ) : params.value.length > 8 ? ( // Not submitted
            <div className="bullet bullet-sm bullet-secondary">{params.value}</div>
          ) : null
        }
      },
      {
        headerName: "Wallet Password",
        field: "wallet_password",
        filter: false,
        width: 450,
        cellRendererFramework: params => {
          return params.value === false ? ( // for active
            <div className=""> Not Added</div>
          ) : params.value.length > 8 ? ( // Not submitted
            <div className="bullet bullet-sm bullet-secondary">{params.value}</div>
          ) : null
        }
      },
    ]
  }

  // async componentDidMount() {
  //   const postdata = {
  //     wallet_password: 1,
  //     admin_user_id: this.state.currentUserId,
  //     user_id: this.state.currentUserId
  //   }
  //   postAPICall('user/get-profile-info',postdata)
  //   .then(response => {
  //     const profile_info = response.data?.params?.profile_info;
  //     if(profile_info){
  //       this.setState({ profile_info });
  //     }
  //   })
  // }

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
  updateQUERY = (mobile_no) => {
    const data = {
      user_id : this.state.currentUserId,
      mobile_no : mobile_no,
      admin_user_id: this.state.currentUserId
    }
    if(mobile_no && (this.state.verify_otp == true) && (this.state.otp_sent == true)){
      postAPICall('updateprofile',data)
        .then(response => {
          if(response.status == 200){
            NotificationManager.success(response.message);
            // this.setState({rowData:rowData});
          }else{
            NotificationManager.error(response.message);
          }
        })
    }else if(mobile_no){
      NotificationManager.error("Please Verify the otp ");
    }else{
      NotificationManager.error("Please enter Mobile No ");
    }
  }
  sendOTP = (mobile_no) => {
    let user_id = this.state.currentUserId;
    const data = {
        user_id : user_id,
        mobile_no : mobile_no,
        admin_user_id: this.state.currentUserId
    }
    if(user_id && mobile_no){
      NotificationManager.success("otp sending");
      postAPICall('send-mobile-varification-otp',data)
      .then(response => {
        if(response.status = 200){
          this.setState({otp_sent:true});
          NotificationManager.success("otp sent");
        }
      })
    }else{
      NotificationManager.error("Please enter Mobile Number");
    }
  }
  verifyOTP = (mobile_no,otp) => {
    let user_id = this.state.currentUserId;
    const data = {
        user_id : user_id,
        otp : otp,
        admin_user_id: this.state.currentUserId
    }
    if(user_id && otp){
      postAPICall('varifie/mobile',data)
      .then(response => {
        if(response.status = 200){
          NotificationManager.success("otp verified");
          this.setState({verify_otp:true});
        }else{

        }
      })
    }else{
      console.log("Please enter Correct otp");
      NotificationManager.error("Please enter Correct otp ");
    }
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
                            <Form className="row">
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Label for="mobileno" className="h5">Enter Mobile Number</Label>
                                    <Input type="number" id="mobileno" placeholder="Enter mobile number..." />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                              <FormGroup>
                                <Label for="otpverify" className="h5">Enter OTP</Label>
                                <InputGroup>
                                  <InputGroupAddon addonType="prepend">
                                    <Button.Ripple id="otpverify" placeholder="Enter otp..." type="button" color="secondary"
                                      onClick={() => {
                                        this.sendOTP(
                                        document.querySelector('#mobileno').value
                                        )
                                    }}
                                    >Send OTP</Button.Ripple>
                                  </InputGroupAddon>
                                  <Input  type="number" id="verifiotp"/>
                                  <InputGroupAddon addonType="append">
                                    <Button.Ripple id="otpverify" type="button" color="secondary"
                                      onClick={() => {
                                        this.verifyOTP(
                                        document.querySelector('#mobileno').value,
                                        document.querySelector('#verifiotp').value,
                                        )
                                    }}
                                    >Verify OTP</Button.Ripple>
                                  </InputGroupAddon>
                                </InputGroup>
                              </FormGroup>
                            </Col>
                            <Col md="3" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                            this.updateQUERY(
                                              document.querySelector('#mobileno').value,
                                            )
                                        }}
                                    >
                                        Add Mobile Number
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
                    {this.state.profile_info !== null ? (
                      <>
                        <FormGroup className="col-md-3 col-sm-12">
                          <Label for="name" className="h5">Mobile Number</Label>
                          <Input
                            type="text"
                            defaultValue={this.state.profile_info.mobile_number}
                            id="name"
                            placeholder="Name"
                            readOnly
                          />
                        </FormGroup>
                      </>
                    ) : null}
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