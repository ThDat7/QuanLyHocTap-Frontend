import React, { useCallback, useEffect, useState } from 'react'
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import Urls from '../../configs/Urls'
import Apis, { authApis, endpoints } from '../../configs/Apis'

const Search = () => {
  const [kw, setKw] = useState('')
  const [courseOutlineSuggestions, setCourseOutlineSuggestions] = useState([])
  const [educationProgramSuggestion, setEducationProgramSuggestion] = useState(
    []
  )
  const [isSearching, setIsSearching] = useState(false)
  const nav = useNavigate()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!kw) {
        setCourseOutlineSuggestions([])
        setEducationProgramSuggestion([])
        return
      }
      try {
        const res = await authApis.get(
          `${endpoints['searchEducationProgram']}?kw=${kw}`
        )
        setCourseOutlineSuggestions(res.data.result[0].data)
        setEducationProgramSuggestion(res.data.result[1].data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchSuggestions()
  }, [kw])

  function onKeyDown(e) {
    if (e.key === 'Enter') {
      const withKwParam = `${Urls['searchEducationProgram']}?kw=${kw}`
      nav(withKwParam)
      setIsSearching(false)
    }
  }

  return (
    <>
      <div className='mb-3'>
        <Form.Control
          placeholder='Tìm kiếm...'
          onChange={(e) => setKw(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onKeyDown={onKeyDown}
          onBlur={() => setTimeout(() => setIsSearching(false), 200)}
        />
        <div style={{ position: 'relative' }}>
          {isSearching &&
            (courseOutlineSuggestions.length > 0 ||
              educationProgramSuggestion.length > 0) && (
              <div
                style={{
                  minHeight: '100px',
                  backgroundColor: '#c2c2c2',
                  padding: '10px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: 100,
                }}
                onMouseEnter={() => setIsSearching(true)}
              >
                {courseOutlineSuggestions.length > 0 && (
                  <div
                    style={{
                      fontSize: '15px',
                      color: '#0d6efd',
                      userSelect: 'none',
                    }}
                  >
                    Đề cương môn học
                  </div>
                )}
                {courseOutlineSuggestions.map((_) => {
                  let url = `${Urls['course-outline-view']}${_.id}`
                  return (
                    <React.Fragment key={_.id}>
                      <div>
                        <Link to={url}>
                          {_.courseName} - Khóa {_.years.join(', ')}
                        </Link>
                      </div>
                    </React.Fragment>
                  )
                })}
                {educationProgramSuggestion.length > 0 && (
                  <div
                    style={{
                      fontSize: '15px',
                      color: '#0d6efd',
                      userSelect: 'none',
                    }}
                  >
                    Chương trình đào tạo
                  </div>
                )}
                {educationProgramSuggestion.map((_) => {
                  let url = `${Urls['educationProgramView']}${_.id}`
                  return (
                    <React.Fragment key={_.id}>
                      <div>
                        <Link to={url}>
                          {_.majorName} - Khóa {_.schoolYear}
                        </Link>
                      </div>
                    </React.Fragment>
                  )
                })}
              </div>
            )}
        </div>
      </div>
    </>
  )
}

export default Search
