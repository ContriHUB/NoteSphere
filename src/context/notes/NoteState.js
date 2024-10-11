

import { useState } from "react";
import NoteContext from "./noteContext";


const NoteState = (props)=>{
    const host ='http://localhost:5000';
    const notesInitial = []
    const [notes,setnotes] = useState(notesInitial)

    const getNotes = async () => {
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'auth-token': localStorage.getItem('token') // Make sure token is valid
            },
            credentials: 'include', // Include credentials (e.g., cookies)
            mode: 'cors'            // Cross-Origin mode
        });
    
        if (!response.ok) {
            console.error('Failed to fetch notes:', response.status);
            return;
        }
    
        const json = await response.json();
        // console.log(JSON.stringify(json));
        setnotes(json);  // Assuming setNotes is a state setter function
    };
    
    const addNote = async (title,description,tag)=>{
        
        const response = await fetch(`${host}/api/notes/addnote`, {
            cors:{
                // origin:"https://127.0.0.1:3000",
                origin: '*',
                // origin: "http://localhost:5000",
                credentials: true,
                methods: ["GET", "POST"],
            },
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            body: JSON.stringify({title,description,tag})
        });

        const note=await response.json();
        
        
        
        setnotes(notes.concat(note));
    }

    const deleteNote = async(id)=>{
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
            
        });
        const json = response .json();
        
        console.log(json);
        console.log("Deleting the note"+id);
        const newNotes=notes.filter((note)=>{return note._id!==id})
        setnotes(newNotes);
    }

    // Edit a note (with optional image upload)
    const editNote = async (id, title, description, tag, imageFile = null) => {
        try {
            let response;
            if (imageFile) {
                const formData = new FormData();
                formData.append('title', title);
                formData.append('description', description);
                formData.append('tag', tag);
                formData.append('image', imageFile); // Append image

                response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                    method: 'PUT',
                    headers: {
                        'auth-token': localStorage.getItem('token'),
                        // Do not set 'Content-Type' when using FormData
                    },
                    body: formData,
                });
            } else {
                // If no image, send JSON
                response = await fetch(`${host}/api/notes/updatenote/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'auth-token': localStorage.getItem('token'),
                    },
                    body: JSON.stringify({ title, description, tag }),
                });
            }

            const updatedNote = await response.json();

            // Update the note in state
            const newNotes = notes.map((note) => {
                if (note._id === id) {
                    return { ...note, title, description, tag };
                }
                return note;
            });
            setnotes(newNotes);
        } catch (error) {
            console.error("Error editing note:", error);
        }
    };

    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )

}

export default NoteState;