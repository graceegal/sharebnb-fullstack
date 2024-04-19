"use strict";

/** Related functions for images
 *
 * Methods:
 * - create
*/

const db = require("../db");


class Image {
  /** Create an image (from data), update db, return new image data.
    *
    * data should be { key, propertyId }
    *
    * Returns { key, propertyId }
    *
    * Throws BadRequestError if image already in database.
    * */

  static async create({ key, propertyId }) {

    const duplicateCheck = await db.query(`
      SELECT key
      FROM images
      WHERE key = $1`, [key]);

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate image: ${key}`);
    }

    const result = await db.query(`
    INSERT INTO images (key, property_id)
      VALUES ($1, $2)
      RETURNING key, property_id AS propertyId`,
      [key, propertyId]);

    const image = result.rows[0];
    return image;
  }
}

module.exports = Image;