import './ConfirmModal.scss'

const ConfirmModal = ({onClose, msg, onConfirm}) => {

  return (
    <div className='confirm-delete-appointment-modal'>
      <div className='confirm-msg'>
        <span>{msg}</span>
      </div>
      <div className="buttons">
        <button className="btn-cancel" onClick={() => onClose()} >Cancel</button>
        <button 
          className="btn-confirm"
          onClick={() => {
            onConfirm();
            onClose();
            }}>
            Confirm
        </button>
      </div>
    </div>
  )
}

export default ConfirmModal;