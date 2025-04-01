const { v4: uuidv4 } = require("uuid");
const Invite = require("../model/InviteSchema");

exports.InviteController = async (req, res) => {
  const token = uuidv4();

  await Invite.create({ token });

  res.json({ token });
};
