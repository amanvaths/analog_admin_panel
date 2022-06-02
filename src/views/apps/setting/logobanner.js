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
  Spinner,
  CustomInput,
  Media
} from "reactstrap"
import { ContextLayout } from "../../../utility/context/Layout"
import { AgGridReact } from "ag-grid-react"
import "../../../assets/scss/plugins/tables/_agGridStyleOverride.scss"
import "../../../assets/scss/pages/users.scss"
import "react-toggle/style.css"
import "../../../assets/scss/plugins/forms/switch/react-toggle.scss"
import { NotificationManager } from "react-notifications"
import { BaseURL, getAPICall, getWebsiteData, postAPICall, WebsiteURL } from "../../../redux/helpers/api_functions"
import { connect } from "react-redux"
import { actions } from "react-table"
import { Editor } from "react-draft-wysiwyg"
import "../../../assets/scss/plugins/extensions/editor.scss"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import Toggle from "react-toggle"
class LogoBanner extends React.Component {
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
    logo: null, 
    editorState: '',
    sort_logo: null, 
    favicon: null,
    banner_img: null,
    bannerDesc:"",
    newsHead:"",
    newsContent:"",
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
    columnDefs: [
      {
        headerName: "Website Title",
        field: "website_title",
        width: 250
      },
      {
        headerName: "Logo",
        field: "logo_img_name",
        width: 250
      },
      {
        headerName: "Favicon",
        field: "favicon_img_name",
        width: 250
      },
      {
        headerName: "Emails",
        field: "support_email",
        width: 400, 
        cellRendererFramework: params => {
          return (
            <div>
              <b>Support Email: {params.data.support_email}</b>
            </div>
          )
        }
      },
      {
        headerName: "Emails",
        field: "contact_email",
        width: 400, 
        cellRendererFramework: params => {
          return (
            <div>
              <b>Support Email: {params.data.contact_email}</b>
            </div>
          )
        }
      },
      {
        headerName: "Emails",
        field: "info_email",
        width: 400, 
        cellRendererFramework: params => {
          return (
            <div>
              <b>Support Email: {params.data.info_email}</b>
            </div>
          )
        }
      },
      {
        headerName: "Emails",
        field: "noreply_email",
        width: 400, 
        cellRendererFramework: params => {
          return (
            <div>
              <b>Support Email: {params.data.noreply_email}</b>
            </div>
          )
        }
      },
    ]
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
  // async componentDidMount() {
  //   getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
  //   .then(response => {
  //     if(response.status === 200){
  //       let rowData = response.data?.params?.website;
  //       console.log("rowData1 : ",rowData)
  //       if(rowData){
  //         this.setState({ rowData });
  //       }
  //     }
  //   })
  // }

  // updateQUERY = () => {
  //   const serialize = require('form-serialize');
  //   const form = document.querySelector('#tokendata');
  //   let alltxtData = serialize(form, { hash: true });
  //   const formData = new FormData();
  //   if(this.state.logo)
  //     formData.append("logo", this.state.logo, this.state.logo.name);
  //   if(this.state.sort_logo)
  //     formData.append("sort_logo", this.state.sort_logo, this.state.sort_logo.name);
  //   if(this.state.favicon)
  //     formData.append("favicon", this.state.favicon, this.state.favicon.name);
  //     formData.append("user_id", this.state.currentUserId)
  //     formData.append("data", JSON.stringify(alltxtData));
  //     console.log("formData: ", formData)
  //     postAPICall("update-website", formData).then((d)=>{
  //       if(d.status === 200) {
  //         if(d.data.status === 200) {
  //           NotificationManager.success(d.data.message);
  //           getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
  //             .then(response => {
  //               if(response.status === 200){
  //                 let rowData = response.data?.params?.website;
  //                 if(rowData){
  //                   this.setState({ rowData });
  //                 }
  //               }
  //             })
  //         } else {
  //           NotificationManager.error(d.data.message);
  //         }
  //       } else {
  //         NotificationManager.error("Something Went Wrong!!");
  //       }
  //     }).catch(e=>console.log(e))
  // }
  // updateNewsLater = () => {
  //   const serialize = require('form-serialize');
  //   const form = document.querySelector('#newslaterdata');
  //   let alltxtData = serialize(form, { hash: true });
  //     alltxtData.action = 'set_news_later';   
  //     alltxtData.user_id = this.state.currentUserId;   
      
  //     postAPICall('update-website',alltxtData)
  //     .then(response => {
  //         if(response.data.query_status){
  //           NotificationManager.success(response.data.message)             
  //         }else{
  //           NotificationManager.error(response.data.message)             
  //         }
  //     })
  // }
  // updateBannerStatus = (status) => {
  //   let alltxtData = {}
  //     alltxtData.action = 'set_banner_status';   
  //     alltxtData.banner_status = status ? false : true;   
  //     alltxtData.user_id = this.state.currentUserId;   
  //     postAPICall('update-website',alltxtData)
  //     .then(response => {
  //         if(response.data.query_status){
  //           getAPICall('get-website-data?admin_user_id='+this.state.currentUserId)
  //             .then(response => {
  //               if(response.status === 200){
  //                 let rowData = response.data?.params?.website;
  //                 if(rowData){
  //                   this.setState({ rowData });
  //                 }
  //               }
  //             })
  //           NotificationManager.success(response.data.message)             
  //         }else{
  //           NotificationManager.error(response.data.message)             
  //         }
  //     })
  // }
  updateBannerimg = (banner_url) => {
    const formData = new FormData();
    if(this.state.banner_logo){
      formData.append("banner", this.state.banner_logo, this.state.banner_logo.name);
      formData.append("description", this.state.bannerDesc);
    }
    // formData.append("action", "set_banner_url");
    // formData.append("user_id", this.state.currentUserId);
      postAPICall('addNotification',formData)
      .then(response => {
          if(response.status==200){
            NotificationManager.success(response.data.message)             
          }else{
            NotificationManager.error(response.data.message)             
          }
      })
  }
    uploadIMG = (input, txt) => {
        if (input.target.files && input.target.files[0]) {
          if(txt == 'website_img') {
          this.setState({ logo:  input.target.files[0]});
          }
          if(txt == 'short_logo_img') {
            this.setState({ sort_logo:  input.target.files[0]});
          }
          if(txt == 'favicon_img') {
            this.setState({ favicon:  input.target.files[0]});
          }
          if(txt == 'banner_logo') {
            this.setState({ banner_logo:  input.target.files[0]});
          }
        }
    }

    submitHandler(e){
      e.preventDefault();
      let{newsContent,newsHead} =this.state;
      
      if(newsContent==="" || newsHead===""){
         NotificationManager.warning("Please fill the field Properly.")
      }
      else{
        postAPICall("addNews",{title:newsHead,description:newsContent}).then((res)=>{
             console.log(res.data,"response.....");
             NotificationManager.success(res.data.message)
             // setTimeout(()=>{ window.location.reload();},1000)
         }).catch((err)=>{
           NotificationManager.error("Something went wrong.")
         })
      }
      
 
 
  }
  render() {
  
    const { rowData,columnDefs, defaultColDef, pageSize, logo, sort_logo, favicon , editorState} = this.state;
    const url = WebsiteURL+'/theme/img/'
    return (
    <React.Fragment>
        <Row className="app-user-list">
            <Col sm="12">
                <Card>
                    <CardBody>
                          {/* <div className="row col-md-12">
                            <span className=" float-left h3 text-success mr-1">Website url: </span> <span className="h3 text-success"> {rowData && rowData.website_name ? rowData.website_name : ''} </span> 

                          </div> */}
                        {/* <Form className="row" id="tokendata">
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Logo</Label>
                                    <CustomInput type="file" accept="image/*" name="website_logo" id="logo_img" onChange={(e) => {this.uploadIMG(e, 'website_img')}}/>
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Short Logo</Label>
                                    <CustomInput type="file" accept="image/*" name="shortl_img" id="shortl_img" onChange={(e) => {this.uploadIMG(e, 'short_logo_img')}}/>
                                </FormGroup>
                                
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Favicon</Label>
                                    <CustomInput type="file" accept="image/*" name="favicon_logo" id="favicon_logo" onChange={(e) => {this.uploadIMG(e, 'favicon_img')}}/>
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Website Title</Label>
                                    <Input type="text" name="website_title" defaultValue={rowData && rowData.website_title ? rowData.website_title : ''} id="website_title" placeholder="Enter Website Title..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Website Short Name</Label>
                                    <Input type="text" name="website_sort_name" defaultValue={rowData && rowData.website_short_name ? rowData.website_short_name : ''} id="website_sort_name" placeholder="Enter Website Name..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Support Email</Label>
                                    <Input type="email" name="support_email" defaultValue={rowData && rowData.support_email ? rowData.support_email : ''} id="support_email" placeholder="Enter Support Email..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Contact us Email</Label>
                                    <Input type="email" name="contact_email" defaultValue={rowData && rowData.contact_email ? rowData.contact_email : ''} id="contact_email" placeholder="Enter Contact Email..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="name" className="label-text h6">Info Email</Label>
                                    <Input type="email" name="info_email" defaultValue={rowData && rowData.info_email ? rowData.info_email : ''} id="info_email" placeholder="Enter Info Email..." />
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Label for="symbol" className="label-text h6">Noreply Email</Label>
                                    <Input type="email" name="noreply_email" defaultValue={rowData && rowData.noreply_email ? rowData.noreply_email : ''} id="noreply_email" placeholder="Enter Noreply Email..." />
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
                                        Update Website
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form> */}
                        {/* <Form className="row" id="newslaterdata">
                            <Col md="8" sm="12">
                                <FormGroup>
                                    <Label for="news_later" className="label-text h6">News Later Message</Label>
                                    <Input type="text" defaultValue={rowData && rowData.news_later ? rowData.news_later : ''} name="news_later" id="news_later" placeholder="Enter message" />
                                  
                                </FormGroup>
                            </Col>
                            <Col md="2" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={() => {
                                          this.updateNewsLater( )
                                        }}
                                    >
                                        Update News Later
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form> */}
                        <Form className="row" id="bannerndata">
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h6">Banner</Label>
                                    <CustomInput type="file" accept="image/*" name="banner_logo" id="banner_logo" onChange={(e) => {this.uploadIMG(e, 'banner_logo')}}/>
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="banner_logo" className="label-text h6">Description</Label>
                                    <Input  name="banner_desc" id="banner_logo" onChange={(e) => {this.setState({bannerDesc:e.target.value})}}/>
                                </FormGroup>
                            </Col>
                          
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                          this.updateBannerimg(e.target.value)
                                        }}
                                    >
                                        Update banner Image
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>

                        <Form className="row" id="bannerndata">
                      
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="newsHead" className="label-text h6">News Heading</Label>
                                    <Input type="text" name="newsHead" id="newsHead" onChange={(e) => {this.setState({newsHead:e.target.value})}}/>
                                </FormGroup>
                            </Col>
                            <Col md="4" sm="12">
                             
                                <FormGroup>
                                    <Label for="newscontent" className="label-text h6"> News Description</Label>
                                    <Input  name="newsContent" id="newscontent" onChange={(e) => {this.setState({newsContent:e.target.value})}}/>
                                </FormGroup>
                                
                            </Col>
                          
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Button.Ripple
                                        color="primary"
                                        type="button"
                                        className="mt-2"
                                        onClick={(e) => {
                                          this.submitHandler(e)
                                        }}
                                    >
                                        Add News
                                    </Button.Ripple>
                                </FormGroup>
                            </Col>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        {/* <Row className="app-user-list">
            <Col sm="12">
            <Card>
                <CardBody>
                <div className="ag-theme-material ag-grid-table">
                    <div className="ag-grid-actions d-flex justify-content-between flex-wrap mb-1">
                    
                    </div>
                    {rowData !== null ? (
                      <>
                        <h2>Uploaded Images</h2>  
                        <div className="row">
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h2 mr-1">Logo: </Label>
                                    <img src={rowData.logo_img_name  ? url+rowData.logo_img_name : ''} alt="logo not uploaded" id="website_img" name="website_img" width="350"/>
                                </FormGroup>
                                
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h2 mr-1">Short Logo: </Label>
                                    <img src={rowData.logo_short  ? url+rowData.logo_short : ''} alt="short logo not uploaded" id="short_logo_img" name="short_logo_img" width="350" />
                                </FormGroup>
                                
                            </Col>
                            <Col md="4" sm="12">
                                <FormGroup>
                                    <Label for="logo_img" className="label-text h2 mr-1">Favicon: </Label>
                                    <img src={rowData.favicon_img_name  ? url+rowData.favicon_img_name : ''} alt="favicon not uploaded" id="favicon_img" name="favicon_img" width="150"/>
                                </FormGroup>
                            </Col>
                        </div>
                      </>
                    
                    ) : (
                      <>
                           <div className="text-center">
                          <Spinner color="primary" />
                        </div>
                      </>
                    )}
                </div>
                </CardBody>
            </Card>
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
export default connect(mapStateToProps)(LogoBanner)