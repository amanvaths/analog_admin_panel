import React from "react";
import {
  Card,
  CardBody,
  Input,
  Label,
  Row,
  Form,
  Col,
Textarea,
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
class editNews extends React.Component {
 state={
    
     banner:null,
     setDesc:"",
     newsHeading:"",
     newsContent:""
     
 };



 submitHandler(e){
     e.preventDefault();
     let{newsContent,newsHeading} =this.state;
     
     if(newsContent==="" || newsHeading===""){
        NotificationManager.warning("Please fill the field Properly.")
     }
     else{
         const id = window.location.search;
         const _id =id.substring(5)
         console.log(_id)
        axios.post(BaseURLAPI +"/editNews",{id:_id,title:newsHeading,description:newsContent}).then((res)=>{
            console.log(res.data,"response.....");
            NotificationManager.success(res.data.message);
            setTimeout(()=>window.location.reload(),2000)
           
        }).catch((err)=>{
          NotificationManager.error("Something went wrong.")
        })
     }
     
  

 }
 componentDidMount(){
    getAPICall("getNews"+window.location.search).then((res)=>{console.log(res.data[0],"response");this.setState({newsHeading:res.data[0].title , newsContent:res.data[0].description})})
 }
//  console.log(this.state.newsHeader)
 
  render() {
    return (
      <Row className="app-user-list justify-content-center">
        <Col sm="12"></Col>
       
         <Col sm="12" md="6">
          <Card>
            <CardBody style={{ height: "70vh" }}>
              <h1 className="text-center">Edit News</h1>
              <Form className="py-4" onSubmit={this.submitHandler.bind(this)}>
           
                <div className="form-group row d-flex justify-content-center">
                  <Label for="heading" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                   Heading
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="heading"
                      placeholder="Enter Heasding"
                      onChange={(e)=>{this.setState({newsHeading:e.target.value})}}
                      value={this.state.newsHeading}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="content" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Content
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <textarea
                      
                      className="form-control px-1"
                      id="content"
                      placeholder="news-content"
                      onChange={(e)=>{this.setState({newsContent:e.target.value})}}
                      value={this.state.newsContent}
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


export default editNews;
