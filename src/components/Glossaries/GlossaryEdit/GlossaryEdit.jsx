
import React, { Fragment } from "react";
import firebase from "../../../Firebase";
import Papa from "papaparse";
import {
  TableHead,
  Grid,
  Button,
  Fab,
  TableRow,
  TableCell,
  Typography,
  Table,
  TableBody,
  TextField,
  withStyles,
  CircularProgress,
  IconButton
} from "@material-ui/core";

import {
  CloudUpload as CloudUploadIcon,
  Save as SaveIcon,
  Check as CheckIcon,
  Delete as DeleteIcon
} from "@material-ui/icons";

import { green } from "@material-ui/core/colors";


const styles = theme => {

  const buttonMargins = {
    marginLeft: theme.spacing.unit
  };

  return {
    root: {
      display: "flex",
      alignItems: "center"
    },
    glossaryForm: {
      marginBottom: theme.spacing.unit
    },
    saveWrapper: {
      // display: "block",
      position: "relative",
      // minHeight: 36,
      // minWidth: 98.22
    },
    saveButtonSuccess: {
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[700],
      },
      ...buttonMargins
    },
    button: {
      ...buttonMargins
    },
    saveProgress: {
      color: green[500],
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: -12,
      marginLeft: -12,
    },
    buttonIcon: {
      marginRight: theme.spacing.unit
    },
    field: {
      // marginLeft: theme.spacing.unit,
      marginRight: theme.spacing.unit * 2,
      width: 200
    }
  };
};

class GlossaryEdit extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      _id: null,
      title: "",
      description: "",
      badges: "",
      isUpToDate: false,
      isSaving: false,
      words: []
    };

    this.getGlossary = this.getGlossary.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    this.onSaveClick = this.onSaveClick.bind(this);
    this.onFileSelect = this.onFileSelect.bind(this);
    this.updateGlossaryWords = this.updateGlossaryWords.bind(this);
    this.saveGlossary = this.saveGlossary.bind(this);
  }

  componentDidMount() {
    this.getGlossary();
  }

  getGlossary() {
    const glossaryId = this.props.match.params.glossaryId;
    const db = firebase.firestore();



    const glossaryRef = db.collection("glossaries")
      .doc(glossaryId)
      .get()
      .then(doc => {
        this.setState({
          _id: doc.id,
          title: doc.data().title,
          description: doc.data().description,
          badges: doc.data().description
        });
      });

    const wordsRef = db.collection("glossaries")
      .doc(glossaryId)
      .collection("words")
      .get()
      .then(snapShot => {

        let words = [];
        snapShot.forEach(document => {

          console.log("Word: ", document.data());
          words.push({
            kanji: document.data().kanji,
            translation: document.data().translation,
            kunyomi: document.data().kunyomi,
            onyomi: document.data().onyomi
          });
        });

        this.setState({
          words: words
        });
      });
  }

  saveGlossary() {
    const glossaryId = this.props.match.params.glossaryId;
    const db = firebase.firestore();


    

    const wordCollection = db.collection("glossaries")
      .doc(glossaryId)
      .collection("words");

    let deletePromise = wordCollection.get()
      .then(snapShot => {
        snapShot.forEach(data => {
          wordCollection.doc(data.id).delete();
        });
      });


    return deletePromise.then(() => {
      var addPromises = this.state.words.map(word => {
        return wordCollection.add(word);
      });

      var titleAndDescriptionPromise = db.collection("glossaries")
      .doc(glossaryId)
      .update("title", this.state.title, "description", this.state.description);

      return Promise.all(addPromises, titleAndDescriptionPromise);
    });
  }


  handleTitleChange(event) {
    this.setState({
      title: event.target.value
    });
  }

  handleDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }

  onSaveClick(event) {
    this.setState({
      isUpToDate: false,
      isSaving: true
    });

    this.saveGlossary().then(() => {
      this.setState({
        isUpToDate: true,
        isSaving: false
      });
    });
  }

  
  onFileSelect(event) {
    console.log("things?");
    let parseResult = null;

    const file = event.target.files[0];
    console.log("File: ", file);
    Papa.parse(file, {
      complete: (result, file) => {
        this.updateGlossaryWords(result.data)
      }
    });
  }

  updateGlossaryWords(data) {
    console.log("updateGlossaryWords: ", data);
    this.setState({
      words: data.filter((value, index) => index !== 0).map((value, index) => {
        return {
          kanji: value[0],
          translation: value[1],
          kunyomi: value[2],
          onyomi: value[3],
        }
      })
    });
  }

  render() {
    const classes = this.props.classes;
    const state = this.state;

    return (
      <Fragment>
        <form className={classes.glossaryForm} noValidate>
          <Grid alignItems="flex-end" justify="space-between" container>
            <Grid item>
              <Grid alignItems="flex-end" container>
                <Grid item>
                  <TextField
                    id="glossary-title"
                    label="Title"
                    className={classes.field}
                    value={state.title}
                    onChange={this.handleTitleChange}
                    margin="normal" />
                </Grid>
                <Grid item>
                  <TextField
                    id="glossary-description"
                    label="Description"
                    className={classes.field}
                    multiline
                    rowsmax="4"
                    value={state.description}
                    onChange={this.handleDescriptionChange}
                    margin="normal" />
                </Grid>
              </Grid>
            </Grid>
            <Grid item className={classes.root}>
              <Grid justify="flex-start" container>
                <Grid item>
                  <div className={classes.saveWrapper}>
                    <Button variant="contained" color="primary" className={this.state.isUpToDate ? classes.saveButtonSuccess : classes.button} disabled={this.state.isSaving} onClick={this.onSaveClick}>
                      {this.state.isUpToDate ? <CheckIcon className={classes.buttonIcon} /> : <SaveIcon className={classes.buttonIcon} />}
                      Save
                    </Button>
                    {this.state.isSaving && <CircularProgress className={classes.saveProgress} size={24} />}
                  </div>
                </Grid>
                <Grid item>
                  <Button color="secondary" variant="contained" className={classes.button} disabled={true}>
                    <DeleteIcon className={classes.buttonIcon} />
                    Delete
                  </Button>
                </Grid>
                <Grid item>
                  <input
                    onChange={this.onFileSelect}
                    hidden
                    id="upload-glossary-file"
                    type="file" />
                  <label htmlFor="upload-glossary-file">
                    <Button variant="contained" component="span" disabled={this.state.isSaving} className={classes.button}>
                      <CloudUploadIcon className={classes.buttonIcon} />
                      Upload glossary
                    </Button>
                  </label>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Kanji</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Translation</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Kunyomi</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">Onyomi</Typography>
              </TableCell>
              {/* <TableCell> */}
              {/* <Typography variant="h6">Edit</Typography> */}
              {/* </TableCell> */}
            </TableRow>
          </TableHead >
          <TableBody>
            {state.words.map((word, wordIndex) => (
              <TableRow key={wordIndex}>
                {Object.keys(word).map((key, keyIndex) => (
                  <TableCell key={keyIndex}>
                    <Typography variant="h6">{keyIndex === 0 ? (<strong>{word[key]}</strong>) : word[key]}</Typography>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Fragment >
    );
  }
}

const styledComponent = withStyles(styles)(GlossaryEdit);

export { styledComponent as GlossaryEdit };