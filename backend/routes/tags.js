const express = require('express');
const router = express.Router();
const Tags = require('../models/Tags');


router.get('/', async (req, res) => {
  try {
    const tags = await Tags.find();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:tag', async (req, res) => {
  try {
    const {tag} = req.params;
    console.log(tag);
    const data = await Tags.find({tag});
    if (!data) return res.status(404).json({ message: 'Tag not found' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;