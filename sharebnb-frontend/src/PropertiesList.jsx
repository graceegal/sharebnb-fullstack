import { useState, useEffect } from 'react';
import SharebnbApi from './api';
import LoadingSpinner from './LoadingSpinner';
import PropertyCard from './PropertyCard';
import SearchForm from './SearchForm';

/** PropertiesList Component for Sharebnb
 *
 * Props: None
 *
 * State:
 *  - properties ( data: [], searchTerm: "" )
 *
 * RoutesList -> PropertiesList -> { PropertyCard, SearchForm }
 */

function PropertiesList() {
    const [properties, setProperties] = useState({ data: null, searchTerm: "" });

    console.log("PropertiesList %o", { properties });

    useEffect(function fetchPropertiesWhenMounted() {
        console.log("Inside of fetchPropertiesWhenMounted use effect");
        search(properties.searchTerm);
    }, []);

    /** handles search for companies that match search term */
    async function search(searchTerm) {
        const params = searchTerm === ""
            ? ""
            : searchTerm;

        const properties = await SharebnbApi.getProperties(params);
        setProperties({
            data: properties,
            searchTerm: searchTerm,
        });
    }

    if (!properties.data) return <LoadingSpinner />;

    return (

        <div className='Properties row justify-content-start'>
            <SearchForm handleSearch={search} />
            {properties.searchTerm
                ? <h1 className='text-center'>{`Search Results for '${properties.searchTerm}'`}</h1>
                : <h1 className='text-center'>All Properties</h1>}
            {properties.data.length === 0 && <h3 className='text-center'>No properties</h3>}
            {properties.data.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
    );
}

export default PropertiesList;