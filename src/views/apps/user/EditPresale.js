import React,{useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import {
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  Label,
  Button,
  Row,
  Col,
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

function EditPresale(){
    const presaleid = useParams();
    const preid = presaleid.presale_id;
    const id =preid.substr(1)
    console.log(id,"presaleid" );
 const[levelName,setLevelName] = useState("");
 const[coinQuantity,setCoinQuantity] = useState("");
 const[coinPrice,setCoinPrice] = useState("");
 const[duration,setDuration] = useState("");
 const [status,editStatus] = useState("");
//  const[submitResp,setSubmitResp] = useState({});
 

useEffect(()=>{
    axios.get(BaseURLAPI +"/getpresalebyid?_id="+id).then((res)=>{
        const response = res.data._data;
        console.log(res.data._data,"res.data")
              
                // const response = res.data.Bonus_percent[0];
                // console.log(response.buying_bonus,"helll");
                setLevelName(response.levelname);
                setCoinQuantity(response.coinquantity);
                setCoinPrice(response.price);
                setDuration(response.duration);
                editStatus(response.status)
            })

},[])

function submitHandler(e){
     e.preventDefault();
     if(levelName=="" ||coinQuantity=="" || coinPrice=="" || duration==""){
        NotificationManager.warning("Something missing in input field");
     }
     axios.post(BaseURLAPI + "/updatepresale",{_id:id,levelname:levelName,coinquantity:coinQuantity,price:coinPrice,duration:duration}).then((resp)=>{
       console.log(resp.data,"pesppp");
       NotificationManager.success(resp.data.message);
       setTimeout(()=>{history.push("/app/user/presalelist")},1500)
    //    setSubmitResp(resp.data);
    setTimeout(()=>{
        window.location.reload()
    },1500);
      
      
     }).catch((err)=>{
       console.log(err,"error");
       NotificationManager.error("Something went wrong.")
     })
   
     }
     
 
    return (
      <Row className="app-user-list">
        <Col sm="12"></Col>
        <Col sm="12">
          <Card>
            <CardBody style={{ height: "70vh" }}>
              <h1 className="text-center">Edit Presale</h1>
              <Form className="py-4" onSubmit={submitHandler}>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="levelname" className="col-sm-2 col-md-3 col-lg-1 col-form-label">
                    Level Name
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="levelname"
                      placeholder="Enter Level"
                      onChange={(e)=>{setLevelName(e.target.value)}}
                      value={levelName}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="coinQty" className="col-sm-2 col-md-3 col-lg-1 col-form-label">
                    Coin Quantity
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="number"
                      className="form-control px-1"
                      id="coinQty"
                      placeholder="Coin Quantity"
                      onChange={(e)=>{setCoinQuantity(e.target.value)}}
                      value={coinQuantity}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="coinPrice" className="col-sm-2 col-md-3 col-lg-1 col-form-label">
                    Coin Price
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="text"
                      className="form-control px-1"
                      id="coinPrice"
                      placeholder="Coin Quantity"
                      onChange={(e)=>{setCoinPrice(e.target.value)}}
                      value={coinPrice}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="duration" className="col-sm-2 col-md-3 col-lg-1 col-form-label">
                    Duration
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <Input
                      type="number"
                      className="form-control px-1"
                      id="duration"
                      placeholder="Enter Duration"
                      onChange={(e)=>setDuration(e.target.value)}
                      value={duration}
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label for="status" className="col-sm-2 col-md-2 col-lg-1 col-form-label">
                    Status
                  </Label>
                  <div className="col-sm-10 col-md-6">
                    <select selected={status} onChange={(e)=>{editStatus(e.target.value)}} id="status" className="form-control" >
                      <option value="0">In-active</option>
                      <option value="1">Active</option>
                    </select>
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


const mapStateToProps = (state) => {
  return {
    currentUserId: state.auth.login.user.user_id,
  };
};
export default connect(mapStateToProps)(EditPresale);
//export default Bonuspercent;
