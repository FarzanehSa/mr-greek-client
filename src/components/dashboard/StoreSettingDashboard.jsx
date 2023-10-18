import { useContext, useState, useEffect, useRef} from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { cyan } from '@mui/material/colors';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './StoreSettingDashboard.scss';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

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
      borderColor: 'MediumPurple',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'LightSeaGreen',
    },
  },
});

const CssSelect = styled(Select)({
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "LightGray"
    },
    "&:hover fieldset": {
      borderColor: "MediumPurple"
    },
    "&.Mui-focused fieldset": {
      borderColor: "LightSeaGreen"
    },
  }
});

const MenuItemDashboard = ({setMenuItems, storeInfo, setStoreInfo}) => {

  const { menuGroups, menuItems, url } = useContext(GeneralContext);

  const [infoForm, setInfoForm] = useState({...storeInfo});
  
  
  const [addMenuItemForm, setAddMenuItemForm] = useState({groupId:"", item:"", price:"", description:"", image:""});
  const [addFeaturesForm, setAddFeaturesForm] = useState([]);
  const [editMenuItemForm, setEditMenuItemForm] = useState({id:"", groupId:"", item:"", price:"", description:"", image:""});
  const [editFeaturesForm, setEditFeaturesForm] = useState([]);
  const [deletedMenuItem, setDeletedMenuItem] = useState("");

  const [errorMsgAdd, setErrorMsgAdd] = useState("");
  const [errorMsgEdit, setErrorMsgEdit] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingInEdit, setLoadingInEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  // 🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻
  console.log(infoForm);
  
  const uploadImage = async e => {
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
    setErrorMsg("");
  }
  
  const deleteImage = (e) => {
    const name = e.currentTarget.id;
    setInfoForm({ ...infoForm, [name]: "" });
    inputRef.current.value = null;
  }

  const onSave = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to add update store info?`);
    setModalAddIsOpen(true);
  }

  const onCancelSave = () => {
    setInfoForm({...storeInfo});
  }

  const handleChangeSave = (event) => {
    const {name, value} = event.target;
    setInfoForm({...infoForm, [name]: value});
  }
  
  // 🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻🔺🔻


  const changeImage = async e => {
    const name = e.target.name;
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0]);
    data.append('upload_preset', 'Mr.Greek.Upload');

    setLoadingInEdit(true);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })

    const file = await res.json()
    if (file.secure_url) {
      setEditMenuItemForm({ ...editMenuItemForm, [name]: `${file.secure_url}` })
    } else {
      setEditMenuItemForm({ ...editMenuItemForm})
    }
    setLoadingInEdit(false);
    setErrorMsgEdit("");
  }
  
  

  



  const onConfirmAdd = () => {
    axios.post(`${url}/api/store-setting`, {...addMenuItemForm, item: addMenuItemForm.item.trim(), description: addMenuItemForm.description.trim(), features:[...addFeaturesForm]})
    .then(res => {
      setMenuItems(res.data.newMenuItems);
    })
    setAddMenuItemForm({groupId:"", item:"", price:"", description:"", image:""});
    setAddFeaturesForm(addFeaturesForm.map(row => {return ({...row, select: false})}));
  }

  const onConfirmEdit = () => {
    axios.put(`${url}/api/menu-items`, {...editMenuItemForm, item: editMenuItemForm.item.trim(), description: editMenuItemForm.description.trim(), features:[...editFeaturesForm]})
    .then(res => {
      setMenuItems(res.data.newMenuItems);
    })
    setEditMenuItemForm({id:"", groupId:"", item:"", price:"", description:"", image:""});
    setEditFeaturesForm([]);
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  return (
    <div className="store-setting-page">
      <Modal
        isOpen={modalDeleteIsOpen || modalEditIsOpen || modalAddIsOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
        className="modal"
        shouldCloseOnOverlayClick={false}
      >
        {modalAddIsOpen && <ConfirmAddModal onClose={closeModal} msg={msg} onConfirmAdd={onConfirmAdd}/>}
        {modalEditIsOpen && <ConfirmEditModal onClose={closeModal} msg={msg} onConfirmEdit={onConfirmEdit}/>}
      </Modal>
      <div className="setting-data">
        <span className="title">Store Info</span>
        <form onSubmit={onSave} className="setting-form">
          <div className="input-group">
            <span>Store Name: </span>    
            <CssTextField
              // required
              id="storename"
              name="storename"
              // value={addMenuItemForm.item}
              value={infoForm.storename}
              onChange={handleChangeSave}
              variant="outlined"
              size="small"
              className="input-name"
            />
          </div>
          <div className="input-group">
            <span>Tel: </span>    
            <CssTextField
              required
              id="tel"
              name="tel"
              value={infoForm.tel}
              onChange={handleChangeSave}
              variant="outlined"
              size="small"
              className="input-price"
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
                onChange={handleChangeSave}
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
              onChange={uploadImage}
              ref={inputRef}
            />
            <div className='loading-image-sign'>
              {loading && <CircularProgress style={{'color': 'LightSeaGreen'}}/>}
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
                <div id='image' onClick={deleteImage}>
                  <FontAwesomeIcon icon="fa-solid fa-trash-can" className='erase-image'/>
                </div>
              </div>
            }
            {errorMsg && 
              <FormHelperText style={{'color': 'red'}}>{errorMsg}</FormHelperText>
            }
          </div>

          <div className="error-msg">{errorMsgAdd}</div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelSave()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MenuItemDashboard;