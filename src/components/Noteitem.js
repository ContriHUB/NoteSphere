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
    <div className="col-md-3 col-lg-4">{/*for UI */}
      <div className="card border border-gray-300 rounded-lg  my-2 bg-white shadow hover:shadow-lg transition-shadow duration-200">
        <div className="card-body ">
          <div className="card-header d-flex align-items-center justify-content-between">
            {/*for UI */}
            <div className="  d-flex justify-content-end align-items-center">
          <i className="fa-solid fa-feather-pointed mb-1 mr-1" ></i>
          <h5 className="card-title font-bold text-xl text-gray-800 " >{note.title}</h5>
        </div>
            <div className="mb-2">{/*for UI */}
            <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);props.showAlert("Deleted Successfully","danger");}} ></i>
            <i className="fa-solid fa-pen-to-square mx-2" onClick={()=>{updateNote(note)}}></i>
            </div>
          </div>

          <p className="card-text mt-1 ml-2 text-gray-700">{note.description}</p>
          {/* adding image in the notes */}
          {imageUrl && (<div className="flex justify-center items-center mt-2">
                        <img
                            src={imageUrl}
                            alt="Note"
                            className="img- rounded-sm"
                            style={{
                              width: "300px", // Set your desired width
                              height: "300px", // Set your desired height
                              objectFit: "cover", // Ensures the image covers the container without distortion
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              // padding: "3px",
                            }}
                            
                        /></div>
                    )}
        <footer className="blockquote-footer">
            {/* {note.tag} */}
              <cite title="Source Title">
                <i className="fa-solid fa-tag mx-1"></i>
                {note.date.slice(0,10)}
              </cite>
            </footer>
        </div>
      </div>
    </div>
  );
};

export default Noteitem;
