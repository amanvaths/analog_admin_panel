import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  CustomInput,
  FormGroup,
  Button,
  Input,
  Label
} from "reactstrap"
import { Formik, Field, Form } from "formik"
import * as Yup from "yup"

const formSchema = Yup.object().shape({
  required: Yup.string().required("Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Required"),
  number: Yup.number().required("Required"),
  url: Yup.string()
    .url()
    .required("Required"),
  date: Yup.date().required("Required"),
  minlength: Yup.string()
    .min(4, "Too Short!")
    .required("Required"),
  maxlength: Yup.string()
    .max(5, "Too Long!")
    .required("Required")
})

class FormValidation extends React.Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle> Add New Page</CardTitle>
        </CardHeader>
        <CardBody>
          <Formik
            initialValues={{
              required: "",
              email: "",
              url: "",
              number: "",
              date: "",
              minlength: "",
              maxlength: ""
            }}
            validationSchema={formSchema}
          >
            {({ errors, touched }) => (
              <Form>
                <FormGroup className="my-3">
                  <Label> Select Category </Label>
                  <CustomInput type="select" name="select" id="city">
                    <option>New York</option>
                    <option>Chicago</option>
                    <option>San Francisco</option>
                    <option>Boston</option>
                  </CustomInput>
                </FormGroup>
                <FormGroup className="my-3">
                  <Label> select sub-category </Label>
                  <CustomInput type="select" name="select" id="city">
                    <option>New York</option>
                    <option>Chicago</option>
                    <option>San Francisco</option>
                    <option>Boston</option>
                  </CustomInput>
                </FormGroup>
                <FormGroup className="my-3">
                  <Label for="required">Enter Menu Name</Label>
                  <Field
                    name="required"
                    id="required"
                    className={`form-control ${errors.required &&
                      touched.required &&
                      "is-invalid"}`}
                  />
                  {errors.required && touched.required ? (
                    <div className="invalid-tooltip mt-25">{errors.required}</div>
                  ) : null}
                </FormGroup>
                <FormGroup className="my-3">
                  <Label for="url">Slug</Label>
                  <Field
                    name="url"
                    id="url"
                    className={`form-control ${errors.url &&
                      touched.url &&
                      "is-invalid"}`}
                  />
                  {errors.url && touched.url ? (
                    <div className="invalid-tooltip mt-25">{errors.url}</div>
                  ) : null}
                </FormGroup>
                <FormGroup>
                    <Label for="banner_img" className="label-text h6">Banner</Label>
                    <img alt="" className="hidden" id="banner_img" name="banner_img" />
                    <CustomInput type="file" accept="image/*" name="banner_img" id="banner_img" />
                </FormGroup>
                <FormGroup className="my-3">
                  <Label for="url">Description</Label>
                  <Input
                    type="textarea"
                    name="text"
                    id="exampleText"
                    rows="3"
                    placeholder="Textarea"
                  />
                </FormGroup>
                
                <Button.Ripple color="primary" type="submit">
                  Submit
                </Button.Ripple>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    )
  }
}
export default FormValidation
