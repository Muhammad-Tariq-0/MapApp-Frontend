import React, { useState } from 'react';
import './BottomSection.css';

const BottomSection = ({ locations,loc, onLocationClick, searchTerm, sortOption, onSortChange, categories, onCategoryChange, isLoading }) => {
    const [isVisible, setIsVisible] = useState(true);
    const [rating, setRating] = useState('');
    const [category, setCategory] = useState('');


    const toggleVisibility = () => {
        setIsVisible(!isVisible);
    };

    // Adjust categories to match those in your database

    const sortedAndFilteredLocations = locations
        .filter((location) => {
            if (searchTerm === "") {
                return location;
            } else if (
                location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.address.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
                return location;
            }
            return null;
        })
        .filter((location) => {
            if (categories.length === 0) return true;
            return categories.includes(location.category);
        })
        .sort((a, b) => {
            switch (sortOption) {
                case 'rating':
                    return b.rating - a.rating;
                case 'category':
                    return a.category.localeCompare(b.category);
                default:
                    return 0;
            }
        });
 
    // Handler for the select Rating Sort change event
    const handleRatingChange = (event) => {
        const selectedValue = event.target.value;
        setRating(selectedValue); // Update state
        console.log('Selected value:', selectedValue); // Print to console
    };
     // Handler for the select Categary change event
     const handleCategaryChange = (event) => {
        const selectedValue = event.target.value;
        setCategory(selectedValue); // Update state
        console.log('Selected value:', selectedValue); // Print to console
    };
    console.log(loc)
    return (
        <div className="bottom-section">
            <center>
                <div className="toggle-bar" onClick={toggleVisibility}></div>
            </center>
            <h2>Top Sights</h2>
            {/* <label>Sort Rating Wise:</label> */}
            <select id="rating" value={rating} onChange={handleRatingChange}>
                <option value="All">Sort Rating Wise:</option>
                <option value="All">All</option>
                <option value="1">&#9734;</option>
                <option value="2">&#9734;&#9734;</option>
                <option value="3">&#9734;&#9734;&#9734;</option>
                <option value="4">&#9734;&#9734;&#9734;&#9734;</option>
                <option value="5">&#9734;&#9734;&#9734;&#9734;&#9734;</option>
            </select> &nbsp; &nbsp; &nbsp;
            {/* <label>Choose a Categary:</label> */}
            <select id="rating" value={category} onChange={handleCategaryChange}>
                <option value="All">Choose a Categary:</option>
                <option value="All">All</option>
                <option value="tourist_attraction">Tourist Attraction</option>
                <option value="museum">Museum</option>
                <option value="park">Park</option>
                
            </select>
            <div className={`container ${isVisible ? 'open' : 'closed'}`}>
    {isLoading ? ( // Show loading message if isLoading is true
        <h2>Loading...</h2>
    ) : (
        sortedAndFilteredLocations.length > 0 ? (
            sortedAndFilteredLocations
                .filter(location => {
                    // Filter by category
                    if (category === "tourist_attraction") {
                        if (location.category !== "tourist_attraction") return false;
                    }
                    else if (category === "park") {
                        if (location.category !== "park") return false;
                    }
                    else if (category === "museum") {
                        if (location.category !== "museum") return false;
                    }
                    
                    // Filter by rating
                    if (rating === "5") {
                        if (location.rating !== 5) return false;
                    }
                    else if (rating === "4") {
                        if (location.rating < 4 || location.rating >= 5) return false;
                    }
                    else if (rating === "3") {
                        if (location.rating < 3 || location.rating >= 4) return false;
                    }
                    else if (rating === "2") {
                        if (location.rating < 2 || location.rating >= 3) return false;
                    }
                    else if (rating === "1") {
                        if (location.rating < 1 || location.rating >= 2) return false;
                    }
                    
                    return true; // Show all locations if the selected category and rating criteria are met
                })
                  .map((location, index) => {
                      // Calculating Distance from my Location

                      // Convert degrees to radians
                      const toRadians = (degrees) => degrees * (Math.PI / 180);

                      // Haversine formula to calculate distance between two lat/lng points
                      const haversineDistance = (lat1, lon1, lat2, lon2) => {
                          const R = 6371; // Radius of the Earth in kilometers
                          const dLat = toRadians(lat2 - lat1);
                          const dLon = toRadians(lon2 - lon1);
                          const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
                              Math.sin(dLon / 2) * Math.sin(dLon / 2);
                          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                          return R * c; // Distance in kilometers
                      };

                      // Example usage

                      const distance = haversineDistance(loc[0], loc[1], location.latitude, location.longitude);



                    return (location.category === "tourist_attraction" ||
                        location.category === "museum" ||
                        location.category === "park") ? (
                        <div className="card" key={location.id} onClick={() => onLocationClick(location)}>
                            {/* Adjust image source as needed */}
                            <div className="content">
                            <p>Distance: {distance.toFixed(2)} km</p> {/* Display the calculated distance */}
                                <p>Index: {index}, ID: {location.id}</p> {/* Display the iteration index */}
                                <p>{location.category}</p>
                                <p>{location.name}</p>
                                <p>Rating: {location.rating}</p>
                                <p>{location.address}</p>
                                <p>Reviews: {location.number_of_reviews}</p>
                                <p className="description">{location.country}</p>
                                <p>Distance: {distance.toFixed(2)} km</p> {/* Display the calculated distance */}
                            </div>
                        </div>
                    ) : null;
                })
        ) : (
            <p>No locations match the selected criteria.</p>
        )
    )}
</div>



        </div>
    );
}

export default BottomSection;


































// import React, { useState } from 'react';
// import './BottomSection.css';

// const BottomSection = ({ locations,loc, onLocationClick, searchTerm, sortOption, onSortChange, categories, onCategoryChange, isLoading }) => {
//     const [isVisible, setIsVisible] = useState(true);
//     const [rating, setRating] = useState('');
//     const [category, setCategory] = useState('');


//     const toggleVisibility = () => {
//         setIsVisible(!isVisible);
//     };

//     // Adjust categories to match those in your database

//     const sortedAndFilteredLocations = locations
//         .filter((location) => {
//             if (searchTerm === "") {
//                 return location;
//             } else if (
//                 location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.address.toLowerCase().includes(searchTerm.toLowerCase())
//             ) {
//                 return location;
//             }
//             return null;
//         })
//         .filter((location) => {
//             if (categories.length === 0) return true;
//             return categories.includes(location.category);
//         })
//         .sort((a, b) => {
//             switch (sortOption) {
//                 case 'rating':
//                     return b.rating - a.rating;
//                 case 'category':
//                     return a.category.localeCompare(b.category);
//                 default:
//                     return 0;
//             }
//         });
 
//     // Handler for the select Rating Sort change event
//     const handleRatingChange = (event) => {
//         const selectedValue = event.target.value;
//         setRating(selectedValue); // Update state
//         console.log('Selected value:', selectedValue); // Print to console
//     };
//      // Handler for the select Categary change event
//      const handleCategaryChange = (event) => {
//         const selectedValue = event.target.value;
//         setCategory(selectedValue); // Update state
//         console.log('Selected value:', selectedValue); // Print to console
//     };
//     console.log(loc)
//     return (
//         <div className="bottom-section">
//             <center>
//                 <div className="toggle-bar" onClick={toggleVisibility}></div>
//             </center>
//             <h2>Top Sights</h2>
//             {/* <label>Sort Rating Wise:</label> */}
//             <select id="rating" value={rating} onChange={handleRatingChange}>
//                 <option value="All">Sort Rating Wise:</option>
//                 <option value="All">All</option>
//                 <option value="1">&#9734;</option>
//                 <option value="2">&#9734;&#9734;</option>
//                 <option value="3">&#9734;&#9734;&#9734;</option>
//                 <option value="4">&#9734;&#9734;&#9734;&#9734;</option>
//                 <option value="5">&#9734;&#9734;&#9734;&#9734;&#9734;</option>
//             </select> &nbsp; &nbsp; &nbsp;
//             {/* <label>Choose a Categary:</label> */}
//             <select id="rating" value={category} onChange={handleCategaryChange}>
//                 <option value="All">Choose a Categary:</option>
//                 <option value="All">All</option>
//                 <option value="tourist_attraction">Tourist Attraction</option>
//                 <option value="museum">Museum</option>
//                 <option value="park">Park</option>
                
//             </select>
//             <div className={`container ${isVisible ? 'open' : 'closed'}`}>
//     {isLoading ? ( // Show loading message if isLoading is true
//         <h2>Loading...</h2>
//     ) : (
//         sortedAndFilteredLocations.length > 0 ? (
//             sortedAndFilteredLocations
//                 .filter(location => {
//                     // Filter by category
//                     if (category === "tourist_attraction") {
//                         if (location.category !== "tourist_attraction") return false;
//                     }
//                     else if (category === "park") {
//                         if (location.category !== "park") return false;
//                     }
//                     else if (category === "museum") {
//                         if (location.category !== "museum") return false;
//                     }
                    
//                     // Filter by rating
//                     if (rating === "5") {
//                         if (location.rating !== 5) return false;
//                     }
//                     else if (rating === "4") {
//                         if (location.rating < 4 || location.rating >= 5) return false;
//                     }
//                     else if (rating === "3") {
//                         if (location.rating < 3 || location.rating >= 4) return false;
//                     }
//                     else if (rating === "2") {
//                         if (location.rating < 2 || location.rating >= 3) return false;
//                     }
//                     else if (rating === "1") {
//                         if (location.rating < 1 || location.rating >= 2) return false;
//                     }
                    
//                     return true; // Show all locations if the selected category and rating criteria are met
//                 })
//                   .map((location, index) => {
//                       // Calculating Distance from my Location

//                       // Convert degrees to radians
//                       const toRadians = (degrees) => degrees * (Math.PI / 180);

//                       // Haversine formula to calculate distance between two lat/lng points
//                       const haversineDistance = (lat1, lon1, lat2, lon2) => {
//                           const R = 6371; // Radius of the Earth in kilometers
//                           const dLat = toRadians(lat2 - lat1);
//                           const dLon = toRadians(lon2 - lon1);
//                           const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//                               Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
//                               Math.sin(dLon / 2) * Math.sin(dLon / 2);
//                           const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//                           return R * c; // Distance in kilometers
//                       };

//                       // Example usage

//                       const distance = haversineDistance(loc[0], loc[1], location.latitude, location.longitude);



//                     return (location.category === "tourist_attraction" ||
//                         location.category === "museum" ||
//                         location.category === "park") ? (
//                         <div className="card" key={location.id} onClick={() => onLocationClick(location)}>
//                             {/* Adjust image source as needed */}
//                             <div className="content">
//                                 <p>Index: {index}, ID: {location.id}</p> {/* Display the iteration index */}
//                                 <p>{location.category}</p>
//                                 <p>{location.name}</p>
//                                 <p>Rating: {location.rating}</p>
//                                 <p>{location.address}</p>
//                                 <p>Reviews: {location.number_of_reviews}</p>
//                                 <p className="description">{location.country}</p>
//                                 <p>Distance: {distance.toFixed(2)} km</p> {/* Display the calculated distance */}
//                             </div>
//                         </div>
//                     ) : null;
//                 })
//         ) : (
//             <p>No locations match the selected criteria.</p>
//         )
//     )}
// </div>



//         </div>
//     );
// }

// export default BottomSection;

































