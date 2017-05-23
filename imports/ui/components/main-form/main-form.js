import React from 'react';

const MainForm = () => (
    <form>
        <div className="row">
            <input type="text" name="gameCode" id="main-input" className="input" placeholder="הכנס קוד שאלון" />
        </div>
        <div className="row">
            <button className="btn btn-primary" type="submit" id="start-game-btn">התחל משחק!</button>
        </div>
    </form>
);

export default MainForm;

