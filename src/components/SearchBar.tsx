import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm.trim());
    }
  }, [searchTerm, onSearch]);

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="🔍 Buscar recetas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />
    </div>
  );
};

export default SearchBar;
