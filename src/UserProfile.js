import React, {useState} from 'react';
import { getAuth, updateProfile } from "firebase/auth";
import {storage} from './firebase';
import Button from 'react-bootstrap/Button';


import './UserProfile.css';


export default function UserProfile() {
  
  const auth = getAuth();
  const user = auth.currentUser;

  let displayName = user.displayName;
  let photoURL = user.photoURL;

  const [profileimage,setprofileImage] = useState(photoURL);
  const [profileName, setProfileName] = useState(displayName);
  const [profileUploadbox, setprofileUpload] = useState("noShow");
  const [profileblackback, setprofileblackback] = useState("noShow");

  const showProfileUpload = () => {  
    setprofileUpload("show");
    setprofileblackback("show")
  };

  const noShowProfileUpload = () => {  
    setprofileUpload("noShow");
    setprofileblackback("noShow")
  };
 

  const pforileChange = (e) =>{
    if(e.target.files[0]){
      setprofileImage(e.target.files[0])
    }
  }
  
  const profileUpload = () =>{

    if(profileimage === photoURL){

      updateProfile(auth.currentUser, {
        displayName: profileName
      });
      setprofileUpload("noShow");
      setprofileblackback("noShow");

    }else if(profileName === displayName) {
     const profileuploadTask = storage.ref(`images/${profileimage.name}`).put(profileimage);
     profileuploadTask.on(
      "profile_changed",
      () =>{
       // complete function
       storage
          .ref("images")
          .child(profileimage.name)
          .getDownloadURL()
          .then( url =>{
            updateProfile(auth.currentUser, {
             photoURL: url        
            });
            setProfileName(profileName);
            setprofileImage(url);
            setprofileUpload("noShow");
            setprofileblackback("noShow");
          });


      }).catch((error) => {
        alert(error.message)
      }
      
  )

}
else{
  const profileuploadTask = storage.ref(`images/${profileimage.name}`).put(profileimage);
  profileuploadTask.on(
      "profile_changed",
      () =>{
       // complete function
       storage
          .ref("images")
          .child(profileimage.name)
          .getDownloadURL()
          .then( url =>{
            photoURL = url
            updateProfile(auth.currentUser, {
              displayName: profileName,
              photoURL: url
        
            })
            setProfileName(profileName);
            setprofileImage(url);
            setprofileUpload("noShow");
            setprofileblackback("noShow")
          });
      }).catch((error) => {
        alert(error.message)
      }
      
  )
}
 
  
  }





  return (
    <div className='UserProfile'>
      <div className='profile__image' onClick={showProfileUpload}>
        <img src= {profileimage} alt=""/>
      </div>
      <p className='profilname'>{profileName}</p>


    <div className= { `profileupload ${profileUploadbox}`}>
      <div>
      <input type="text" placeholder='새로운 닉네임' onChange={ event => setProfileName(event.target.value)} value={profileName} />
      <input type="file" onChange={pforileChange}/>
      <Button onClick= {profileUpload}>프로필수정</Button>
      </div>

    </div>

    <div className={ `pforileblackback ${profileblackback}`} onClick={noShowProfileUpload}></div>

    </div>




  )
}
