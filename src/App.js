import React, {useState, useEffect} from 'react';
import {  BrowserRouter as Router, Route} from 'react-router-dom';
import './App.css';
import Post from './Post';
import {db, auth, getDocs } from './firebase';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form';
import ImageUpload from './ImageUpload';
import UserProfile from './UserProfile';
import MapContainer from './MapContainer';




import { BiPlus, BiLogOut, BiHomeAlt, BiMapAlt, BiSearch,BiPencil} from "react-icons/bi";
import { fetchSignInMethodsForEmail } from 'firebase/auth';


function App() {
  const [visible, setVisible] = useState(true);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [loginShow, loginsetShow] = useState(false);

  const loginHandleClose = () => loginsetShow(false);
  const loginHandleShow = () => loginsetShow(true);

  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [email, setEmail] = useState([]);
  const [user, setUser] = useState(null);

  const [addressInfo, setAddressInfo] = useState([]);
  const [mapSwimId, setMapSwimId] = useState([]);

  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: 'https://swimus.co.kr',
    // This must be true.
    handleCodeInApp: true,
    dynamicLinkDomain: 'https://swimus.co.kr'
  };


  const signUp = (event) =>{
  event.preventDefault();

  
  auth
  .createUserWithEmailAndPassword(email, password)
  .then((authUser) =>
   { return authUser.user.updateProfile({
    displayName: username
    })
   }) 
  .catch( (error) => alert(error.message ))

  setShow(false);
  }

 const signIn = (event) =>{
  event.preventDefault();
  auth
  .signInWithEmailAndPassword(email, password)
  .catch((error) => alert(error.message) )

  loginsetShow(false);
 }

useEffect( () =>{
   const unsubscribe = auth.onAuthStateChanged((authUser) => {
    if( authUser){
     setUser(authUser);

  }else{
    setUser(null)
  }
//user has logged out
  return() => {
  // performe some cleanup actions
    unsubscribe();
  }
})
}, [user, username]);

  
useEffect( () =>{
db.collection('posts').orderBy('timestamp','desc').onSnapshot(snapshot =>{
  setPosts(snapshot.docs.map(doc=>({
    id: doc.id,
    post:doc.data()
  })));
})

}, []);

const [showImageUpload, setshowImageUpload] = useState("noShow");
const [showloginWarning, setshowloginWarning] = useState("noShow");


const popImageUpload = () => {  
  setshowImageUpload("show");
  setshowloginWarning("show")
  setblackback("show")
};
const [blackback, setblackback] = useState("noShow");

const noShowImageUpload= () => {  
  setshowImageUpload("noShow");
  setshowloginWarning("noShow");
  setblackback("noShow")
};



let productInfos = [];
let swimIds = [];

let swimId;

useEffect( () =>{
db.collection("swimAddress").get().then(function(querySnapshot) {
  querySnapshot.forEach(function(doc) {
      productInfos.push(doc.data());
      swimId = doc.id;
      swimIds.push(swimId);
 //     console.log(swimId, " => ", doc.data());

  });
setAddressInfo( productInfos )
setMapSwimId( swimIds );

}); }, []);


  return (
    <Router>
    <div className="app">


      {user?.displayName ? 
      (<div className={showImageUpload}><ImageUpload username ={user.displayName} setblackback ={setblackback} setshowImageUpload ={setshowImageUpload}/> </div>)
      :(
        <div className={`loginWarning ${showloginWarning}`}>
          <div>
          <h3>로그인해주세요.</h3>
          </div>
        </div>
      )}

      <Modal
        show={loginShow}
        onHide={loginHandleClose}
        backdrop="static"
        keyboard={false}
      >
      <Form className='app__signup'>  
      <Modal.Header closeButton>
          <Modal.Title><img className="app__headerImage" src="https://firebasestorage.googleapis.com/v0/b/instagram-react-75d47.appspot.com/o/images%2Flogo.jpg?alt=media&token=f3dd1d10-c667-4327-bf40-bb1039859fb9" alt="logo"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
         <Form.Control placeholder="email" type="text" value={email} onChange ={ (e)=> setEmail(e.target.value) }></Form.Control>
         <Form.Control placeholder="password" type="password" value={password} onChange ={ (e)=> setPassword(e.target.value) }></Form.Control>
        </Modal.Body>
        <Modal.Footer>
          <Button type ="submit" variant="primary" onClick ={signIn}>로그인</Button>
        </Modal.Footer>
        </Form>
      </Modal>


     <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
      <Form className='app__signup'>  
      <Modal.Header closeButton>
          <Modal.Title>          <img className="app__headerImage" src="https://firebasestorage.googleapis.com/v0/b/instagram-react-75d47.appspot.com/o/images%2Flogo.jpg?alt=media&token=2e9a70ce-b265-45c3-9928-a48abef3abfc" alt="instagram"/></Modal.Title>
        </Modal.Header>
        <Modal.Body>
      
         <Form.Control placeholder="username" type="text" value={username} onChange ={ (e)=> setUsername(e.target.value) }></Form.Control>
         <Form.Control placeholder="email" type="text" value={email} onChange ={ (e)=> setEmail(e.target.value) }></Form.Control>
         <Form.Control placeholder="password" type="password" value={password} onChange ={ (e)=> setPassword(e.target.value) }></Form.Control>
       
        </Modal.Body>
        <Modal.Footer>
          <Button type ="submit" variant="primary" onClick ={signUp}>회원가입</Button>
        </Modal.Footer>
        </Form>
      </Modal>

      <div className="app__header">
         <img className="app__headerImage" src="https://firebasestorage.googleapis.com/v0/b/instagram-react-75d47.appspot.com/o/images%2Flogo.jpg?alt=media&token=2e9a70ce-b265-45c3-9928-a48abef3abfc" alt="logo"/>
        {user ? 
      ( 
      <div className='app__loginContainer'>
        <div><BiLogOut   onClick={()=> auth.signOut()}/></div>
      </div>
      ):
    
      (<div className='app__loginContainer'>
      <button className='btn btn-login' onClick={loginHandleShow}>
        로그인
      </button>
        <button className='btn btn-sign' onClick={handleShow}>
        회원가입
      </button>
      </div>
      ) }
      </div>

      {user ? (
      <div>
            <UserProfile />
       </div>
      ): (
              <div>
            </div>
      )}
      {!visible && ( 
       <MapContainer  
       className={ `mapContainer ${blackback}`} addressInfo ={addressInfo} swimIds ={mapSwimId} Mapcontianervisible={setVisible} />  )}
   


    <div className='app__posts'>


        {
          posts.map(( {post, id}) => (
            <Post key={id} postId={id} user={user} username = {post.username} caption ={post.caption} imageUrl ={post.imageUrl} photoURL ={post.photoURL} />
          ))
  
        }
      

      </div>


      <div className='bottomNav'>
        <div><BiHomeAlt onClick={() => window.location.reload()} /></div>
        <div onClick={popImageUpload}><BiPlus /></div>
        <div onClick={() => setVisible(!visible)}><BiMapAlt/></div>  
       <div><BiSearch /></div>
      </div> 

      <div className={ `blackback ${blackback}`} onClick={noShowImageUpload}></div>

    </div>
    </Router>
  );
  
}

export default App;
