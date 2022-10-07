import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Map.css';
import { db } from './firebase';
//import { ContentCutOutlined, EightK } from '@mui/icons-material';

import { BiEdit, BiPencil } from "react-icons/bi";
import MapUpload from './MapUpload';


const { kakao, MapMarker } = window;

const MapContainer = ({ addressInfo, swimIds, Mapcontianervisible }) => {

  const [showMapUploadWindow, setShowUploadWindow] = useState("noshow");
  const [noShowmapUpload, setnoShowmapUpload] = useState("noShow");


  let funtionShowmapUpload = () => {
    setShowUploadWindow("show");
  };


  const [visible, setVisible] = useState(true);
  const [updateSwimName, setupdateSwimName] = useState('');
  const [updateday1, setUpdateDay1] = useState('');

  const [stateswimId, setStateswimId] = useState([]);
  const [overayId, setOverayId] = useState('');

  const [showMapUpdate, setShowmapUpdate] = useState("noShow");

  const [La, setLa] = useState("");
  const [Ma, setMa] = useState("");


  const ShowmapUpdate = () => {
    setShowmapUpdate("show");

  };


  const location = useLocation();

  useEffect(() => {
    const container = document.getElementById('swimmMap');
    const options = {
      center: new kakao.maps.LatLng(37.5170, 126.980453),
      level: 12,
    };

    // db
    // .collection("swimAddress")
    // .onSnapshot((snapshot) =>{
    //   setStateswimId(snapshot.docs.map( doc => (
    //     {  thisId:doc.id,
    //        data:doc.data() }
    //     )))
    // });

    mapRef.current = new kakao.maps.Map(container, options);
  }, [location]);

  const mapRef = useRef();

  const [currenttitle, setTitle] = useState([]);
  const [day, setDay] = useState([]);

  const [updatetitle, setUpdateTitle] = useState([]);
  const [day1, setDay1] = useState([]);
  const [updatelength, setupdateLength] = useState("25m");


  useEffect(() => {

    const overlayInfos = addressInfo?.map((info) => {

      return {
        title: info.swimname,
        lat: info.latitude,
        lng: info.longtitude,
        img: info.image_url,
        price: info.price,
        day1: info.day1,
        day2: info.day2,
        sat1: info.sat1,
        sat2: info.sat2,
        sun1: info.sun1,
        sun2: info.sun2,
        sun3: info.sun3,
        memberfee: info.memberfee,
        generalfee: info.generalfee,
        length: info.length


      };

    });


    overlayInfos.forEach((el, index) => {

      let marker = new kakao.maps.Marker({
        map: mapRef.current,
        position: new kakao.maps.LatLng(el.lat, el.lng),
        title: el.title,

      });

      setTitle(el.title);
      setDay(el.day1);

      let content
      content =
        `<div class='overlayWrap'>
         <div class="length">${el.length} </div>
          <div class='accommInfoWrap'>
          <p class='accommName'>${el.title} </p>
          <p class='accommRegion'><b>자유수영 시간&가격:</b></p>
          <p class='accommRegion'> ${el.day1}</p>
          </div>
        </div>
        `

      let position = new kakao.maps.LatLng(el.lat, el.lng);

      let customOverlay;

      customOverlay = new kakao.maps.CustomOverlay({
        position: position,
        content: content,

      });



      kakao.maps.event.addListener(marker, 'click', function () {
        customOverlay.setMap(mapRef.current);
        setVisible(!visible)
        //setOverayId( stateswimId[index-stateswimId.length].thisId );
        setOverayId(swimIds[index]);
        setUpdateTitle(el.title)
        setDay1(el.day1)
        setupdateLength(el.length)


      });


      kakao.maps.event.addListener(mapRef.current, 'click', function (mouseEvent) {
        customOverlay.setMap()
        setVisible(visible);
        setShowmapUpdate("noShow");

        var latlng = mouseEvent.latLng;

        // 마커 위치를 클릭한 위치로 옮깁니다
        marker.setPosition(latlng);
        setLa(latlng.La)
        setMa(latlng.Ma);


      });



    });

  }, [La, Ma]);



  /*update */

  let newmapUpload = () => {

    console.log(overayId + '현재 아이디')
    updateday1.replaceAll("<br>", "\r\n");


    if (updateSwimName === '') {
      db.collection("swimAddress").doc(overayId).update({
        day1: updateday1,
        length: updatelength,
      });
      if (updateday1 === "") {
        db.collection("swimAddress").doc(overayId).update({
          day1: day1,
          length: updatelength,
        });
      }

    } else if (updateday1 === '') {
      db.collection("swimAddress").doc(overayId).update({
        swimname: updateSwimName,
        length: updatelength,
      });
    }
    else {
      db.collection("swimAddress").doc(overayId).update({
        swimname: updateSwimName,
        day1: updateday1,
        length: updatelength,

      });
    }



    setTitle(updateSwimName);
    setDay1(updateday1);
    setupdateLength(updatelength);

    setShowmapUpdate("noShow");

    alert('수정되었습니다');
    Mapcontianervisible(true);


  };
  console.log(updatelength)

  const onnewLengthChange = (e) => {
    setupdateLength(e.target.value);
    console.log(updatelength)

  }



  return (


    <div>

      <div id="swimmMap" className='map'  >
      </div>
      {/* <p className='positinon'>{'클릭한 위치의 위도는 ' + latlng.La+ ' 이고, 경도는 ' +latlng.Ma + ' 입니다'}</p> */}

      <div id="clickLatlng"></div>

      {!visible && (<div className='updateAddress' onClick={ShowmapUpdate}><BiEdit /></div>)}

      <div className={`mapUpdate ${showMapUpdate}`}>

        <div className='wave'>
          <div className='wave-inner'>
            <p> 수영장의 자유수영 정보를 입력해주세요. </p>
            <p><b>수영장 이름:</b><input type="text" onChange={event => setupdateSwimName(event.target.value)} defaultValue={updatetitle} /></p>
            <div>
              <input type="radio" id="25m" name="length" value="25m" checked={updatelength === "25m"} onChange={onnewLengthChange} />
              <label for="25m">25m</label>
              &nbsp;&nbsp;
              <input type="radio" id="50m" name="length" value="50m" checked={updatelength === "50m"} onChange={onnewLengthChange} />
              <label for="50m">50m</label>
            </div>


            <div><b>자유 수영 시간, 가격</b></div>

            <textarea type="text" onChange={event => setUpdateDay1(event.target.value)} defaultValue={day1} />

            {/* <input type="file" onChange={handleChange}/> */}
            <button className='btnShare' onClick={newmapUpload}>지도정보공유</button>

          </div>

        </div>
      </div>

      <div className='writeAddress' onClick={funtionShowmapUpload}><BiPencil /></div>
      <MapUpload setShowUploadWindow={setShowUploadWindow} showMapUploadWindow={showMapUploadWindow} La={La} Ma={Ma} />

    </div>




  );
};

export default MapContainer;