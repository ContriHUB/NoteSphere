import React, { useContext,useEffect,useState } from "react";
import NoteContext from "../context/notes/noteContext";

const Noteitem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;
  const { note,updateNote } = props;
  const [imageUrl, setImageUrl] = useState(null); //for image
  useEffect(() => {
    if (note._id) {
        fetchImage();
    }
    // eslint-disable-next-line
}, [note]);
    //fetchimage function
    const fetchImage = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/notes/fetchimagenote/${note._id}`, {
                method: 'GET',
                headers: {
                    'auth-token': localStorage.getItem('token'),
                },
            });

            if (response.ok) {
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                setImageUrl(url);
            } else {
                // No image found or error
                setImageUrl(null);
            }
        } catch (error) {
            console.error("Error fetching image:", error);
            setImageUrl(null);
        }
    };

  return (
    <div className="col md-3 col-lg-4">{/*for UI */}
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">{/*for UI */}
            <h5 className="card-title">{note.title}</h5>
            <div>{/*for UI */}
            <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted Successfully","danger");}} ></i>
            <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
            </div>
          </div>

          <p className="card-text">{note.description}</p>
          {/* adding image in the notes */}
          {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Note"
                            className="img-fluid"
                            style={{
                              width: "300px", // Set your desired width
                              height: "300px", // Set your desired height
                              objectFit: "cover", // Ensures the image covers the container without distortion
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              padding: "3px",
                            }}
                            
                        />
                    )}
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
