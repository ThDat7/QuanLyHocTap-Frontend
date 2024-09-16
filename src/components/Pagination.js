import Pagination from 'react-bootstrap/Pagination'

const Page = ({ currentPage, setCurrentPage, total, pageSize = 10 }) => {
  const totalPage = Math.ceil(total / pageSize)

  return (
    <>
      {totalPage > 1 && (
        <Pagination>
          {[...Array(totalPage)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  )
}

export default Page
