import React from "react"
import { Form, FormGroup, Label, Input, Row, Col, Button } from "reactstrap"
import {
  Link,
  Twitter,
  Facebook,
  Instagram,
  GitHub,
  Codepen,
  Slack
} from "react-feather"
class UserSocialTab extends React.Component {
  render() {
    return (
      <Form className="" onSubmit={e => e.preventDefault()}>
        <Col md="12">
          <h2>Coming Soon</h2>
        </Col>
      </Form>
    )
  }
}
export default UserSocialTab
