import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Homepage.css';

const products = [
    { id: 1, name: "Pullover", brand: "Mango", category: "T-shirts", price: "$15", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { id: 2, name: "Blouse", brand: "Dorothy Perkins", category: "Crop tops", price: "$34", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" },
    { id: 3, name: "T-shirt", brand: "LOST INK", category: "T-shirts", price: "$12", image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" },
    { id: 4, name: "Jacket", brand: "Zara", category: "Sleeveless", price: "$50", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFja2V0fGVufDB8fDB8fHww" },
    { id: 5, name: "Sweater", brand: "H&M", category: "T-shirts", price: "$25", image: "https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dlYXRlcnxlbnwwfHwwfHx8MA%3D%3D" },
    { id: 6, name: "Jeans", brand: "Levi's", category: "Crop tops", price: "$40", image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amVhbnN8ZW58MHx8MHx8fDA%3D" },
    { id: 7, name: "Dress", brand: "Forever 21", category: "Sleeveless", price: "$30", image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRyZXNzfGVufDB8fDB8fHww" },
    { id: 8, name: "Shorts", brand: "Nike", category: "T-shirts", price: "$20", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnRzfGVufDB8fDB8fHww" },
    { id: 9, name: "Shoes", brand: "Adidas", category: "Crop tops", price: "$60", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8MHx8fDA%3D" },
];

function Homepage() {
    const [filteredCategory, setFilteredCategory] = useState("All");
    const [filteredPrice, setFilteredPrice] = useState([0, 100]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleCategoryFilter = (category) => setFilteredCategory(category);
    const handlePriceFilter = (min, max) => setFilteredPrice([min, max]);
    const resetFilters = () => {
        setFilteredCategory("All");
        setFilteredPrice([0, 100]);
        setSearchQuery("");
        setSearchResult([]);
    };

    const handleSearch = () => {
        const filtered = products.filter((product) => {
            const price = parseInt(product.price.replace('$', ''));
            const isCategoryMatch = filteredCategory === "All" || product.category === filteredCategory;
            const isPriceInRange = price >= filteredPrice[0] && price <= filteredPrice[1];
            const isSearchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            return isCategoryMatch && isPriceInRange && isSearchMatch;
        });
        setSearchResult(filtered);
    };

    const filteredProducts = searchResult.length > 0 ? searchResult : products.filter((product) => {
        const price = parseInt(product.price.replace('$', ''));
        const isCategoryMatch = filteredCategory === "All" || product.category === filteredCategory;
        const isPriceInRange = price >= filteredPrice[0] && price <= filteredPrice[1];
        return isCategoryMatch && isPriceInRange;
    });

    return (
        <div className="container">
            <div className="sidebar">
                <h2>Category Filters</h2>
                <div className="category-buttons">
                    <button onClick={() => handleCategoryFilter("All")}>All</button>
                    <button onClick={() => handleCategoryFilter("T-shirts")}>T-shirts</button>
                    <button onClick={() => handleCategoryFilter("Crop tops")}>Crop tops</button>
                    <button onClick={() => handleCategoryFilter("Sleeveless")}>Sleeveless</button>
                </div>
                <div className="price-filter">
                    <h3>Price Filter</h3>
                    <input type="number" placeholder="Min price" onChange={(e) => handlePriceFilter(Number(e.target.value), filteredPrice[1])} />
                    <input type="number" placeholder="Max price" onChange={(e) => handlePriceFilter(filteredPrice[0], Number(e.target.value))} />
                </div>
                <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
            </div>

            <div className="main-content">
                <h1 className="title">Cosysta Ecommerce</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="search-button" onClick={handleSearch}>Search</button>
                </div>

                <div className="product-grid">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="product-card">
                            <img src={product.image} alt={product.name} className="product-image" />
                            <h2 className="product-name">{product.name}</h2>
                            <p className="product-brand">{product.brand}</p>
                            <p className="product-price">{product.price}</p>
                            <button className="add-to-cart">Add to Cart</button>
                        </div>
                    ))}
                </div>

                {/* 🚀 Vendor Dashboard Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link to="/vendordashboard/:vendorId">
                        <button style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '5px' }}>
                            Go to Vendor Dashboard
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Homepage;



// import React, { useState } from 'react';
// import './Homepage.css';

// const products = [
//     { id: 1, name: "Pullover", brand: "Mango", category: "T-shirts", price: "$15", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1372&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
//     { id: 2, name: "Blouse", brand: "Dorothy Perkins", category: "Crop tops", price: "$34", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" },
//     { id: 3, name: "T-shirt", brand: "LOST INK", category: "T-shirts", price: "$12", image: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fGNsb3RoZXN8ZW58MHx8MHx8fDA%3D" },
//     { id: 4, name: "Jacket", brand: "Zara", category: "Sleeveless", price: "$50", image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8amFja2V0fGVufDB8fDB8fHww" },
//     { id: 5, name: "Sweater", brand: "H&M", category: "T-shirts", price: "$25", image: "https://images.unsplash.com/photo-1581497396202-5645e76a3a8e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3dlYXRlcnxlbnwwfHwwfHx8MA%3D%3D" },
//     { id: 6, name: "Jeans", brand: "Levi's", category: "Crop tops", price: "$40", image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8amVhbnN8ZW58MHx8MHx8fDA%3D" },
//     { id: 7, name: "Dress", brand: "Forever 21", category: "Sleeveless", price: "$30", image: "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGRyZXNzfGVufDB8fDB8fHww" },
//     { id: 8, name: "Shorts", brand: "Nike", category: "T-shirts", price: "$20", image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hvcnRzfGVufDB8fDB8fHww" },
//     { id: 9, name: "Shoes", brand: "Adidas", category: "Crop tops", price: "$60", image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8c2hvZXN8ZW58MHx8MHx8fDA%3D" },
//   ];
  
//   export default function EcommerceGrid() {
//     const [filteredCategory, setFilteredCategory] = useState("All");
//     const [filteredPrice, setFilteredPrice] = useState([0, 100]); // Default price filter
//     const [searchQuery, setSearchQuery] = useState("");
  
//     const handleCategoryFilter = (category) => {
//       setFilteredCategory(category);
//     };
  
//     const handlePriceFilter = (minPrice, maxPrice) => {
//       setFilteredPrice([minPrice, maxPrice]);
//     };
  
//     const handleSearch = (e) => {
//       setSearchQuery(e.target.value);
//     };
  
//     const resetFilters = () => {
//       setFilteredCategory("All");
//       setFilteredPrice([0, 100]);
//       setSearchQuery("");
//     };
  
//     const filteredProducts = products.filter((product) => {
//       const price = parseInt(product.price.replace('$', ''));
//       const isCategoryMatch = filteredCategory === "All" || product.category === filteredCategory;
//       const isPriceInRange = price >= filteredPrice[0] && price <= filteredPrice[1];
//       const isSearchMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
  
//       return isCategoryMatch && isPriceInRange && isSearchMatch;
//     });
  
//     return (
//       <div className="container">
//         <div className="sidebar">
//           <h2>Filters</h2>
//           <div className="category-buttons">
//             <button onClick={() => handleCategoryFilter("All")}>All</button>
//             <button onClick={() => handleCategoryFilter("T-shirts")}>T-shirts</button>
//             <button onClick={() => handleCategoryFilter("Crop tops")}>Crop tops</button>
//             <button onClick={() => handleCategoryFilter("Sleeveless")}>Sleeveless</button>
//           </div>
//           <div className="price-filter">
//             <h3>Price</h3>
//             <input
//               type="number"
//               placeholder="Min price"
//               onChange={(e) => handlePriceFilter(Number(e.target.value), filteredPrice[1])}
//             />
//             <input
//               type="number"
//               placeholder="Max price"
//               onChange={(e) => handlePriceFilter(filteredPrice[0], Number(e.target.value))}
//             />
//           </div>
//           <button className="reset-filters" onClick={resetFilters}>Reset Filters</button>
//         </div>
  
//         <div className="main-content">
//           <h1 className="title">Cosysta Ecommerce</h1>
//           <div className="search-bar">
//             <input
//               type="text"
//               className="search-input"
//               placeholder="Search products..."
//               value={searchQuery}
//               onChange={handleSearch}
//             />
//             <button className="search-button">Search</button>
//           </div>
  
//           <div className="product-grid">
//             {filteredProducts.map((product) => (
//               <div key={product.id} className="product-card">
//                 <img src={product.image} alt={product.name} className="product-image" />
//                 <h2 className="product-name">{product.name}</h2>
//                 <p className="product-brand">{product.brand}</p>
//                 <p className="product-price">{product.price}</p>
//                 <button className="add-to-cart">Add to Cart</button>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }