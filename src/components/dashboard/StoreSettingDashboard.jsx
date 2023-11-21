import { useContext, useState, useEffect} from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmModal from "./ConfirmModal";
import './StoreSettingDashboard.scss';
import {admin_color, admin_color_sec} from "./variable.js";

const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: 'black',
  },
  '& .MuiInput-underline:after': {
    borderBottomColor: 'black',
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'LightGray',
    },
    '&:hover fieldset': {
      borderColor: 'DarkGray',
    },
    '&.Mui-focused fieldset': {
      borderColor: admin_color,
    },
  },
});

const MenuItemDashboard = ({storeInfo, setStoreInfo, slides, setSlides}) => {

  const { url } = useContext(GeneralContext);

  const [infoForm, setInfoForm] = useState({...storeInfo});
  const [slideForm, setSlideForm] = useState([...slides]);

  const [loading, setLoading] = useState(false);
  const [loadingSlide, setLoadingSlide] = useState(false);

  const [modalInfoIsOpen, setModalInfoIsOpen] = useState(false);
  const [modalSlideIsOpen, setModalSlideIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setInfoForm({...storeInfo});
  },[storeInfo]);

  useEffect(() => {
    setSlideForm([...slides]);
  },[slides]);
  
  const uploadLogo = async e => {
    const name = e.target.name;
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'Mr.Greek.Upload');
    
    setLoading(true);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })
    
    const file = await res.json()
    if (file.secure_url) {
      setInfoForm({ ...infoForm, [name]: `${file.secure_url}` });
    } else {
      setInfoForm({ ...infoForm});
    }
    setLoading(false);
  }

  const uploadSlide = async e => {
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'Mr.Greek.Upload');
    
    setLoadingSlide(true);
    
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })
    
    const file = await res.json()
    if (file.secure_url) {
      const x = [...slideForm];
      x.push(`${file.secure_url}`);
      setSlideForm([...x]);
    }
    setLoadingSlide(false);
  }
  
  const deleteLogo = (e) => {
    setInfoForm({ ...infoForm, logo: "" });
  }

  const deleteSlide = (e) => {
    const index = Number(e.currentTarget.id);
    const newSlides = slideForm.filter((s, i) => {
      return i !== index;
    });
    setSlideForm([...newSlides]);
  }

  const onUpdateInfo = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to update store info?`);
    setModalInfoIsOpen(true);
  }

  const onUpdateSlides = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to update slides?`);
    setModalSlideIsOpen(true);
  }

  const onCancelUpdateInfo = () => {
    setInfoForm({...storeInfo});
  }

  const onCancelUpdateSlides = () => {
    setSlideForm([...slides]);
  }

  const handleChangeUpdateInfo = (event) => {
    const {name, value} = event.target;
    setInfoForm({...infoForm, [name]: value});
  }

  const onConfirmUpdateInfo = () => {
    axios.put(`${url}/api/store-settings`, {...infoForm})
    .then(res => {
      setStoreInfo(res.data.settings[0]);
    })
  }

  const onConfirmUpdateSlide = () => {
    axios.post(`${url}/api/store-settings`, {slides: slideForm})
    .then(res => {
      setSlides(res.data.newSlides);
    })
  }

  const closeModal = () => {
    setModalInfoIsOpen(false);
    setModalSlideIsOpen(false);
  }

  const equal = (arr1, arr2) => {
    if (arr1.length !== arr2.length) {
      return false;
    } else {
      for (let i = 1; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
          return false
        }
      }
      return true;
    }
  }

  return (
    <div className="store-setting-page">
      <Modal
        isOpen={modalInfoIsOpen || modalSlideIsOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
        className="modal"
        shouldCloseOnOverlayClick={false}
      >
        {modalInfoIsOpen && <ConfirmModal onClose={closeModal} msg={msg} onConfirm={onConfirmUpdateInfo}/>}
        {modalSlideIsOpen && <ConfirmModal onClose={closeModal} msg={msg} onConfirm={onConfirmUpdateSlide}/>}
      </Modal>
      <div className="setting-info">
        <span className="title">Store Info</span>
        <form onSubmit={onUpdateInfo} className="setting-form">
          <div className="input-group">
            <span>Store Name: </span>    
            <CssTextField
              // required
              id="storename"
              name="storename"
              // value={addMenuItemForm.item}
              value={infoForm.storename}
              onChange={handleChangeUpdateInfo}
              variant="outlined"
              size="small"
              className="input-name"
            />
          </div>
          <div className="input-group">
            <span>Tel: </span>    
            <CssTextField
              // required
              id="tel"
              name="tel"
              value={infoForm.tel}
              onChange={handleChangeUpdateInfo}
              variant="outlined"
              size="small"
              className="input-tel"
            />
          </div>
          <div className="description">
            <span>Address: </span>
            <div className="input-group">
              <CssTextField
                // required
                id="address"
                name="address"
                multiline
                maxRows={2}
                minRows={1}
                value={infoForm.address}
                onChange={handleChangeUpdateInfo}
                variant="outlined"
                size="small"
                // margin="normal"
                inputProps={{min: 1, style: { textAlign: 'left' }}}
                className="input-address"
              />
            </div>
          </div>
          <div className='image-select'>
            <label htmlFor="file-upload-image" className="custom-file-upload">
              Choose Logo
            </label>
            <input
              id="file-upload-image" 
              type="file"
              name="logo"
              accept={'image/*'} 
              onChange={uploadLogo}
            />
            <div className='loading-image-sign'>
              {loading && <CircularProgress style={{'color': admin_color}}/>}
            </div>
            {infoForm.logo &&
              <div className='img-preview-part'>
                <div className='img-preview'>
                  <img
                    src={infoForm.logo}
                    alt="logo"
                    width="100"
                    height="100"
                    className="img-prev"
                  />
                </div>
                <div onClick={deleteLogo}>
                  <FontAwesomeIcon icon="fa-solid fa-trash-can" className='erase-image'/>
                </div>
              </div>
            }
          </div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelUpdateInfo()}>Cancel</button>
            <button type="submit" className="btn-save">Update</button>
          </div>
        </form>
      </div>
      <div className="setting-slides">
        <span className="title">Home Page Slides:</span>
        <form onSubmit={onUpdateSlides} className="slide-form">
          <div className='slide-select'>
            <label htmlFor="slide" className="custom-file-upload">
              Add Slide
            </label>
            <input
              id="slide" 
              type="file"
              name="slide"
              accept={'image/*'} 
              onChange={uploadSlide}
            />
            <div className='loading-image-sign'>
              {loadingSlide && <LinearProgress sx={{
                  backgroundColor: admin_color_sec,
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: admin_color
                  }
                }}/>
              }
            </div>
          </div>
          {slideForm.length ? 
            <div className="show-slides-part">
            {slideForm.map((src, index) => {
              return(
                <div className="show-slide-row" key={index}>
                  <span className="slide-num">Slide {index + 1} :</span>
                  <div className="img-del">
                    <img src={src} alt={`slide ${index + 1}`} key={index} className="slide-preview"/>
                    <div onClick={deleteSlide} id={index}>
                      <FontAwesomeIcon icon="fa-solid fa-trash-can" className='erase-image'/>
                    </div>
                  </div>
                </div>
                )
              })}
            </div> : 
            <span className="slide-text">There is no slide!</span>
          }
          <div className="buttons">
            <button 
              type="button"
              className={ equal(slides, slideForm) ? "btn-cancel deactive" : "btn-cancel"}
              onClick={() => onCancelUpdateSlides()} 
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">Update</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MenuItemDashboard;