import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";


const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'http://localhost:3001/graphql',
  headers: {
    authorization: localStorage.getItem('Id_token') || ''
  }
})

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <>
          <Navbar />
          <Switch>
            <Route exact path="/" component={SearchBooks} />
            <Route exact path="/saved" component={SavedBooks} />
            <Route render={() => <h1 className="display-2">Wrong page!</h1>} />
          </Switch>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
