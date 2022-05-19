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
class NotificationForm extends React.Component {
 state={
     levelName:"",
     coinQty:"",
     coinPrice:"",
     duration:"",
     status:"",
     banner:null,
     setDesc:""
     
 };

 notiSubmitHandler(e){
    e.preventDefault();
     const formdata = new FormData(e.target);
    const{banner,setDesc} = e.state
   postAPICall("addNotification",formdata).then((res)=>{console.log(res.data,"res.data"); NotificationManager.success("Submitted successfully.")}).catch((err)=>console.log("err0",err))
    
}

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
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12" md="6">
          <Card>
            <CardBody style={{ height: "70vh" }}>
              <h1 className="text-center">Add Notification</h1>
              <Form className="py-4" onSubmit={this.notiSubmitHandler.bind(this)}>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="banner" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Add Banner
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <input
                      type="file"
                      className="form-control px-1"
                      id="banner"
                      placeholder="Image"
                    //   onChange={(e)=>{ this.setState({banner:e.target.files[0]});}}
                    //   value={this.banner}
                      
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="desc" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Description
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="desc"
                      placeholder="Description"
                    //  onChange={(e)=>this.setState({setDesc:e.target})}
                    //  value={this.setDesc}
                     
                    />
                  </div>
                </div>
               
                <div className="btnClass d-flex justify-content-center">
                <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </Form>
            </CardBody>
          </Card>
        </Col>
         <Col sm="12" md="6">
          <Card>
            <CardBody style={{ height: "70vh" }}>
              <h1 className="text-center">Add News</h1>
              <Form className="py-4" onSubmit={this.submitHandler.bind(this)}>
              <div className="form-group row d-flex justify-content-center">
                  <Label for="bannernews" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Add Banner
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <input
                      type="file"
                      className="form-control px-1"
                      id="bannernews"
                      placeholder="Image"
                    //   onChange={(e)=>{ this.setState({banner:e.target.files[0]});}}
                    //   value={this.banner}
                      
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="heading" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                   Heading
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="heading"
                      placeholder="Enter Level"
                      onChange={(e)=>{this.setState({newsHeading:e.target.value})}}
                      value={this.newsHeading}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="content" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Content
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="content"
                      placeholder="news-content"
                      onChange={(e)=>{this.setState({newsContent:e.target.value})}}
                      value={this.newsContent}
                    />
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


export default NotificationForm;
