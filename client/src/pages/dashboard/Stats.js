import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import {
  StatItem,
  StatsContainer,
  ChartsContainer,
  Loading,
} from "../../components";

const Stats = () => {
  const { statJobs, stats, monthlyApplications, isLoading } = useAppContext();

  useEffect(() => {
    statJobs();
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <StatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};
export default Stats;
