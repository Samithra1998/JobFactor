import { useAppContext } from "../context/appContext";
import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../assets/wrappers/PageBtnContainer";

const PageBtnContainer = () => {
  const { noOfPages, page, changePage } = useAppContext();

  const pages = Array.from({ length: noOfPages }, (_, index) => {
    return index + 1;
  });
  console.log(pages);
  const nextPage = () => {
    let newPage = page + 1;
    if (newPage > noOfPages) {
      newPage = 1;
    }
    changePage(newPage);
  };
  const prePage = () => {
    let newPage = page - 1;
    if (newPage < 1) {
      newPage = noOfPages;
    }
    changePage(newPage);
  };
  return (
    <Wrapper>
      <div className="prev-btn" onClick={prePage}>
        <HiChevronDoubleLeft />
        Pre
      </div>
      <div className="btn-container">
        {pages.map((pageNo, index) => {
          return (
            <button
              type="button"
              key={index}
              className={page === pageNo ? "pageBtn active" : "pageBtn"}
              onClick={() => changePage(pageNo)}
            >
              {pageNo}
            </button>
          );
        })}
      </div>
      <div className="next-btn" onClick={nextPage}>
        Next
        <HiChevronDoubleRight />
      </div>
    </Wrapper>
  );
};
export default PageBtnContainer;
