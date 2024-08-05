import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomSection from '../BottomSection/BottomSection';
import './MapComponent.css';
import Swal from 'sweetalert2';

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
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [searchTerm, setSearchTerm] = useState("");
    
   
    const [sortOption, setSortOption] = useState("rating");
    const [categories, setCategories] = useState([]);
    
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        // Define an async function to fetch data
        const fetchData = async () => {
            try {
                // Fetch data from the API
                const response = await fetch('https://squid-app-ni9et.ondigitalocean.app/maps_graded');
                
                // Check if the response is OK
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // Parse the JSON data
                const data = await response.json();

                // Log the data to the console
                console.log('Fetched data:', data);
                setLocations(data)
                setLoading(false); // Data has been fetched
            } catch (error) {
                // Handle any errors
                console.error('Error fetching data:', error);
                setLoading(false); // Data fetch failed
            }
        };
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setCurrentLocation([latitude, longitude]);
                },
                (error) => {
                    console.error('Error fetching current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
        // Call the async function
        fetchData();
    }, []); // Empty dependency array ensures this runs only once on mount

    const handleGetLocationClick = () => {
        if (currentLocation) {
            setMapCenter(currentLocation);
        } else {
            console.error('Current location is not available.');
        }
    };

    const handleLocationClick = (location) => {
        console.log('Location clicked:', location);
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
    
        console.log('Nearby locations:', sortedLocations);
        setFilteredLocations(sortedLocations);
    };
    
    
    const searchedLocationClick = () => {
        // Check if searchTerm is empty
        if (searchTerm === "") {
            Swal.fire({
                title: "Empty Search",
                text: "Write Something in Search Bar!",
                icon: "warning"
            });
            return; // Exit the function if no search term
        }
      
        // Filter and sort locations
        const filtered = locations
            .filter(location => 
                location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
                location.address.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.id > b.id ? -1 : 1);
      
        // Update the map center and filtered locations
        filtered.forEach((location, ind) => {
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
// console.log(currentLocation,mapCenter)
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
            <MapContainer center={mapCenter} zoom={13} className="leaflet-map">
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
                            <p style={{ color: 'blue' }}>{location.rating}</p>
                            {location.country}
                        </Popup>
                    </Marker>
                ))}

{/* {filteredLocations.map(location => {
    // Check if the current location is the selected location
    console.log(selectedLocation.id, location.id)
    if (selectedLocation && selectedLocation.id === location.id) {
        // Log both the selectedLocation.id and location.id
        console.log('Selected Location ID:', selectedLocation.id);
        console.log('Current Location ID:', location.id);
    }

    return (
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
                <p style={{ color: 'blue' }}>{location.rating}</p>
                {location.country}
            </Popup>
        </Marker>
    );
})} */}



            </MapContainer>
            
            <BottomSection
                locations={locations}
                onLocationClick={handleLocationClick}
                searchTerm={searchTerm}
                onSortChange={handleSortChange}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                sortOption={sortOption}
                isLoading={loading}
                loc = {mapCenter}
            />
        </div>
    );
}

export default MapComponent;
































































// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import BottomSection from '../BottomSection/BottomSection';
// import './MapComponent.css';
// import Swal from 'sweetalert2';

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
//     const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
//     const [searchTerm, setSearchTerm] = useState("");
    
   
//     const [sortOption, setSortOption] = useState("rating");
//     const [categories, setCategories] = useState([]);
    
//     const [loading, setLoading] = useState(true); // Add loading state

//     useEffect(() => {
//         // Define an async function to fetch data
//         const fetchData = async () => {
//             try {
//                 // Fetch data from the API
//                 const response = await fetch('http://localhost:3001/maps_graded');
                
//                 // Check if the response is OK
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok');
//                 }

//                 // Parse the JSON data
//                 const data = await response.json();

//                 // Log the data to the console
//                 console.log('Fetched data:', data);
//                 setLocations(data)
//                 setLoading(false); // Data has been fetched
//             } catch (error) {
//                 // Handle any errors
//                 console.error('Error fetching data:', error);
//                 setLoading(false); // Data fetch failed
//             }
//         };
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const { latitude, longitude } = position.coords;
//                     setCurrentLocation([latitude, longitude]);
//                 },
//                 (error) => {
//                     console.error('Error fetching current location:', error);
//                 }
//             );
//         } else {
//             console.error('Geolocation is not supported by this browser.');
//         }
//         // Call the async function
//         fetchData();
//     }, []); // Empty dependency array ensures this runs only once on mount

//     const handleGetLocationClick = () => {
//         if (currentLocation) {
//             setMapCenter(currentLocation);
//         } else {
//             console.error('Current location is not available.');
//         }
//     };

//     const handleLocationClick = (location) => {
//         console.log('Location clicked:', location);
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
    
//         console.log('Nearby locations:', sortedLocations);
//         setFilteredLocations(sortedLocations);
//     };
    
    
//     const searchedLocationClick = () => {
//         // Check if searchTerm is empty
//         if (searchTerm === "") {
//             Swal.fire({
//                 title: "Empty Search",
//                 text: "Write Something in Search Bar!",
//                 icon: "warning"
//             });
//             return; // Exit the function if no search term
//         }
      
//         // Filter and sort locations
//         const filtered = locations
//             .filter(location => 
//                 location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 location.address.toLowerCase().includes(searchTerm.toLowerCase())
//             )
//             .sort((a, b) => a.id > b.id ? -1 : 1);
      
//         // Update the map center and filtered locations
//         filtered.forEach((location, ind) => {
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
// // console.log(currentLocation,mapCenter)
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
//                             <p style={{ color: 'blue' }}>{location.rating}</p>
//                             {location.country}
//                         </Popup>
//                     </Marker>
//                 ))}

// {/* {filteredLocations.map(location => {
//     // Check if the current location is the selected location
//     console.log(selectedLocation.id, location.id)
//     if (selectedLocation && selectedLocation.id === location.id) {
//         // Log both the selectedLocation.id and location.id
//         console.log('Selected Location ID:', selectedLocation.id);
//         console.log('Current Location ID:', location.id);
//     }

//     return (
//         <Marker
//             key={location.id}
//             position={[location.latitude, location.longitude]}
//             icon={L.icon({
//                 iconUrl: selectedLocation && selectedLocation.id === location.id
//                     ? 'https://static.vecteezy.com/system/resources/previews/022/187/606/non_2x/map-location-pin-icon-free-png.png'
//                     : 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
//                 iconSize: [25, 41],
//                 iconAnchor: [12, 41],
//                 popupAnchor: [1, -34],
//                 shadowSize: [41, 41]
//             })}
//         >
//             <Popup>
//                 <strong>{location.name}</strong><br />
//                 <p style={{ color: 'blue' }}>{location.rating}</p>
//                 {location.country}
//             </Popup>
//         </Marker>
//     );
// })} */}



//             </MapContainer>
            
//             <BottomSection
//                 locations={locations}
//                 onLocationClick={handleLocationClick}
//                 searchTerm={searchTerm}
//                 onSortChange={handleSortChange}
//                 onCategoryChange={handleCategoryChange}
//                 categories={categories}
//                 sortOption={sortOption}
//                 isLoading={loading}
//                 loc = {mapCenter}
//             />
//         </div>
//     );
// }

// export default MapComponent;































































