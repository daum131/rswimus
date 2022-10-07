import React, {useEffect, useState} from 'react';
import Button from 'react-bootstrap/Button';
import './Post.css';
import firebase from 'firebase/compat/app';
import {db , storage} from './firebase';


import { BiDotsHorizontalRounded, BiTrash } from "react-icons/bi";

function Post({ postId, user, username,photoURL, caption, imageUrl}) {

  const [showMenu, setShowmenu] = useState("noShow");
  const [blackback, setblackback] = useState("noShow");

  caption.replaceAll("\n", "<br/>");
  
  const showPostmenu = () => {  
    setShowmenu("show");
    setblackback("show")
  };

  const noShowPostmenu = () => {  
    setShowmenu("noShow");
    setblackback("noShow")
  };

  const [mode, setMode] = useState('READ');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');



  useEffect( ()=>{
    let unsubscribe;
    if(postId){
       unsubscribe = db
      .collection("posts")
      .doc(postId)
      .collection("comments")
      .orderBy('timestamp','desc')
      .onSnapshot((snapshot) =>{
        setComments(snapshot.docs.map( doc => (
          { 
            id:doc.id,
            comment:doc.data()}
          )))
      });
    }
    return () =>{
      unsubscribe();
    }
  }, [postId]);
  

  /*update*/
    
  const [updateImage,setUpdateImage] = useState(null);
  const [updateCaption , setUpdateCaption] = useState('');

  const ImageChange = (e) =>{
  if(e.target.files[0]){
      setUpdateImage(e.target.files[0])
    } 
}
const captionChange =(event) => {
     setUpdateCaption(event.target.value);
}

  const updatePost = () =>{

    if(updateImage === null){

      if(updateCaption ===''){
        alert('수정된게 없습니다.')
        window.location.reload();
      }
      else{
        db.collection("posts")
        .doc(postId).update({
            caption: updateCaption,
        });

        setUpdateCaption("");
        setUpdateImage(null);
        setMode("READ")

      }
      
  
  }
  else if(updateCaption === ''){
   
    const updateTask = storage.ref(`images/${updateImage.name}`).put(updateImage);
    updateTask.on("update",
    () =>{
      // complete function
      storage
         .ref("images")
         .child(updateImage.name)
         .getDownloadURL()
         .then( url =>{
             //post image inside db
             db.collection("posts")
             .doc(postId).update({
                 imageUrl: url,
             });

             setUpdateCaption("");
             setUpdateImage(null);
             setMode("READ")

         });
     }
  )

}

    else{
      updateCaption.replaceAll("<br>", "\r\n"); 
      
      const updateTask = storage.ref(`images/${updateImage.name}`).put(updateImage);
      updateTask.on("update",
      () =>{
        // complete function
        storage
           .ref("images")
           .child(updateImage.name)
           .getDownloadURL()
           .then( url =>{
               //post image inside db
               db.collection("posts")
               .doc(postId).update({
                   caption: updateCaption,
                   imageUrl: url,
               });
  
               setUpdateCaption("");
               setUpdateImage(null);
               setMode("READ")
  
           });
       }
    )
      
    }


  }


  //removePost
    const removePost = () => {
  
      db.collection("posts")
      .doc(postId).delete();


      setUpdateCaption("");
      setUpdateImage(null);
      setMode("READ")
     
  }

  const postComment = (event) =>{
    event.preventDefault();
    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment('');
     
  }

  const removeComment = (id) => {
   db.collection("posts").doc(postId).collection("comments").doc(id).delete()

}


  let content = null

  if(mode === 'READ'){
    content=
  <div>    
    <div>
    <div className='post__header'>

    <div className='UserProfile'>
      <div className='profile__image'>
        <img src= {photoURL} alt="" />
      </div>
      {username}
    </div>
      
      {user ? ( <div className='post__menu__button' onClick={showPostmenu}><BiDotsHorizontalRounded/> </div>) : (<div></div>)}

      {user && ( 
        <div className={showMenu}>       
        <ul className='post__menu'>
          <li>
              <a html={'/update/' + postId } onClick={(event) =>{
               event.preventDefault();
               setMode("UPDATE");
               setShowmenu("noShow");
               setblackback("noShow")
              }}>수정하기</a>
          </li>
          <li><button onClick={()=>{ 
            removePost();
            setShowmenu("noShow");
            setblackback("noShow")} }>삭제</button></li>

        </ul>
        </div>

      )} 
  
   </div>

      <img className='post__image' 
      src= { imageUrl } alt=""/>
     <div className='post__textarea'>
     <h4 className='post__text'><strong>{username}</strong>{ caption }</h4>
      
     </div>

     </div>
  
        <div className='post__comments'>
            {comments.map(({id, comment}) => (
            <div className='comment__wrap' key={id}>
              <div className='comment__box'>
              <p><strong>{comment.username}</strong> {comment.text}
              </p>
              <button className='btn__comment__remove' onClick= {() => {removeComment(id) }}><BiTrash /></button>
              </div>
            </div>
            ))}
          </div> 
          
          { user &&(
          <form className='post__commentBox'>
  
          <input className='post__input'
           type="text"
          placeholder='댓글입력'
          value={comment}
           onChange ={(e) => setComment(e.target.value)}> 
          </input>
  
          <button className='post__button'
          disabled={!comment}
          type="submit"
          onClick={postComment}>
          게시
          </button>
          </form>
          )}
  
</div>


  } else if(mode === 'UPDATE'){
    content=
    <div className='postUpdate'>
    <div className='post__header'>
    <div className='UserProfile'>
      <div className='profile__image'>
        <img src= {photoURL} />
      </div>
      {username}
    </div>

      <Button onClick= {updatePost} className='post__updatepost__btn'>수정완료</Button>
   </div>
      <img className='post__image' 
      src= { imageUrl } alt=""/>
    
    <input type="file" onChange={ImageChange}/>
    <div className='post__textarea'>
    <strong>{username}</strong> 
    <textarea className='post__text update' onChange={captionChange} defaultValue ={caption}></textarea>
    </div>

  </div>
  }

  return (
    <div className='post'>    
    { content }

    
    <div className={ `blackback ${blackback}`} onClick={noShowPostmenu}></div>
    </div>


  
  )
}

export default Post