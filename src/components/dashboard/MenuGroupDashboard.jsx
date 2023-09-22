import { useContext, useState } from "react";
import axios from "axios";
import Modal from 'react-modal';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';

import GeneralContext from "../../contexts/GeneralContext";
import ConfirmAddModal from "./ConfirmAddModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import ConfirmEditModal from "./ConfirmEditModal";
import './MenuGroupDashboard.scss';

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
      borderColor: 'Goldenrod',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'LightSeaGreen',
    },
  },
});

const MenuGroupDashboard = ({setMenuGroups}) => {

  const { menuGroups, url } = useContext(GeneralContext);

  const [addGroupForm, setAddGroupForm] = useState({name: ""});
  const [editGroupForm, setEditGroupForm] = useState({id:"", name: ""});
  const [deletedGroup, setDeletedGroup] = useState("");

  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalEditIsOpen, setModalEditIsOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  console.log(addGroupForm);

  const onReqEdit = (rId, rName) => {
    setEditGroupForm({id: rId, name: rName });
    setShowEdit(true);
  }

  const onAdd = (event) => {
    event.preventDefault();
    setMsg(`Are you ready to add new service group?`);
    setModalAddIsOpen(true);
  }
  
  const onEdit = (event) => {
    event.preventDefault();
    setMsg(`Are you sure you want to save changes?`);
    setModalEditIsOpen(true);
  }

  const onDelete = (rId, rName) => {
    setDeletedGroup(rId);
    setMsg(`Are you sure you want to delete the ${rName} menu group and all items that are related to that?`);
    setModalDeleteIsOpen(true);
  }

  const onCancelAdd = () => {
    setAddGroupForm({name: "" });
  }

  const onCancelEdit = () => {
    setEditGroupForm({id: "", name: "" });
    setShowEdit(false);
  }

  const handleChangeAdd = (event) => {
    const value = event.target.value;
    setAddGroupForm({name: value})
  }

  const handleChangeEdit = (event) => {
    const value = event.target.value;
    setEditGroupForm({...editGroupForm, name: value})
  }

  const onConfirmAdd = () => {
    axios.post(`${url}/api/menu-groups`, {group: addGroupForm})
    .then(res => {
      setMenuGroups(res.data.updateGroups);
    })
    setAddGroupForm({name: ""});
  }

  const onConfirmEdit = () => {
    axios.put(`${url}/api/menu-groups`, {group: editGroupForm})
    .then(res => {
      const newGroup = menuGroups.map(row => {
        return (row.id === res.data.updated.id ? {...row, name: res.data.updated.name} : row)
      });
      setMenuGroups(newGroup)
    })
    setEditGroupForm({id: "", name: ""});
    // setShowStatus({add: false, edit: false});
  }

  const onConfirmDelete = () => {
    axios.delete(`${url}/api/menu-groups/${deletedGroup}`)
    .then(res => {
      const newGroup = menuGroups.filter(row => row.id !== res.data.deleted.id);
      setMenuGroups(newGroup);
    })
    setDeletedGroup("");
  }

  const closeModal = () => {
    setModalDeleteIsOpen(false);
    setModalEditIsOpen(false);
    setModalAddIsOpen(false);
  }

  const groupNameArr = menuGroups.map(row => {
    const cssMenuGroup = showEdit && editGroupForm.id === row.id ? "menu-group menu-group-select" : "menu-group";
    const cssEditGroupMenu = showEdit && editGroupForm.id === row.id ? "edit-group-menu edit-group-menu-select" : "edit-group-menu";
    return (
      <div key={row.id}>
        <div className={cssMenuGroup}>
          <div className="group-name">
            <span>{row.name}</span>
          </div>
          <div className="buttons">
            <button className="btn-edit" onClick={() => onReqEdit(row.id, row.name)}><FontAwesomeIcon icon="fa-solid fa-pencil" /></button>
            <button className="btn-delete" onClick={() => onDelete(row.id, row.name)}><FontAwesomeIcon icon="fa-solid fa-trash" /></button>
          </div>
        </div>

        <div className={cssEditGroupMenu}>
          <form onSubmit={onEdit} className='edit-form'>      
            <CssTextField
              required
              id="name"
              name="name"
              value={editGroupForm.name}
              onChange={handleChangeEdit}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
            <div className="buttons">
              <button type="button" className="btn-edit-cancel" onClick={() => onCancelEdit()}><FontAwesomeIcon icon="fa-solid fa-ban" /></button>
              <button type="submit" className="btn-edit-save"><FontAwesomeIcon icon="fa-solid fa-floppy-disk" /></button>
            </div>
          </form>
        </div>

      </div>
    )
  })

  return (
    <div className="menu-group-dashboard-page">
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
      <div className="add-group-part">
        <span className="title">Add new menu group</span>
        <form onSubmit={onAdd} className="add-form"> 
          <div className="input-group">
            <span>Name: </span>    
            <CssTextField
              required
              id="name"
              name="name"
              value={addGroupForm.name}
              onChange={handleChangeAdd}
              variant="outlined"
              size="small"
              margin="normal"
              className="input-text"
            />
          </div>
          <div className="buttons">
            <button type="button" className="btn-cancel" onClick={() => onCancelAdd()}>Cancel</button>
            <button type="submit" className="btn-save">Save</button>
          </div>
        </form>
      </div>
      <div className="title-2">Menu Groups</div>
      {groupNameArr}      
    </div>
  )
}

export default MenuGroupDashboard;