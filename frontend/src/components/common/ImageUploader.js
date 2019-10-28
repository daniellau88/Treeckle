import React from "react";
import { Form, Image } from "semantic-ui-react";

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      imagePreviewUrl: ""
    };

    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    // TODO: do something with -> this.state.file
  }

  handleImageChange(e) {
    e.preventDefault();

    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };

    console.log(file, reader.result);
    if (file) {
      reader.readAsDataURL(file);
    }
  }

  render() {
    let { imagePreviewUrl } = this.state;

    return (
      <div>
        <Form onSubmit={this._handleSubmit}>
          <Form.Input
            type="file"
            accept="image/*"
            onChange={this.handleImageChange}
          />
          <Form.Button type="submit" onClick={this.handleSubmit}>
            Upload Image
          </Form.Button>
        </Form>
        {imagePreviewUrl && <Image src={imagePreviewUrl} />}
      </div>
    );
  }
}

export default ImageUploader;
