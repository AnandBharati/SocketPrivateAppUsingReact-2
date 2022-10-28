import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ChatWindowStyle.css'
import { socket } from './Login';
import { addMessage } from '../redux/slice'

function ChatWindow() {
  const selector = useSelector(state => state.chatReducers);
  const [allUsers, setAllUsers] = useState(selector.allUsers);
  const [newMsg, setNewMsg] = useState('')
  const [AllMsg, setAllMsg] = useState(selector.messages);
  const [filterMsg, setFilterMsg] =useState()
  const [selectedUser, setSelectedUser] = useState({});
  const [isUserHidden, setIsUserHidden] = useState(true);
  const dispatch = useDispatch();
  
  const [floatBtn, setfloatBtn] = useState(<i className="fa-solid fa-users fa-xl"></i>)

  useEffect(() => {
    setAllUsers(selector.allUsers);
    setAllMsg(selector.messages);
    // eslint-disable-next-line
  }, [selector])

  useEffect(()=>{
    setFilterMsg(AllMsg.filter((msg)=>(msg.fromUserId===selectedUser.id || msg.toUserId===selectedUser.id)))
  },[selectedUser.id, AllMsg])

  useEffect(() => {
    console.log('Checking incomeing message')
    socket.on('send message', ({ content, fromUser, fromUserId, toUser, toUserId }) => {
      console.log('message recieved')
      dispatch(addMessage({ content, fromUser, fromUserId, toUser, toUserId }))
      setAllMsg(selector.messages);
    })
    // eslint-disable-next-line
  }, [])

  function sendMsg(e) {
    e.preventDefault();
    if (selector.self.username !== null) {
      socket.emit('send message', { 'content': newMsg, 'fromUser': selector.self.username, 'fromUserId': selector.self.id, 'toUser': selectedUser.username, 'toUserId': selectedUser.id })
      dispatch(addMessage({ 'content': newMsg, 'fromUser': selector.self.username, 'fromUserId': selector.self.id, 'toUser': selectedUser.username, 'toUserId': selectedUser.id }))
    }
  }

  function setUserActive(user){
     setSelectedUser({ username: user.username, id: user.id });
      let userRibbon = document.getElementById('user-'+user.id)
      let otherUser = document.querySelectorAll('.otherUser-container .user')
      console.log(otherUser)
      Array.from(otherUser).map(a=> a.classList?.remove('active-user'));
      userRibbon.classList.add('active-user');

  }

  function showHideUsers(){
    const userPanel = document.querySelector('.user-panel');
    if(isUserHidden){
      userPanel.style.display='flex';
      setfloatBtn(<i className="fa-solid fa-xmark fa-xl"></i>)
    }
    else{
      userPanel.style.display='none';
      //floatBtn.innerHTML = '<i className="fa-solid fa-users fa-xl"></i>'
      setfloatBtn(<i className="fa-solid fa-users fa-xl"></i>)
    }
    setIsUserHidden(!isUserHidden);
  }

  //style the chat window
  //get all the users
  //get all the messages
  return (
    <div className='chat-window-container'>

      <div className="user-panel">
        <div className="selfaccount-container">
          <img src='https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Free-Image.png' alt="" />
          <div className="user-info">
            <h3> {selector.self.username}</h3>
            <select defaultValue="available">
              <option value="available">Available</option>
              <option value="busy" >Busy</option>
              <option value="away" >Away</option>
              <option value="offline" >Offline</option>
            </select>
          </div>
        </div>
        <div className="otherUser-container">
          {allUsers.filter((user) => user.id !== selector.self.id).map((user) =>
          (<div className="user" id={'user-'+user.id} key={user.id} onClick={() =>setUserActive(user) }>
            <img src='https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Free-Image.png' alt='avatar' />
            <h3> {user.username} </h3>
          </div>)
          )}
        </div>
      </div>

      <div className="message-panel">
        <span className='floatBtn' onClick={()=>showHideUsers()}> {floatBtn} </span>
        <div className="selfaccount-container">
          <img src='https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Free-Image.png' alt="" />
          <h3> {selectedUser.username}</h3>
        </div>
        <div className="messages">
          {filterMsg?.map(({ content, fromUser, fromUserId, toUser, toUserId }, i) =>{
            let direction = fromUserId === selector.self.id ? 'from' : 'to'
            
           return <p key={i} className={'message ' +direction}>
              {content}
            </p>

})}
        </div>
        <div className="message-control">
        <button onClick={(e) => sendMsg(e)}>Send</button>
          <input type="text" name="" id="" placeholder='Enter Message' value={newMsg} onChange={(e) => setNewMsg(e.target.value)} />
          
        </div>
      </div>
    </div>
  )
}

export default ChatWindow