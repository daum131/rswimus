import React, { useState } from 'react';
//import firebase from 'firebase/compat/app';
import { db, storage } from './firebase';
import './MapUpload.css';
//import { getAuth } from "firebase/auth";


function MapUpload({ setShowUploadWindow, showMapUploadWindow, La, Ma }) {

  const funtionNoShowmapUpload = () => {
    setShowUploadWindow("noshow");
  };

  // const [image,setImage] = useState(null);
  const [swimname, setSwimName] = useState('');
  const [latitude, setLat] = useState(La);
  const [longtitude, setLong] = useState(Ma);
  const [day1, setDay1] = useState('');
  const [length, setLength] = useState('25m');

  // const [memberfee, setMemberfee] = useState();
  // const [generalfee, setGeneralfee] = useState();
  // const handleChange = (e) =>{
  //     if(e.target.files[0]){
  //         setImage(e.target.files[0])
  //     }
  // }

  const mapUpload = () => {
    day1.replaceAll("<br>", "\r\n");

    db.collection("swimAddress").add({
      swimname: swimname,
      latitude: Ma,
      longtitude: La,
      day1: day1,
      length: length
      //  memberfee:memberfee,
      //  generalfee:generalfee,
    });

    setLat('');
    setLong('');
    setSwimName('');
    setDay1('');
    setLength('');
    funtionNoShowmapUpload();

    //  setMemberfee();
    //  setGeneralfee();

  }


  //  const uploadTask = storage.ref(`images/${image.name}`).put(image);

  //   uploadTask.on(
  //         "stage_changed",
  //         (error) =>{
  //             //error function
  //             console.log(error);
  //             alert(error.message)
  //         },
  //             () =>{
  //              // complete function
  //              storage
  //               //  .ref("images")
  //               //  .child(image.name)
  //               //  .getDownloadURL()
  //                 .then( url =>{
  //                     //post image inside db
  //                     db.collection("swimAddress").add({
  //                        // timestamp: firebase.firestore.FieldValue.serverTimestamp(),
  //                         swimname:swimname,
  //                         latitude: latitude,
  //                         longtitude:longtitude,
  //                         image_url: url,
  //                     });

  //                     setLat(null);
  //                     setLong(null);
  //                     setImage(null);

  //                     // setshowImageUpload("noShow");
  //                     // setblackback("noShow")

  //                 });
  //             }


  // }

  const onLengthChange = (e) => {
    setLength(e.target.value);

  }



  return (

    <div className={`mapupload ${showMapUploadWindow}`}>
      <div className='wave'>
        <div className='wave-inner'>
          <p> ???????????? ???????????? ????????? ??????????????????. </p>
          <p><b>????????? ??????:</b><input type="text" onChange={event => setSwimName(event.target.value)} value={swimname} /></p>

          {/* <p><b>????????????:</b><input type="number" onChange={ event => setLong(event.target.value)} value={memberfee} />???</p>
    <p><b>????????????:</b><input type="number" onChange={ event => setLong(event.target.value)} value={generalfee} />???</p> */}
          <div>
            &nbsp;
            <input type="radio" id="25m" name="length" value="25m" defaultChecked={length === "25m"} onChange={onLengthChange} />
            &nbsp;<label for="25m">25m</label>
            &nbsp;&nbsp;
            <input type="radio" id="50m" name="length" value="50m" checked={length === "50m"} onChange={onLengthChange} />
            &nbsp;<label for="50m">50m</label>
          </div>


          <b>?????? ?????? ??????, ??????</b>
          <textarea type="text" onChange={event => setDay1(event.target.value)} value={day1} />

          {/* <input type="file" onChange={handleChange}/> */}
          <div class="btn-wrap">
          <button className='btnShare' onClick={mapUpload}>??????????????????</button>
          <button className='btnShare close' onClick={funtionNoShowmapUpload}>??????</button>
          </div>

        </div>
      </div>
    </div>


  )
}

export default MapUpload