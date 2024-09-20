import { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { Link, useSearchParams } from 'react-router-dom'
import Page from '../Pagination'

const CourseOutline = () => {
  const [courseOutlines, setCourseOutlines] = useState([])
  const [total, setTotal] = useState(0)

  const [searchParam] = useSearchParams()
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  useEffect(() => {
    const fetchCourseOutlines = async () => {
      try {
        const res = await authApis.get(
          `${endpoints['teacherCourseOutlines']}?page=${currentPage}`
        )
        setTotal(res.data.result.total)
        setCourseOutlines(res.data.result.data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchCourseOutlines()
  }, [currentPage])

  if (courseOutlines.length === 0)
    return (
      <>
        <h3 className='text-center mt-3'>
          Hiện không có đề cương được phân công
        </h3>
      </>
    )

  return (
    <>
      <Table hover bordered striped>
        <thead>
          <tr>
            <th>Môn học</th>
            <th>Mã môn</th>
            <th>Ngày hết hạn</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {courseOutlines.map((_) => {
            let url = `${Urls['teacherCourseOutlineView']}${_.id}`
            return (
              <tr key={_.id}>
                <td>{_.courseName}</td>
                <td>{_.courseCode}</td>
                <td>{_.deadline}</td>
                <td>
                  <Link className='btn btn-success' to={url}>
                    Chi tiết
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>

      <Page
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        total={total}
      />
    </>
  )
}

export default CourseOutline
