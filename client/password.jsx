const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

const handlePassword = (e) => {
    e.preventDefault();
    helper.hideError();

    const pass = e.target.querySelector('#pass').value;
    const pass2 = e.target.querySelector('#pass2').value;

    if(!pass || !pass2) {
        helper.handleError('All fields are required!');
        return false;
    }

    if(pass !== pass2) {
        helper.handleError('Passwords do not match!');
        return false;
    }

    helper.sendPost(e.target.action, {pass, pass2});
    window.location.href = '/maker';
    
    return false;
};

const PasswordWindow = (props) => {
    return (
        <form id="passwordForm"
            name="passwordForm"
            onSubmit={handlePassword}
            action="/password"
            method="POST"
            className="mainForm"
        >
            <label htmlFor="pass">New Password</label>
            <input id="pass" type="text" name="pass" placeholder="password" />
            <label htmlFor="pass">Retype Password</label>
            <input id="pass2" type="password" name="pass2" placeholder="retype password" />
            <input className="formSubmit" type="submit" value="Change Password" />
        </form>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render(<PasswordWindow />);
};

document.addEventListener('DOMContentLoaded', () => {
    init();
  });