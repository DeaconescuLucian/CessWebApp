import React,{useEffect,useState} from 'react'
import { Avatar,IconButton } from "@material-ui/core";
import {useSelector,useDispatch} from 'react-redux';
import "./Sidebar.css"
import {log_in,log_out,set_user} from './actions';
import db,{auth,provider} from "./firebase";
import MoonLoader from "react-spinners/MoonLoader";

function Sidebar() {
    const isLogged=useSelector(state => state.isLogged);
    const [searching,setSearching]=useState(false);
    const user=useSelector(state => state.user);
    const dispatch=useDispatch();


    const startSearching = () =>
    {
        if(isLogged)
        {
            setSearching(true);
            db.collection('queue').doc('queue').get().then( doc =>
            {
                if(doc.data().vector==undefined || doc.data().vector==null)
                {
                    const v=new Array()
                    v.push(isLogged.uid)
                    db.collection('queue').doc('queue').set({vector: v})
                }
                else
                {
                    const v=doc.data().vector
                    const index=v.indexOf(isLogged.uid)
                    if(index===-1)
                    {
                        v.push(isLogged.uid)
                        db.collection('queue').doc('queue').set({vector: v})
                    }
                    else{
                        console.log("Already in queue")
                    }
                }
            })
        }
    }

    const stopSearching = () =>
    {
        if(isLogged)
        {
            setSearching(false);
            db.collection('queue').doc('queue').get().then( doc =>
            {
                const v=doc.data().vector
                const index=v.indexOf(isLogged.uid)
                v.splice(index,1)
                db.collection('queue').doc('queue').set({vector: v})
            })
        }
    }

    const signIn = () =>
  {
    auth.signInWithPopup(provider).then(result => dispatch(log_in(result.user)));
  }

    const signOut = () =>
    {
        setSearching(false)
        dispatch(log_out());
        dispatch(set_user(null))
    }

    useEffect(() => {
            if(isLogged)
            {
              db.collection("users").doc(isLogged.uid).onSnapshot(snapshot=>
                {
                if(snapshot.data()==null || snapshot.data()==undefined)
                { 
                  db.collection("users").doc(isLogged.uid).set(
                      {
                          email: isLogged.email,
                          username: isLogged.displayName,
                          photo: isLogged.photoURL,
                          id: isLogged.uid,
                          rating: 1000,
                          gamesplayed: 0,
                          wins: 0,
                          losses: 0,
                          draws: 0
                      }
                  )
                  
              }
              db.collection("users").doc(isLogged.uid).onSnapshot(snapshot=>{dispatch(set_user(snapshot.data()))});
                });
        }
    }, [isLogged]);

    return (
        <div className="sidebar">
            { isLogged ?
                <div className="sidebar__header">
                    <div className="sidebar__header__info">
                        <IconButton>
                            <Avatar src={isLogged?.photoURL}/>
                        </IconButton>
                        <h3>{isLogged?.displayName}</h3>
                    </div>
                    <div className="sidebar__rating">
                        <img src="/trophy.png" alt="" width="32" height="32" />
                        <p>{user?.rating} points</p>
                    </div>
                </div>
                :
                <div className="sidebar__app__name">
                    <h2>CESS.com</h2>
                </div>
            }
            <div className="sidebar__options">
                {
                    searching ?
                    <div className="sidebar__option" onClick={stopSearching}>
                        <MoonLoader loading={searching}/>
                        STOP SEARCHING
                    </div>
                    :
                    <div className="sidebar__option" onClick={startSearching}>
                        SEARCH GAME
                    </div>
                }
                <div className="sidebar__option">
                    PROFILE
                </div>
                <div className="sidebar__option">
                    HISTORY
                </div>
                {
                    isLogged ?
                    <div className="sidebar__option" onClick={signOut}>
                        LOGOUT
                    </div>
                    :
                    <div className="sidebar__option" onClick={signIn}>
                        LOGIN
                    </div>
                }
            </div>
        </div>
    )
}

export default Sidebar
