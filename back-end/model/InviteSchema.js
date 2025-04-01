const mongoose = require("mongoose");

const InviteSchema = new mongoose.Schema({
  token: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("Invite", InviteSchema);
