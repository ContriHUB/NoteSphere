import React, { useContext, useEffect, useRef,useState } from "react";
import noteContext from "../context/notes/noteContext";
import Noteitem from "./Noteitem";
import AddNote from "./AddNote";
import { useNavigate } from "react-router-dom";
import imageCompression from "browser-image-compression";
export default function Notes(props) {
  const context = useContext(noteContext);
  const { notes, getNotes,editNote } = context;
  const navigate = useNavigate();
  useEffect(() => {
    if(localStorage.getItem('token')){
      console.log(localStorage.getItem('token'))
      getNotes()
    } else {
      navigate("/login")
    }
    
  }, []);
  const [loading, setLoading] = useState(false); // Initialize loading state

  const [note,setnote] = useState({id:"",etitle:"",edescription:"",etag:"default",eimage:null //added image field
  });
  const buttonref = useRef(null);
  const refclose = useRef(null);
  const confirmButtonRef = useRef(null); // For Confirmation Modal
  const refCloseConfirm = useRef(null); // To close Confirmation Modal
  const updateNote = (currentNote) => {
    confirmButtonRef.current.click();
    setnote({id:currentNote._id,etitle:currentNote.title,edescription:currentNote.description,etag:currentNote.tag,
    eimage:null,//reset image field
    });
    
  };
  //updated handleclick function
  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("updating note", note);

    let compressedImage = note.eimage;
    if (note.eimage) {
      try {
        compressedImage = await imageCompression(note.eimage, {
          maxSizeMB: 1, // Maximum size in MB
          maxWidthOrHeight: 1920, // Max width or height
          useWebWorker: true,
        });
      } catch (error) {
        console.error("Error compressing image:", error);
        props.showAlert("Error compressing image.", "danger");
        setLoading(false);
        return;
      }
    }

    try {
      // Call editNote from context with compressed image
      await editNote(
        note.id,
        note.etitle,
        note.edescription,
        note.etag,
        compressedImage
      );
      props.showAlert("Note updated successfully!", "success");
    } catch (error) {
      props.showAlert(error.message, "danger");
    }

    setLoading(false);
    refclose.current.click();
  };
  //updated onchange function
  const onChange = (e) => {
    if (e.target.name === "eimage") {
      setnote({ ...note, [e.target.name]: e.target.files[0] });
    } else {
      setnote({ ...note, [e.target.name]: e.target.value });
    }
  };

  return (
    <>
      <AddNote showAlert={props.showAlert}/>
      {/* Hidden button to trigger Confirmation Modal */}
      <button
        ref={confirmButtonRef}
        type="button"
        className="btn btn-secondary d-none"
        data-toggle="modal"
        data-target="#confirmModal"
      >
        Launch Confirmation Modal
      </button>
      {/* Confirmation Modal */}
      <div
        className="modal fade"
        id="confirmModal"
        tabIndex="-1"
        aria-labelledby="confirmModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog bg-white rounded-lg shadow-lg p-2">
          <div className="modal-content">
            <div className="modal-header border-b-2 border-blue-400 pb-2">
              <h5 className="modal-title text-lg font-semibold" id="confirmModalLabel">
                Confirm Edit
              </h5>
              <button
                type="button"
                className="btn "
                data-dismiss="modal"
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark-circle ">
                </i>
              </button>
            </div>
            <div className="modal-body">
              Are you sure you want to edit this note?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="px-3 py-2 bg-gray-500 text-white rounded-sm cursor-pointer hover:bg-gray-600 transition duration-200"
                data-dismiss="modal"
                ref={refCloseConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-3 py-2 bg-blue-400 text-white rounded-sm cursor-pointer hover:bg-blue-600 transition duration-200"
                onClick={() => {
                  // Close Confirmation Modal
                  refCloseConfirm.current.click();
                  // Open Edit Note Modal
                  buttonref.current.click();
                }}
              >
                Yes, Edit
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Hidden button to trigger Edit Note Modal */}
      <button
        ref={buttonref}
        type="button"
        className="btn btn-primary d-none"
        data-toggle="modal"
        data-target="#exampleModal"
      >
        Launch demo modal
      </button>

      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title p-1 text-lg  text-gray-700" id="exampleModalLabel">
                Edit Note
              </h5>
              <button
                type="button"
                className="btn"
                data-dismiss="modal" //to close the modal
                aria-label="Close"
              >
                <i className="fa-solid fa-xmark-circle "> 
                </i> {/*Cross icon */}
              </button>
            </div>
            <form className="my-1 mx-4" enctype="multipart/form-data">{/*To handle file uploads */}
              <div className="mb-3 ">
                <label for="title" className="form-label text-md text-gray-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  className="form-control w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  id="etitle"
                  name="etitle"
                  aria-describedby="emailHelp"
                  value={note.etitle}
                  required onChange={onChange}
                  minLength={3}
                />
                <div id="emailHelp" className="form-text text-sm text-gray-500">
                  We'll never share your email with anyone else.
                </div>
              </div>
              <div className="mb-3">
                <label for="desc" className="form-label text-md text-gray-500">
                  Description
                </label>
                <input
                  type="text"
                  className="form-control w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  id="edescription"
                  name="edescription"
                  value={note.edescription}
                  required onChange={onChange}
                  minLength={5}
                />
              </div>
              <div className="mb-3">
                <label for="tag" className="form-label text-md text-gray-500">
                  Tag
                </label>
                <input
                  type="text"
                  className="form-control w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  id="etag"
                  name="etag"
                  value={note.etag}
                  onChange={onChange}
                />
              </div>
              {/* Input for file upload */}
              <div className="mb-3">
                <label htmlfor="eimage" className="form-label text-md text-gray-500">
                  Upload Image
                </label>
                <input
                  type="file"
                  className="form-control w-full px-3 py-1 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  id="eimage"
                  name="eimage"
                  accept="image/*"
                  onChange={onChange}
                />
              </div>
            </form>
            <div className="modal-footer">
              <button
                ref={refclose}
                type="button"
                className="px-3 py-2 bg-gray-500 text-white rounded-sm cursor-pointer hover:bg-gray-600 transition duration-200"
                data-dismiss="modal"
              >
                Close
              </button>
              <button disabled={note.etitle.length<3 || note.edescription.length<5} onClick={handleClick} type="button" className="px-3 py-2 bg-blue-400 text-white rounded-sm cursor-pointer hover:bg-blue-600 transition duration-200">
                Update Note
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
      <h3 className="text-3xl  text-gray-700 text-center my-2 px-3">
      Your Feedbacks
      </h3>
        <div className="container mx-2">
        {notes.length===0 && 'No feedbacks yet'}
        </div>
        {notes.map((note) => {
          return (
            <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />
          );
        })}
      </div>
    </>
  );
}
