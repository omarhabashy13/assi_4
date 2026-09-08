import { User } from '../../models/index.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const user = User.build({ name, email, password, role });
    user.checkPasswordLength();
    await user.save();

    return res.status(201).json({ message: "User added successfully." });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const upsertUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const user = await User.findByPk(id);
    if (user) {
      await user.update({ name, email, password, role }, { validate: false });
    } else {
      await User.create({ id, name, email, password, role }, { validate: false });
    }

    return res.status(200).json({ message: "User created or updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserByEmail = async (req, res) => {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['role'] }
    });

    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};