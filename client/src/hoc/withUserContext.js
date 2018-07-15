import React from 'react';
import { UserContext } from '../contexts';

const withUserContext = Component => {
  return props => (
    <UserContext.Consumer>
      {user => {
        return <Component {...props} user={user} />;
      }}
    </UserContext.Consumer>
  );
};
export default withUserContext;
