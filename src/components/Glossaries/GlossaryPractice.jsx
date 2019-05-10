import firebase from "../../Firebase";
import React, { Fragment } from "react";
import { TableHead, TableRow, TableCell, Typography, Table, TableBody, Paper, Grid, TextField, withStyles, Button } from "@material-ui/core";
import {
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";

const styles = theme => {
  return {
    root: {
      position: "fixed",
      top: theme.spacing.unit * 16,
      left: 0,
      width: "100%"
    },
    questionContainer: {
      [theme.breakpoints.between("lg", "xl")]: {
        width: "auto",
        top: theme.spacing.unit * 32,
        marginLeft: theme.spacing.unit * 32,
        marginRight: theme.spacing.unit * 32
      },
      [theme.breakpoints.between("md", "lg")]: {
        width: "auto",
        top: theme.spacing.unit * 16,
        marginLeft: theme.spacing.unit * 16,
        marginRight: theme.spacing.unit * 16
      },
      [theme.breakpoints.between("sm", "md")]: {
        width: "auto",
        top: theme.spacing.unit * 8,
        marginLeft: theme.spacing.unit * 8,
        marginRight: theme.spacing.unit * 8
      },
      [theme.breakpoints.between("xs","sm")]: {
        top: "25%",
        width: "auto",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
      },

    },
    kanjiContainer: {
      [theme.breakpoints.between("lg", "xl")]: {
        padding: theme.spacing.unit * 20,
        // backgroundColor: "red"
      },
      [theme.breakpoints.between("md", "lg")]: {
        padding: theme.spacing.unit * 10,
        // backgroundColor: "orange"
      },
      [theme.breakpoints.between("sm", "md")]: {
        padding: theme.spacing.unit * 5,
        // backgroundColor: "yellow"
      },
      [theme.breakpoints.between("xs","sm")]: {
        // padding: theme.spacing.unit * 5,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: theme.spacing.unit * 4,
        paddingTop: theme.spacing.unit * 4,
        // backgroundColor: "blue"
      }
    },
    kanji: {
      textAlign: "center"
    },
    answerControlContainer: {
      textAlign: "center"
    },
    answerTextField: {
      textAlign: "center"
    },
    answerButton: {
      marginBottom: theme.spacing.unit,
      textAlign: ""
    },
    answerButtonIcon: {
      marginLeft: theme.spacing.unit * 2
    }
  };
}

class GlossaryPractice extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      glossary: {
        _id: null,
        title: "",
        description: "",
        words: []
      },
      activeWord: null
    };

    this.getGlossary = this.getGlossary.bind(this);
    this.getNextWord = this.getNextWord.bind(this);
    this.onSubmitAnswer = this.onSubmitAnswer.bind(this);

  }

  componentDidMount() {
    this.getGlossary().then(() => {
      this.getNextWord();
    });
  }

  getNextWord() {
    this.setState({
      activeWord: this.state.glossary.words[0]
    });
  }

  getGlossary() {
    const glossaryId = this.props.match.params.glossaryId;
    const db = firebase.firestore();

    const glossaryPromise = db.collection("glossaries")
      .doc(glossaryId)
      .get()
      .then(document => {
        this.setState({
          glossary: {
            _id: document.id,
            ...document.data()
          }
        });
      });

    const wordsPromise = db.collection("glossaries")
      .doc(glossaryId)
      .collection("words")
      .get()
      .then(snapShot => {

        let words = [];
        snapShot.forEach(document => {
          words.push({
            _id: document.id,
            ...document.data()
          });
        });

        this.setState({
          glossary: {
            words: words
          }
        });
      });

    return Promise.all([glossaryPromise, wordsPromise]);
  }

  onSubmitAnswer(event) {
    const word = event.target.value
  }

  render() {
    const state = this.state;
    const classes = this.props.classes;

    return (
      <Fragment>
        <div className={classes.root}>
          <Grid justify="center" direction="column" className={classes.questionContainer} container>
            <Grid item>
              <Paper className={classes.kanjiContainer}>
                <Grid justify="center" direction="column" container>
                  <Grid className={classes.kanji} item>
                    <Typography variant="h5">What is the translation of</Typography>
                    <Typography variant="h1" >{state.activeWord !== null ? state.activeWord.kanji : ""}</Typography>
                    {/* <Typography variant="h2" >{state.activeWord !== null ? state.activeWord.kanji : ""}</Typography> */}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <form className={classes.answerControlContainer}>
                <TextField
                  variant="outlined"
                  className={classes.answerTextField}
                  placeholder="ANSWER"
                  fullWidth
                  margin="normal"
                  inputProps={{
                    className: classes.answerTextField
                  }}
                />
                <Button variant="contained" color="primary" className={classes.answerButton} fullWidth>
                  SUBMIT
                {/* <SubdirectoryArrowRightIcon className={classes.answerButtonIcon} /> */}
                </Button>
                <Button variant="contained" color="secondary" fullWidth>
                  SKIP
                {/* <ArrowForwardIcon className={classes.answerButtonIcon} /> */}
                </Button>
              </form>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

var styledGlossaryPractice = withStyles(styles)(GlossaryPractice);

export { styledGlossaryPractice as GlossaryPractice };