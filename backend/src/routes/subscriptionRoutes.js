const express = require('express');
const Subscription = require('../models/Subscription');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'email is required' });
    }

    const subscription = await Subscription.findOneAndUpdate(
      { email },
      { email, active: true },
      { upsert: true, new: true }
    );

    return res.status(201).json(subscription);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
