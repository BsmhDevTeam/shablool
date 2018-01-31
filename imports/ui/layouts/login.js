import React from 'react';

export default ({ main }) =>
  <div id="login-layout">
    <div className="container">
      <div className="logo-area">
          <img className="logo" src="/img/Logo.svg" alt="logo" />
      </div>
      {main}
    </div>
  </div>;
