import React from "react";

const Modal = ({
  modalIsOpen,
  openModal,
  closeModal,
  modalContent,
  buttonText,
}) => {
  return (
    <>
      <button
        className="modal-button"
        id="modalButton"
        onClick={openModal}
        aria-controls="modal"
        aria-expanded={modalIsOpen}
      >
        {buttonText}
      </button>

      {modalIsOpen ? (
        <>
          <div className="modal" id="modal">
            <div className="modal-background" onClick={closeModal}></div>
            <div className="modal-content">
              <button className="close" onClick={closeModal}>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                >
                  <title>Close</title>
                  <path d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path>
                </svg>
                <span className="screen-reader-text">Close</span>
              </button>

              {modalContent}
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export default Modal;
