import { useAppContext } from "../../context/appContext"
import { JobsContainer,SearchContainer } from "../../components"

const AllJobs = () => {
  const {getJobs} = useAppContext()
  return (
    <div>
      <SearchContainer/>
      <JobsContainer/>
    </div>
  )
}
export default AllJobs