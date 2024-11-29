const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleNote = (e, onNoteAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#noteName').value;
    const description = e.target.querySelector('#noteDescription').value;

    if(!name || !description) {
        helper.handleError('All fields are required');
        return false;
    }

    helper.sendPost(e.target.action, {name, description}, onNoteAdded);
    return false;
};

const NoteForm = (props) => {
    return (
        <form id="noteForm"
            onSubmit={(e) => handleNote(e, props.triggerReload)}
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
                <input id="noteDescription" type="text" name="description" placeholder='Note Description' />
            </div>

            <input className="makeNoteSubmit" type="submit" value="Make Note" />
        </form>
    );
};

const NoteList = (props) => {
    const [notes, setNotes] = useState(props.notes);

    useEffect(() => {
        const loadNotesFromServer = async () => {
            const response = await fetch('/getNotes');
            const data = await response.json();
            setNotes(data.notes);
        };
        loadNotesFromServer();
    }, [props.reloadNotes]);

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

    if(notes.length === 0) {
        return (
            <div className="noteList">
                <h3 className="emptyNote">No Notes Yet!</h3>
            </div>
        );
    }

    const noteNodes = notes.map(note => {
        return (
            <div key={note.id} className="note">
                <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
                <h3 className="noteName">Name: {note.name}</h3>
                <h3 className="noteDescription">Description: {note.description}</h3>
                <div className="noteDeleteButtonContainer">
                    <button onClick={() => deleteNote(note._id)} className="deleteNoteButton"> delete </button>
                </div>
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

    return (
        <div>
            <div id="makeNote">
                <NoteForm triggerReload={() => setReloadNotes(!reloadNotes)} />
            </div>
            <div id="notes">
                <NoteList notes={[]} reloadNotes={reloadNotes} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
}; 

window.onload = init;