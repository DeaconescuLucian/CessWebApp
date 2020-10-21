import React,{useEffect} from 'react';
import './App.css';
import BoardHome from "./BoardHome"
import BoardGame from "./BoardGame"
import Sidebar from "./Sidebar"
import {log_in,set_user} from './actions';
import {useSelector,useDispatch} from 'react-redux';

function App() {

  const isLogged=useSelector(state => state.isLogged);
  const dispatch=useDispatch();
  const user=useSelector(state => state.user)

  useEffect(() => {
    const u=localStorage.getItem('user');
    if(u)
      dispatch(log_in(JSON.parse(u))); 
    const p=localStorage.getItem('player')
    if(p)
      dispatch(set_user(JSON.parse(p)))  
  }, []);

  useEffect(() => {
    localStorage.setItem('user',JSON.stringify(isLogged))
    localStorage.setItem('player',JSON.stringify(user))
  },);

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar/>
        {
          user?.inGame ?
          <BoardGame/>
          :
          <BoardHome/>
        }
        
      </div>
    </div>
  );
}

export default App;
