import axios from 'axios'
import './App.css';
import React, {useEffect, useRef, useState} from 'react'

function App() {
  const [messages, setMessages] = useState([]);
  const [value, setvalue]= useState('');
  const socket = useRef()
  const [connected, setConnected]= useState(false)
  const [username, setUsername]= useState('')
  
  function connect(){
    socket.current = new WebSocket('ws://localhost:4070')
    socket.current.onopen = () =>{
    setConnected(true)
    console.log(username, "connected to websocket")
    const message = {
      event: 'connection',
      username,
      id: Date.now()
       }
    socket.current.send(JSON.stringify(message))
    
  }
  socket.current.onmessage = (event) =>{
    const message = JSON.parse(event.data)
    setMessages(prev => [message, ...prev])  
  }
  socket.current.onclose = () =>{
    console.log('connection closed')
  }
  socket.current.onerror = () =>{
    console.log('SOCKET error')
  }
  }
  
  const sendMessage = async()=>{
    const message={
      username,
      message: value,
      id: Date.now(),
      event: 'message'
    }
    socket.current.send(JSON.stringify(message));
    setvalue('')
  }




  if(!connected){
    return(
      <div className='d-flex-center'>
        <div >
          <input type="text" 
          className='inputbox'
          value={username} 
          onChange={e =>setUsername(e.target.value)}
           placeholder="input username"/>
          <button
          className='btn' 
          onClick={connect}>Con</button>
        </div>
      </div>
    )
  }


  return (
    <>
    <div className="App red">
      PLACE
    </div>
    <div className='chat_box'>
      
      <div className='red'>
        {messages.map(mess=>
          <div key={mess.id}>
            {mess.event === 'connection'
            ?
            <div>user {mess.username} connected</div>
            
            :
             <div> {mess.username}: {mess.message} </div>

            }
          </div>
          )}
      </div>
      
      <div>
        <input className='inputbox' value={value} onChange={e=> setvalue(e.target.value)} type="text"/>
        <button className='btn' onClick={sendMessage}> send</button>
      </div>
    </div>
    </>
  );
}

export default App;
