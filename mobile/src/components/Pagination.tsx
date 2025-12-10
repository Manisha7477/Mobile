import React from "react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  goToPage: (page: number) => void
  goToNextPage: () => void
  goToPreviousPage: () => void
  itemsPerPage: number
  setItemsPerPage: (itemsPerPage: number) => void
  itemsPerPageOptions: number[]
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  goToPage,
  goToNextPage,
  goToPreviousPage,
  itemsPerPage,
  setItemsPerPage,
  itemsPerPageOptions,
}) => {
  const renderPaginationButtons = () => {
    const maxPageButtons = 10
    const halfMaxPageButtons = Math.floor(maxPageButtons / 2)
    let startPage = currentPage - halfMaxPageButtons
    let endPage = currentPage + halfMaxPageButtons

    if (startPage < 1) {
      startPage = 1
      endPage = Math.min(maxPageButtons, totalPages)
    }

    if (endPage > totalPages) {
      endPage = totalPages
      startPage = Math.max(1, totalPages - maxPageButtons + 1)
    }

    const pageNumbers = []
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="-mt-20 join">
        <button
          className="join-item bg-blue-200 rounded-md border-b border-base-300  px-1 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
          disabled={currentPage === 1}
          onClick={() => goToPage(1)}
        >
          First
        </button>

        <button
          className="join-item bg-blue-200 rounded-md border-b border-base-300 font px-4 py-1 disabled:opacity-50 disabled:text-gray-400 disabled:text-sm disabled:bg-transparent disabled:border-b"
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
        >
          Previous
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`join-item bg-info rounded-md border-b border-base-300 font px-4 py-1 ${
              currentPage === page ? "bg-primary text-white" : ""
            }`}
            onClick={() => goToPage(page)}
          >
            {page}
          </button>
        ))}
        <button
          className="join-item bg-info rounded-md border-b border-base-300 px-4 py-1
             disabled:opacity-50 disabled:text-gray-400 disabled:text-sm
             disabled:bg-transparent disabled:border-b"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={goToNextPage}
        >
          Next
        </button>

        <button
          className="join-item bg-info rounded-md border-b border-base-300 px-4 py-1
             disabled:opacity-50 disabled:text-gray-400 disabled:text-sm
             disabled:bg-transparent disabled:border-b"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => goToPage(totalPages)}
        >
          Last
        </button>
      </div>
    )
  }

  return (
    <div className="flex justify-between items-center gap-4 -mt-12">
      <div className="dropdown dropdown-top -mt-20">
        <div tabIndex={0} role="button" className="btn btn-sm m-1">
          {itemsPerPage} ▼
        </div>
        <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-md w-28">
          {itemsPerPageOptions.map((pageSize) => (
            <li key={pageSize}>
              <button onClick={() => setItemsPerPage(pageSize)}>
                {pageSize}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {renderPaginationButtons()}

      {/* Go to page input */}
      <div className="flex items-center gap-2 -mt-20">
        <span>Go to:</span>
        <input
          type="number"
          value={currentPage}
          min={1}
          max={totalPages}
          onChange={(e) => goToPage(Number(e.target.value))}
          className="btn btn-sm m-1"
        />
      </div>
    </div>
  )
}

export default Pagination
