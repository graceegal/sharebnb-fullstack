const BASE_URL = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class SharebnbApi {

  static token = null;

  static async request(endpoint, data = {}, method = "GET", reqType = 'regular') {
    const url = new URL(`${BASE_URL}/${endpoint}`);

    const headers = reqType === "regular" ? {
      authorization: `Bearer ${SharebnbApi.token}`,
      'content-type': "application/json",
    } : {
      authorization: `Bearer ${SharebnbApi.token}`,
    }
      ;

    url.search = (method === "GET")
      ? new URLSearchParams(data).toString()
      : "";

    // set to undefined since the body property cannot exist on a GET method
    const body = (method !== "GET")
      ? (reqType === "regular" ? JSON.stringify(data) : data)
      : undefined;

    const resp = await fetch(url, { method, body, headers });

    if (!resp.ok) {
      console.error("API Error:", resp.statusText, resp.status);
      const message = (await resp.json()).error.message;
      throw Array.isArray(message) ? message : [message];
    }

    return await resp.json();
  }

  // Individual API routes

  /** Get details on a property by ID. */

  static async getProperty(id) {
    const res = await this.request(`properties/${id}`);
    return res.property;
  }

  /** Get list of properties, with optional filter that takes in searchTerm  */

  static async getProperties(searchTerm) {
    const searchTermParam = searchTerm ? { titleLike: searchTerm } : {};
    const res = await this.request("properties", searchTermParam);
    return res.properties;
  }

  /** Create new property  */

  static async createProperty(data) {
    const res = await this.request(
      "properties",
      data,
      "POST",
      "multipart");
    return res.property;
  }

  /** Authenticates user's login credentials; if authenticated, returns
   * JWT token */

  static async login({ username, password }) {
    const res = await this.request("auth/login", { username, password }, "POST");
    return res.token;
  }

  /** Signup new user and validates request; if valid, returns JWT token */

  static async signup({ username, password, firstName, lastName, email, phone }) {
    const res = await this.request(
      "auth/register",
      { username, password, firstName, lastName, email, phone },
      "POST");
    return res.token;
  }

  /** Get user */
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Create booking */

  static async createBooking({ propertyId, guestUsername, startDate, endDate }) {
    const res = await this.request(
      "bookings",
      { propertyId, guestUsername, startDate, endDate },
      "POST"
    );
    return res.booking;
  }

  /** get one booking */
  static async getBooking(bookingId) {
    const res = await this.request(`bookings/${bookingId}`);
    return res;
  }

}

export default SharebnbApi;
