import { Comment, Avatar, Form, Button, List, Input, Col, Row } from "antd";
import { connect } from "react-redux";
import { createRef } from "react";
import { socket } from "../pages/";
import { URL } from "../config/config.js";



  componentDidMount = () => {
    this.socket.on("messageFromServer", (msg) => {
      console.log('msg from server', msg);

      this.setState({
        comments: [
          ...this.state.comments,
          {
            author: msg.nickName,
            avatar:
              process.env.NODE_ENV === "development"
                ? `${URL}/${msg.profilePhoto}`
                : msg.profilePhoto,
            content: <p>{msg.message}</p>,
          },
        ],
      });
    });
  };

  componentDidUpdate = () => {
    this.scrollBottom();
  };

  handleSubmit = () => {
    if (!this.state.value) {
      return;
    }

    this.setState({
      submitting: true,
    });

    this.socket.emit("messageToServer", {
      message: this.state.value,
      nickName: this.props.nickName,
      room: this.state.room,
      profilePhoto: this.state.profilePhoto,
      signalRoom: this.state.signalRoom,
    });

    setTimeout(() => {
      this.setState({
        submitting: false,
        value: "",
        comments: [
          ...this.state.comments,
          {
            author: this.props.nickName,
            avatar:
              process.env.NODE_ENV === "development"
                ? `${URL}/${this.state.profilePhoto}`
                : this.state.profilePhoto,
            content: <p>{this.state.value}</p>,
          },
        ],
      });
    }, 500);
  };

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    const { comments, submitting, value } = this.state;

    return (
      <div>
        <Row>
          <Col xs={24} md={24} lg={24}>
            <div
              ref={this.divRef}
              style={{
                backgroundColor: "white",
                padding: "8px",
                height: "40vh",
                marginTop: "0.2rem",
                overflowY: "auto",
                borderRadius: "0.5rem",
                border: "solid 1px grey",
              }}
            >
              <CommentList comments={comments} />
            </div>
          </Col>
        </Row>
        <Comment
          style={{ marginBottom: "-1.5rem", padding: "1px" }}
          avatar={
            <Avatar
              author={this.props.nickName}
              src={
                process.env.NODE_ENV === "development"
                  ? `${URL}/${this.state.profilePhoto}`
                  : this.state.profilePhoto
              }
              alt={this.props.nickName}
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </div>
    );
  }
}
