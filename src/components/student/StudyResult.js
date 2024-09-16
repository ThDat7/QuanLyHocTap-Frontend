import React, { useEffect, useState } from 'react'
import { Table, Container, Row, Col } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'

const StudyResult = () => {
  const [studyResults, setStudyResults] = useState([])

  useEffect(() => {
    const fetchStudyResultsResponse = async () => {
      try {
        const url = endpoints['studyResult']
        const response = await authApis.get(url)
        setStudyResults(response.data)
      } catch (error) {
        console.error('Failed to fetch study results: ', error)
      }
    }

    fetchStudyResultsResponse()
  }, [])

  return (
    <Container>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã MH</th>
            <th>Nhóm/tổ môn học</th>
            <th>Tên môn học</th>
            <th>Số tín chỉ</th>
            <th>Bài tập</th>
            <th>Quá trình</th>
            <th>Điểm thi</th>
            <th>T2</th>
            <th>Điểm TK (10)</th>
            <th>Điểm TK (4)</th>
            <th>Điểm TK (C)</th>
            <th>Kết quả</th>
          </tr>
        </thead>
      </Table>

      {studyResults &&
        studyResults.length > 0 &&
        studyResults.map((studyResult, index) => (
          <SemesterResult key={index} studyResult={studyResult} />
        ))}
    </Container>
  )
}

const SemesterResult = ({ studyResult }) => {
  return (
    <div>
      {studyResult && (
        <>
          <h4>
            Học kỳ {studyResult.semester} - Năm học {studyResult.year}-
            {studyResult.year + 1}
          </h4>
          <Table striped bordered hover>
            <tbody>
              {studyResult.courses.map((course, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  <td>{course.courseCode}</td>
                  <td>{course.studentClassName}</td>
                  <td>{course.courseName}</td>
                  <td>{course.credits}</td>
                  <td></td>
                  <td>{course.midTermScore}</td>
                  <td>{course.finalTermScore}</td>
                  <td></td>
                  <td>{course.totalScore10}</td>
                  <td>{course.totalScore4}</td>
                  <td>{course.totalScoreLetter}</td>
                  <td>{course.isPassed ? '✓' : 'X'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <div className='summary'>
            <p>Điểm trung bình học kỳ hệ 4: {studyResult.gpa4Semester}</p>
            <p>Số tín chỉ đạt học kỳ: {studyResult.creditsEarnedSemester}</p>
            <p>Điểm trung bình tích lũy hệ 4: {studyResult.gpa4Cumulative}</p>
            <p>Số tín chỉ tích lũy: {studyResult.creditsCumulative}</p>
          </div>
        </>
      )}
    </div>
  )
}

export default StudyResult
