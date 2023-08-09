import { FormRow, FormRowSelect } from ".";
import { useAppContext } from "../context/appContext";
import Wrapper from "../assets/wrappers/SearchContainer";

const SearchContainer = () => {
  const handleSearch = (e) => {
    if (!isLoading) {
      handleChange({ name: e.target.name, value: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    clearFilters()
  };
  const {
    isLoading,
    search,
    searchType,
    searchStatus,
    sort,
    sortOptions,
    statusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();
  return (
    <Wrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            labelText="status"
            name="searchStatus"
            value={searchStatus}
            handleChange={handleSearch}
            list={["all", ...statusOptions]}
          />
          <FormRowSelect
            labelText="Job type"
            name="searchType"
            value={searchType}
            handleChange={handleSearch}
            list={["all", ...jobTypeOptions]}
          />
          <FormRowSelect
            labelText="sort"
            name="sort"
            value={sort}
            handleChange={handleSearch}
            list={["all", ...sortOptions]}
          />
          <button className="btn btn-block btn-danger" onClick={handleSubmit}>
            Clear
          </button>
        </div>
      </form>
    </Wrapper>
  );
};
export default SearchContainer;
