import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp()

export const onPlayerQueue=functions.firestore
.document('queue/queue').onUpdate(async (change,context) => {
    let v=new Array();
    v=change.after.data().vector
    
    if(v.length>1)
    {
        try {
            const d = new Date();
            const n = d.getTime();
            const str=n.toString()
            const board='rb,knb,bb,qb,kb,bb,knb,rb,pb,pb,pb,pb,pb,pb,pb,pb,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,pw,pw,pw,pw,pw,pw,pw,pw,rw,knw,bw,qw,kw,bw,knw,rw'
            const oldboard='rb,knb,bb,qb,kb,bb,knb,rb,pb,pb,pb,pb,pb,pb,pb,pb,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,pw,pw,pw,pw,pw,pw,pw,pw,rw,knw,bw,qw,kw,bw,knw,rw'
            const gameID=str.concat(v[0])
            const promise1=admin.firestore().doc(`users/${v[0]}`).update({inGame: true,gameID,color: 'white',opponent: v[1]})
            const promise2=admin.firestore().doc(`users/${v[1]}`).update({inGame: true,gameID,color: 'black',opponent: v[0]})
            const promise=admin.firestore().collection('games').doc(gameID).create({white: v[0],black: v[1],board,oldboard,rook00: false, rook07: false,rook70: false,rook77: false,king_white: false,king_black: false})
            const promises=new Array()
            promises.push(promise1)
            promises.push(promise2)
            promises.push(promise)
            v.shift()
            v.shift()
            await change.after.ref.update({vector: v})
            return Promise.all(promises);
        } catch (error) {
            console.log(error)
            return null;
        }
    }
    else
        return null;
})