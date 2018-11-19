import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, Route} from 'react-router-dom'
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import rootReducer from './reducers/rootReducer'
import 'semantic-ui-css/semantic.min.css';
import { saveUserID } from './actions/uidAction'



const store = createStore(rootReducer);

var config = {
    apiKey: "AIzaSyBwsF-zDgnt_nMPNLY_hWUhZ5RiEu7FZhc",
    authDomain: "rich-web-lab4.firebaseapp.com",
    databaseURL: "https://rich-web-lab4.firebaseio.com",
    projectId: "rich-web-lab4",
    storageBucket: "rich-web-lab4.appspot.com",
    messagingSenderId: "676477576042"
};

const fb = firebase
    .initializeApp(config)
    .database()
    .ref();

// fb()


firebase.auth().signInAnonymously().then(function(data) {
    console.log(data.user.uid);
}, function(error) {
    console.error('Sign Out Error', error);
});

const username = localStorage.chatroom_username

if (username){
    console.log('username',username)
    store.dispatch(saveUserID(username))
}else {
    console.log('no username')
    store.dispatch(saveUserID(null))
}

ReactDOM.render(
    <BrowserRouter>
    {/*<App />*/}

        <Provider store={store}>
            <Route component={App} />
        </Provider>


    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
