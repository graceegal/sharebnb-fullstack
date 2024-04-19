"use strict";

/** Routes for properties. */

const express = require("express");
const jsonschema = require("jsonschema");

const Property = require("../models/property");
const { BadRequestError } = require("../expressError");
const propertySearchSchema = require("../schemas/propertySearch.json");
const propertyCreateSchema = require("../schemas/propertyCreate.json");
const { ensureLoggedIn } = require("../middleware/auth");
const { putIntoBucket } = require("../awss3");
const multer = require('multer');
const Image = require("../models/image");

const router = new express.Router();

// Set up storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


/** POST / { property } =>  { property }
 *
 * property should be { title, address, description, price, images }
 *
 * Returns {property: { title, address, description, price, owner, images }}
 *    where images is [ key, ...]
 *
 * Authorization required: logged in user
 */

router.post("/",
  ensureLoggedIn,
  upload.array('images', 5),
  async function (req, res, next) {
    console.log("*****req.body CREATE", req.body);
    console.log("*****req.files CREATE", req.files);
    const q = req.body;
    q.price = +q.price;

    const validator = jsonschema.validate(
      q,
      propertyCreateSchema,
      { required: true }
    );

    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    const data = { ...req.body, owner: res.locals.user.username };
    const newProperty = await Property.create(data);

    const propertyId = newProperty.id;

    await Promise.all(req.files.map(async (file, idx) => {
      console.log("inside Promise file", file);
      const key = `${file.originalname}-${Date.now()}-${idx}`;
      await putIntoBucket(key, file.buffer);
      await Image.create({ propertyId: propertyId, key: key });
    }));

    const property = await Property.get(propertyId);

    return res.status(201).json({ property });
  });


/** Get all properties
 *
 * Can filter on provided search filters:
 *  - minPrice
 *  - maxPrice
 *  - titleLike (will find case-insensitive, partial matches)
 *
 * Returns { properties: [{ id, title, address, description, price, owner, images }, ...] }
 *    where images is [ key, ...]
 *
 * Authorization required: none
 */

router.get('/', async function (req, res) {
  const q = req.query;
  // arrive as strings from querystring, but we want as ints
  if (q.minPrice !== undefined) q.minPrice = +q.minPrice;
  if (q.maxPrice !== undefined) q.maxPrice = +q.maxPrice;


  const validator = jsonschema.validate(
    q,
    propertySearchSchema,
    { required: true }
  );
  if (!validator.valid) {
    const errs = validator.errors.map(e => e.stack);
    throw new BadRequestError(errs);
  }

  const properties = await Property.findAll(q);
  return res.send({ properties });
});


/** Get specific property
 *
 * Returns { property: { title, address, description, price, owner, images }}
 *   where images is [ key, ...]
 *
 * Authorization required: none
 */

router.get('/:id', async function (req, res) {
  const property = await Property.get(req.params.id);
  return res.send({ property });
});


// Commented out because merged below route logic into post /properties/ route
/** POST / { fileData, propertyId } =>  { property }
 *
 * Returns property should be { id, title, address, description, price, images }
 *    where images is [ { key },... ]
 *
 * Authorization required: logged in user
 */

// router.post('/:id/images',
//   ensureLoggedIn,
//   upload.array('images', 5),
//   async function (req, res) {
//     const propertyId = req.params.id;

//     await Promise.all(req.files.map(async (file, idx) => {
//       console.log("inside Promise file", file);
//       const key = `${file.originalname}-${Date.now()}-${idx}`;
//       await putIntoBucket(key, file.buffer);
//       await Image.create({ propertyId: propertyId, key: key });
//     }));

//     const property = await Property.get(propertyId);
//     return res.json({ property });

//   });

module.exports = router;