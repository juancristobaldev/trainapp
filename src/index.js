import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';

import './index.css';
import { DataProvider } from './context/DataProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql',
  cache: new InMemoryCache(),
});

root.render(
  <ApolloProvider client={client}>
    <DataProvider>
      <App/>
    </DataProvider>
  </ApolloProvider>
);

