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
  CardHeader,
  CardTitle,
} from "reactstrap"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications"
import { getAPICall, postAPICall } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import DataTable from "react-data-table-component"

class StakeSetting extends React.Component {
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
    one_stake:'',
    one_stake_per:'',
    second_stake:'',
    second_stake_per:'',
    third_stake:'',
    third_stake_per:'',
    fourth_stake:'',
    fourth_stake_per:'',
    columns:[
        {
            name: "Stake Type",
            selector: "id",
            sortable: true
          },
        {
          name: "Days",
          selector: "days"
        },
        {
            name: "Percent",
            selector: "percent"
        }
      ]
  }
  async componentDidMount() {
    getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
    .then(response => {
      if(response.status === 200){
        const rowData = response.data.params.website.stake;
        this.setState({ rowData });
      }
    }).catch(e=>console.log(e));
  }

  updateQUERY = (e, type) => {
      e.preventDefault();
      if(type === 1) {
        if(this.state.one_stake>0 || this.state.one_stake_per>0) {
            const body = {
                user_id:this.state.currentUserId,
                one_stake: this.state.one_stake,
                one_stake_per: this.state.one_stake_per
            }
            this.updateKey(body);
        } else {
            NotificationManager.error("Please Fill type 1 Days nad type 1 percent");
        }
      } else if(type === 2) {
        if(this.state.second_stake>0 || this.state.second_stake_per>0) {
            const body = {
                user_id:this.state.currentUserId,
                second_stake: this.state.second_stake,
                second_stake_per: this.state.second_stake_per
            }
            this.updateKey(body);
        } else {
            NotificationManager.error("Please Fill type 2 Days nad type 2 percent");
        }
      } else if(type === 3) {
        if(this.state.third_stake>0 || this.state.third_stake_per>0) {
            const body = {
                user_id:this.state.currentUserId,
                third_stake: this.state.third_stake,
                third_stake_per: this.state.third_stake_per
            }
            this.updateKey(body);
        } else {
            NotificationManager.error("Please Fill type 3 Days nad type 3 percent");
        }
      } else if(type === 4) {
        if(this.state.fourth_stake>0 || this.state.fourth_stake_per>0) {
            const body = {
                user_id:this.state.currentUserId,
                fourth_stake: this.state.fourth_stake,
                fourth_stake_per: this.state.fourth_stake_per
            }
            this.updateKey(body);
        } else {
            NotificationManager.error("Please Fill type 4 Days nad type 4 percent");
        }
      } else {
          NotificationManager.info("Not Updated")
      }
  }
  updateKey = (alltxtData) => {
    postAPICall("update-stake", alltxtData).then((d)=>{
        if(d.status === 200) {
          if(d.data.status === 200) {
            NotificationManager.success(d.data.message);
            getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
                .then(response => {
                if(response.status === 200){
                    const rowData = response.data.params.website.stake;
                    this.setState({ rowData });
                }
                }).catch(e=>console.log(e));
          } else {
            NotificationManager.error(d.data.message);
          }
        } else {
          NotificationManager.error("Something Went Wrong!!");
        }
      }).catch(e=>console.log(e))
  }
  render() {
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                        <Form className="row" id="tokendata">
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Set Days type1</Label>
                                    <Input type="text" 
                                    value={this.state.one_stake} 
                                    onChange={(e)=>{
                                        this.setState( {one_stake:
                                            e.target.value
                                            .replace(/[^0-9.]/g, "")
                                            .replace(/(\..*?)\..*/g, "$1")
                                        })
                                    }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type1 precent</Label>
                                    <Input type="text"
                                    value={this.state.one_stake_per} 
                                    onChange={(e)=>{
                                        this.setState( {one_stake_per:
                                            e.target.value
                                            .replace(/[^0-9.]/g, "")
                                            .replace(/(\..*?)\..*/g, "$1")
                                        })
                                    }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                            this.updateQUERY(e, 1)
                                        }}
                                    >
                                        Update Stake
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type2</Label>
                                    <Input type="text"
                                     value={this.state.second_stake} 
                                     onChange={(e)=>{
                                         this.setState( {second_stake:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type2 percent</Label>
                                    <Input type="text" 
                                     value={this.state.second_stake_per} 
                                     onChange={(e)=>{
                                         this.setState( {second_stake_per:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                            this.updateQUERY(e, 2)
                                        }}
                                    >
                                        Update Stake
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type3</Label>
                                    <Input type="text"
                                     value={this.state.third_stake} 
                                     onChange={(e)=>{
                                         this.setState( {third_stake:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type3 percent</Label>
                                    <Input type="text" 
                                     value={this.state.third_stake_per} 
                                     onChange={(e)=>{
                                         this.setState( {third_stake_per:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                            this.updateQUERY(e, 3)
                                        }}
                                    >
                                        Update Stake
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type4</Label>
                                    <Input type="text"
                                     value={this.state.fourth_stake} 
                                     onChange={(e)=>{
                                         this.setState( {fourth_stake:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Set Days type4 percent</Label>
                                    <Input type="text"
                                     value={this.state.fourth_stake_per} 
                                     onChange={(e)=>{
                                         this.setState( {fourth_stake_per:
                                             e.target.value
                                             .replace(/[^0-9.]/g, "")
                                             .replace(/(\..*?)\..*/g, "$1")
                                         })
                                     }} placeholder="0" />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                            this.updateQUERY(e, 4)
                                        }}
                                    >
                                        Update Stake
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {this.state.rowData !== null ? (
        <Row className="app-user-list">
            <Col sm="12">
            <Card>
                <CardHeader>
                <CardTitle>Stake Details</CardTitle>
                </CardHeader>
                <CardBody>
                <DataTable data={this.state.rowData} columns={this.state.columns} noHeader />
                </CardBody>
            </Card>
            </Col>
        </Row>):null}
        {/* <Row className="app-user-list">
            <Col sm="12">
                <DataTablePagination />
            </Col>
        </Row> */}
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUserId: state.auth.login.user.user_id
  }
}
export default connect(mapStateToProps)(StakeSetting)