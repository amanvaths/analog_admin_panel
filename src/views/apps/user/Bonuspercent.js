import React,{useEffect, useState} from "react";
import {
  Card,
  CardBody,
  FormGroup,
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
function Bonuspercent(){
//  state={
//      buyingbonus:"",
//      level1:"",
//      level2:"",
//      level3:""
     
//  };
 const[buyingbonus,setBuyingBonus] = useState("");
 const[level1,setLevel1] = useState("");
 const[level2,setLevel2] = useState("");
 const[level3,setLevel3] = useState("");
 const[hoLevel1,setHoLevel1] = useState("");
 const[hoLevel2,setHoLevel2] = useState("");
 const[hoLevel3,setHoLevel3] = useState("");
 const[loader,setLoader]=useState(true);
 
 const[submitResp,setSubmitResp] = useState({});
 console.log(level1,"hello")

useEffect(()=>{
    axios.get(BaseURLAPI +"/bonuspercent").then((res)=>{
                console.log(res.data.Bonus_percent[0],"response.....")
                const response = res.data.Bonus_percent[0];
                console.log(response.buying_bonus,"helll");
               setBuyingBonus(response.buying_bonus);
               setLevel1(response.level1);
               setLevel2(response.level2);
               setLevel3(response.level3);
               setHoLevel1(response.ho_level1);
               setHoLevel2(response.ho_level2);
               setHoLevel3(response.ho_level3);
               setLoader(false)
            })

},[submitResp]);

function submitHandler(e){
     e.preventDefault();
     axios.post(BaseURLAPI + "/updatePrecent",{bonus:buyingbonus,level1:level1,level2:level2,level3:level3,ho_level1:hoLevel1,ho_level2:hoLevel2,ho_level3:hoLevel3}).then((resp)=>{
       console.log(resp.data,"pesppp");
       NotificationManager.success("Update Successfully.");
       setSubmitResp(resp.data);
      
      
     }).catch((err)=>{
       console.log(err,"error");
       NotificationManager.error("Something went wrong.")
     })
   
     }
     

 
 

 

 
    return (
      <Row className="app-user-list justify-content-center">
        <Col sm="12"></Col>
       {!loader ? 
       (
         <>
       <Col sm="12" md="6">
          <Card>
            <CardBody className="h-100" style={{ height: "90vh" }}>
              <h1 className="text-center">Bonus Percent</h1>
              <form className="py-3 py-sm-1" onSubmit={submitHandler}>
              <h3 className="text-center  pb-md-2" style={{textDecoration:"underline"}}>Bounty Bonus Percent</h3>
                <div className="form-group row d-flex justify-content-center">
                  <label htmlFor="levelname" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                    Buying Bonus Percent
                  </label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control px-1"
                      id="levelname"
                      placeholder="Buying Bonus Percent"
                      onChange={(e)=>setBuyingBonus(e.target.value)}
                      value={buyingbonus}
                      name="buyingBonus"
                    />
                  </div>
                </div>
                <h3 className="text-center py-md-1 pb-md-2" style={{textDecoration:"underline"}}>Affiliate Bonus percent</h3>
                <div className="form-group row d-flex justify-content-center">
                  <label htmlFor="coinQty" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                   Level-1 Percent
                  </label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control  px-1"
                      id="coinQty"
                      placeholder="Level-1 Percent"
                      onChange={(e)=>{setLevel1(e.target.value)}}
                      value={level1}
                      name="level1"
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <label htmlFor="coinPrice" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                  Level-2 Percent
                  </label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control  px-1"
                      id="coinPrice"
                      placeholder=" Level-2 Percent"
                      onChange={(e)=>{setLevel2(e.target.value)}}
                      value={level2}
                      name="level2"
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="duration" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                  Level-3 Percent
                  </Label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control  px-1"
                      id="duration"
                      placeholder="Level-3 Percent"
                      onChange={(e)=>{setLevel3(e.target.value)}}
                      value={level3}
                      name="level3"
                    />
                  </div>
                </div>
                <h3 className="text-center py-md-1 pb-md-2" style={{textDecoration:"underline"}}>HandOut Level Percent</h3>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="duration" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                  Level-1 Percent
                  </Label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control  px-1"
                      id="duration"
                      placeholder="Level-3 Percent"
                      onChange={(e)=>{setHoLevel1(e.target.value)}}
                      value={hoLevel1}
                      name="level3"
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="duration" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                  Level-2 Percent
                  </Label>
                  <div className="col-sm-12 col-md-6">
                    <Input
                      type="number"
                      className="form-control  px-1"
                      id="duration"
                      placeholder="Level-3 Percent"
                      onChange={(e)=>{setHoLevel2(e.target.value)}}
                      value={hoLevel2}
                      name="level3"
                    />
                  </div>
                </div>
                <div className="form-group row d-flex justify-content-center">
                  <Label htmlFor="duration" className="col-sm-12 col-md-5 col-lg-3 col-form-label">
                  Level-3 Percent
                  </Label>
                  <div className="col-sm-12 col-md-6">
                    <Input  
                      type="number"
                      className="form-control  px-1"
                      id="duration"
                      placeholder="Level-3 Percent"
                      onChange={(e)=>{setHoLevel3(e.target.value)}}
                      value={hoLevel3}
                      name="level3"
                    />
                  </div>
                </div>

                <div className="btnClass d-flex justify-content-center">
                <Button.Ripple
                    color="primary"
                    type="submit"
                    className="mr-1 mb-1"
                  >
                    Submit
                  </Button.Ripple>
                </div>
              </form>
            </CardBody>
          </Card>
        </Col>
        </>):
        (
          <>
            <div className="float-left">
              <Spinner color="primary" />
            </div>
            <h2 className="float-left ml-1">
              System is loading Date.
            </h2>
          </>
        )
        }
      </Row>
    );
  }


const mapStateToProps = (state) => {
  return {
    currentUserId: state.auth.login.user.user_id,
  };
};
export default connect(mapStateToProps)(Bonuspercent);

