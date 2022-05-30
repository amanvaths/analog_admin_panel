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
class editNotification extends React.Component {
 state={
    
     banner:null,
     setDesc:"",
     newsHeading:"",
     newsContent:""
     
 };

 componentDidMount(){
     getAPICall("/getNews"+window.location.search).then((res)=>{this.setState({newsHeading:res.data.title})}).catch((err)=>console.log(err))
 }

 notiSubmitHandler(e){
    e.preventDefault();
     const files = new FormData();
     files.append(
       "img",
       this.state.banner,
       
     )
     console.log(files,"hello")

    console.log({banner:this.state.banner[0],desc:this.state.setDesc},"efhieh");
    //console.log(formData,"scfhJH")
    // console.log(banner,"banner")
   postAPICall("addNotification",files).then((res)=>{console.log(res.data,"res.data"); NotificationManager.success(res.data.message)}).catch((err)=>console.log("err0",err))
    
}

 submitHandler(e){
     e.preventDefault();
     let{newsContent,newsHeading} =this.state;
     
     if(newsContent==="" || newsHeading===""){
        NotificationManager.warning("Please fill the field Properly.")
     }
     else{
        axios.post(BaseURLAPI +"/addNews",{title:newsHeading,description:newsContent}).then((res)=>{
            console.log(res.data,"response.....");
            NotificationManager.success(res.data.message)
            // setTimeout(()=>{ window.location.reload();},1000)
        }).catch((err)=>{
          NotificationManager.error("Something went wrong.")
        })
     }
     


 }
 
  render() {
    return (
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12" >
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
                       onChange={(e)=>{ this.state.banner = e.target.files}}
                      value={this.banner}
                      
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="desc" className="col-sm-3 col-md-3 col-lg-3 col-form-label">
                    Description
                  </Label>
                  <div className="col-sm-9 col-md-8">
                    <textarea
                      
                      className="form-control px-1"
                      id="desc"
                      placeholder="Description"
                      onChange={(e)=>this.state.setDesc = e.target.value}
                       value={this.setDesc}
                     
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


export default editNotification;
