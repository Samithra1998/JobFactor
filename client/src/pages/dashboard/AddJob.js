import { FormRow, Alert, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useAppContext } from "../../context/appContext";

const AddJob = () => {
  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    handleChange({ name, value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company) {
      return displayAlerts();
    }
    if (isEditing) {
      editJob();
    } else {
      createJob();
    }
  };
  const {
    showAlert,
    isLoading,
    displayAlerts,
    company,
    position,
    jobTypeOptions,
    jobLocation,
    jobType,
    statusOptions,
    status,
    isEditing,
    handleChange,
    clearValues,
    createJob,
    editJob,
  } = useAppContext();
  return (
    <Wrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>{!isEditing ? "Add Job" : "Edit Job"}</h3>
        {showAlert && <Alert />}
        <div className="form-center">
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
          />
          <FormRow
            type="text"
            name="jobLocation"
            labelText="job Location"
            value={jobLocation}
            handleChange={handleJobInput}
          />
          <FormRowSelect
            name="status"
            value={status}
            handleChange={handleJobInput}
            list={statusOptions}
          />
          <FormRowSelect
            name="jobType"
            value={jobType}
            handleChange={handleJobInput}
            list={jobTypeOptions}
            labelText="Job Type"
          />
          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              disabled={isLoading}
            >
              Submit
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
              className="btn btn-block clear-btn"
            >
              Clear
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddJob;
