import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
c
import './index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));

const httpLink = createHttpLink({
  uri: 'https://trainingapp-api-nodejs.vercel.app/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token || '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    fetchOptions: {
      credentials: 'include',
    },
  }),
});

root.render(
  <ApolloProvider client={client}>
      <App/>
  </ApolloProvider>
);

