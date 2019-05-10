import firebase from "../../Firebase";
import React, { Fragment } from "react";
import { TableHead, TableRow, TableCell, Typography, Table, TableBody, Paper, Grid, TextField, withStyles, Button, Input } from "@material-ui/core";
import {
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  ArrowForward as ArrowForwardIcon
} from "@material-ui/icons";
import { Transition, TransitionGroup } from "react-transition-group";

const styles = theme => {
  return {
    root: {
      position: "fixed",
      top: theme.spacing.unit * 16,
      left: 0,
      width: "100%",
      [theme.breakpoints.between("lg", "xl")]: {},
      [theme.breakpoints.between("md", "lg")]: {},
      [theme.breakpoints.between("sm", "md")]: { top: "20%" },
      [theme.breakpoints.between("xs", "sm")]: { top: "20%" },
    },
    questionContainer: {
      [theme.breakpoints.between("lg", "xl")]: {
        width: "auto",
        top: theme.spacing.unit * 32,
        marginLeft: theme.spacing.unit * 64,
        marginRight: theme.spacing.unit * 64
      },
      [theme.breakpoints.between("md", "lg")]: {
        width: "auto",
        top: theme.spacing.unit * 16,
        marginLeft: theme.spacing.unit * 16,
        marginRight: theme.spacing.unit * 16
      },
      [theme.breakpoints.between("sm", "md")]: {
        top: "25%",
        // top: theme.spacing.unit * 8,
        marginLeft: theme.spacing.unit * 8,
        marginRight: theme.spacing.unit * 8
      },
      [theme.breakpoints.between("xs", "sm")]: {
        top: "25%",
        width: "auto",
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
      },

    },
    questionContainer: {
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
      [theme.breakpoints.between("xs", "sm")]: {
        // padding: theme.spacing.unit * 5,
        paddingLeft: 0,
        paddingRight: 0,
        paddingBottom: theme.spacing.unit * 4,
        paddingTop: theme.spacing.unit * 4,
        // backgroundColor: "blue"
      },
    },
    kanjiContainer: {
      textAlign: "center",
    },
    kanji: {
      transition: `transform ${300}ms ease-in-out`,
      transform: "translate(100%)"
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



const kanjiTransitionStyles = {
  entering: { transform: "translate(0)" },
  entered: { transform: "translate(0)" },
  extiting: { transform: "translate(-100%)" },
  exited: { transform: "translate(-100%)" }
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
      currentWord: null,
      currentWordIndex: 0,
      currentAnswer: ""
    };

    this.getGlossary = this.getGlossary.bind(this);
    this.getNextWord = this.getNextWord.bind(this);
    this.handleSubmitAnswer = this.handleSubmitAnswer.bind(this);
    this.handleAnswerChange = this.handleAnswerChange.bind(this);
    this.handleSkip = this.handleSkip.bind(this);

  }

  componentDidMount() {
    this.getGlossary().then(() => {
      this.getNextWord();
    });
  }

  handleSubmitAnswer(event) {
    if (this.state.currentAnswer === this.state.currentWord.translation) {
      console.log("You guessed it! Next!");
    } else {
      console.log("Wrong! Next!");
    }
    const currentAnswer = "";
    this.setState({ currentAnswer });

    console.log(this.state.currentAnswer);
  }

  handleAnswerChange(event) {
    const currentAnswer = event.target.value;
    this.setState({ currentAnswer });
  }

  handleSkip() {
    this.getNextWord();
  }

  getNextWord() {

    console.log("Current state: ", this.state);

    if (this.state.currentWord === null) {
      this.setState({
        currentWord: this.state.glossary.words[0]
      });
    } else {
      let currentWordIndex = this.state.currentWordIndex + 1;

      if (currentWordIndex >= this.state.glossary.words.length) return;

      const currentWord = this.state.glossary.words[currentWordIndex];

      this.setState({ currentWord, currentWordIndex });
    }

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



  render() {
    const state = this.state;
    const classes = this.props.classes;

    return (
      <Fragment>
        <div className={classes.root}>
          <Grid justify="center" direction="column" className={classes.questionContainer} container>
            <Grid item>
              <Paper className={classes.questionContainer}>
                <Grid justify="center" direction="column" container>
                  <Grid className={classes.kanjiContainer} item>
                    <Typography variant="h5">What is the translation of</Typography>
                    <Transition key={state.currentWordIndex} in={state.currentWord !== null} timeout={300}>
                      {transitionState => (
                        <Typography  variant="h1" style={{ ...kanjiTransitionStyles[transitionState] }} className={classes.kanji} >{state.currentWord !== null ? state.currentWord.kanji : ""}</Typography>
                      )}
                    </Transition>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item>
              <form className={classes.answerControlContainer} onSubmit={this.handleSubmitAnswer}>
                <TextField
                  variant="outlined"
                  className={classes.answerTextField}
                  placeholder="ANSWER"
                  fullWidth
                  margin="normal"
                  inputProps={{
                    className: classes.answerTextField
                  }}
                  value={state.currentAnswer}
                  onChange={this.handleAnswerChange}
                />
                <Button type="submit" variant="contained" color="primary" className={classes.answerButton} fullWidth >
                  SUBMIT
                </Button>

                {/* <SubdirectoryArrowRightIcon className={classes.answerButtonIcon} /> */}
                <Button variant="contained" color="secondary" fullWidth onClick={this.handleSkip}>
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