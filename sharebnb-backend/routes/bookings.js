"use strict";

/** Routes for bookings. */

const Booking = require('../models/booking');
const express = require("express");
const { UnauthorizedError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");

const router = new express.Router();


/** POST /   { bookingData } => { booking }
 *
 * Create a new instance of a booking
 *
 * Returns {booking: { id, propertyId, guestUsername, startDate, endDate }}
 *    where start & end date are formatted as "yyy/mm/dd"
 * Authorization required: logged in user
 */

router.post('/',
  ensureLoggedIn,
  async function (req, res) {
    const { guestUsername, propertyId, startDate, endDate } = req.body;
    const booking = await Booking.create(
      { guestUsername, propertyId, startDate, endDate });
    return res.send({ booking });
  });

/** GET /  =>  { bookings }
 *
 * Get all bookings
 *
 * Returns {bookings: [{ id, propertyId, guestUsername, startDate, endDate }...]}
 *    where start & end date are formatted as "yyy/mm/dd"
 *
 * Authorization required: admin
 */

router.get('/',
  ensureAdmin,
  async function (req, res) {
    const bookings = await Booking.getAll();
    return res.send({ bookings });
  });

/** GET /[id]  => { booking }
 *
 * Get booking data, using booking ID
 *
 * Returns {booking: { id, propertyId, guestUsername, startDate, endDate }}
 *    where start & end date are formatted as "yyy/mm/dd"
 *
 * Authorization required: admin or same user-as-:username
 */

router.get('/:id',
  ensureLoggedIn,
  async function (req, res) {
    const booking = await Booking.get(req.params.id);

    const user = res.locals.user;
    const username = res.locals.user?.username;
    if (username && (username === booking.guestUsername || user.isAdmin === true)) {
      return res.send({ booking });
    } else {
      throw new UnauthorizedError();
    }
  });

module.exports = router;