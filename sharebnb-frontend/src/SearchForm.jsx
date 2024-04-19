import { useState } from "react";

/** SearchForm component for Sharebnb
 *
 * props: handleSearch()
 * state: searchTerm ("")
 *
 * PropertiesList -> SearchForm 
*/

function SearchForm({ handleSearch }) {
    const [searchTerm, setSearchTerm] = useState("");

    console.log("searchForm %o", { searchTerm });

    /** handle input change */
    function handleChange(evt) {
        setSearchTerm(evt.target.value);
    }

    /** function to call a function in parent then clears search form */
    function handleSubmit(evt) {
        evt.preventDefault();
        handleSearch(searchTerm.trim());
    }

    return (
        <div className="SearchForm mb-4 mt-4">
            <form onSubmit={handleSubmit}>
                <div className="row justify-content-center gx-0">
                    <div className="col-4">
                        <input type="text"
                            id="searchTerm"
                            className="form-control"
                            name="searchTerm"
                            placeholder="Enter search term..."
                            onChange={handleChange}
                            value={searchTerm} />
                    </div>
                    <button type="submit"
                        className="btn btn-outline-dark col-auto">
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SearchForm;