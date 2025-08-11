const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Deterministic key built from sorted participant IDs to guarantee uniqueness of a pair
  participantsKey: { type: String, unique: true, index: true }
}, { timestamps: true });

// Pre-validate: build participantsKey (supports exactly 2 participants for direct chat)
conversationSchema.pre('validate', function(next) {
  if (this.participants && this.participants.length) {
    const ids = this.participants.map(id => id.toString()).sort();
    this.participantsKey = ids.join('_');
  }
  next();
});

module.exports = mongoose.model('Conversation', conversationSchema);