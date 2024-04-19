"use strict";

/** Routes for users. */

const User = require('../models/user');
const express = require("express");
const { BadRequestError, NotFoundError } = require("../expressError");
const router = new express.Router();
const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
  ensureLoggedIn
} = require("../middleware/auth.js");


/** GET / => { users: [ {username, firstName, lastName, email, phone, isAdmin }, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization required: admin
 **/

router.get("/",
  ensureAdmin,
  async function (req, res, next) {
    const users = await User.findAll();
    return res.json({ users });
  });

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, email, phone, isAdmin, bookings, properties }
 *   where bookings is [{ id, propertyId, guestUsername, startDate, endDate }... ]
 *   where properties is [{ id, title, address, description, price, owner }... ]
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get("/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    const user = await User.get(req.params.username);
    if (!user) throw new NotFoundError(`no such user: ${req.params.username}`)
    return res.json({ user });
  });

module.exports = router;