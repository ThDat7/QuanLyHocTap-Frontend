import { useEffect, useState } from 'react'
import { authApis, endpoints } from '../../configs/Apis'
import Urls from '../../configs/Urls'
import { useNavigate, useParams } from 'react-router'
import BaseForm from '../BaseForm'
import BaseList from '../BaseList'

const News = () => {
  const fields = [
    { field: 'id', label: 'ID' },
    { field: 'title', label: 'Tiêu đề' },
    { field: 'authorName', label: 'Tác giả' },
    { field: 'createdAt', label: 'Ngày tạo' },
    { field: 'isImportant', label: 'Quan trọng' },
  ]

  return (
    <BaseList
      fields={fields}
      url={Urls['adminNews']}
      endpoint={endpoints['newses']}
    />
  )
}

const NewsEdit = () => {
  const { id } = useParams()
  const isCreate = !parseInt(id)

  const [news, setNews] = useState({})
  const [staffs, setStaffs] = useState([])
  const nav = useNavigate()

  useEffect(() => {
    const fetchNews = async () => {
      if (isCreate) return
      try {
        const res = await authApis.get(endpoints['news'](id))
        setNews(res.data)
      } catch (e) {
        console.error(e)
      }
    }

    const fetchStaffs = async () => {
      try {
        const res = await authApis.get(endpoints['staffSelectOption'])
        setStaffs(res.data)
      } catch (e) {
        console.error(e)
      }
    }

    fetchNews()
    fetchStaffs()
  }, [id])

  const majorType = [
    { name: 'title', label: 'Tiêu đề' },
    { name: 'content', label: 'Nội dung' },
    {
      name: 'isImportant',
      label: 'Quan trọng?',
      type: 'select',
      values: [
        { label: 'Có', value: true },
        { label: 'Không', value: false },
      ],
    },
    {
      name: 'authorId',
      label: 'Tác giả',
      values: staffs,
      type: 'select',
    },
  ]

  const handleSubmit = async (e) => {
    try {
      e.preventDefault()

      if (isCreate) await create()
      else await update()

      const listUrl = Urls['adminNews']
      nav(listUrl)
    } catch (e) {
      console.error(e)
    }
  }

  const create = async () => {
    await authApis.post(endpoints['newses'], news)
  }

  const update = async () => {
    await authApis.put(endpoints['news'](id), news)
  }

  const handleChange = (e, field) => {
    setNews({ ...news, [field]: e.target.value })
  }

  return (
    <>
      {news &&
        majorType.map((field, index) => (
          <BaseForm
            key={index}
            field={field}
            value={news[field.name]}
            handleChange={handleChange}
          />
        ))}

      <button onClick={handleSubmit} className='btn btn-primary'>
        Lưu
      </button>
    </>
  )
}

export { NewsEdit }
export default News
