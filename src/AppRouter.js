import React, { Component } from "react";
import { Route, Switch, Link } from "react-router-dom";
import Welcome from "./components/Welcome";
import ReactQuill from "react-quill";
import firebase from "./firebase";
import $ from "jquery";

export default class AppRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userCollection: "",
      text: "",
      document: {
        name: "",
        data: "",
        author: "",
        createdOn: "",
        email: "",
        ownerId: ""
      },
      docId: null,
      shareEmail: ""
    };
  }

  toggleShareInput = e => {
    $("#share-input").toggle();
  };

  createShare = () => {
    let userEmail = this.state.shareEmail;
    let userId = '';
    let obj = {};
    //obj[ownerId] = userEmail;
    firebase
      .database()
      .ref(`documents/${this.props.uid}/${this.state.docId}/sharedWith`)
      .set(obj)
      .then(() => {
        //anotate share success
      });
  };

  getDocumentFromDB = props => {
    firebase
      .database()
      .ref(`documents/${this.props.user.uid}/${props.match.params.id}`)
      .on("value", dataSnap => {
        if (
          JSON.stringify(this.state.text) !==
          JSON.stringify(dataSnap.val().data)
        ) {
          this.handleChange(dataSnap.val().data);
          this.setState({
            document: dataSnap.val(),
            name: dataSnap.val().name,
            docId: props.match.params.id
          });
        }
      });
  };

  renderEditor = () => {
    return (
      <div className="editor-container">
        <label htmlFor="docName">Document Name</label>
        <input
          onChange={e => {
            this.setState({ name: e.target.value });
          }}
          type="text"
          defaultValue={this.state.name}
        />
        <ReactQuill
          user={this.props.user}
          value={this.state.text}
          onChange={this.handleChange}
          modules={this.state.modules}
          formats={this.state.formats}
        />
        <button onClick={this.saveDocument}>Save Doc</button>
      </div>
    );
  };

  saveDocument = () => {
    let obj = {
      ownerId: this.props.user.uid,
      author: this.props.user.displayName,
      createdOn: Date.now(),
      data: this.state.text,
      email: this.props.user.email,
      name: this.state.name
    };
    let docRef = `documents/${this.props.user.uid}`;
    if (!this.state.docId) {
      firebase
        .database()
        .ref(docRef)
        .push(obj)
        .then(res => {
          //anotate saved doc
        });
    } else {
      obj.createdOn = this.state.document.createdOn;
      obj.lastEdit = Date.now();
      firebase
        .database()
        .ref(`${docRef}/${this.state.docId}`)
        .set(obj)
        .then(res => {
          //anotate updated doc
          console.log(res);
        });
    }
  };

  handleChange = value => {
    this.setState({ text: value });
  };

  getDocAndRenderEditor = props => {
    this.getDocumentFromDB(props);
    return (
      <div className="editor-container">
        <div className="doc-details">
          <p>
            Name: <strong>{this.state.document.name}</strong>
          </p>
          <p>
            Created:{" "}
            <strong>
              {new Date(this.state.document.createdOn).toLocaleDateString()}
            </strong>
          </p>
          <p>
            Author: <strong>{this.state.document.email}</strong>
          </p>
        </div>
        <div className="buttons-container">
          <button className="btn btn-warning" onClick={this.toggleShareInput}>
            Share
          </button>
          <Link className="btn btn-primary" to="/editor">
            Edit
          </Link>
        </div>
        <div id="share-input">
          <input
            onChange={e => {
              this.setState({ shareEmail: e.target.value });
            }}
            type="email"
            placeholder="user email"
          />
          <button className="btn btn-primary" onClick={this.createShare}>
            Create Share
          </button>
        </div>
        <ReactQuill user={this.props.user} value={this.state.text} />
      </div>
    );
  };

  render() {
    return (
      <Switch>
        <Route path="/editor" render={this.renderEditor} />
        <Route path="/documents/:id" render={this.getDocAndRenderEditor} />
        <Route component={Welcome} />
      </Switch>
    );
  }
}