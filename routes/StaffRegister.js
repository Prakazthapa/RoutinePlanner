const express = require('express');
const router = express.Router();

// Define a dummy route for registering staff
router.post('/', (req, res) => {
  res.send('Dummy route for registering staff');
});

module.exports = router;
