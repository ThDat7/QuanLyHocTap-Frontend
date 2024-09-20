import { useEffect, useState } from 'react'
import Apis, { authApis, endpoints } from '../../configs/Apis'
import { Link, useParams } from 'react-router-dom'
import { Col, Container, Row } from 'react-bootstrap'

const EducationPrograms = () => {
  const [educationProgram, setEducationProgram] = useState(null)
  const { id } = useParams()

  if (educationProgram)
    console.log(
      [...Array(12)].map((e, i) => {
        return (
          <Col md={4} className='col-4 border'>
            <div className='d-flex justify-content-center border-bottom p-2'>
              Học kỳ {i}
            </div>
            <div className='ps-3 py-2 list-group list-group-numbered'>
              {educationProgram.educationProgramCourses
                .filter((epc) => epc.semester === i)
                .map((epc) => (
                  <div className='list-group-item'>{epc.courseName}</div>
                ))}
            </div>
          </Col>
        )
      })
    )

  useEffect(() => {
    const fetchEducationProgram = async () => {
      try {
        const res = await authApis.get(endpoints['education-program-view'](id))
        setEducationProgram(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchEducationProgram()
  }, [id])

  return (
    <>
      {educationProgram && (
        <>
          <h1 className='text-center'>
            Chương trình đào tạo: {educationProgram.majorName}
          </h1>
          <h1 className='text-center'>Khóa {educationProgram.schoolYear}</h1>
          <Container>
            <Row>
              {[
                ...Array(
                  Math.max(
                    ...educationProgram.educationProgramCourses.map(
                      (epc) => epc.semester
                    )
                  )
                ),
              ].map((e, i) => {
                return (
                  <Col md={4} className='col-4 border'>
                    <div className='d-flex justify-content-center border-bottom p-2'>
                      Học kỳ {i + 1}
                    </div>
                    <div className='ps-3 py-2 list-group list-group-numbered'>
                      {educationProgram.educationProgramCourses
                        .filter((epc) => epc.semester === i + 1)
                        .map((epc) => {
                          let url = epc.courseOutlineUrl

                          if (url)
                            return (
                              <div className='list-group-item'>
                                {epc.courseOutlineId ? (
                                  <Link to={url}>{epc.courseName}</Link>
                                ) : (
                                  <>{epc.courseName}</>
                                )}
                              </div>
                            )
                          else
                            return (
                              <div className='list-group-item'>
                                {epc.courseName}
                              </div>
                            )
                        })}
                    </div>
                  </Col>
                )
              })}
            </Row>
          </Container>
        </>
      )}
    </>
  )
}

export default EducationPrograms
