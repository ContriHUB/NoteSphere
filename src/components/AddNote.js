import React, { useContext, useState } from 'react';
import NoteContext from '../context/notes/noteContext';

const AddNote = (props) => {
    const context = useContext(NoteContext);
    const { addNote } = context;
    const [note, setnote] = useState({ title: "", description: "", tag: "" });

    const handleClick = (e) => {
        e.preventDefault();
        addNote(note.title, note.description, note.tag);
        setnote({ title: "", description: "", tag: "" });
        props.showAlert("Added Successfully", "success");
    }

    const onChange = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value });
    }

    return (
        <div
        className="w-full h-screen"
        style={{
          backgroundImage:
            "url('https://i1.wp.com/wallpapercave.com/wp/wp9537343.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Note form container */}
        <div className="w-3/4 flex items-center justify-center h-screen bg-white bg-opacity-25 shadow-lg p-20">
          <div className="w-full px-20">
            <h3 className="text-4xl  text-gray-700 mb-3">Add Your Note</h3>
            <form onSubmit={handleClick} autoComplete="off">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm text-gray-500 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="block w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  placeholder="Enter title"
                  value={note.title}
                  onChange={onChange}
                  required
                  minLength={3}
                />
                <small className="text-gray-500">
                  Add a relevant title to your note.
                </small>
              </div>
  
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm text-gray-500 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  className="block w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  placeholder="Enter description"
                  value={note.description}
                  onChange={onChange}
                  required
                  minLength={5}
                />
              </div>
  
              <div className="mb-6">
                <label htmlFor="tag" className="block text-sm text-gray-500 mb-1">
                  Tag
                </label>
                <input
                  type="text"
                  id="tag"
                  name="tag"
                  className="block w-full px-3 py-2 bg-zinc-100 border border-zinc-200 rounded-md mb-2"
                  placeholder="Enter tag"
                  value={note.tag}
                  onChange={onChange}
                />
              </div>
  
              <button
                disabled={note.title.length < 3 || note.description.length < 5}
                type="submit"
                className="px-5 py-3 w-full bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 transition duration-200"
              >
                Add Note
              </button>
            </form>
          </div>
        </div>
      </div>
    );
}

export default AddNote;
