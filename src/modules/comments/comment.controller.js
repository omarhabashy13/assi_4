import { Comment, User, Post } from '../../models/index.js';
import { Op } from 'sequelize';

export const createBulkComments = async (req, res) => {
  try {
    const { comments } = req.body;
    await Comment.bulkCreate(comments);
    return res.status(201).json({ message: "comments created." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, content } = req.body;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res.status(404).json({ message: "comment not found." });
    }

    if (comment.userId !== Number(userId)) {
      return res.status(403).json({ message: "You are not authorized to update this comment." });
    }

    comment.content = content;
    await comment.save();

    return res.status(200).json({ message: "Comment updated." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const findOrCreateComment = async (req, res) => {
  try {
    const { postId, userId, content } = req.body;

    const [comment, created] = await Comment.findOrCreate({
      where: { postId, userId, content },
      defaults: { postId, userId, content }
    });

    return res.status(200).json({ comment, created });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const searchComments = async (req, res) => {
  try {
    const { word } = req.query;

    const { count, rows: comments } = await Comment.findAndCountAll({
      where: {
        content: {
          [Op.like]: `%${word}%`
        }
      }
    });

    if (count === 0) {
      return res.status(404).json({ message: "no comments found." });
    }

    return res.status(200).json({ count, comments });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getNewestComments = async (req, res) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.findAll({
      where: { postId },
      order: [['createdAt', 'DESC']],
      limit: 3,
      attributes: ['id', 'content', 'createdAt']
    });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getCommentDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id, {
      attributes: ['id', 'content'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email']
        },
        {
          model: Post,
          attributes: ['id', 'title', 'content']
        }
      ]
    });

    if (!comment) {
      return res.status(404).json({ message: "no comment found" });
    }

    return res.status(200).json(comment);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};