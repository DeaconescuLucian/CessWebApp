import React,{useEffect,useState} from 'react'
import "./Board.css"
import { Avatar,IconButton } from "@material-ui/core";
import {useSelector} from 'react-redux'
import db from "./firebase"
import Modal from 'react-modal'


function BoardGame() {

    const user=useSelector(state => state.user);
    const [opponent,setOpponent]=useState(null)
    const [board,setBoard]=useState(null)
    const [oldBoard,setOldBoard]=useState(null)
    const [isSelected,setIsSelected]=useState(false)
    const [selected,setSelected]=useState({row: -1,col: -1})
    const [kwPosition,setKwPosition]=useState({row: -1,col: -1})
    const [kbPosition,setKbPosition]=useState({row: -1,col: -1})
    const [kwChecked,setKwChecked]=useState(false)
    const [kbChecked,setKbChecked]=useState(false)
    const [kwMoved,setKwMoved]=useState(false)
    const [kbMoved,setKbMoved]=useState(false)
    const[rook00Moved,setRook00Moved]=useState(false)
    const[rook07Moved,setRook07Moved]=useState(false)
    const[rook70Moved,setRook70Moved]=useState(false)
    const[rook77Moved,setRook77Moved]=useState(false)
    const [w_moves, setW_moves] = useState(20)
    const [b_moves, setB_moves] = useState(20)
    const [modal, setmodal] = useState(false)
    const [modalWasClosed, setmodalWasClosed] = useState(false)

    useEffect(() => {
      if(user.opponent)
      {db.collection('users').doc(user?.opponent).get().then(
        doc =>
        {
          setOpponent(doc.data())
        }
      )}
    }, [])
    useEffect(() => {
      db.collection('games').doc(user?.gameID).onSnapshot(
        snapshot =>
        { if(snapshot.data())
          {let string=snapshot.data().board
          let vector=string.split(',')
          let matrix=[]
          for(let i=0;i<8;i++)
            {
              matrix[i]=new Array()
              for(let j=i*8;j<(i+1)*8;j++)
              matrix[i].push(vector[j])
            }
          setBoard(matrix);
          let string1=snapshot.data().oldboard
          let vector1=string1.split(',')
          let matrix1=[]
          for(let i=0;i<8;i++)
            {
              matrix1[i]=new Array()
              for(let j=i*8;j<(i+1)*8;j++)
              matrix1[i].push(vector1[j])
            }
          setOldBoard(matrix1);
          for(let i=0;i<8;i++)
            for(let j=0;j<8;j++)
            {
              if(matrix[i][j]==="kw")
                setKwPosition({row: i,col: j})
              if(matrix[i][j]==="kb")
                setKbPosition({row: i,col: j})  
            }
            setRook00Moved(snapshot.data().rook00)
            setRook07Moved(snapshot.data().rook07)
            setRook70Moved(snapshot.data().rook70)
            setRook77Moved(snapshot.data().rook77)
            setKwMoved(snapshot.data().king_white)
            setKbMoved(snapshot.data().king_black) 
          }
        }
      )
    }, [])



    useEffect(() => {
      let test_white=check_white_king_check(board,kwPosition)
      let test_black=check_black_king_check(board,kbPosition)
      if(test_white)
        setKwChecked(true)
      else
        setKwChecked(false)  
      if(test_black)
        setKbChecked(true) 
      else
        setKbChecked(false)   
      setW_moves(check_white_has_moves())
      setB_moves(check_black_has_moves())
      if((w_moves===0 || b_moves===0) && modalWasClosed===false)
        setmodal(true)
      if(board?.[7][7]!=="rw")
        setRook77Moved(true)
      if(board?.[7][0]!=="rw")
        setRook70Moved(true)  
      if(board?.[0][7]!=="rb")
        setRook07Moved(true)
      if(board?.[0][0]!=="rb")
        setRook00Moved(true)
      if(board?.[7][4]!=="kw")
        setKwMoved(true)
      if(board?.[0][4]!=="kb")
        setKbMoved(true)   

    }, [[],board])

    function move_pawn(row,col)
    {
      let ok=1
      if(user?.color=="white")
        {
            if(selected.col===col)
            {
              if(board?.[row][col]==="0")
              {
                if(selected.row-row>1 || selected.row<row)
                  ok=1
                else
                  ok=0  
              if(selected.row===6 && selected.row-row<=2) 
                ok=0 
              }
            }
            if(selected.col-col===1 || selected.col-col===-1)
            {
              if(selected.row-row===1)
              {
                if(board?.[row][col]==="rb" || board?.[row][col]==="knb" || board?.[row][col]==="bb" || board?.[row][col]==="qb" || board?.[row][col]==="kb" || board?.[row][col]==="pb")
                  ok=0
                else
                  if(oldBoard?.[1][col]==="pb" && oldBoard?.[2][col]==="0" && oldBoard?.[3][col]==="0" && board?.[3][col]==="pb" && row===2)
                    {
                      ok=0
                      let newBoard=board
                      newBoard[3][col]="0"
                      setBoard(newBoard)
                    }
                } 
              }
            if(ok===0 && row===0)
            {
              let newBoard=board
              newBoard[selected.row][selected.col]="qw"
              setBoard(newBoard)
            }
        }
        if(user?.color=="black")
        {
          if(selected.col===col)
          {
            if(board?.[row][col]==="0")
            {
              if(selected.row-row<-1 || selected.row>row)
                ok=1
            else
              ok=0  
            if(selected.row===1 && selected.row-row>=-2) 
              ok=0 
            }
          }
          if(selected.col-col===1 || selected.col-col===-1)
          {
            if(selected.row-row===-1)
            {
              if(board?.[row][col]==="rw" || board?.[row][col]==="knw" || board?.[row][col]==="bw" || board?.[row][col]==="qw" || board?.[row][col]==="kw" || board?.[row][col]==="pw")
                ok=0
              else
                if(oldBoard?.[6][col]==="pw" && oldBoard?.[5][col]==="0" && oldBoard?.[4][col]==="0" && board?.[4][col]==="pw" && row===5)
                  {
                    ok=0
                    let newBoard=board
                    newBoard[4][col]="0"
                    setBoard(newBoard)
                  }  
            }
          }
          if(ok===0 && row===7)
            {
              let newBoard=board
              newBoard[selected.row][selected.col]="qb"
              setBoard(newBoard)
            }
        }  
        return ok
    }

    function move_rook(row,col)
    {
      let ok=0
        if(row===selected.row)
        {
          if(col>selected.col)
          {
            for(let i=selected.col+1;i<col;i++)
            if(board?.[row][i]!=="0")
              ok=1
          }
          if(col<selected.col)
          {
            for(let i=selected.col-1;i>col;i--)
            if(board?.[row][i]!=="0")
              ok=1
          }
        }
        if(col===selected.col)
        {
          if(row>selected.row)
          {
            for(let i=selected.row+1;i<row;i++)
            if(board?.[i][col]!=="0")
              ok=1
          }
          if(row<selected.row)
          {
            for(let i=selected.row-1;i>row;i--)
            if(board?.[i][col]!=="0")
              ok=1
          }
        }
        if(row!==selected.row && col!==selected.col)
          ok=1
      return ok  
    }

    function move_knight(row,col)
    {
      let ok=1
      if(row===selected.row+1 && col===selected.col+2)
        ok=0
      if(row===selected.row+1 && col===selected.col-2)
        ok=0
      if(row===selected.row+2 && col===selected.col+1)
        ok=0
      if(row===selected.row+2 && col===selected.col-1)
        ok=0
      if(row===selected.row-1 && col===selected.col-2)
        ok=0
      if(row===selected.row-1 && col===selected.col+2)
        ok=0
      if(row===selected.row-2 && col===selected.col-1)
        ok=0
      if(row===selected.row-2 && col===selected.col+1)
        ok=0   
      return ok     
    }

    function move_bishop(row,col)
    {
      let ok=1
      if((row+col)===(selected.row+selected.col))
      {
        ok=0
        if(row>selected.row)
          {
            for(let i=1;i<row-selected.row;i++)
            {
                if(board?.[selected.row+i][selected.col-i]!=="0")
                  ok=1
            }
          }
        if(row<selected.row)
          {
            for(let i=1;i<col-selected.col;i++)
            {
                if(board?.[selected.row-i][selected.col+i]!=="0")
                  ok=1
            }
          } 
          return ok
      }
      if((row-col)===(selected.row-selected.col))
      {
        ok=0
        if(row>selected.row)
        {
          for(let i=1;i<row-selected.row;i++)
            if(board?.[selected.row+i][selected.col+i]!=="0")
              ok=1
        }
        if(row<selected.row)
        {
          for(let i=1;i<selected.row-row;i++)
            if(board?.[selected.row-i][selected.col-i]!=="0")
              ok=1
        }
        return ok
      }
      return ok;
    }

    function move_queen(row,col)
    { 
      let ok=1
      if(row===selected.row || col===selected.col)
        ok=move_rook(row,col)
      if((row+col)===(selected.row+selected.col) || (row-col)===(selected.row-selected.col))
        ok=move_bishop(row,col)
      return ok    
    } 

    function move_king(row,col)
    {
      let ok=0
      if(Math.abs(row-selected.row)>1 || Math.abs(col-selected.col)>1)
        ok=1
      if(kwPosition.row===7 && kwPosition.col===4 && kwMoved===false && row===7 && col===7  && rook77Moved===false && board?.[7][5]==="0" && board?.[7][6]==="0")
      {
        const checked=check_white_king_check(board,kwPosition)
        const checked1= check_white_king_check(board,{row: 7,col: 5})
        const checked2= check_white_king_check(board,{row: 7,col: 6})
        if(checked===true || checked1===true || checked2===true)
          return 1
        else        
          ok=0
      }
      if(kwPosition.row===7 && kwPosition.col===4 && kwMoved===false && row===7 && col===0  && rook70Moved===false && board?.[7][3]==="0" && board?.[7][2]==="0" && board?.[7][1]==="0")
      {
        const checked=check_white_king_check(board,kwPosition)
        const checked1= check_white_king_check(board,{row: 7,col: 3})
        const checked2= check_white_king_check(board,{row: 7,col: 2})
        if(checked===true || checked1===true || checked2===true)
          return 1
        else        
           ok=0
      }   
      if(kbPosition.row===0 && kbPosition.col===4 && kbMoved===false && row===0 && col===7  && rook07Moved===false && board?.[0][5]==="0" && board?.[0][6]==="0")
      {
        const checked=check_black_king_check(board,kbPosition)
        const checked1= check_black_king_check(board,{row: 0,col: 5})
        const checked2= check_black_king_check(board,{row: 0,col: 6})
        if(checked===true || checked1===true || checked2===true)
          return 1
        else        
          ok=0
      }
      if(kbPosition.row===0 && kwPosition.col===4 && kbMoved===false && row===0 && col===0  && rook00Moved===false && board?.[0][3]==="0" && board?.[0][2]==="0" && board?.[0][1]==="0")
      {
        const checked=check_black_king_check(board,kbPosition)
        const checked1= check_black_king_check(board,{row: 0,col: 3})
        const checked2= check_black_king_check(board,{row: 0,col: 2})
        if(checked===true || checked1===true || checked2===true)
          return 1
        else        
           ok=0
      }  
      if(ok===0)
        {
          if(user?.color==="white")
            {
              setKwPosition({row,col})
            }
          if(user?.color==="black")
          {
            setKbPosition({row,col})
          }  
        }  
      return ok  
    }

    function check_white_king_check(theBoard,kwPosition)
    {
        let checked=false
        if(kwPosition.row!==-1 && kwPosition.col!==-1)
        {
          if(kwPosition.row>1)
        {
          if(theBoard?.[kwPosition.row-1][kwPosition.col+1]==="pb" || theBoard?.[kwPosition.row-1][kwPosition.col-1]==="pb")
            checked=true
        }  
        let row=kwPosition.row
        let col=kwPosition.col
          while(row<7)
          {
            if(theBoard?.[row+1][col]==="rb" || theBoard?.[row+1][col]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row+1][col]!=="0" && theBoard?.[row+1][col]!=="rb" && theBoard?.[row+1][col]!=="qb")
            {
              break
            }
            if(theBoard?.[row+1][col]==="0")
            {
              row++
            }
          }
          row=kwPosition.row
          while(row>0)
          {
            if(theBoard?.[row-1][col]==="rb" || theBoard?.[row-1][col]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row-1][col]!=="0" && theBoard?.[row-1][col]!=="rb" && theBoard?.[row-1][col]!=="qb")
            {
              break
            }
            if(theBoard?.[row-1][col]==="0")
            {
              row--
            }
          }

          col=kwPosition.col
          row=kwPosition.row
          while(col<7)
          {
            if(theBoard?.[row][col+1]==="rb" || theBoard?.[row][col+1]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row][col+1]!=="0" && theBoard?.[row][col+1]!=="rb" && theBoard?.[row][col+1]!=="qb")
            {
              break
            }
            if(theBoard?.[row][col+1]==="0")
            {
              col++
            }
          }
          col=kwPosition.col
          while(col>0)
          {
            if(theBoard?.[row][col-1]==="rb" || theBoard?.[row][col-1]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row][col-1]!=="0" && theBoard?.[row][col-1]!=="rb" && theBoard?.[row][col-1]!=="qb")
            {
              break
            }
            if(theBoard?.[row][col-1]==="0")
            {
              col--
            }
          }
          row=kwPosition.row
          col=kwPosition.col
          let i=1
          let maxIncrement=Math.min(7-row,7-col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row+i][col+i]==="bb" || theBoard?.[row+i][col+i]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row+i][col+i]!=="0" && theBoard?.[row+i][col+i]!=="bb" && theBoard?.[row+i][col+i]!=="qb")
            {
              break
            }
            if(theBoard?.[row+i][col+i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(7-row,col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row+i][col-i]==="bb" || theBoard?.[row+i][col-i]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row+i][col-i]!=="0" && theBoard?.[row+i][col-i]!=="bb" && theBoard?.[row+i][col-i]!=="qb")
            {
              break
            }
            if(theBoard?.[row+i][col-i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(row,col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row-i][col-i]==="bb" || theBoard?.[row-i][col-i]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row-i][col-i]!=="0" && theBoard?.[row-i][col-i]!=="bb" && theBoard?.[row-i][col-i]!=="qb")
            {
              break
            }
            if(theBoard?.[row-i][col-i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(row,7-col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row-i][col+i]==="bb" || theBoard?.[row-i][col+i]==="qb")
            {
              checked=true
              break
            }
            if(theBoard?.[row-i][col+i]!=="0" && theBoard?.[row-i][col+i]!=="bb" && theBoard?.[row-i][col+i]!=="qb")
            {
              break
            }
            if(theBoard?.[row-i][col+i]==="0")
            {
              i++
            }
          }
          if(row<7 && col<6)
            if(theBoard?.[row+1][col+2]==="knb")
              checked=true
          if(row<7 && col>1)
            if(theBoard?.[row+1][col-2]==="knb")
              checked=true
          if(row<6 && col>0)
            if(theBoard?.[row+2][col-1]==="knb")
              checked=true
          if(row<6 && col<7)
            if(theBoard?.[row+2][col+1]==="knb")
                checked=true
          if(row>0 && col<6)
            if(theBoard?.[row-1][col+2]==="knb")
              checked=true
          if(row>0 && col>1)
            if(theBoard?.[row-1][col-2]==="knb")
              checked=true
          if(row>2 && col>0)
            if(theBoard?.[row-2][col-1]==="knb")
              checked=true
          if(row>2 && col<7)
            if(theBoard?.[row-2][col+1]==="knb")
                checked=true               
          if(row>0)
            {
              if(theBoard?.[row-1][col]==="kb")
                  checked=true
              if(col>0)
                if(theBoard?.[row-1][col-1]==="kb")
                  checked=true
              if(col<7)
                if(theBoard?.[row-1][col+1]==="kb")
                  checked=true    
            }
            if(row<7)
            {
              if(theBoard?.[row+1][col]==="kb")
                  checked=true
              if(col>0)
                if(theBoard?.[row+1][col-1]==="kb")
                  checked=true
              if(col<7)
                if(theBoard?.[row+1][col+1]==="kb")
                  checked=true    
            }
            if(col>0)
              if(theBoard?.[row][col-1]==="kb")
                  checked=true
            if(col<7)
                if(theBoard?.[row][col+1]==="kb")
                    checked=true      
            
        } 
          return checked 
    }
    function check_black_king_check(theBoard,kbPosition)
    {
        let checked=false
        if(kbPosition.row!==-1 && kbPosition.col!==-1)
        {
          if(kbPosition.row<6)
        {
          if(theBoard?.[kbPosition.row+1][kbPosition.col+1]==="pw" || theBoard?.[kbPosition.row+1][kbPosition.col-1]==="pw")
            checked=true
        }  
        let row=kbPosition.row
        let col=kbPosition.col
          while(row<7)
          {
            if(theBoard?.[row+1][col]==="rw" || theBoard?.[row+1][col]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row+1][col]!=="0" && theBoard?.[row+1][col]!=="rw" && theBoard?.[row+1][col]!=="qw")
            {
              break
            }
            if(theBoard?.[row+1][col]==="0")
            {
              row++
            }
          }
          row=kbPosition.row
          while(row>0)
          {
            if(theBoard?.[row-1][col]==="rw" || theBoard?.[row-1][col]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row-1][col]!=="0" && theBoard?.[row-1][col]!=="rw" && theBoard?.[row-1][col]!=="qw")
            {
              break
            }
            if(theBoard?.[row-1][col]==="0")
            {
              row--
            }
          }

          col=kbPosition.col
          row=kbPosition.row
          while(col<7)
          {
            if(theBoard?.[row][col+1]==="rw" || theBoard?.[row][col+1]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row][col+1]!=="0" && theBoard?.[row][col+1]!=="rw" && theBoard?.[row][col+1]!=="qw")
            {
              break
            }
            if(theBoard?.[row][col+1]==="0")
            {
              col++
            }
          }
          col=kbPosition.col
          while(col>0)
          {
            if(theBoard?.[row][col-1]==="rw" || theBoard?.[row][col-1]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row][col-1]!=="0" && theBoard?.[row][col-1]!=="rw" && theBoard?.[row][col-1]!=="qw")
            {
              break
            }
            if(theBoard?.[row][col-1]==="0")
            {
              col--
            }
          }
          row=kbPosition.row
          col=kbPosition.col
          let i=1
          let maxIncrement=Math.min(7-row,7-col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row+i][col+i]==="bw" || theBoard?.[row+i][col+i]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row+i][col+i]!=="0" && theBoard?.[row+i][col+i]!=="bw" && theBoard?.[row+i][col+i]!=="qw")
            {
              break
            }
            if(theBoard?.[row+i][col+i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(7-row,col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row+i][col-i]==="bw" || theBoard?.[row+i][col-i]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row+i][col-i]!=="0" && theBoard?.[row+i][col-i]!=="bw" && theBoard?.[row+i][col-i]!=="qw")
            {
              break
            }
            if(theBoard?.[row+i][col-i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(row,col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row-i][col-i]==="bw" || theBoard?.[row-i][col-i]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row-i][col-i]!=="0" && theBoard?.[row-i][col-i]!=="bw" && theBoard?.[row-i][col-i]!=="qw")
            {
              break
            }
            if(theBoard?.[row-i][col-i]==="0")
            {
              i++
            }
          }
          i=1
          maxIncrement=Math.min(row,7-col)
          while(i<=maxIncrement)
          {
            if(theBoard?.[row-i][col+i]==="bw" || theBoard?.[row-i][col+i]==="qw")
            {
              checked=true
              break
            }
            if(theBoard?.[row-i][col+i]!=="0" && theBoard?.[row-i][col+i]!=="bw" && theBoard?.[row-i][col+i]!=="qw")
            {
              break
            }
            if(theBoard?.[row-i][col+i]==="0")
            {
              i++
            }
          }
          if(row<7 && col<6)
            if(theBoard?.[row+1][col+2]==="knw")
              checked=true
          if(row<7 && col>1)
            if(theBoard?.[row+1][col-2]==="knw")
              checked=true
          if(row<6 && col>0)
            if(theBoard?.[row+2][col-1]==="knw")
              checked=true
          if(row<6 && col<7)
            if(theBoard?.[row+2][col+1]==="knw")
                checked=true
          if(row>0 && col<6)
            if(theBoard?.[row-1][col+2]==="knw")
              checked=true
          if(row>0 && col>1)
            if(theBoard?.[row-1][col-2]==="knw")
              checked=true
          if(row>2 && col>0)
            if(theBoard?.[row-2][col-1]==="knw")
              checked=true
          if(row>2 && col<7)
            if(theBoard?.[row-2][col+1]==="knw")
                checked=true               
          if(row>0)
            {
              if(theBoard?.[row-1][col]==="kw")
                  checked=true
              if(col>0)
                if(theBoard?.[row-1][col-1]==="kw")
                  checked=true
              if(col<7)
                if(theBoard?.[row-1][col+1]==="kw")
                  checked=true    
            }
            if(row<7)
            {
              if(theBoard?.[row+1][col]==="kw")
                  checked=true
              if(col>0)
                if(theBoard?.[row+1][col-1]==="kw")
                  checked=true
              if(col<7)
                if(theBoard?.[row+1][col+1]==="kw")
                  checked=true    
            }
            if(col>0)
              if(theBoard?.[row][col-1]==="kw")
                  checked=true
            if(col<7)
                if(theBoard?.[row][col+1]==="kw")
                    checked=true
        } 
          return checked 
    }

    function check_if_valid_move(row,col)
    {
        let ok=0
        if(selected.row!==-1 && selected.col!==-1)
        {
          let testBoard=[]
          for(let i=0;i<8;i++)
          {
            testBoard[i]=new Array()
              for(let j=0;j<8;j++)
                testBoard[i].push(board?.[i][j])
          }
          if(board?.[selected.row][selected.col]==="kw" && board?.[row][col]==="rw")
          {
            if(kwMoved===false && rook77Moved===false && col===7)
            {
              testBoard[7][5]="rw"
              testBoard[7][6]="kw"
              testBoard[7][4]="0"
              testBoard[7][7]="0"
            
            }
            if(kwMoved===false && rook70Moved===false && col===0)
            {
                testBoard[7][3]="rw"
                testBoard[7][2]="kw"
                testBoard[7][0]="0"
                testBoard[7][1]="0"
                testBoard[7][4]="0"
            
            }
          }
          else if(board?.[selected.row][selected.col]==="kb" && board?.[row][col]==="rb")
          {
            if(kbMoved===false && rook07Moved===false && col===7)
            {
              testBoard[0][5]="rb"
              testBoard[0][6]="kb"
              testBoard[0][4]="0"
              testBoard[0][7]="0"
            
            }
            if(kbMoved===false && rook00Moved===false && col===0)
            {
                testBoard[7][3]="rb"
                testBoard[7][2]="kb"
                testBoard[7][0]="0"
                testBoard[7][1]="0"
                testBoard[7][4]="0"
            
            }
          }
          else
          {
            testBoard[row][col]=board?.[selected.row][selected.col]
            testBoard[selected.row][selected.col]="0"
          }
          
          let kw={row:-1,col:-1}
          let kb={row:-1,col:-1}
          for(let i=0;i<8;i++)
            for(let j=0;j<8;j++)
            {
              if(testBoard?.[i][j]==="kw")
              {
                kw={row: i,col: j}
              }
              if(testBoard?.[i][j]==="kb")
              {
                kb={row: i,col: j}
              }
            }
          if(user?.color==="white")
          {
            let theTest=check_white_king_check(testBoard,kw)
            let theTest1=check_black_king_check(testBoard,kb)
            if(theTest===true)
              return 1
            else
              setKbChecked(theTest1)  
          }
          if(user?.color==="black")
            {
              let theTest=check_black_king_check(testBoard,kb)
              let theTest1=check_white_king_check(testBoard,kw)
              if(theTest===true)
                return 1
              else
              setKwChecked(theTest1)
            }    

      }   

          if(board?.[selected.row][selected.col]==="pw" || board?.[selected.row][selected.col]==="pb")
            ok=move_pawn(row,col)
          if(board?.[selected.row][selected.col]==="rw" || board?.[selected.row][selected.col]==="rb")
            ok=move_rook(row,col)
          if(board?.[selected.row][selected.col]==="knw" || board?.[selected.row][selected.col]==="knb")
            ok=move_knight(row,col)
          if(board?.[selected.row][selected.col]==="bw" || board?.[selected.row][selected.col]==="bb")
            ok=move_bishop(row,col)
          if(board?.[selected.row][selected.col]==="qw" || board?.[selected.row][selected.col]==="qb")
            ok=move_queen(row,col)
          if(board?.[selected.row][selected.col]==="kw" || board?.[selected.row][selected.col]==="kb")
            ok=move_king(row,col)
                      
        return ok    
        
    }

    function setNewBoard(row,col)
    {
        let newBoard=board
        let newOldBoard=oldBoard
        for(let i=0;i<8;i++)
          for(let j=0;j<8;j++)
            newOldBoard[i][j]=board?.[i][j]
        newBoard[row][col]=board?.[selected.row][selected.col]
        newBoard[selected.row][selected.col]="0"
 
    }

    function sendNewBoard()
    {
        let str=""
        let str1=""
        for(let i=0;i<8;i++)
        {
          for(let j=0;j<8;j++)
          {
            if(i!==7 || j!==7)
          {
            str=str.concat(board?.[i][j])
            str=str.concat(",")
            str1=str1.concat(oldBoard?.[i][j])
            str1=str1.concat(",")
            
          }
          else
          {
            str=str.concat(board?.[i][j])
            str1=str1.concat(oldBoard?.[i][j])
          }
        }

        }
        console.log("old board")
        console.log(oldBoard)
        console.log("board")
        console.log(board)
        db.collection('games').doc(user?.gameID).update({board: str,oldboard: str1,rook00: rook00Moved,rook07: rook07Moved,rook70: rook70Moved,rook77: rook77Moved,king_white: kwMoved,king_black: kbMoved})

    }

    function load_image(row,col)
    {
      if(board?.[row][col]==="rb")
        return "/rook_black.png";
      if(board?.[row][col]==="knb")
        return "/knight_black.png";
      if(board?.[row][col]==="bb")
        return "/bishop_black.png"; 
      if(board?.[row][col]==="qb")
        return "/queen_black.png";
      if(board?.[row][col]==="kb")
        return "/king_black.png";
        if(board?.[row][col]==="rw")
        return "/rook_white.png";
      if(board?.[row][col]==="knw")
        return "/knight_white.png";
      if(board?.[row][col]==="bw")
        return "/bishop_white.png"; 
      if(board?.[row][col]==="qw")
        return "/queen_white.png";
      if(board?.[row][col]==="kw")
        return "/king_white.png";
      if(board?.[row][col]==="pw")
        return "/pawn_white.png";
      if(board?.[row][col]==="pb")
        return "/pawn_black.png";
      return null;  
    }

    function select_square(row,col)
    {
      if(!isSelected )
      {
        if(board?.[row][col]!=="0")
        {
          if(user?.color==="white")
        {
          if(board?.[row][col]==="rw" || board?.[row][col]==="knw" || board?.[row][col]==="bw" || board?.[row][col]==="qw" || board?.[row][col]==="kw" || board?.[row][col]==="pw")
          setIsSelected(true)
          setSelected({row,col})
        }
        if(user?.color==="black")
        {
          if(board?.[row][col]==="rb" || board?.[row][col]==="knb" || board?.[row][col]==="bb" || board?.[row][col]==="qb" || board?.[row][col]==="kb" || board?.[row][col]==="pb")
          setIsSelected(true)
          setSelected({row,col})
        }
      }
        
      }
      else{
        if(user?.color==="white")
        {
          if(board?.[selected.row][selected.col]==="kw" && board?.[row][col]==="rw")
          {
            const ok=check_if_valid_move(row,col)
            if((kwMoved===false && rook70Moved===false) || (kwMoved===false && rook77Moved===false))
            {

             if(ok===0)
            {
              let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }
              if(col===7)
              {
                testBoard[7][5]="rw"
                testBoard[7][6]="kw"
                testBoard[7][4]="0"
                testBoard[7][7]="0"
                let kw=kwPosition
                kw={row: 7,col: 6}

              }
              if(col===0)
              {
                testBoard[7][3]="rw"
                testBoard[7][2]="kw"
                testBoard[7][0]="0"
                testBoard[7][1]="0"
                testBoard[7][4]="0"
                let kw=kwPosition
                kw={row: 7,col: 2}
              }    
              let newBoard=board
              let newOldBoard=oldBoard
              for(let m=0;m<8;m++)
                for(let n=0;n<8;n++)
                  {
                    newOldBoard[m][n]=board?.[m][n]
                    newBoard[m][n]=testBoard[m][n]
                  }

              sendNewBoard()   
              setIsSelected(false) 
            }
            else{
              setSelected({row,col})
            }
          }
          else{
            setSelected({row,col})
          }
        }
          else
            if(board?.[row][col]==="rw" || board?.[row][col]==="knw" || board?.[row][col]==="bw" || board?.[row][col]==="qw" || board?.[row][col]==="kw" || board?.[row][col]==="pw")
              setSelected({row,col})
            else
            {
              const ok=check_if_valid_move(row,col)
              if(ok===0)
              {
                setIsSelected(false)
                setNewBoard(row,col)
                sendNewBoard()
                
              }
            }
        }
        if(user?.color==="black")
        {
          if(board?.[selected.row][selected.col]==="kb" && board?.[row][col]==="rb")
          {
            const ok=check_if_valid_move(row,col)
            if((kbMoved===false && rook00Moved===false) || (kbMoved===false && rook07Moved===false))
            {

             if(ok===0)
            {
              let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }
              if(col===7)
              {
                testBoard[0][5]="rb"
                testBoard[0][6]="kb"
                testBoard[0][4]="0"
                testBoard[0][7]="0"
                let kb=kbPosition
                kb={row: 0,col: 6}
              }
              if(col===0)
              {
                testBoard[0][3]="rb"
                testBoard[0][2]="kb"
                testBoard[0][0]="0"
                testBoard[0][1]="0"
                testBoard[0][4]="0"
                let kb=kbPosition
                kb={row: 0,col: 2}
              }    
              let newBoard=board
              let newOldBoard=oldBoard
              for(let m=0;m<8;m++)
                for(let n=0;n<8;n++)
                  {
                    newOldBoard[m][n]=board?.[m][n]
                    newBoard[m][n]=testBoard[m][n]
                  }

              sendNewBoard()   
              setIsSelected(false) 
            }
            else{
              setSelected({row,col})
            }
          }
          else{
            setSelected({row,col})
          }
        }
        else
          if(board?.[row][col]==="rb" || board?.[row][col]==="knb" || board?.[row][col]==="bb" || board?.[row][col]==="qb" || board?.[row][col]==="kb" || board?.[row][col]==="pb")
            setSelected({row,col})
          else
          {
            const ok=check_if_valid_move(row,col)
            if(ok===0)
            {
              setIsSelected(false)
              setNewBoard(row,col)
              sendNewBoard()
              
            }
          }
        }
      }
    }

    function square_selected(row,col)
    {
      if(kwChecked===true)
      {
        if(row===kwPosition.row && col===kwPosition.col)
          {
            if(isSelected===true && selected.row===kwPosition.row && selected.col===kwPosition.col)
              return "app__board__square__selected"
            else
              return "app__board__square__checked"
          }
      }
      if(kbChecked===true)
      {
        if(row===kbPosition.row && col===kbPosition.col)
        {
            if(isSelected===true && selected.row===kbPosition.row && selected.col===kbPosition.col)
              return "app__board__square__selected"
            else
              return "app__board__square__checked"
        }
          
      }
      if(isSelected===true)
      {
        if(row===selected?.row && col===selected?.col)
          return "app__board__square__selected"
        else
        {
          if((row+col)%2===0)
          return "app__board__square__white"
        if((row+col)%2===1)
          return "app__board__square__black"
        }     
      }
      else
      {
        if((row+col)%2===0)
          return "app__board__square__white"
        if((row+col)%2===1)
          return "app__board__square__black"
      }
    }

    function check_move(moves,i,j,row,col,piece,kPosition)
    {
      let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }

                testBoard[row][col]=piece
                testBoard[i][j]="0"
                if(piece==="pb" || piece==="rb" || piece==="knb" || piece==="bb" || piece==="qb" || piece==="kb")
                  if(check_black_king_check(testBoard,kPosition)===false)
                    {
                      moves++
                    }
                if(piece==="pw" || piece==="rw" || piece==="knw" || piece==="bw" || piece==="qw" || piece==="kw")
                  if(check_white_king_check(testBoard,kPosition)===false)
                    {
                      moves++
                    }
      return moves            
    }

    function check_white_has_moves()
    {
      let moves=0
      for(let i=0;i<8;i++)
        for(let j=0;j<8;j++)
        {
          if(board?.[i][j]==="pw")
          {
            if(i>0)
              if(board?.[i-1][j]==="0")
              {
                moves=check_move(moves,i,j,i-1,j,"pw",kwPosition)  
              }
            if(i>0 && j>0)  
              if(board?.[i-1][j-1]==="pb" || board?.[i-1][j-1]==="rb" || board?.[i-1][j-1]==="knb" || board?.[i-1][j-1]==="bb" || board?.[i-1][j-1]==="qb" || board?.[i-1][j-1]==="kb")
              {
                moves=check_move(moves,i,j,i-1,j-1,"pw",kwPosition)   
              }
            if(i>0 && j<7)  
              if(board?.[i-1][j+1]==="pb" || board?.[i-1][j+1]==="rb" || board?.[i-1][j+1]==="knb" || board?.[i-1][j+1]==="bb" || board?.[i-1][j+1]==="qb" || board?.[i-1][j+1]==="kb")
              {
                moves=check_move(moves,i,j,i-1,j+1,"pw",kwPosition)   
              } 
            if(i===6 && board?.[i-1][j]==="0" && board?.[i-2][j]==="0")
            {
                moves=check_move(moves,i,j,i-2,j,"pw",kwPosition)
            }  
            if(j>0 && i===3)
            {
              if(board?.[i][j]==="pw" && board?.[i][j-1]==="pb" && oldBoard?.[i-1][j-1]==="0" && oldBoard[i-2][j-1]==="pb" && oldBoard?.[i][j-1]==="0")
              {
                let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }

                testBoard[i-1][j-1]="pw"
                testBoard[i][j]="0"
                testBoard[i][j-1]="0"
                if(check_white_king_check(testBoard,kwPosition)===false)
                  moves++
              }
            }
            if(j<7 && i===3)
            {
              if(board?.[i][j]==="pw" && board?.[i][j+1]==="pb" && oldBoard?.[i][j+1]==="0" && oldBoard?.[i-1][j+1]==="0" && oldBoard[i-2][j+1]==="pb")
              {
                let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }

                testBoard[i-1][j+1]="pw"
                testBoard[i][j]="0"
                testBoard[i][j+1]="0"
                if(check_white_king_check(testBoard,kwPosition)===false)
                  moves++
              }
            }
          }
          if(board?.[i][j]==="rw")
          {
            let r=i+1
            while(r<=7)
            {
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                moves=check_move(moves,i,j,r,j,"rw",kwPosition)
                  break
              }
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"rw",kwPosition) 
                r++  
              }
            }
            r=i-1
            while(r>=0)
            {
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                moves=check_move(moves,i,j,r,j,"rw",kwPosition)
                  break
              }
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw") 
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"rw",kwPosition) 
                r--  
              }
            }
            r=j+1
            while(r<=7)
            {
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  moves=check_move(moves,i,j,i,r,"rw",kwPosition)
                  break
              }
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"rw",kwPosition) 
                r++  
              }
            }
            r=j-1
            while(r>=0)
            {
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"rw",kwPosition)
                r--  
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                moves=check_move(moves,i,j,i,r,"rw",kwPosition)
                  break
              }
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw") 
              {
                  break
              }
            }
          }
          if(board?.[i][j]==="bw")
          {
              let maxIncrement=Math.min(7-i,7-j)
              let increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j+increment]==="pw" || board?.[i+increment][j+increment]==="kw" || board?.[i+increment][j+increment]==="qw" || board?.[i+increment][j+increment]==="rw" || board?.[i+increment][j+increment]==="bw" || board?.[i+increment][j+increment]==="knw")
                {
                  break
                }
                if(board?.[i+increment][j+increment]==="pb" || board?.[i+increment][j+increment]==="kb" || board?.[i+increment][j+increment]==="qb" || board?.[i+increment][j+increment]==="rb" || board?.[i+increment][j+increment]==="bb" || board?.[i+increment][j+increment]==="knb")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"bw",kwPosition)
                  break
                }
                if(board?.[i+increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"bw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(7-i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j-increment]==="pw" || board?.[i+increment][j-increment]==="kw" || board?.[i+increment][j-increment]==="qw" || board?.[i+increment][j-increment]==="rw" || board?.[i+increment][j-increment]==="bw" || board?.[i+increment][j-increment]==="knw")
                {
                  break
                }
                if(board?.[i+increment][j-increment]==="pb" || board?.[i+increment][j-increment]==="kb" || board?.[i+increment][j-increment]==="qb" || board?.[i+increment][j-increment]==="rb" || board?.[i+increment][j-increment]==="bb" || board?.[i+increment][j-increment]==="knb")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"bw",kwPosition)
                  break
                }
                if(board?.[i+increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"bw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j-increment]==="pw" || board?.[i-increment][j-increment]==="kw" || board?.[i-increment][j-increment]==="qw" || board?.[i-increment][j-increment]==="rw" || board?.[i-increment][j-increment]==="bw" || board?.[i-increment][j-increment]==="knw")
                {
                  break
                }
                if(board?.[i-increment][j-increment]==="pb" || board?.[i-increment][j-increment]==="kb" || board?.[i-increment][j-increment]==="qb" || board?.[i-increment][j-increment]==="rb" || board?.[i-increment][j-increment]==="bb" || board?.[i-increment][j-increment]==="knb")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"bw",kwPosition)
                  break
                }
                if(board?.[i-increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"bw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,7-j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j+increment]==="pw" || board?.[i-increment][j+increment]==="kw" || board?.[i-increment][j+increment]==="qw" || board?.[i-increment][j+increment]==="rw" || board?.[i-increment][j+increment]==="bw" || board?.[i-increment][j+increment]==="knw")
                {
                  break
                }
                if(board?.[i-increment][j+increment]==="pb" || board?.[i-increment][j+increment]==="kb" || board?.[i-increment][j+increment]==="qb" || board?.[i-increment][j+increment]==="rb" || board?.[i-increment][j+increment]==="bb" || board?.[i-increment][j+increment]==="knb")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"bw",kwPosition)
                  break
                }
                if(board?.[i-increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"bw",kwPosition)
                  increment++
                }
              }
          }
          if(board?.[i][j]==="knw")
          {
            if(i<7 && j<6)
            if(board?.[i+1][j+2]==="0" || board?.[i+1][j+2]==="rb" || board?.[i+1][j+2]==="knb" || board?.[i+1][j+2]==="bb" || board?.[i+1][j+2]==="qb" || board?.[i+1][j+2]==="kb" || board?.[i+1][j+2]==="pb")
            {
              moves=check_move(moves,i,j,i+1,j+2,"knw",kwPosition)
            }
            if(i<7 && j>1)
            if(board?.[i+1][j-2]==="0" || board?.[i+1][j-2]==="rb" || board?.[i+1][j-2]==="knb" || board?.[i+1][j-2]==="bb" || board?.[i+1][j-2]==="qb" || board?.[i+1][j-2]==="kb" || board?.[i+1][j-2]==="pb")
            {
              moves=check_move(moves,i,j,i+1,j-2,"knw",kwPosition)
            }
            if(i>0 && j>1)
            if(board?.[i-1][j-2]==="0" || board?.[i-1][j-2]==="rb" || board?.[i-1][j-2]==="knb" || board?.[i-1][j-2]==="bb" || board?.[i-1][j-2]==="qb" || board?.[i-1][j-2]==="kb" || board?.[i-1][j-2]==="pb")
            {
              moves=check_move(moves,i,j,i-1,j-2,"knw",kwPosition)
            }
            if(i>0 && j<6)
            if(board?.[i-1][j+2]==="0" || board?.[i-1][j+2]==="rb" || board?.[i-1][j+2]==="knb" || board?.[i-1][j+2]==="bb" || board?.[i-1][j+2]==="qb" || board?.[i-1][j+2]==="kb" || board?.[i-1][j+2]==="pb")
            {
              moves=check_move(moves,i,j,i-1,j+2,"knw",kwPosition)
            }
            if(i<6 && j<7)
            if(board?.[i+2][j+1]==="0" || board?.[i+2][j+1]==="rb" || board?.[i+2][j+1]==="knb" || board?.[i+2][j+1]==="bb" || board?.[i+2][j+1]==="qb" || board?.[i+2][j+1]==="kb" || board?.[i+2][j+1]==="pb")
            {
              moves=check_move(moves,i,j,i+2,j+1,"knw",kwPosition)
            }
            if(i<6 && j>0)
            if(board?.[i+2][j-1]==="0" || board?.[i+2][j-1]==="rb" || board?.[i+2][j-1]==="knb" || board?.[i+2][j-1]==="bb" || board?.[i+2][j-1]==="qb" || board?.[i+2][j-1]==="kb" || board?.[i+2][j-1]==="pb")
            {
              moves=check_move(moves,i,j,i+2,j-1,"knw",kwPosition)
            }
            if(i>1 && j>0)
            if(board?.[i-2][j-1]==="0" || board?.[i-2][j-1]==="rb" || board?.[i-2][j-1]==="knb" || board?.[i-2][j-1]==="bb" || board?.[i-2][j-1]==="qb" || board?.[i-2][j-1]==="kb" || board?.[i-2][j-1]==="pb")
            {
              moves=check_move(moves,i,j,i-2,j-1,"knw",kwPosition)
            }
            if(i>1 && j<7)
            if(board?.[i-2][j+1]==="0" || board?.[i-2][j+1]==="rb" || board?.[i-2][j+1]==="knb" || board?.[i-2][j+1]==="bb" || board?.[i-2][j+1]==="qb" || board?.[i-2][j+1]==="kb" || board?.[i-2][j+1]==="pb")
            {
              moves=check_move(moves,i,j,i-2,j+1,"knw",kwPosition)
            }
          }
          if(board?.[i][j]==="qw")
          {
            let r=i+1
            while(r<=7)
            {
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                moves=check_move(moves,i,j,r,j,"qw",kwPosition)
                  break
              }
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"qw",kwPosition) 
                r++  
              }
            }
            r=i-1
            while(r>=0)
            {
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                moves=check_move(moves,i,j,r,j,"qw",kwPosition)
                  break
              }
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw") 
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"qw",kwPosition) 
                r--  
              }
            }
            r=j+1
            while(r<=7)
            {
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  moves=check_move(moves,i,j,i,r,"qw",kwPosition)
                  break
              }
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"qw",kwPosition) 
                r++  
              }
            }
            r=j-1
            while(r>=0)
            {
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"qw",kwPosition)
                r--  
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                moves=check_move(moves,i,j,i,r,"qw",kwPosition)
                  break
              }
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw") 
              {
                  break
              }
            }
            let maxIncrement=Math.min(7-i,7-j)
            let increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j+increment]==="pw" || board?.[i+increment][j+increment]==="kw" || board?.[i+increment][j+increment]==="qw" || board?.[i+increment][j+increment]==="rw" || board?.[i+increment][j+increment]==="bw" || board?.[i+increment][j+increment]==="knw")
                {
                  break
                }
                if(board?.[i+increment][j+increment]==="pb" || board?.[i+increment][j+increment]==="kb" || board?.[i+increment][j+increment]==="qb" || board?.[i+increment][j+increment]==="rb" || board?.[i+increment][j+increment]==="bb" || board?.[i+increment][j+increment]==="knb")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"qw",kwPosition)
                  break
                }
                if(board?.[i+increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"qw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(7-i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j-increment]==="pw" || board?.[i+increment][j-increment]==="kw" || board?.[i+increment][j-increment]==="qw" || board?.[i+increment][j-increment]==="rw" || board?.[i+increment][j-increment]==="bw" || board?.[i+increment][j-increment]==="knw")
                {
                  break
                }
                if(board?.[i+increment][j-increment]==="pb" || board?.[i+increment][j-increment]==="kb" || board?.[i+increment][j-increment]==="qb" || board?.[i+increment][j-increment]==="rb" || board?.[i+increment][j-increment]==="bb" || board?.[i+increment][j-increment]==="knb")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"qw",kwPosition)
                  break
                }
                if(board?.[i+increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"qw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j-increment]==="pw" || board?.[i-increment][j-increment]==="kw" || board?.[i-increment][j-increment]==="qw" || board?.[i-increment][j-increment]==="rw" || board?.[i-increment][j-increment]==="bw" || board?.[i-increment][j-increment]==="knw")
                {
                  break
                }
                if(board?.[i-increment][j-increment]==="pb" || board?.[i-increment][j-increment]==="kb" || board?.[i-increment][j-increment]==="qb" || board?.[i-increment][j-increment]==="rb" || board?.[i-increment][j-increment]==="bb" || board?.[i-increment][j-increment]==="knb")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"qw",kwPosition)
                  break
                }
                if(board?.[i-increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"qw",kwPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,7-j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j+increment]==="pw" || board?.[i-increment][j+increment]==="kw" || board?.[i-increment][j+increment]==="qw" || board?.[i-increment][j+increment]==="rw" || board?.[i-increment][j+increment]==="bw" || board?.[i-increment][j+increment]==="knw")
                {
                  break
                }
                if(board?.[i-increment][j+increment]==="pb" || board?.[i-increment][j+increment]==="kb" || board?.[i-increment][j+increment]==="qb" || board?.[i-increment][j+increment]==="rb" || board?.[i-increment][j+increment]==="bb" || board?.[i-increment][j+increment]==="knb")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"qw",kwPosition)
                  break
                }
                if(board?.[i-increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"qw",kwPosition)
                  increment++
                }
              }
          }
          if(board?.[i][j]==="kw")
          {
            for(let m=0;m<8;m++)
              for(let n=0;n<8;n++)
              {
                if(Math.abs(i-m)<=1 && Math.abs(j-n)<=1 && (i!==m || j!==n))
                {
                  if(board?.[m][n]==="pb" || board?.[m][n]==="rb" || board?.[m][n]==="knb" || board?.[m][n]==="bb" || board?.[m][n]==="qb" || board?.[m][n]==="0")
                    moves=check_move(moves,i,j,m,n,"kw",{row: m ,col: n})
                }
              }
          }

        }
       return moves 
    }

    function check_black_has_moves()
    {
      let moves=0
      for(let i=0;i<8;i++)
        for(let j=0;j<8;j++)
        {
          if(board?.[i][j]==="pb")
          {
            if(i<7)
              if(board?.[i+1][j]==="0")
              {
                moves=check_move(moves,i,j,i+1,j,"pb",kbPosition)  
              }
            if(i<7 && j>0)  
              if(board?.[i+1][j-1]==="pw" || board?.[i+1][j-1]==="rw" || board?.[i+1][j-1]==="knw" || board?.[i+1][j-1]==="bw" || board?.[i+1][j-1]==="qw" || board?.[i+1][j-1]==="kw")
              {
                moves=check_move(moves,i,j,i+1,j-1,"pb",kbPosition)   
              }
            if(i>0 && j<7)  
            if(board?.[i+1][j+1]==="pw" || board?.[i+1][j+1]==="rw" || board?.[i+1][j+1]==="knw" || board?.[i+1][j+1]==="bw" || board?.[i+1][j+1]==="qw" || board?.[i+1][j+1]==="kw")
              {
                moves=check_move(moves,i,j,i+1,j+1,"pb",kbPosition)   
              } 
            if(i===1 && board?.[i+1][j]==="0" && board?.[i+2][j]==="0")
            {
                moves=check_move(moves,i,j,i+2,j,"pb",kbPosition)
            }  
            if(j>0 && i===4)
            {
              if(board?.[i][j]==="pb" && board?.[i][j-1]==="pw" && oldBoard?.[i+1][j-1]==="0" && oldBoard[i+2][j-1]==="pw" && oldBoard?.[i][j-1]==="0")
              {
                let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }
                testBoard[i+1][j-1]="pb"
                testBoard[i][j]="0"
                testBoard[i][j-1]="0"
                if(check_black_king_check(testBoard,kbPosition)===false)
                  moves++
              }
            }
            if(j<7 && i===4)
            {
              if(board?.[i][j]==="pb" && board?.[i][j+1]==="pw" && oldBoard?.[i][j+1]==="0" && oldBoard?.[i+1][j+1]==="0" && oldBoard[i+2][j+1]==="pw")
              {
                let testBoard=[]
                for(let m=0;m<8;m++)
                  {
                    testBoard[m]=new Array()
                    for(let n=0;n<8;n++)
                      testBoard[m][n]=board?.[m][n]
                  }

                testBoard[i+1][j+1]="pb"
                testBoard[i][j]="0"
                testBoard[i][j+1]="0"
                if(check_black_king_check(testBoard,kbPosition)===false)
                  moves++
              }
            }
          }
          if(board?.[i][j]==="rb")
          {
            let r=i+1
            while(r<=7)
            {
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                moves=check_move(moves,i,j,r,j,"rb",kbPosition)
                  break
              }
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"rb",kbPosition) 
                r++  
              }
            }
            r=i-1
            while(r>=0)
            {
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                moves=check_move(moves,i,j,r,j,"rb",kbPosition)
                  break
              }
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"rb",kbPosition) 
                r--  
              }
            }
            r=j+1
            while(r<=7)
            {
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  moves=check_move(moves,i,j,i,r,"rb",kbPosition)
                  break
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"rb",kbPosition) 
                r++  
              }
            }
            r=j-1
            while(r>=0)
            {
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  moves=check_move(moves,i,j,i,r,"rb",kbPosition)
                  break
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"rb",kbPosition) 
                r--  
              }
            }
          }
          if(board?.[i][j]==="bb")
          {
              let maxIncrement=Math.min(7-i,7-j)
              let increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j+increment]==="pb" || board?.[i+increment][j+increment]==="kb" || board?.[i+increment][j+increment]==="qb" || board?.[i+increment][j+increment]==="rb" || board?.[i+increment][j+increment]==="bb" || board?.[i+increment][j+increment]==="knb")
                {
                  break
                }
                if(board?.[i+increment][j+increment]==="pw" || board?.[i+increment][j+increment]==="kw" || board?.[i+increment][j+increment]==="qw" || board?.[i+increment][j+increment]==="rw" || board?.[i+increment][j+increment]==="bw" || board?.[i+increment][j+increment]==="knw")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"bb",kbPosition)
                  break
                }
                if(board?.[i+increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"bb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(7-i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j-increment]==="pb" || board?.[i+increment][j-increment]==="kb" || board?.[i+increment][j-increment]==="qb" || board?.[i+increment][j-increment]==="rb" || board?.[i+increment][j-increment]==="bb" || board?.[i+increment][j-increment]==="knb")
                {
                  break
                }
                if(board?.[i+increment][j-increment]==="pw" || board?.[i+increment][j-increment]==="kw" || board?.[i+increment][j-increment]==="qw" || board?.[i+increment][j-increment]==="rw" || board?.[i+increment][j-increment]==="bw" || board?.[i+increment][j-increment]==="knw")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"bb",kbPosition)
                  break
                }
                if(board?.[i+increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"bb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j-increment]==="pb" || board?.[i-increment][j-increment]==="kb" || board?.[i-increment][j-increment]==="qb" || board?.[i-increment][j-increment]==="rb" || board?.[i-increment][j-increment]==="bb" || board?.[i-increment][j-increment]==="knb")
                {
                  break
                }
                if(board?.[i-increment][j-increment]==="pw" || board?.[i-increment][j-increment]==="kw" || board?.[i-increment][j-increment]==="qw" || board?.[i-increment][j-increment]==="rw" || board?.[i-increment][j-increment]==="bw" || board?.[i-increment][j-increment]==="knw")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"bb",kbPosition)
                  break
                }
                if(board?.[i-increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"bb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,7-j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j+increment]==="pb" || board?.[i-increment][j+increment]==="kb" || board?.[i-increment][j+increment]==="qb" || board?.[i-increment][j+increment]==="rb" || board?.[i-increment][j+increment]==="bb" || board?.[i-increment][j+increment]==="knb")
                {
                  break
                }
                if(board?.[i-increment][j+increment]==="pw" || board?.[i-increment][j+increment]==="kw" || board?.[i-increment][j+increment]==="qw" || board?.[i-increment][j+increment]==="rw" || board?.[i-increment][j+increment]==="bw" || board?.[i-increment][j+increment]==="knw")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"bb",kbPosition)
                  break
                }
                if(board?.[i-increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"bb",kbPosition)
                  increment++
                }
              }
          }
          if(board?.[i][j]==="knb")
          {
            if(i<7 && j<6)
            if(board?.[i+1][j+2]==="0" || board?.[i+1][j+2]==="rw" || board?.[i+1][j+2]==="knw" || board?.[i+1][j+2]==="bw" || board?.[i+1][j+2]==="qw" || board?.[i+1][j+2]==="kw" || board?.[i+1][j+2]==="pw")
            {
              moves=check_move(moves,i,j,i+1,j+2,"knb",kbPosition)
            }
            if(i<7 && j>1)
            if(board?.[i+1][j-2]==="0" || board?.[i+1][j-2]==="rw" || board?.[i+1][j-2]==="knw" || board?.[i+1][j-2]==="bw" || board?.[i+1][j-2]==="qw" || board?.[i+1][j-2]==="kw" || board?.[i+1][j-2]==="pw")
            {
              moves=check_move(moves,i,j,i+1,j-2,"knb",kbPosition)
            }
            if(i>0 && j>1)
            if(board?.[i-1][j-2]==="0" || board?.[i-1][j-2]==="rw" || board?.[i-1][j-2]==="knw" || board?.[i-1][j-2]==="bw" || board?.[i-1][j-2]==="qw" || board?.[i-1][j-2]==="kw" || board?.[i-1][j-2]==="pw")
            {
              moves=check_move(moves,i,j,i-1,j-2,"knb",kbPosition)
            }
            if(i>0 && j<6)
            if(board?.[i-1][j+2]==="0" || board?.[i-1][j+2]==="rw" || board?.[i-1][j+2]==="knw" || board?.[i-1][j+2]==="bw" || board?.[i-1][j+2]==="qw" || board?.[i-1][j+2]==="kw" || board?.[i-1][j+2]==="pw")
            {
              moves=check_move(moves,i,j,i-1,j+2,"knb",kbPosition)
            }
            if(i<6 && j<7)
            if(board?.[i+2][j+1]==="0" || board?.[i+2][j+1]==="rw" || board?.[i+2][j+1]==="knw" || board?.[i+2][j+1]==="bw" || board?.[i+2][j+1]==="qw" || board?.[i+2][j+1]==="kw" || board?.[i+2][j+1]==="pw")
            {
              moves=check_move(moves,i,j,i+2,j+1,"knb",kbPosition)
            }
            if(i<6 && j>0)
            if(board?.[i+2][j-1]==="0" || board?.[i+2][j-1]==="rw" || board?.[i+2][j-1]==="knw" || board?.[i+2][j-1]==="bw" || board?.[i+2][j-1]==="qw" || board?.[i+2][j-1]==="kw" || board?.[i+2][j-1]==="pw")
            {
              moves=check_move(moves,i,j,i+2,j-1,"knb",kbPosition)
            }
            if(i>1 && j>0)
            if(board?.[i-2][j-1]==="0" || board?.[i-2][j-1]==="rw" || board?.[i-2][j-1]==="knw" || board?.[i-2][j-1]==="bw" || board?.[i-2][j-1]==="qw" || board?.[i-2][j-1]==="kw" || board?.[i-2][j-1]==="pw")
            {
              moves=check_move(moves,i,j,i-2,j-1,"knb",kbPosition)
            }
            if(i>1 && j<7)
            if(board?.[i-2][j+1]==="0" || board?.[i-2][j+1]==="rw" || board?.[i-2][j+1]==="knw" || board?.[i-2][j+1]==="bw" || board?.[i-2][j+1]==="qw" || board?.[i-2][j+1]==="kw" || board?.[i-2][j+1]==="pw")
            {
              moves=check_move(moves,i,j,i-2,j+1,"knb",kbPosition)
            }
          }
          if(board?.[i][j]==="qb")
          {
            let r=i+1
            while(r<=7)
            {
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                moves=check_move(moves,i,j,r,j,"qb",kbPosition)
                  break
              }
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"qb",kbPosition) 
                r++  
              }
            }
            r=i-1
            while(r>=0)
            {
              if(board?.[r][j]==="pw" || board?.[r][j]==="rw" || board?.[r][j]==="knw" || board?.[r][j]==="bw" || board?.[r][j]==="qw" || board?.[r][j]==="kw")
              {
                moves=check_move(moves,i,j,r,j,"qb",kbPosition)
                  break
              }
              if(board?.[r][j]==="pb" || board?.[r][j]==="rb" || board?.[r][j]==="knb" || board?.[r][j]==="bb" || board?.[r][j]==="qb" || board?.[r][j]==="kb")
              {
                  break
              }
              if(board?.[r][j]==="0")
              {
                moves=check_move(moves,i,j,r,j,"qb",kbPosition) 
                r--  
              }
            }
            r=j+1
            while(r<=7)
            {
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  moves=check_move(moves,i,j,i,r,"qb",kbPosition)
                  break
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"qb",kbPosition) 
                r++  
              }
            }
            r=j-1
            while(r>=0)
            {
              if(board?.[i][r]==="pw" || board?.[i][r]==="rw" || board?.[i][r]==="knw" || board?.[i][r]==="bw" || board?.[i][r]==="qw" || board?.[i][r]==="kw")
              {
                  moves=check_move(moves,i,j,i,r,"qb",kbPosition)
                  break
              }
              if(board?.[i][r]==="pb" || board?.[i][r]==="rb" || board?.[i][r]==="knb" || board?.[i][r]==="bb" || board?.[i][r]==="qb" || board?.[i][r]==="kb")
              {
                  break
              }
              if(board?.[i][r]==="0")
              {
                moves=check_move(moves,i,j,i,r,"qb",kbPosition) 
                r--  
              }
            }
            let maxIncrement=Math.min(7-i,7-j)
              let increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j+increment]==="pb" || board?.[i+increment][j+increment]==="kb" || board?.[i+increment][j+increment]==="qb" || board?.[i+increment][j+increment]==="rb" || board?.[i+increment][j+increment]==="bb" || board?.[i+increment][j+increment]==="knb")
                {
                  break
                }
                if(board?.[i+increment][j+increment]==="pw" || board?.[i+increment][j+increment]==="kw" || board?.[i+increment][j+increment]==="qw" || board?.[i+increment][j+increment]==="rw" || board?.[i+increment][j+increment]==="bw" || board?.[i+increment][j+increment]==="knw")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"qb",kbPosition)
                  break
                }
                if(board?.[i+increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j+increment,"qb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(7-i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i+increment][j-increment]==="pb" || board?.[i+increment][j-increment]==="kb" || board?.[i+increment][j-increment]==="qb" || board?.[i+increment][j-increment]==="rb" || board?.[i+increment][j-increment]==="bb" || board?.[i+increment][j-increment]==="knb")
                {
                  break
                }
                if(board?.[i+increment][j-increment]==="pw" || board?.[i+increment][j-increment]==="kw" || board?.[i+increment][j-increment]==="qw" || board?.[i+increment][j-increment]==="rw" || board?.[i+increment][j-increment]==="bw" || board?.[i+increment][j-increment]==="knw")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"qb",kbPosition)
                  break
                }
                if(board?.[i+increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i+increment,j-increment,"qb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j-increment]==="pb" || board?.[i-increment][j-increment]==="kb" || board?.[i-increment][j-increment]==="qb" || board?.[i-increment][j-increment]==="rb" || board?.[i-increment][j-increment]==="bb" || board?.[i-increment][j-increment]==="knb")
                {
                  break
                }
                if(board?.[i-increment][j-increment]==="pw" || board?.[i-increment][j-increment]==="kw" || board?.[i-increment][j-increment]==="qw" || board?.[i-increment][j-increment]==="rw" || board?.[i-increment][j-increment]==="bw" || board?.[i-increment][j-increment]==="knw")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"qb",kbPosition)
                  break
                }
                if(board?.[i-increment][j-increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j-increment,"qb",kbPosition)
                  increment++
                }
              }
              maxIncrement=Math.min(i,7-j)
              increment=1
              while(increment<=maxIncrement)
              {
                if(board?.[i-increment][j+increment]==="pb" || board?.[i-increment][j+increment]==="kb" || board?.[i-increment][j+increment]==="qb" || board?.[i-increment][j+increment]==="rb" || board?.[i-increment][j+increment]==="bb" || board?.[i-increment][j+increment]==="knb")
                {
                  break
                }
                if(board?.[i-increment][j+increment]==="pw" || board?.[i-increment][j+increment]==="kw" || board?.[i-increment][j+increment]==="qw" || board?.[i-increment][j+increment]==="rw" || board?.[i-increment][j+increment]==="bw" || board?.[i-increment][j+increment]==="knw")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"qb",kbPosition)
                  break
                }
                if(board?.[i-increment][j+increment]==="0")
                {
                  moves=check_move(moves,i,j,i-increment,j+increment,"qb",kbPosition)
                  increment++
                }
              }
          }
          if(board?.[i][j]==="kb")
          {
            for(let m=0;m<8;m++)
              for(let n=0;n<8;n++)
              {
                if(Math.abs(i-m)<=1 && Math.abs(j-n)<=1 && (i!==m || j!==n))
                {
                  if(board?.[m][n]==="pw" || board?.[m][n]==="rw" || board?.[m][n]==="knw" || board?.[m][n]==="bw" || board?.[m][n]==="qw" || board?.[m][n]==="0")
                    moves=check_move(moves,i,j,m,n,"kb",{row: m ,col: n})
                }
              }
          }

        }
        return moves
    }
    function closeModal()
    {
      setmodal(false)
      setmodalWasClosed(true)
    }

    return (
        <div className="canvas">
          <div className="board__user">

            <IconButton>
              <Avatar src={opponent?.photo}/>
            </IconButton>
            <h3>{opponent?.username}</h3>
            <div className="timer">10:00</div>
          </div>  
          <div className={ user.color=="white" ? "app__board" : "app__board__reverse"}>
            {
              w_moves===0 && user?.color==="white" ?
              <Modal isOpen={modal} onRequestClose={closeModal} className="modal">
                <h2>You lost!</h2>
                <p>-10 rating points</p>
                <button onClick={closeModal}>Ok</button>
              </Modal> 
              : w_moves===0 && user?.color==="black" ?
              <Modal isOpen={modal} onRequestClose={closeModal} className="modal">
                <h2>You won!</h2>
                <p>+10 rating points</p>
                <button onClick={closeModal}>Ok</button>
              </Modal>
              : b_moves===0 && user?.color==="black" ?
              <Modal isOpen={modal} onRequestClose={closeModal} className="modal">
                <h2>You lost!</h2>
                <p>-10 rating points</p>
                <button onClick={closeModal}>Ok</button>
              </Modal>
              : b_moves===0 && user?.color==="white" ?
              <Modal isOpen={modal} onRequestClose={closeModal} className="modal">
                <h2>You won!</h2>
                <p>+10 rating points</p>
                <button onClick={closeModal}>Ok</button>
              </Modal>
              :
              ""
            }
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(0,0)} onClick={()=>select_square(0,0)}>{load_image(0,0) ?<img src={load_image(0,0)} alt=""/>: ""}</div>
        <div className={square_selected(0,1)} onClick={()=>select_square(0,1)}>{load_image(0,1) ?<img src={load_image(0,1)} alt=""/>: ""}</div>
        <div className={square_selected(0,2)} onClick={()=>select_square(0,2)}>{load_image(0,2) ?<img src={load_image(0,2)} alt=""/>: ""}</div>
        <div className={square_selected(0,3)} onClick={()=>select_square(0,3)}>{load_image(0,3) ?<img src={load_image(0,3)} alt=""/>: ""}</div>
        <div className={square_selected(0,4)} onClick={()=>select_square(0,4)}>{load_image(0,4) ?<img src={load_image(0,4)} alt=""/>: ""}</div>
        <div className={square_selected(0,5)} onClick={()=>select_square(0,5)}>{load_image(0,5) ?<img src={load_image(0,5)} alt=""/>: ""}</div>
        <div className={square_selected(0,6)} onClick={()=>select_square(0,6)}>{load_image(0,6) ?<img src={load_image(0,6)} alt=""/>: ""}</div>
        <div className={square_selected(0,7)} onClick={()=>select_square(0,7)}>{load_image(0,7) ?<img src={load_image(0,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(1,0)} onClick={()=>select_square(1,0)}>{load_image(1,0) ?<img src={load_image(1,0)} alt=""/>: ""}</div>
        <div className={square_selected(1,1)} onClick={()=>select_square(1,1)}>{load_image(1,1) ?<img src={load_image(1,1)} alt=""/>: ""}</div>
        <div className={square_selected(1,2)} onClick={()=>select_square(1,2)}>{load_image(1,2) ?<img src={load_image(1,2)} alt=""/>: ""}</div>
        <div className={square_selected(1,3)} onClick={()=>select_square(1,3)}>{load_image(1,3) ?<img src={load_image(1,3)} alt=""/>: ""}</div>
        <div className={square_selected(1,4)} onClick={()=>select_square(1,4)}>{load_image(1,4) ?<img src={load_image(1,4)} alt=""/>: ""}</div>
        <div className={square_selected(1,5)} onClick={()=>select_square(1,5)}>{load_image(1,5) ?<img src={load_image(1,5)} alt=""/>: ""}</div>
        <div className={square_selected(1,6)} onClick={()=>select_square(1,6)}>{load_image(1,6) ?<img src={load_image(1,6)} alt=""/>: ""}</div>
        <div className={square_selected(1,7)} onClick={()=>select_square(1,7)}>{load_image(1,7) ?<img src={load_image(1,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(2,0)} onClick={()=>select_square(2,0)}>{load_image(2,0) ?<img src={load_image(2,0)} alt=""/>: ""}</div>
        <div className={square_selected(2,1)} onClick={()=>select_square(2,1)}>{load_image(2,1) ?<img src={load_image(2,1)} alt=""/>: ""}</div>
        <div className={square_selected(2,2)} onClick={()=>select_square(2,2)}>{load_image(2,2) ?<img src={load_image(2,2)} alt=""/>: ""}</div>
        <div className={square_selected(2,3)} onClick={()=>select_square(2,3)}>{load_image(2,3) ?<img src={load_image(2,3)} alt=""/>: ""}</div>
        <div className={square_selected(2,4)} onClick={()=>select_square(2,4)}>{load_image(2,4) ?<img src={load_image(2,4)} alt=""/>: ""}</div>
        <div className={square_selected(2,5)} onClick={()=>select_square(2,5)}>{load_image(2,5) ?<img src={load_image(2,5)} alt=""/>: ""}</div>
        <div className={square_selected(2,6)} onClick={()=>select_square(2,6)}>{load_image(2,6) ?<img src={load_image(2,6)} alt=""/>: ""}</div>
        <div className={square_selected(2,7)} onClick={()=>select_square(2,7)}>{load_image(2,7) ?<img src={load_image(2,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(3,0)} onClick={()=>select_square(3,0)}>{load_image(3,0) ?<img src={load_image(3,0)} alt=""/>: ""}</div>
        <div className={square_selected(3,1)} onClick={()=>select_square(3,1)}>{load_image(3,1) ?<img src={load_image(3,1)} alt=""/>: ""}</div>
        <div className={square_selected(3,2)} onClick={()=>select_square(3,2)}>{load_image(3,2) ?<img src={load_image(3,2)} alt=""/>: ""}</div>
        <div className={square_selected(3,3)} onClick={()=>select_square(3,3)}>{load_image(3,3) ?<img src={load_image(3,3)} alt=""/>: ""}</div>
        <div className={square_selected(3,4)} onClick={()=>select_square(3,4)}>{load_image(3,4) ?<img src={load_image(3,4)} alt=""/>: ""}</div>
        <div className={square_selected(3,5)} onClick={()=>select_square(3,5)}>{load_image(3,5) ?<img src={load_image(3,5)} alt=""/>: ""}</div>
        <div className={square_selected(3,6)} onClick={()=>select_square(3,6)}>{load_image(3,6) ?<img src={load_image(3,6)} alt=""/>: ""}</div>
        <div className={square_selected(3,7)} onClick={()=>select_square(3,7)}>{load_image(3,7) ?<img src={load_image(3,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(4,0)} onClick={()=>select_square(4,0)}>{load_image(4,0) ?<img src={load_image(4,0)} alt=""/>: ""}</div>
        <div className={square_selected(4,1)} onClick={()=>select_square(4,1)}>{load_image(4,1) ?<img src={load_image(4,1)} alt=""/>: ""}</div>
        <div className={square_selected(4,2)} onClick={()=>select_square(4,2)}>{load_image(4,2) ?<img src={load_image(4,2)} alt=""/>: ""}</div>
        <div className={square_selected(4,3)} onClick={()=>select_square(4,3)}>{load_image(4,3) ?<img src={load_image(4,3)} alt=""/>: ""}</div>
        <div className={square_selected(4,4)} onClick={()=>select_square(4,4)}>{load_image(4,4) ?<img src={load_image(4,4)} alt=""/>: ""}</div>
        <div className={square_selected(4,5)} onClick={()=>select_square(4,5)}>{load_image(4,5) ?<img src={load_image(4,5)} alt=""/>: ""}</div>
        <div className={square_selected(4,6)} onClick={()=>select_square(4,6)}>{load_image(4,6) ?<img src={load_image(4,6)} alt=""/>: ""}</div>
        <div className={square_selected(4,7)} onClick={()=>select_square(4,7)}>{load_image(4,7) ?<img src={load_image(4,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(5,0)} onClick={()=>select_square(5,0)}>{load_image(5,0) ?<img src={load_image(5,0)} alt=""/>: ""}</div>
        <div className={square_selected(5,1)} onClick={()=>select_square(5,1)}>{load_image(5,1) ?<img src={load_image(5,1)} alt=""/>: ""}</div>
        <div className={square_selected(5,2)} onClick={()=>select_square(5,2)}>{load_image(5,2) ?<img src={load_image(5,2)} alt=""/>: ""}</div>
        <div className={square_selected(5,3)} onClick={()=>select_square(5,3)}>{load_image(5,3) ?<img src={load_image(5,3)} alt=""/>: ""}</div>
        <div className={square_selected(5,4)} onClick={()=>select_square(5,4)}>{load_image(5,4) ?<img src={load_image(5,4)} alt=""/>: ""}</div>
        <div className={square_selected(5,5)} onClick={()=>select_square(5,5)}>{load_image(5,5) ?<img src={load_image(5,5)} alt=""/>: ""}</div>
        <div className={square_selected(5,6)} onClick={()=>select_square(5,6)}>{load_image(5,6) ?<img src={load_image(5,6)} alt=""/>: ""}</div>
        <div className={square_selected(5,7)} onClick={()=>select_square(5,7)}>{load_image(5,7) ?<img src={load_image(5,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(6,0)} onClick={()=>select_square(6,0)}>{load_image(6,0) ?<img src={load_image(6,0)} alt=""/>: ""}</div>
        <div className={square_selected(6,1)} onClick={()=>select_square(6,1)}>{load_image(6,1) ?<img src={load_image(6,1)} alt=""/>: ""}</div>
        <div className={square_selected(6,2)} onClick={()=>select_square(6,2)}>{load_image(6,2) ?<img src={load_image(6,2)} alt=""/>: ""}</div>
        <div className={square_selected(6,3)} onClick={()=>select_square(6,3)}>{load_image(6,3) ?<img src={load_image(6,3)} alt=""/>: ""}</div>
        <div className={square_selected(6,4)} onClick={()=>select_square(6,4)}>{load_image(6,4) ?<img src={load_image(6,4)} alt=""/>: ""}</div>
        <div className={square_selected(6,5)} onClick={()=>select_square(6,5)}>{load_image(6,5) ?<img src={load_image(6,5)} alt=""/>: ""}</div>
        <div className={square_selected(6,6)} onClick={()=>select_square(6,6)}>{load_image(6,6) ?<img src={load_image(6,6)} alt=""/>: ""}</div>
        <div className={square_selected(6,7)} onClick={()=>select_square(6,7)}>{load_image(6,7) ?<img src={load_image(6,7)} alt=""/>: ""}</div>
        </div>
        <div className={ user.color=="white" ? "app__board__row" : "app__board__row__reverse"}>
        <div className={square_selected(7,0)} onClick={()=>select_square(7,0)}>{load_image(7,0) ?<img src={load_image(7,0)} alt=""/>: ""}</div>
        <div className={square_selected(7,1)} onClick={()=>select_square(7,1)}>{load_image(7,1) ?<img src={load_image(7,1)} alt=""/>: ""}</div>
        <div className={square_selected(7,2)} onClick={()=>select_square(7,2)}>{load_image(7,2) ?<img src={load_image(7,2)} alt=""/>: ""}</div>
        <div className={square_selected(7,3)} onClick={()=>select_square(7,3)}>{load_image(7,3) ?<img src={load_image(7,3)} alt=""/>: ""}</div>
        <div className={square_selected(7,4)} onClick={()=>select_square(7,4)}>{load_image(7,4) ?<img src={load_image(7,4)} alt=""/>: ""}</div>
        <div className={square_selected(7,5)} onClick={()=>select_square(7,5)}>{load_image(7,5) ?<img src={load_image(7,5)} alt=""/>: ""}</div>
        <div className={square_selected(7,6)} onClick={()=>select_square(7,6)}>{load_image(7,6) ?<img src={load_image(7,6)} alt=""/>: ""}</div>
        <div className={square_selected(7,7)} onClick={()=>select_square(7,7)}>{load_image(7,7) ?<img src={load_image(7,7)} alt=""/>: ""}</div>
        </div>
      </div>
      <div className="board__user">
        <IconButton>
          <Avatar src={user?.photo}/>
        </IconButton>
          <h3>{user?.username}</h3>
          <div className="timer">10:00</div>
      </div> 
        </div>
    )
}

export default BoardGame
