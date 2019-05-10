import React, { Fragment } from "react";
import firebase from "../../Firebase";
import Grid from "@material-ui/core/Grid";
// import Paper from "@material-ui/core/Paper";
// import Avatar from "@material-ui/core/Avatar";
import { Link } from "react-router-dom";
import { Avatar, Paper, Card, CardActionArea, withStyles, Typography, CardMedia, CardContent, CardActions, Button } from "@material-ui/core";

import Icon from "@material-ui/core/Icon";
import { Add as AddIcon } from "@material-ui/icons";

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  kanjiAvatar: {
    margin: theme.spacing.unit * 2,
    width: "80px",
    height: "80px",
    backgroundColor: theme.palette.secondary.main,
    fontSize: "30pt"
  },
  cardContainer: {
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit * 2
  },
  card: {
    position: "relative",
    padding: theme.spacing.unit * 2,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "100%",
    minHeight: "350px"
  },
  cardMedia: {
    height: 150
  },
  badgeContainer: {
    width: "100%",
    marginTop: theme.spacing.unit * 2,
    // position: "absolute",
    bottom: 0
  },
  badge: {
    marginLeft: theme.spacing.unit
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  }
  ,
  newButton: {
    marginRight: theme.spacing.unit,
    marginBottom: theme.spacing.unit
  },
  buttonIcon: {
    marginRight: theme.spacing.unit
  }

});



class Glossaries extends React.Component {
  constructor(props) {
    super(props);

    this.handleNewGlossary = this.handleNewGlossary.bind(this);
    this.getGlossaries = this.getGlossaries.bind(this);


    this.state = {
      glossaries: [
        // { title: "Transportation", description: "A list of words related to transportation, and a much longer text than the other ones. We'll see how it fares when it comes to reducing height.", badges: ["A", "B", "C"] },
        // { title: "Food", description: "A list of words related to food", badges: ["X", "B", "Z"] },
        // { title: "Animals", description: "A list of words related to animals", badges: ["A", "Z", "C"] },
        // { title: "Workplace", description: "A list of words related to the workplace", badges: ["N", "M", "P"] },
      ]
    }


  }

  componentDidMount() {
    this.getGlossaries();
  }


  render() {
    const classes = this.props.classes;
    const glossaries = this.state.glossaries;

    return (
      <Fragment>
        <div className={classes.buttonContainer}>
          <Button
            onClick={this.handleNewGlossary}
            variant="contained"
            color="primary"
            className={classes.newButton}>
            <AddIcon className={classes.buttonIcon} />
            New glossary
        </Button>
        </div>
        <Grid container className={classes.root}>
          {glossaries.map((glossary, glossaryIndex) => (
            <Grid key={glossaryIndex} item xs={12} sm={6} md={3} lg={3} xl={2} className={classes.cardContainer}>
              <Card>
                <CardActionArea component={Link} to={"/glossaries/" + glossary._id + "/practice"} params={{ id: glossaryIndex }}>
                  <CardMedia image={"https://placeimg.com/640/480/nature?random=" + glossary._id} title={glossary.title} className={classes.cardMedia} />
                  <CardContent>
                    <Typography variant="h5">{glossary.title}</Typography>
                    <Typography component="p">{glossary.description}</Typography>
                    <Grid container justify="flex-end" className={classes.badgeContainer}>
                      {glossary.badges.map((badge, badgeIndex) => (
                        <Grid key={badgeIndex} item className={classes.badge}>
                          <Avatar>
                            {badge}
                          </Avatar>
                        </Grid>
                      ))}
                    </Grid>
                  </CardContent>
                </CardActionArea>
                <CardActions>
                  <Button size="small" color="primary" component={Link} to={"/glossaries/" + glossary._id + "/edit"}>
                    Edit
                </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Fragment>
    );
  }

  getGlossaries() {
    const db = firebase.firestore();

    const glossariesRef = db.collection("glossaries");


    var glossaries = [];

    glossariesRef.get().then((snapshot) => {

      console.log("Fetched some glossaries!");
      snapshot.forEach(doc => {
        console.log("Got one! ", doc.data());
        glossaries.push({ _id: doc.id, ...doc.data() });
      });

      this.setState({
        glossaries: glossaries
      });
    });

  }

  handleNewGlossary() {
    const db = firebase.firestore();

    const glossaryRef = db
      .collection("glossaries")
      .add({
        title: "New Glossary",
        description: "",
        badges: ["A"]
      }).then(newDoc => {

        newDoc.get().then(document => {
          console.log("New document!", document);
          this.setState({
            glossaries: [...this.state.glossaries, {
              _id: document.id,
              ...document.data()
            }]
          });
        });
      });
  }

}

const styledGlossary = withStyles(styles)(Glossaries);

export { styledGlossary as Glossaries };