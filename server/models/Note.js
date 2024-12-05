const mongoose = require('mongoose');
const _ = require('underscore');

const setName = (name) => _.escape(name).trim();

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  description: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

NoteSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
});

const NoteModel = mongoose.model('Note', NoteSchema);
module.exports = NoteModel;
