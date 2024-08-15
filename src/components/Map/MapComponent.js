// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import BottomSection from '../BottomSection/BottomSection';
// import './MapComponent.css';
// import Swal from 'sweetalert2';
// import axios from 'axios';

// // Fix for default marker icon issues in Leaflet with Webpack
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
//     iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//     shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
// });

// // Helper component to handle map center changes
// const SetMapCenter = ({ center }) => {
//     const map = useMap(); 
//     useEffect(() => {
//         if (center) {
//             map.setView(center, map.getZoom());
//         }
//     }, [center, map]);
//     return null;
// };

// const MapComponent = () => {
//     const [locations, setLocations] = useState([]);
//     const [filteredLocations, setFilteredLocations] = useState([]);
//     const [selectedLocation, setSelectedLocation] = useState({});
//     const [currentLocation, setCurrentLocation] = useState(null);
//     const [mapCenter, setMapCenter] = useState([41.5309, -8.61967]); // Default center before fetching user's location
//     const [searchTerm, setSearchTerm] = useState("");
//     const [sortOption, setSortOption] = useState("rating");
//     const [categories, setCategories] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [PoitOfInterests, setPoitOfInterests] = useState([]);
//     const [polylinePositions, setPolylinePositions] = useState([]); // State for polyline
//     const userid = sessionStorage.getItem('userId');

//     // Function to fetch POIs data
//     const fetchPoitOfInterests = async () => {
//         try {
//             const response = await fetch('https://squid-app-ni9et.ondigitalocean.app/pois');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             setPoitOfInterests(data);
//         } catch (error) {
//             console.error('Error fetching POIs:', error);
//         }
//     };

//     // Function to fetch other data (locations, etc.)
//     const fetchLocations = async () => {
//         try {
//             const response = await fetch('https://squid-app-ni9et.ondigitalocean.app/maps_graded');
//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }
//             const data = await response.json();
//             setLocations(data);
//             setLoading(false);
//         } catch (error) {
//             console.error('Error fetching locations:', error);
//             setLoading(false);
//         }
//     };

//     // Fetch locations and POIs on component mount
//     useEffect(() => {
//         fetchLocations();
//         fetchPoitOfInterests();
        
//         // Fetch user's location and set it as map center
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setCurrentLocation([latitude, longitude]);
//                     setMapCenter([latitude, longitude]);
//                 },
//                 (error) => {
//                     console.error('Error fetching current location:', error);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by this browser.');
//         }
//     }, []);

//     const handleGetLocationClick = () => {
//         if (currentLocation) {
//             setMapCenter(currentLocation);
//             setPolylinePositions([])
//         } else {
//             console.error('Current location is not available.');
//         }
//     };

//     const handleLocationClick = (location) => {
//         setSelectedLocation(location);
//         setMapCenter([location.latitude, location.longitude]);

//         // Calculate distances for all locations including the selected one
//         const locationsWithDistance = locations.map(loc => ({
//             ...loc,
//             distance: Math.sqrt(
//                 Math.pow(loc.latitude - location.latitude, 2) +
//                 Math.pow(loc.longitude - location.longitude, 2)
//             )
//         }));

//         // Sort by distance and select the top 50 including the selected location
//         const sortedLocations = locationsWithDistance
//             .sort((a, b) => a.distance - b.distance)
//             .slice(0, 50);

//         setFilteredLocations(sortedLocations);
//     };

//     const handlePointOfInterestClick = async (location) => {
//         const data = {
//             userid,
//             name: location.name,
//             address: location.address,
//             rating: location.rating,
//             latitude: location.latitude,
//             longitude: location.longitude,
//             place_id: location.place_id,
//             category: location.category,
//             country: location.country,
//             description: location.description,
//             photo_url: location.photo_url,
//             fact1: location.fact1,
//             fact2: location.fact2,
//             fact3: location.fact3,
//         };

//         try {
//              await axios.post('https://squid-app-ni9et.ondigitalocean.app/pois', data, {
//                 headers: {
//                     'Content-Type': 'application/json',
//                 }
//             });
//             Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Point of Interest has been saved",
//                 showConfirmButton: false,
//                 timer: 1500
//             });

//             // // Update polyline positions after saving POI
//             // if (currentLocation) {
//             //     setPolylinePositions([currentLocation, [location.latitude, location.longitude]]);
//             //     // setMapCenter([location.latitude, location.longitude]);
//             // }

//             // Reload POIs data to reflect the new POI
//             fetchPoitOfInterests();

//         } catch (error) {
//             console.error('Error adding POI:', error.response ? error.response.data : error.message);
//         }
//     };

//     const handleDeletePointOfInterest = async (id) => {
//         try {
//              await axios.delete(`https://squid-app-ni9et.ondigitalocean.app/pois/${id}`);
//             Swal.fire({
//                 position: "top-end",
//                 icon: "success",
//                 title: "Point of Interest has been deleted",
//                 showConfirmButton: false,
//                 timer: 1500
//             });
//             fetchPoitOfInterests(); // Refresh POIs list
//         } catch (error) {
//             Swal.fire({
//                 position: "top-end",
//                 icon: "error",
//                 title: "Failed to delete Point of Interest",
//                 text: error.response ? error.response.data.error : error.message,
//                 showConfirmButton: true
//             });
//         }
//     };

//     const handleNavigation = (location) => {
//         if (currentLocation) {
//             setPolylinePositions([currentLocation, [location.latitude, location.longitude]]);
//             setMapCenter([location.latitude, location.longitude]);
//         }
//     };

//     const searchedLocationClick = () => {
//         if (searchTerm === "") {
//             Swal.fire({
//                 title: "Empty Search",
//                 text: "Write Something in Search Bar!",
//                 icon: "warning"
//             });
//             return;
//         }

//         const filtered = locations
//             .filter(location =>
//                 location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.address.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .sort((a, b) => a.id > b.id ? -1 : 1);

//         filtered.forEach((location) => {
//             setMapCenter([location.latitude, location.longitude]);
//         });

//         setFilteredLocations(filtered);
//     };

//     const handleSortChange = (event) => {
//         setSortOption(event.target.value);
//     };

//     const handleCategoryChange = (event) => {
//         const value = event.target.value;
//         setCategories(prevCategories =>
//             prevCategories.includes(value)
//                 ? prevCategories.filter(cat => cat !== value)
//                 : [...prevCategories, value]
//         );
//     };

//     function LocationDetails(location1) {
//         Swal.fire({
//             title: `${location1.name}`,
//             html: `
//                 ${location1.country},
//                 ${location1.address}<br/>
//                 <b> Rating: </b>${location1.rating}&#9734;<br/>
//                 <p>${location1.description}</p>
//                 <b> Facts </b>
//                 <p>${location1.fact1}</p> 
//                 <p>${location1.fact2}</p>
//                 <p>${location1.fact3}</p>
//             `,
//             text: `${location1.description}`,
//             imageUrl: `${location1.photo_url}`,
//             imageAlt: "Custom image",
//             showCloseButton: true,
//             showCancelButton: true,
//             focusConfirm: false,
//             confirmButtonText: `<i class="fa fa-thumbs-up"></i> Great!`,
//             confirmButtonAriaLabel: "Thumbs up, great!",
//             cancelButtonText: `<i class="fa fa-thumbs-down"></i>`,
//             cancelButtonAriaLabel: "Thumbs down"
//         });
//     }

//     return (
//         <div className="map-container">
//             <div className="search-container">
//                 <button type="submit" onClick={searchedLocationClick}>
//                     <i className="fa fa-search"></i>
//                 </button>
//                 <input type="text" placeholder="Search..." onChange={(event) => setSearchTerm(event.target.value)} />
//                 <button className='location-button' onClick={handleGetLocationClick}>
//                     <i className="fas fa-location-arrow"></i>
//                 </button>
//             </div>
//             <MapContainer center={mapCenter} zoom={13} className="leaflet-map">
//                 <TileLayer
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                 />
//                 <SetMapCenter center={mapCenter} />
//                 {currentLocation && (
//                     <Marker position={currentLocation}>
//                         <Popup>Your Current Location</Popup>
//                     </Marker>
//                 )}
//                 {filteredLocations.map(location => (
//                     <Marker
//                         key={location.id}
//                         position={[location.latitude, location.longitude]}
//                         icon={L.icon({
//                             iconUrl: selectedLocation && selectedLocation.id === location.id
//                                 ? 'https://static.vecteezy.com/system/resources/previews/022/187/606/non_2x/map-location-pin-icon-free-png.png'
//                                 : 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//                             iconSize: [25, 41],
//                             iconAnchor: [12, 41],
//                             popupAnchor: [1, -34],
//                             shadowSize: [41, 41]
//                         })}
//                     >
//                         <Popup>
//                             <strong>{location.name}</strong><br />
//                             <p style={{ color: 'blue' }}>Rating: {location.rating}</p>
//                             {location.country}<br/>
//                             <p className='details-button' onClick={() => LocationDetails(location)}>Details</p>
//                         </Popup>
//                     </Marker>
//                 ))}
//                 {polylinePositions.length === 2 && (
//                     <Polyline positions={polylinePositions} color="red" />
//                 )}
//             </MapContainer>
//             <BottomSection
//                 locations={locations}
//                 PoitOfInterests={PoitOfInterests}
//                 userid={userid}
//                 onLocationClick={handleLocationClick}
//                 OnAddButtonClick={handlePointOfInterestClick}
//                 OnDeleteButtonClick={handleDeletePointOfInterest}
//                 OnMyLocationButtonClick = {handleGetLocationClick}
//                 OnNavigateButtonClick={handleNavigation}
//                 searchTerm={searchTerm}
//                 onSortChange={handleSortChange}
//                 onCategoryChange={handleCategoryChange}
//                 categories={categories}
//                 sortOption={sortOption}
//                 isLoading={loading}
//                 loc={mapCenter}
//             />
//         </div>
//     );
// }

// export default MapComponent;




































///////////////////// Below is the Working code to display all locations on map ///////////////////// 

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomSection from '../BottomSection/BottomSection';
import './MapComponent.css';
import Swal from 'sweetalert2';
import axios from 'axios';

// Fix for default marker icon issues in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper component to handle map center changes
const SetMapCenter = ({ center }) => {
    const map = useMap(); 
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom());
        }
    }, [center, map]);
    return null;
};

const MapComponent = () => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState({});
    const [currentLocation, setCurrentLocation] = useState(null);
    const [mapCenter, setMapCenter] = useState([41.5309, -8.61967]);  // Default center before fetching user's location
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOption, setSortOption] = useState("rating");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [PoitOfInterests, setPoitOfInterests] = useState([]);
    const [polylinePositions, setPolylinePositions] = useState([]); // State for polyline
    const userid = sessionStorage.getItem('userId');

    // Function to fetch POIs data
    const fetchPoitOfInterests = async () => {
        try {
            const response = await fetch('https://squid-app-ni9et.ondigitalocean.app/pois');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setPoitOfInterests(data);
        } catch (error) {
            console.error('Error fetching POIs:', error);
        }
    };

    // Function to fetch other data (locations, etc.)
    const fetchLocations = async () => {
        try {
            const response = await fetch('https://squid-app-ni9et.ondigitalocean.app/maps_graded');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setLocations(data);
            setFilteredLocations(data); // Initialize filteredLocations with all locations
            setLoading(false);
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLoading(false);
        }
    };

    // Fetch locations and POIs on component mount
    useEffect(() => {
        fetchLocations();
        fetchPoitOfInterests();
        
        // Fetch user's location and set it as map center
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                    setMapCenter([latitude, longitude]);
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    }, []);

    const handleGetLocationClick = () => {
        if (currentLocation) {
            setMapCenter(currentLocation);
            setPolylinePositions([]);
        } else {
            console.error('Current location is not available.');
        }
    };

    const handleLocationClick = (location) => {
        setSelectedLocation(location);
        setMapCenter([location.latitude, location.longitude]);

        // Calculate distances for all locations including the selected one
        const locationsWithDistance = locations.map(loc => ({
            ...loc,
            distance: Math.sqrt(
                Math.pow(loc.latitude - location.latitude, 2) +
                Math.pow(loc.longitude - location.longitude, 2)
            )
        }));

        // Sort by distance and select the top 50 including the selected location
        const sortedLocations = locationsWithDistance
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 50);

        setFilteredLocations(locations);
    };

    const handlePointOfInterestClick = async (location) => {
        const data = {
            userid,
            name: location.name,
            address: location.address,
            rating: location.rating,
            latitude: location.latitude,
            longitude: location.longitude,
            place_id: location.place_id,
            category: location.category,
            country: location.country,
            description: location.description,
            photo_url: location.photo_url,
            fact1: location.fact1,
            fact2: location.fact2,
            fact3: location.fact3,
        };

        try {
            await axios.post('https://squid-app-ni9et.ondigitalocean.app/pois', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Point of Interest has been saved",
                showConfirmButton: false,
                timer: 1500
            });

            // Reload POIs data to reflect the new POI
            fetchPoitOfInterests();
        } catch (error) {
            console.error('Error adding POI:', error.response ? error.response.data : error.message);
        }
    };

    const handleDeletePointOfInterest = async (id) => {
        try {
            await axios.delete(`https://squid-app-ni9et.ondigitalocean.app/pois/${id}`);
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Point of Interest has been deleted",
                showConfirmButton: false,
                timer: 1500
            });
            fetchPoitOfInterests(); // Refresh POIs list
        } catch (error) {
            Swal.fire({
                position: "top-end",
                icon: "error",
                title: "Failed to delete Point of Interest",
                text: error.response ? error.response.data.error : error.message,
                showConfirmButton: true
            });
        }
    };

    const handleNavigation = (location) => {
        if (currentLocation) {
            setPolylinePositions([currentLocation, [location.latitude, location.longitude]]);
            setMapCenter([location.latitude, location.longitude]);
        }
    };

    const searchedLocationClick = () => {
        if (searchTerm === "") {
            Swal.fire({
                title: "Empty Search",
                text: "Write Something in Search Bar!",
                icon: "warning"
            });
            return;
        }

        const filtered = locations
            .filter(location =>
                location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.id > b.id ? -1 : 1);

        filtered.forEach((location) => {
            setMapCenter([location.latitude, location.longitude]);
        });

        setFilteredLocations(filtered);
    };

    const handleSortChange = (event) => {
        setSortOption(event.target.value);
    };

    const handleCategoryChange = (event) => {
        const value = event.target.value;
        setCategories(prevCategories =>
            prevCategories.includes(value)
                ? prevCategories.filter(cat => cat !== value)
                : [...prevCategories, value]
        );
    };

    function LocationDetails(location1) {
        Swal.fire({
            title: `${location1.name}`,
            html: `
                ${location1.country},
                ${location1.address}<br/>
                <b> Rating: </b>${location1.rating}&#9734;<br/>
                <p>${location1.description}</p>
                <b> Facts </b>
                <p>${location1.fact1}</p> 
                <p>${location1.fact2}</p>
                <p>${location1.fact3}</p>
            `,
            text: `${location1.description}`,
            imageUrl: `${location1.photo_url}`,
            imageAlt: "Custom image",
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: `<i class="fa fa-thumbs-up"></i> Great!`,
            confirmButtonAriaLabel: "Thumbs up, great!",
            cancelButtonText: `<i class="fa fa-thumbs-down"></i>`,
            cancelButtonAriaLabel: "Thumbs down"
        });
    }

    return (
        <div className="map-container">
            <div className="search-container">
                <button type="submit" onClick={searchedLocationClick}>
                    <i className="fa fa-search"></i>
                </button>
                <input type="text" placeholder="Search..." onChange={(event) => setSearchTerm(event.target.value)} />
                <button className='location-button' onClick={handleGetLocationClick}>
                    <i className="fas fa-location-arrow"></i>
                </button>
            </div>
            <MapContainer center={mapCenter} zoom={23} className="leaflet-map">
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <SetMapCenter center={mapCenter} />
                {currentLocation && (
                    <Marker position={currentLocation}>
                        <Popup>Your Current Location</Popup>
                    </Marker>
                )}
                {filteredLocations.map(location => (
                    <Marker
                        key={location.id}
                        position={[location.latitude, location.longitude]}
                        icon={L.icon({
                            iconUrl: selectedLocation && selectedLocation.id === location.id
                                ? 'https://static.vecteezy.com/system/resources/previews/022/187/606/non_2x/map-location-pin-icon-free-png.png'
                                : 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            shadowSize: [41, 41]
                        })}
                    >
                        <Popup>
                            <strong>{location.name}</strong><br />
                            <p style={{ color: 'blue' }}>Rating: {location.rating}</p>
                            {location.country}<br/>
                            <p className='details-button' onClick={() => LocationDetails(location)}>Details</p>
                        </Popup>
                    </Marker>
                ))}
                {polylinePositions.length === 2 && (
                    <Polyline positions={polylinePositions} color="red" />
                )}
            </MapContainer>
            <BottomSection
                locations={locations}
                PoitOfInterests={PoitOfInterests}
                userid={userid}
                onLocationClick={handleLocationClick}
                OnAddButtonClick={handlePointOfInterestClick}
                OnDeleteButtonClick={handleDeletePointOfInterest}
                OnMyLocationButtonClick={handleGetLocationClick}
                OnNavigateButtonClick={handleNavigation}
                searchTerm={searchTerm}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                sortOption={sortOption}
                isLoading={loading}
                loc={mapCenter}
            />
        </div>
    );
};

export default MapComponent;




































