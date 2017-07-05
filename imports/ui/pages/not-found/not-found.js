import React from 'react';

const NotFound = () => (
  <div id="not-found">
    <div className="game-background" />
    <div className="row">
      <img className="logo" src="/img/Logo.svg" alt="logo" />
    </div>
    <div className="row">
      <div className="not-found-title">
        <h1>אופסססס...</h1>
        <h3>מתנצלים, נראה שהעמוד הזה פשוט לא קיים!</h3>
        <a href="/" className="gotohomepage">חזור לדף הבית</a>
      </div>
    </div>
  </div>
);

export default NotFound;
