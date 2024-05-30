"use strict";

/** Related functions for properties
 *
 * Methods:
 * - create
 * - _filterWhereBuilder
 * - findAll
 * - get
 * - update
 * - remove
 */

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");


class Property {
  /** Create a property (from data), update db, return new property data.
     *
     * data should be { title, address, description, price, owner }
     *
     * Returns { id, title, address, description, price, owner }
     *
     * Throws BadRequestError if property already in database.
     * */

  static async create({ title, address, description, price, owner }) {
    const duplicateCheck = await db.query(`
      SELECT address
      FROM properties
      WHERE address = $1`, [address]);

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate property: ${address}`);

    const result = await db.query(`
              INSERT INTO properties (title,
                                     address,
                                     description,
                                     price,
                                     owner)
              VALUES ($1, $2, $3, $4, $5)
              RETURNING
                  id,
                  title,
                  address,
                  description,
                  price,
                  owner`, [
      title,
      address,
      description,
      price,
      owner,
    ],
    );
    const property = result.rows[0];

    return property;
  }

  /** Create WHERE clause for filters, to be used by functions that query
   * with filters.
   *
   * searchFilters (all optional):
   * - minPrice
   * - maxPrice
   * - titleLike (will find case-insensitive, partial matches)
   *
   * Returns {
   *  where: "WHERE price >= $1 AND title ILIKE $2",
   *  vals: [100, '%Oasis%']
   * }
   */

  static _filterWhereBuilder({ minPrice, maxPrice, titleLike }) {
    let whereParts = [];
    let vals = [];

    if (minPrice !== undefined) {
      vals.push(minPrice);
      whereParts.push(`price >= $${vals.length}`);
    }

    if (maxPrice !== undefined) {
      vals.push(maxPrice);
      whereParts.push(`price <= $${vals.length}`);
    }

    if (titleLike) {
      vals.push(`%${titleLike}%`);
      whereParts.push(`title ILIKE $${vals.length}`);
    }

    const where = (whereParts.length > 0) ?
      "WHERE " + whereParts.join(" AND ")
      : "";

    return { where, vals };
  }

  /** Find all properties (optional filter on searchFilters).
   *
   * searchFilters (all optional):
   * - minPrice
   * - maxPrice
   * - titleLike (will find case-insensitive, partial matches)
   *
   * Returns [{ title, address, description, price, owner }, ...]
   * */

  static async findAll(searchFilters = {}) {
    const { minPrice, maxPrice, titleLike } = searchFilters;

    if (minPrice > maxPrice) {
      throw new BadRequestError("Min price cannot be greater than max");
    }

    const { where, vals } = this._filterWhereBuilder({
      minPrice, maxPrice, titleLike,
    });

    const propertiesRes = await db.query(`
          SELECT p.id,
                p.title,
                 p.address,
                 p.description,
                 p.price,
                 p.owner,
                 JSON_AGG(i.key) AS "images"
          FROM properties AS p
          FULL JOIN images AS i ON i.property_id = p.id
          ${where}
          GROUP BY p.id
          ORDER BY p.title`, vals);
    return propertiesRes.rows;
  }

  /** Given a property id, return data about property.
  *
  * Returns { title, address, description, price, owner, images }
  *   where images is [{ key, caption}, ...]
  *
  * Throws NotFoundError if not found.
  **/

  static async get(id) {
    const propertyRes = await db.query(`
        SELECT title,
               address,
               description,
               price,
               owner
        FROM properties
        WHERE id = $1`, [id]);

    const property = propertyRes.rows[0];

    if (!property) throw new NotFoundError(`No property: ${id}`);

    const imagesRes = await db.query(`
        SELECT key
        FROM images
        WHERE property_id = $1
        ORDER BY key`, [id],
    );

    property.images = imagesRes.rows.map(row => row.key);

    return property;
  }

  /** Update property data with `data`.
   *
   * This is a "partial update" --- it's fine if data doesn't contain all the
   * fields; this only changes provided ones.
   *
   * Data can include: {title, description, address, price}
   *
   * Returns {id, title, description, address, price, owner}
   *
   * Throws NotFoundError if not found.
   */

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {});
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `
        UPDATE properties
        SET ${setCols}
        WHERE id = ${handleVarIdx}
        RETURNING
            id,
            title,
            description,
            address,
            price,
            owner`;
    const result = await db.query(querySql, [...values, id]);
    const property = result.rows[0];

    if (!property) throw new NotFoundError(`No property: ${id}`);

    return property;
  }

  /** Delete given property from database; returns undefined.
   *
   * Throws NotFoundError if property not found.
   **/

  static async remove(id) {
    const result = await db.query(`
        DELETE
        FROM properties
        WHERE id = $1
        RETURNING id`, [id]);
    const property = result.rows[0];

    if (!property) throw new NotFoundError(`No property: ${id}`);
  }
}

module.exports = Property;