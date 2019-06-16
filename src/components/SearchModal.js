import React, { useState, useEffect } from "react";
import styled from "@emotion/styled";
import ModalCard from "./ModalCard";
import useControlledInput from "./useControlledInput";
import { Modal } from "./useModal";
import { NumMembers, NumMessages } from "./RoomList";
import useDebounce from "./useDebounce";
import prop from "ramda/es/prop";

function useSearch(searchTerm, handleSearch, options = {}) {
  const { shouldClearResults = false } = options;
  const [searchedTerm, setSearchedTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  // Search for the input value
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  useEffect(() => {
    if (debouncedSearchTerm) {
      let didCancel = false;
      setSearchedTerm(debouncedSearchTerm);
      const handleSearchResults = results =>
        !didCancel && setSearchResults(results);
      if (debouncedSearchTerm) {
        handleSearch(debouncedSearchTerm).then(handleSearchResults);
      }
      return () => {
        didCancel = true;
      };
    }
  }, [handleSearch, debouncedSearchTerm]);

  // Clear the search results
  useEffect(() => {
    if (shouldClearResults) {
      setSearchResults([]);
    }
  }, [shouldClearResults]);

  return [searchResults, searchedTerm];
}
function useFilteredSearch(
  inputText,
  handleSearch,
  searchFilter = r => r,
  options,
) {
  const [searchResults, searchTerm] = useSearch(
    inputText,
    handleSearch,
    options,
  );
  const [filteredResults, setFilteredResults] = useState([]);
  useEffect(() => {
    setFilteredResults(searchFilter(searchResults));
  }, [searchFilter, searchResults]);

  return [filteredResults, searchTerm];
}

export default React.memo(function SearchModal({
  handleSearch,
  searchFilter,
  handleSearchResult,
  ...props
}) {
  const [searchInput, searchInputRef] = useControlledInput("", {
    shouldFocusInput: prop.isOpen,
    shouldClearInput: !props.isOpen,
  });
  const focusInput = () => {
    if (props.isOpen) {
      searchInputRef.current && searchInputRef.current.focus();
    }
  };

  const [searchResults, searchTerm] = useFilteredSearch(
    searchInput.value,
    handleSearch,
    searchFilter,
    { shouldClearResults: !props.isOpen },
  );

  return (
    <Modal {...props}>
      <ModalCard heading="Search for Rooms">
        <SearchInput
          ref={searchInputRef}
          placeholder="Room Name"
          searchInput={searchInput}
          focusInput={focusInput}
        />
        <SearchResults
          searchTerm={searchTerm}
          handleSearchResult={handleSearchResult}
          results={searchResults}
        />
      </ModalCard>
    </Modal>
  );
});
const SearchInput = React.forwardRef(function(
  { placeholder, searchInput, focusInput },
  inputRef,
) {
  useEffect(focusInput);
  return (
    <Input
      ref={ref => (inputRef.current = ref)}
      placeholder={placeholder}
      value={searchInput.value}
      onChange={searchInput.onChange}
    />
  );
});
const Input = styled.input`
  flex-grow: 1;
  width: 100%;
  padding: 10px;
  margin-right: 10px;
  border-radius: 4px;
  border: none;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  &:focus {
    outline: 0;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.5);
  }
  background: ${props => props.hasError && "rgba(255, 0, 0, 0.25);"};
`;
function SearchResults({ results, handleSearchResult, searchTerm }) {
  return (
    results.length > 0 && (
      <>
        <ResultsHeading>Results for "{searchTerm}"</ResultsHeading>
        <ResultsList>
          {results.map(result => {
            return (
              <ResultItem
                key={result._id}
                onClick={() => handleSearchResult(result)}
              >
                <ResultName>{result.name}</ResultName>
                <ResultDetails>
                  <NumMembers num={result.members.length} />
                  <NumMessages num={result.messages.length} />
                </ResultDetails>
              </ResultItem>
            );
          })}
        </ResultsList>
      </>
    )
  );
}
const ResultsHeading = styled.h2`
  margin-top: 26px;
  margin-bottom: 8px;
  margin-right: auto;
`;
const ResultsList = styled.ul`
  width: 100%;
  text-align: left;
  list-style: none;
  max-height: 200px;
  overflow-y: scroll;
  box-shadow: 0 0 0 1px #000;
  box-sizing: border-box;
  ::-webkit-scrollbar {
    width: 5px;
    &-track {
      background: #ddd;
    }
    &-thumb {
      background: #666;
    }
  }
`;
const ResultItem = styled.li`
  border-top: 0.5px solid black;
  :first-of-type {
    border-top: none;
  }
  :hover {
    background: lightgrey;
  }
  font-size: 22px;
  line-height: 64px;
  padding: 4px 12px;
  display: flex;
`;
const ResultName = styled.span`
  flex-grow: 1;
`;
const ResultDetails = styled.div``;
