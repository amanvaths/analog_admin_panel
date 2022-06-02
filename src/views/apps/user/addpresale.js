import React from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  Row,
  Form,
  Col,
  Select,
  Spinner,
} from "reactstrap";
import axios from "axios";
import { ContextLayout } from "../../../utility/context/Layout";
import { AgGridReact } from "ag-grid-react";
//import BaseURLAPI from "../../../../src/redux/helpers/api_functions"

import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss";
import "../../../assets/scss/pages/users.scss";
import * as Icon from "react-feather";
import { history } from "../../../history";
import { getAPICall, postAPICall ,BaseURLAPI } from "../../../redux/helpers/api_functions";
import { connect } from "react-redux";
import NotificationManager from "react-notifications/lib/NotificationManager";
class addpresale extends React.Component {
 state={
     levelName:"",
     coinQty:"",
     coinPrice:"",
     duration:"",
     status:""
     
 };
 submitHandler(e){
     e.preventDefault();
     let{levelName,coinQty,coinPrice,duration,status} =this.state;
     console.log(status,"statt")
     if(levelName=="" || coinQty=="" || coinPrice=="" || duration=="" || status==""){
        NotificationManager.warning("Please fill the field Properly.")
     }
     else{
        axios.post(BaseURLAPI +"/addpresale",{levelname:levelName,coinquantity:coinQty,coinprice:coinPrice,duration:duration,status:status}).then((res)=>{
            console.log(res.data,"response.....");
            NotificationManager.success("Pre-sale added successfully.")
            // setTimeout(()=>{ window.location.reload();},1000)
        }).catch((err)=>{
          NotificationManager.error("Something went wrong.")
        })
     }
     
    console.log(this.state.levelName,"hello")


 }
 

 

  render() {
    return (
      <Row className="app-user-list justify-content-center">
        <Col sm="12"></Col>
        <Col sm="12" md="6">
          <Card>
            <CardBody style={{ height: "70vh" }}>
              <h1 className="text-center">Add Pre-sale</h1>
              <Form className="py-4" onSubmit={this.submitHandler.bind(this)}>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="levelname" className="col-sm-3 col-md-5 col-lg-2  col-form-label">
                    Level Name
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="levelname"
                      placeholder="Enter Level"
                      onChange={(e)=>{this.state.levelName=e.target.value;}}
                      value={this.levelName}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="coinQty" className="col-sm-3 col-md-5 col-lg-2 col-form-label">
                    Coin Quantity
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="coinQty"
                      placeholder="Coin Quantity"
                      onChange={(e)=>{this.state.coinQty=e.target.value;}}
                      value={this.coinQty}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="coinPrice" className="col-sm-3 col-md-5 col-lg-2 col-form-label">
                    Coin Price
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="coinPrice"
                      // pattern="/^\d*\.?\d*$/"
                      title="Coin price can be in number or digits"
                      placeholder="Coin Price"
                      onChange={(e)=>{this.state.coinPrice=e.target.value;}}
                      value={this.coinPrice}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="duration" className="col-sm-3 col-md-5 col-lg-2 col-form-label">
                    Duration
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="number"
                      className="form-control px-1"
                      id="duration"
                      placeholder="Enter Duration"
                      onChange={(e)=>this.state.duration=e.target.value}
                      value={this.duration}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="status" className="col-sm-3 col-md-5 col-lg-2 col-form-label">
                    Status
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input type="select" onChange={(e)=>{this.state.status=e.target.value;}} id="status" className="form-control" >
                      <option selected disabled>Select Status</option>
                      <option value="0">In-active</option>
                      <option value="1">Active</option>
                    </Input>
                  </div>
                </div>
                <div className="btnClass d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </Form>
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
export default connect(mapStateToProps)(addpresale);
