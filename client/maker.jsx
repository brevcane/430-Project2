const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const NoteForm = (props) => {
    const [noteCount, setNoteCount] = useState(0);

    useEffect(() => {
        const loadNoteCount = async () => {
            const response = await fetch('/getNotes');
            const data = await response.json();
            setNoteCount(data.notes.length);
        };
        loadNoteCount();
    }, [props.isPremium]); 

    const handleNoteSubmit = (e) => {
        e.preventDefault();

        const name = e.target.querySelector('#noteName').value;
        const description = e.target.querySelector('#noteDescription').value;

        if (!name || !description) {
            helper.handleError('All fields are required');
            return false;
        }

        helper.sendPost(e.target.action, { name, description }, () => {
            setNoteCount(prevCount => prevCount + 1);
            props.triggerReload();
        });

        return false;
    };

    return (
        <form id="noteForm"
            onSubmit={handleNoteSubmit}
            name="noteForm"
            action="/maker"
            method="POST"
            className="noteForm"
        >
            <div className="formField">
                <label htmlFor="name">Name: </label>
                <input id="noteName" type="text" name="name" placeholder="Note Name" />
            </div>

            <div className="formField">
                <label htmlFor="description">Description: </label>
                <input id="noteDescription" type="text" name="description" placeholder="Note Description" />
            </div>

            <input className="makeNoteSubmit" type="submit" value="Make Note" disabled={!props.isPremium && noteCount >= 3} />
            {!props.isPremium && noteCount >= 3 && (
                <div className="noteLimitWarning">
                    <p>You have reached the maximum number of notes. Please upgrade to premium to create more notes.</p>
                </div>
            )}
        </form>
    );
};


const NoteList = (props) => {
    const [notes, setNotes] = useState(props.notes);
    const [isEditing, setIsEditing] = useState(null); 
    const [editedNote, setEditedNote] = useState({ name: '', description: '' });

    useEffect(() => {
        const loadNotesFromServer = async () => {
            const response = await fetch('/getNotes');
            const data = await response.json();

            if (!props.isPremium) {
                data.notes = data.notes.slice(0, 3);
            }

            setNotes(data.notes);
        };
        loadNotesFromServer();
    }, [props.reloadNotes, props.isPremium]);

    const deleteNote = async (id) => {
        const response = await fetch('/deleteNote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (response.ok) {
            setNotes(notes.filter(note => note._id !== id));
        } else {
            alert(data.error || 'Error deleting Note');
        }
    };

    const startEdit = (note) => {
        setIsEditing(note._id);
        setEditedNote({ name: note.name, description: note.description });
    };

    const handleEditChange = (e) => {
        setEditedNote({
            ...editedNote,
            [e.target.name]: e.target.value
        });
    };

    const saveEdit = async (id) => {
        const response = await fetch('/editNote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                name: editedNote.name,
                description: editedNote.description
            }),
        });

        const data = await response.json();

        if (response.ok) {
            setNotes(notes.map(note => note._id === id ? { ...note, ...editedNote } : note));
            setIsEditing(null);
        } else {
            alert(data.error || 'Error editing Note');
        }
    };

    if (notes.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    const noteNodes = notes.map(note => {
        return (
            <div key={note._id} className="note">
                {isEditing === note._id ? (
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={editedNote.name}
                            onChange={handleEditChange}
                        />
                        <input
                            type="text"
                            name="description"
                            value={editedNote.description}
                            onChange={handleEditChange}
                        />
                        <button onClick={() => saveEdit(note._id)}>Save</button>
                    </div>
                ) : (
                    <div>
                        <h3 className="noteName">Name: {note.name}</h3>
                        <h3 className="noteDescription">Description: {note.description}</h3>
                        {props.isPremium && (
                            <button onClick={() => startEdit(note)}>Edit</button>
                        )}
                        <button onClick={() => deleteNote(note._id)}>Delete</button>
                    </div>
                )}
            </div>
        );
    });

    return (
        <div className="noteList">
            {noteNodes}
        </div>
    );
};

const App = () => {
    const [reloadNotes, setReloadNotes] = useState(false);
    const [isPremium, setIsPremium] = useState(false);

    return (
        <div>
            <div id="makeNote">
                <NoteForm triggerReload={() => setReloadNotes(!reloadNotes)} isPremium={isPremium} />
            </div>
            <div id="notes">
                <NoteList notes={[]} reloadNotes={reloadNotes} isPremium={isPremium} />
            </div>
            <div>
                <label>
                    Premium
                    <input type="checkbox" checked={isPremium} onChange={() => setIsPremium(!isPremium)} />
                </label>
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render(<App />);
};

window.onload = init;
