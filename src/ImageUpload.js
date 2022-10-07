import React, {useState} from 'react';
import firebase from 'firebase/compat/app';
import {db, storage} from './firebase';
import  './ImageUpload.css';
import { getAuth } from "firebase/auth";


function ImageUpload({username, setblackback, setshowImageUpload}) {

    const auth = getAuth();
    const user = auth.currentUser;
    const photoURL = user.photoURL;
    
    const [image,setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');


    const handleChange = (e) =>{
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }

    const handleUpload = () =>{
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        caption.replaceAll("<br>", "\r\n"); 

        uploadTask.on(
            "stage_changed",
            (snapshot) => {
                // progress function
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) =>{
                //error function
                console.log(error);
                alert(error.message)
            },
            () =>{
             // complete function
             storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then( url =>{
                    //post image inside db
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageUrl: url,
                        username: username,
                        photoURL: photoURL
                    });

                    setProgress(0);
                    setCaption("");
                    setImage(null);

                    setshowImageUpload("noShow");
                    setblackback("noShow")

                });
            }
        )

}



  return (

    <div className='imageupload'>
    <progress className='imageupload__progress' value={progress} max="100"></progress>
    <textarea type="text" rows="3" placeholder='문구입력...' onChange={ event => setCaption(event.target.value)} value={caption} />
    <input type="file" onChange={handleChange}/>
    <button className='btnShare' onClick= {handleUpload}>공유</button>
    </div>


  )
}

export default ImageUpload