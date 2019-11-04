import React from "react";
import { Image, Form } from "semantic-ui-react";

class ImageUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      imagePreviewUrl: ""
    };

    this.handleImageChange = this.handleImageChange.bind(this);
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
      this.props.onChange(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  render() {
    let { imagePreviewUrl } = this.state;

    return (
      <div
        className="image-upload"
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        {imagePreviewUrl && (
          <label htmlFor="file-input">
            <Image src={imagePreviewUrl} />
          </label>
        )}
        <Form style={imagePreviewUrl ? { display: "none" } : null}>
          <Form.Input
            label="Select poster image"
            type="file"
            accept="image/*"
            onChange={this.handleImageChange}
            id="file-input"
          />
        </Form>
      </div>
    );
  }
}

export default ImageUploader;
