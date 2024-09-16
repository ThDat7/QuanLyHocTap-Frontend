import React, { useEffect, useState } from 'react'
import { Form } from 'react-bootstrap'
import { authApis, endpoints } from '../../configs/Apis'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Urls from '../../configs/Urls'

const CourseOutlineEdit = () => {
  const [courseOutline, setcourseOutline] = useState(null)
  const { id } = useParams()
  const [file, setFile] = useState()
  const nav = useNavigate()

  useEffect(() => {
    const fetchCourseOutline = async () => {
      try {
        const res = await authApis.get(
          endpoints['teacherCourseOutlineView'](id)
        )
        setcourseOutline(res.data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchCourseOutline()
  }, [id])

  async function handleSubmit() {
    if (!file) return

    const data = {
      courseRule: {
        midTermFactor: courseOutline.courseRule.midTermFactor,
        finalTermFactor: courseOutline.courseRule.finalTermFactor,
        passScore: courseOutline.courseRule.passScore,
      },
    }

    const blobData = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    })

    const formData = new FormData()
    formData.append('file', file)
    formData.append('data', blobData)

    const id = courseOutline.id
    try {
      await authApis.post(
        endpoints['teacherUpdateCourseOutline'](id),
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      nav(Urls['teacherCourseOutlines'])
    } catch (error) {
      console.log('Error: ' + error)
    }
  }

  const handleChangeCourseRule = (field, value) => {
    const newCourseOutline = { ...courseOutline }
    newCourseOutline.courseRule[field] = value
    setcourseOutline(newCourseOutline)
  }

  return (
    <>
      {courseOutline && (
        <>
          <p>
            <b>Tên môn học:</b>{' '}
            <Link to={courseOutline.url}>{courseOutline.courseName}</Link>
            <br />
            <b>Mã môn học:</b> {courseOutline.courseCode}
          </p>
          <label htmlFor='midTermFactor'>% điểm giữa kỳ</label>
          <Form.Control
            type='number'
            id='midTermFactor'
            placeholder='% điểm giữa kỳ'
            value={
              courseOutline.courseRule
                ? courseOutline.courseRule.midTermFactor
                : ''
            }
            onChange={(e) =>
              handleChangeCourseRule(
                'midTermFactor',
                parseFloat(e.target.value)
              )
            }
          />

          <label htmlFor='finalTermFactor'>% điểm cuối kỳ</label>
          <Form.Control
            type='number'
            id='finalTermFactor'
            placeholder='% điểm cuối kỳ'
            value={
              courseOutline.courseRule
                ? courseOutline.courseRule.finalTermFactor
                : ''
            }
            onChange={(e) =>
              handleChangeCourseRule(
                'finalTermFactor',
                parseFloat(e.target.value)
              )
            }
          />

          <label htmlFor='passScore'>Điểm qua môn</label>
          <Form.Control
            type='number'
            id='passScore'
            placeholder='Điểm qua môn'
            value={
              courseOutline.courseRule ? courseOutline.courseRule.passScore : ''
            }
            onChange={(e) =>
              handleChangeCourseRule('passScore', parseFloat(e.target.value))
            }
          />

          <label htmlFor='file'>Tải lên đề cương</label>
          <Form.Control
            type='file'
            id='file'
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className='btn btn-success' onClick={handleSubmit}>
            Lưu
          </button>
        </>
      )}
    </>
  )
}

export default CourseOutlineEdit
