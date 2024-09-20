import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Search from './Search'
import Urls from '../../configs/Urls'
import Apis, { authApis, endpoints } from '../../configs/Apis'
import Page from '../Pagination'
import { Form } from 'react-bootstrap'

const SearchResult = () => {
  const [searchParam] = useSearchParams()
  const kw = searchParam.get('kw') || ''
  const nav = useNavigate()

  const [courseOutlines, setCourseOutlines] = useState([])
  const [educationPrograms, setEducationPrograms] = useState([])

  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(
    parseInt(searchParam.get('page') || 1)
  )

  let years = []
  for (let i = new Date().getFullYear(); i >= 2010; i--) years.push(i)

  const [creditFilter, setCreditFilter] = useState('')
  const [yearFilter, setYearFilter] = useState('')

  useEffect(() => {
    const fetchAssigns = async () => {
      try {
        const creditFilterParam = creditFilter ? `&credits=${creditFilter}` : ''
        const yearFilterParam = yearFilter ? `&year=${yearFilter}` : ''

        const res = await authApis.get(
          `${endpoints['searchEducationProgram']}?kw=${kw}&page=${currentPage}${creditFilterParam}${yearFilterParam}`
        )
        setCourseOutlines(res.data.result[0].data)
        setEducationPrograms(res.data.result[1].data)
        setTotal(
          res.data.result[0].total > res.data.result[1].total
            ? res.data.result[0].total
            : res.data.result[1].total
        )
      } catch (e) {
        console.error(e)
      }
    }
    fetchAssigns()
  }, [kw, yearFilter, creditFilter, currentPage])

  return (
    <>
      <Search />
      <div>
        <label htmlFor='credit'>Số tín chỉ</label>
        <select id='credit' onChange={(e) => setCreditFilter(e.target.value)}>
          <option value=''></option>
          {[1, 2, 3, 4].map((_) => (
            <option key={_} value={_}>
              {_}
            </option>
          ))}
        </select>

        <label htmlFor='year'>Năm học</label>
        <select id='year' onChange={(e) => setYearFilter(e.target.value)}>
          <option value=''></option>
          {years.map((_) => (
            <option key={_} value={_}>
              {_}
            </option>
          ))}
        </select>

        <Page
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          total={total}
          pageSize={10}
        />

        {educationPrograms.length > 0 && (
          <div>
            <h2>Chương trình đào tạo</h2>
            {educationPrograms.map((_) => (
              <Link key={_.id} to={`${Urls['educationProgramView']}${_.id}`}>
                <div className='border p-3'>
                  <p className='m-0'>{_.majorName}</p>
                  <p className='m-0'>Khóa {_.schoolYear}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {courseOutlines.length > 0 && (
          <div>
            <h2>Đề cương môn học</h2>
            {courseOutlines.map((_) => (
              <Link key={_.id} to={_.url}>
                <div className='border p-3'>
                  <p className='m-0'>{_.courseName}</p>
                  <p className='m-0'>Giáo viên: {_.teacherName}</p>
                  <p className='m-0'>Số tín chỉ: {_.courseCredits}</p>
                  <p className='m-0'>Khóa học: {_.years.join(', ')}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {courseOutlines.length === 0 && educationPrograms.length === 0 && (
          <div>Không tìm thấy kết quả</div>
        )}
      </div>
    </>
  )
}

export default SearchResult
