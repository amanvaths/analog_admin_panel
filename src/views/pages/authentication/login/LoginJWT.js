import React from "react"
import { CardBody, FormGroup, Form, Input, Button, Label } from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import { Mail, Lock, Check, Key } from "react-feather"
import { userLogin } from "../../../../redux/actions/auth/loginActions"
import { connect } from "react-redux"

class LoginJWT extends React.Component {
  state = {
    email: "",
    password: "",
    remember: false,
    mobile_otp: ""
  }

  handleLogin = e => {
    e.preventDefault()
    this.props.userLogin(
      this.state.email,
      this.state.password,
      this.state.mobile_otp,
    )
  }
  render() {
    return (
      <React.Fragment>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={e => this.setState({ email: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Mail size={15} />
              </div>
              <Label>Email</Label>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.setState({ password: e.target.value })}
                required
              />
              <div className="form-control-position">
                <Lock size={15} />
              </div>
              <Label>Password</Label>
            </FormGroup>
            <FormGroup id="askmobileotp" className=" hidden form-label-group position-relative has-icon-left">
              <Input
                type="text"
                placeholder="Enter OTP"
                value={this.state.mobile_otp}
                onChange={e => this.setState({ mobile_otp: e.target.value })}
              />
              <div className="form-control-position">
                <Key size={15} />
              </div>
              <Label>Mobile OTP</Label>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16} />}
                label="Remember me"
                defaultChecked={false}
                onChange={this.handleRemember}
              />
            </FormGroup>
            <div className="d-flex justify-content-between">
              <Button.Ripple color="primary" type="submit">
                Login
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>
      </React.Fragment>
    )
  }
}
const mapStateToProps = state => {
  return {
    values: state.auth.login
  }
}
export default connect(mapStateToProps, { userLogin })(LoginJWT)
