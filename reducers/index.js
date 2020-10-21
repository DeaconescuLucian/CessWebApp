import logInReducer from './islogged';
import setUserReducer from "./setuser";
import {combineReducers} from 'redux';

const allReducers = combineReducers({
    isLogged: logInReducer,
    user: setUserReducer
})

export default  allReducers; 