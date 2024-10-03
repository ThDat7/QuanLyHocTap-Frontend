import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { generatePath, useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import { Form } from 'react-bootstrap'

const CourseClassEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [courseClass, setCourseClass] = useState({
    courseId: '',
    semesterId: '',
  })
  const [courses, setCourses] = useState([])
  const [semesters, setSemesters] = useState([])
  const [teachers, setTeachers] = useState([])
  const [studentClasses, setStudentClasses] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchCourseClass = async () => {
      if (isCreate) return

      try {
        const res = await authApis.get(endpoints['courseClass'](id))
        setCourseClass(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchCourse = async () => {
      try {
        const res = await authApis.get(endpoints['coursesSelectOption'])
        setCourses(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchSemester = async () => {
      try {
        const res = await authApis.get(endpoints['semestersSelectOptions'])
        setSemesters(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchCourseClass()
    fetchCourse()
    fetchSemester()
  }, [id])

  useEffect(() => {
    const fetchTeacher = async () => {
      if (!courseClass || !courseClass.courseId || !courseClass.semesterId)
        return
      try {
        const res = await authApis.get(
          endpoints['courseClassTeacherSelectOptions'](
            courseClass.courseId,
            courseClass.semesterId
          )
        )
        setTeachers(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchStudentClass = async () => {
      if (!courseClass || !courseClass.courseId || !courseClass.semesterId)
        return
      try {
        const res = await authApis.get(
          endpoints['courseClassStudentClassSelectOptions'](
            courseClass.courseId,
            courseClass.semesterId
          )
        )
        setStudentClasses(res.data.result)
      } catch (e) {
        console.error(e)
      }
    }

    fetchTeacher()
    fetchStudentClass()
  }, [courseClass.courseId, courseClass.semesterId])

  const type = [
    {
      name: 'courseId',
      label: 'Môn học',
      values: courses,
      type: 'select',
    },
    {
      name: 'semesterId',
      label: 'Học kỳ',
      values: semesters,
      type: 'select',
    },
    { name: 'capacity', label: 'Số lượng sinh viên' },
    {
      name: 'teacherId',
      label: 'Giảng viên',
      values: teachers,
      type: 'select',
    },
    {
      name: 'studentClassId',
      label: 'Lớp sinh viên',
      values: studentClasses,
      type: 'select',
    },
  ]

  const handleSubmit = async (e) => {
    try {
      console.log(courseClass)
      e.preventDefault()
      if (isCreate) await create()
      else await update()

      const directUrl = generatePath(Urls['adminCourseRegistrationDetail'], {
        semesterId: courseClass.semesterId,
        courseId: courseClass.courseId,
      })

      nav(directUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const update = async () => {
    await authApis.put(endpoints['courseClass'](id), courseClass)
  }

  const create = async () => {
    await authApis.post(endpoints['courseClasses'], courseClass)
  }

  const handleChange = (e, field) => {
    console.log(field, ' : ', e.target.value)
    setCourseClass({ ...courseClass, [field]: e.target.value })
  }

  return (
    <>
      {courseClass && courses && semesters && (
        <>
          {type.map((field, index) => (
            <BaseForm
              key={index}
              field={field}
              value={courseClass[field.name]}
              handleChange={handleChange}
            />
          ))}

          <label htmlFor='midTermFactor'>Hệ số giữa kỳ</label>
          <Form.Control
            id='midTermFactor'
            value={courseClass.courseRule?.midTermFactor}
            disabled={true}
          />

          <label htmlFor='finalTermFactor'>Hệ số cuối kỳ</label>
          <Form.Control
            id='finalTermFactor'
            value={courseClass.courseRule?.finalTermFactor}
            disabled={true}
          />

          <label htmlFor='passScore'>Điểm qua môn</label>
          <Form.Control
            id='passScore'
            value={courseClass.courseRule?.passScore}
            disabled={true}
          />

          <label htmlFor='durationFinalExam'>Thời gian làm bài cuối kỳ</label>
          <Form.Control
            id='durationFinalExam'
            value={courseClass.durationFinalExam}
            disabled={true}
          />
        </>
      )}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { CourseClassEdit }
