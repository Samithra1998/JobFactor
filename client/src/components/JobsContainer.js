import { useAppContext } from "../context/appContext";
import Loading from "./Loading";
import { useEffect } from "react";
import Job from "./Job";
import Wrapper from "../assets/wrappers/JobsContainer";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const { getJobs, isLoading, jobs, page, totalJobs,search,searchStatus,searchType,sort,noOfPages } = useAppContext();

  useEffect(() => {
    getJobs();
  }, [search,searchStatus,searchType,sort]);

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h3>No jobs to display..</h3>
      </Wrapper>
    );
  }
  return <Wrapper>
    <h4>
      {totalJobs} job{jobs.length > 1 && 's'} Found
    </h4>
    <div className="jobs">
      {jobs.map((job) => {
        return <Job key={job._id} {...job}/>
      })}
    </div>
    {noOfPages > 1 && <PageBtnContainer/>}
  </Wrapper>;
};
export default JobsContainer;
