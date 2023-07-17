import { FormRow, Alert, FormRowSelect } from "../../components";
import Wrapper from "../../assets/wrappers/DashboardFormPage";
import { useAppContext } from "../../context/appContext";

const AddJob = () => {
  const handleJobInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    console.log(`${name} ${value}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company) {
      return displayAlerts();
    }
    console.log("Job created");
  };
  const {
    showAlert,
    displayAlerts,
    company,
    position,
    jobTypeOptions,
    jobLocation,
    jobType,
    statusOptions,
    status,
    isEditing,
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
            <button type="submit" className="btn btn-block submit-btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </Wrapper>
  );
};
export default AddJob;
