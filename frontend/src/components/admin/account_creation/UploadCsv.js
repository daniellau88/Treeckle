import React from "react";
import axios, { post } from "axios";
import { Header, Form } from "semantic-ui-react";
import { Context } from "../../../contexts/UserProvider";

class UploadCsv extends React.Component {
  static contextType = Context;

  constructor(props) {
    super(props);
    this.state = {
      file: null
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.fileUpload(this.state.file).then(response => {
      console.log(response.data);
    });
  }
  onChange(e) {
    this.setState({ file: e.target.files[0] });
  }
  fileUpload(file) {
    const url = "../auth/newAccountRequestCSV";
    const formData = new FormData();
    formData.append("csvFile", file);
    const config = {
      headers: {
        Authorization: `Bearer ${this.context.token}`,
        "Content-Type": "multipart/form-data"
      }
    };
    return post(url, formData, config);
  }

  render() {
    return (
      <Form onSubmit={this.onFormSubmit}>
        <Header>File Upload</Header>
        <Form.Input type="file" onChange={this.onChange} />
        <Form.Button
          content="Upload .csv"
          fluid
          primary
          onChange={this.onChange}
        />
      </Form>
    );
  }
}

export default UploadCsv;
