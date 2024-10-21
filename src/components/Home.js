import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import Notes from "./Notes";

export const Home = (props) => {
  const { showAlert } = props;
  // using state hooks for warning modal, login, signup and notes page
  const [showNotes, setShowNotes] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSignUp, setShowSignUp] =useState(false);
  const [showLogin, setShowLogin] =useState(false);

  //callbacks to change states on click of buttons in warning modal
  const handleNavigateToSignUp = () => {
    setShowModal(false);
    setShowSignUp(true);
  };
  const handleNavigateToLogin = () => {
    setShowModal(false);
    setShowLogin(true);
  };

  // effect hook to check if the user is logged in or not
  //if logged in then show notes page
  //else show warning modal
  useEffect(() => {
    if(localStorage.getItem('token')){
      console.log(localStorage.getItem('token'))
      setShowNotes(true);
    } else {
      setShowModal(true);
    }
    
  }, []);

  return (
    // warning modal with 3 buttons
    <div>
      <div className={`modal fade in ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Warning</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <p>Access Denied: You must be logged in to view the homepage. Please log in or sign up to continue.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleNavigateToLogin}>Login</button>
              <button type="button" className="btn btn-primary" onClick={handleNavigateToSignUp}>Signup</button>
            </div>
          </div>
        </div>
      </div>
      
      {/* page content change according to the state change */}
      {showNotes && <Notes showAlert={showAlert} />}
      {showSignUp && <Navigate to={"/signup"}/>}
      {showLogin && <Navigate to={"/login"}/>}
    </div>
  );
};
