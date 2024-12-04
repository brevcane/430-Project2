const models = require('../models');
const Note = models.Note;

const makerPage = async (req, res) => {
    return res.render('app');
};

const makeNote = async (req,res) => {
    if(!req.body.name || !req.body.description) {
        return res.status(400).json({ error: 'Name and description are required!' });
    }
    
    const noteData = {
        name: req.body.name,
        description: req.body.description,
        owner: req.session.account._id,
    };

    try {
        const newNote = new Note(noteData);
        await newNote.save();
        return res.status(201).json({ name: newNote.name, description: newNote.description});
    } catch (err) {
        console.log(err);
        if(err.code === 11000) {
            return res.status(400).json({ error: 'Note already exists!' });
        }
        return res.status(500).json({ error: 'An error occured making note!' });
    }
}

const getNotes = async (req, res) => {
    try {
        const query = {owner: req.session.account._id};
        const docs = await Note.find(query).select('name description').lean().exec();

        return res.json({notes: docs});
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: 'Error retrieving notes!'});
    }
}

const deleteNote = async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({error: "Note ID is required"});
    }

    try {
        const deletedNote = await Note.findByIdAndDelete(id);
        if (!deletedNote) {
            return res.status(404).json({ error: "Note not found!" });
        }
        return res.status(200).json({ message: "Note deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Error occured while deleting the note" });
    }
};

const updateNote = async (req, res) => {
    const { id, name, description } = req.body;

    if (!id || !name || !description) {
        return res.status(400).json({ error: 'ID, name, and description are required!' });
    }

    try {
        const updatedNote = await Note.findByIdAndUpdate(
            id,
            { name, description },
            { new: true }
        );

        if (!updatedNote) {
            return res.status(404).json({ error: 'Note not found!' });
        }

        return res.status(200).json({ message: 'Note updated successfully', note: updatedNote });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: 'Error updating the note!' });
    }
};

module.exports = {
  makerPage,
  makeNote,
  getNotes,
  deleteNote,
  updateNote, 
};
