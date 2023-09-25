import { useContext, useState, useEffect, useRef} from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './MenuItemDashboard.scss';

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

const MenuItemDashboard = ({setMenuItems}) => {

  const { menuGroups, menuItems, url } = useContext(GeneralContext);
  
  const [addMenuItemForm, setAddMenuItemForm] = useState({groupId:"", item:"", price:"", description:"", image:""});
  const [editMenuItemForm, setEditMenuItemForm] = useState({id:"", groupId:"", item:"", price:"", description:"", image:""});
  const [searchForm, setSearchForm] = useState({id: ""});
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
  
  const uploadImage = async e => {
    const name = e.target.name;
    const files = e.target.files;
    const data = new FormData();
    data.append('file', files[0])
    data.append('upload_preset', 'Mr.Greek.Upload')

    setLoading(true);

    // const res = await fetch(`https://api.cloudinary.com/v1_1/demoshoebox/image/upload`,
    const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
    {
      method: 'post',
      body: data
    })

    const file = await res.json()
    if (file.secure_url) {
      setAddMenuItemForm({ ...addMenuItemForm, [name]: `${file.secure_url}` })
    } else {
      setAddMenuItemForm({ ...addMenuItemForm})
    }
    setLoading(false);
    setErrorMsg("");
  }

  const deleteImage = (e) => {
    const name = e.currentTarget.id;
    setAddMenuItemForm({ ...addMenuItemForm, [name]: "" });
    inputRef.current.value = null;
  }

  const groupsArr = menuGroups.map(row => {
    return (
      <MenuItem key={row.id} value={row.id} >{row.group}</MenuItem>
    )
  });

  const onReqEdit = (id, groupid, item, price, description) => {
    setEditMenuItemForm({id, groupId: groupid, item, price, description});
    setSearchForm({id: ""});
  }
  
  const onAdd = (event) => {
    event.preventDefault();
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    if (!regexPrice.test(addMenuItemForm.price)) {
      setErrorMsgAdd('Please insert valid price!');
    } else {
      setMsg(`Are you ready to add new item?`);
      setModalAddIsOpen(true);
    }
  }

  const onEdit = (event) => {
    event.preventDefault();
    const regexPrice = /^\d+(\.\d{1,2})?$/;
    if (!regexPrice.test(editMenuItemForm.price)) {
      setErrorMsgEdit('Please insert valid price!');
    } else {
      setMsg(`Are you sure you want to save changes?`);
      setModalEditIsOpen(true);
    }
  }

  const onDelete = (rId, rName) => {
    setDeletedMenuItem(rId);
    setMsg(`Are you sure you want to delete the ${rName} item?`);
    setModalDeleteIsOpen(true);
  }

  const onCancelAdd = () => {
    setAddMenuItemForm({groupId:"", item:"", price:"", description:""});
    setErrorMsgAdd("");
  }

  const onCancelEdit = () => {
    setSearchForm({id: editMenuItemForm.id});
    setEditMenuItemForm({id:"", groupId:"", item:"", price:"", description:""});
    setErrorMsgEdit("");
  }

  const handleChangeAdd = (event) => {
    const {name, value} = event.target;
    setAddMenuItemForm({...addMenuItemForm, [name]: value});
    setErrorMsgAdd("");
  }

  const handleChangeEdit = (event) => {
    const {name, value} = event.target;
    setEditMenuItemForm({...editMenuItemForm, [name]: value});
    setErrorMsgEdit("");
  }

  const handleChangeSearch = (event) => {
    const value = event.target.value;
    setEditMenuItemForm({id:"", groupId:"", item:"", price:"", description:""});
    setSearchForm({id: value});
  }

  const onConfirmAdd = () => {
    axios.post(`${url}/api/menu-items`, {...addMenuItemForm, item: addMenuItemForm.item.trim(), description: addMenuItemForm.description.trim()})
    .then(res => {
      setMenuItems(res.data.newMenuItems);
    })
    setAddMenuItemForm({groupId:"", item:"", price:"", description:""});
  }

  const onConfirmEdit = () => {
    axios.put(`${url}/api/menu-items`, {...editMenuItemForm, item: editMenuItemForm.item.trim(), description: editMenuItemForm.description.trim()})
    .then(res => {
      setMenuItems(res.data.newMenuItems);
    })
    setEditMenuItemForm({id:"", groupId:"", item:"", price:"", description:""});
  }

  const onConfirmDelete = () => {
    axios.delete(`${url}/api/menu-items/${deletedMenuItem}`)
    .then(res => {
      const newMenuItems = menuItems.filter(row => row.id !== res.data.deleted.id);
      setMenuItems(newMenuItems);
    })
    setSearchForm({id: ""})
    setEditMenuItemForm({id:"", groupId:"", item:"", price:"", description:""});
    setDeletedMenuItem("");
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  const menuItemDetails = menuItems.filter(item => item.id === searchForm.id)
  .map(row => {
    return (
      <div key={row.id} className="show-item">
        <div className="name-price text-name-price">
          <div className="input-group">
            <span className="name-field">Name: </span>    
            <div className="input-name">{row.item}</div>
          </div>
          <div className="input-group">
            <span className="name-field">Price: </span>    
            <div className="input-price">${row.price / 100}</div>
          </div>
        </div>
        <div className="group text-group">
          <div className="input-group">
            <span className="name-field">Group: </span> 
            <div className="select-group">{row.group}</div>   
          </div>
        </div>
        <div className="description text-description">
          <span className="name-field">Description: </span> 
          <div className="input-group">
            <div className="input-description">{row.description}</div>   
          </div>
        </div>
        <div>
          <button className="btn-edit" onClick={() => onReqEdit(row.id, row.groupid, row.item, row.price / 100, row.description)}><FontAwesomeIcon icon="fa-solid fa-pencil" /></button>
          <button className="btn-delete" onClick={() => onDelete(row.id, row.name)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
        </div>
      </div>
    )
  })

  return (
    <div className="menu-item-dashboard-page">
      <Modal
        isOpen={modalDeleteIsOpen || modalEditIsOpen || modalAddIsOpen}
        onRequestClose={closeModal}
        appElement={document.getElementById('root')}
        className="modal"
        shouldCloseOnOverlayClick={false}
      >
        {modalAddIsOpen && <ConfirmAddModal onClose={closeModal} msg={msg} onConfirmAdd={onConfirmAdd}/>}
        {modalDeleteIsOpen && <ConfirmDeleteModal onClose={closeModal} msg={msg} onConfirmDelete={onConfirmDelete}/>}
        {modalEditIsOpen && <ConfirmEditModal onClose={closeModal} msg={msg} onConfirmEdit={onConfirmEdit}/>}
      </Modal>
      <div className="add-menu-item-part">
        <span className="title">Add new item</span>
        {!menuGroups.length &&
        <div>You have to add menu group at first!</div>
        }
        <form onSubmit={onAdd} className="add-form">
          <div className="name-price">
            <div className="input-group">
              <span>Name: </span>    
              <CssTextField
                required
                id="item"
                name="item"
                value={addMenuItemForm.item}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                className="input-name"
              />
            </div>
            <div className="input-group">
              <span>Price: </span>    
              <CssTextField
                required
                id="price"
                name="price"
                type='number'
                value={addMenuItemForm.price}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                InputProps={{
                  startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                }}
                className="input-price"
              />
            </div>
          </div>
          <div className="group">
            <div className="input-group">
              <span>Group: </span>    
              <CssSelect
                required
                id="groupId"
                name="groupId"
                value={addMenuItemForm.groupId}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                className="select-group"
                MenuProps={MenuProps}
              >
                {groupsArr}
              </CssSelect>
            </div>
          </div>
          <div className='image-select'>
            <label htmlFor="file-upload-image" className="custom-file-upload">
              Choose Image
            </label>
            <input
              id="file-upload-image" 
              type="file"
              name="image"
              accept={'image/*'} 
              onChange={uploadImage}
              ref={inputRef}
            />
            <div className='loading-image-sign'>
              {/* {loading && <CircularProgress style={{'color': 'LightSeaGreen'}}/>} */}
            </div>
            {addMenuItemForm.image &&
              <div className='img-preview-part'>
                <div className='img-preview'>
                  <img
                    src={addMenuItemForm.image}
                    alt="image1"
                    width="80"
                    height="80"
                  />
                </div>
                <div id='image' onClick={deleteImage}>
                  <FontAwesomeIcon icon="fa-solid fa-trash-can" className='erase-image'/>
                </div>
              </div>
            }
            {/* {errorMsg && 
              <FormHelperText style={{'color': 'red'}}>{errorMsg}</FormHelperText>
            } */}
          </div> 
          <div className="description">
            <span>Description: </span>
            <div className="input-group">
              <CssTextField
                // required
                id="description"
                name="description"
                multiline
                maxRows={10}
                minRows={3}
                value={addMenuItemForm.description}
                onChange={handleChangeAdd}
                variant="outlined"
                size="small"
                // margin="normal"
                inputProps={{min: 1, style: { textAlign: 'left' }}}
                className="input-description"
              />
            </div>
          </div>
          <div className="error-msg">{errorMsgAdd}</div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
      <div className="search-menu-item-part">
        <span className="title-2">Search service: </span>
        <CssSelect
          required
          id="id"
          name="id"
          value={searchForm.id}
          onChange={handleChangeSearch}
          variant="outlined"
          size="small"
          className="search-item"
          MenuProps={MenuProps}
        >
          <MenuItem value="">
            <em> --- </em>
          </MenuItem>
          {menuItems.map(row => {
            return (
              <MenuItem key={row.id} value={row.id} >{row.item}</MenuItem>
            )})
          }
        </CssSelect>
      </div>
      <div>
        {searchForm.id && 
          <div className="show-menu-item-part">
            {menuItemDetails}
          </div>
        }
        {editMenuItemForm.id &&
          <div className="edit-menu-item-part">
            <span className="title">Edit Item</span>
            <form onSubmit={onEdit} className="add-form">
              <div className="name-price">
                <div className="input-group">
                  <span className="name-field">Name: </span>    
                  <CssTextField
                    required
                    id="item"
                    name="item"
                    value={editMenuItemForm.item}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="input-name"
                  />
                </div>
                <div className="input-group">
                  <span className="name-field">Price: </span>    
                  <CssTextField
                    required
                    id="price"
                    name="price"
                    type='number'
                    value={editMenuItemForm.price}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    InputProps={{
                      startAdornment: (<InputAdornment position="start">$</InputAdornment>)
                    }}
                    className="input-price"
                  />
                </div>
              </div>
              <div className="group">
                <div className="input-group">
                  <span>Group: </span>    
                  <CssTextField
                    required
                    id="groupId"
                    name="groupId"
                    value={editMenuItemForm.groupId}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    className="select-group"
                    MenuProps={MenuProps}
                  >
                    {groupsArr}
                  </CssTextField>
                </div>
              </div>
              <div className="description">
                <span className="name-field">Description: </span>
                <div className="input-group">
                  <CssTextField
                    id="description"
                    name="description"
                    multiline
                    maxRows={10}
                    minRows={3}
                    value={editMenuItemForm.description}
                    onChange={handleChangeEdit}
                    variant="outlined"
                    size="small"
                    inputProps={{min: 1, style: { textAlign: 'left' }}}
                    className="input-description"
                  />
                </div>
              </div>
              <div className="error-msg">{errorMsgEdit}</div>
              <div className="buttons">
                <button type="button" className="btn-cancel" onClick={() => onCancelEdit()}>Cancel</button>
                <button type="submit" className="btn-save">Save</button>
              </div>
            </form>
          </div>
        }
      </div>
    </div>
  )
}

export default MenuItemDashboard;