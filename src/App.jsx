import { hot } from "react-hot-loader";
import React, {
  Component,
  Fragment
} from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {
  Tabs,
  Tab,
  AppBar
} from "@material-ui/core";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import "./App.scss";
import { Glossaries } from "./components/Glossaries/Glossaries";
import { Home } from "./components/Home";
import { GlossaryEdit } from "./components/Glossaries/GlossaryEdit/GlossaryEdit";
import { GlossaryPractice } from "./components/Glossaries/GlossaryPractice";

const styles = theme => {
  const layoutProps = {
    [theme.breakpoints.up("lg")]: {
      width: theme.breakpoints.values["lg"],
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.only("md")]: {
      width: theme.breakpoints.values["md"],
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    [theme.breakpoints.down("sm")]: {
      width: "auto",
      marginTop: "calc((100vw - 100%) / 2)",
      marginLeft: 'auto',
      marginRight: 'auto',
    },

  };

  return {
    topBar: {
      ...layoutProps,
      paddingLeft: "calc((100vw - 100%) / 2)"
    },
    mainContent: {
      ...layoutProps,
      paddingTop: theme.spacing.unit * 10,
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing.unit * 7
      },
    },
    toolbarSecondary: {
      justifyContent: "space-between"
    }
  };
};

const routes = [
  { path: "/", label: "Home" },
  { path: "/glossaries", label: "Glossaries" },
  { path: "", label: "Log out" }
];

class App extends Component {
  constructor(props) {
    super(props);

    this.setTab = this.setTab.bind(this);

    this.state = {
      selectedTab: 0
    };


 

  }

  setTab(value) {
    this.setState((state, props) => {
      return {
        selectedTab: value
      };
    });
  }

  render() {
    const classes = this.props.classes;

    return (
      <Fragment>
        <CssBaseline />
        <Router>

          <AppBar variant="fullWidth" position="fixed">
            <div className={classes.topBar}>
              <Tabs variant="fullWidth" value={this.state.selectedTab} onChange={(event, value) => this.setTab(value)}>
                {routes.map((value, index) => (
                  <Tab key={index} label={value.label} component={Link} to={value.path} />
                ))}
              </Tabs>
            </div>
          </AppBar>
          <div className={classes.mainContent}>
            <Switch>
              {/* <Route path="/user" component={User} /> */}
              <Route path="/glossaries/:glossaryId/practice" component={GlossaryPractice} />
              <Route path="/glossaries/:glossaryId/edit" component={GlossaryEdit} />
              {/* <Route path="/glossaries/:id" render={() => <GlossaryDetails />} /> */}
              <Route path="/glossaries" component={Glossaries} />
              <Route path="/whatever" component={null} />
              <Route path="/" exact component={Home} />
            </Switch>
          </div>
        </Router>
      </Fragment>
    );
  }
}

const styleWith = withStyles(styles);
const styledApp = styleWith(App);
const hotReload = hot(module);
export default hotReload(styledApp);