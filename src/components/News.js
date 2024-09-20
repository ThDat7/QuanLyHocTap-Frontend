import React, { useEffect, useState } from 'react'
import { ListGroup, Card } from 'react-bootstrap'
import Apis, { endpoints } from '../configs/Apis'
import { Link, useParams } from 'react-router-dom'
import Urls from '../configs/Urls'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { CKEditor } from '@ckeditor/ckeditor5-react'

const News = () => {
  const [news, setNews] = useState([])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = endpoints.allNews
        const response = await Apis.get(url)
        const data = response.data.result
        setNews(data.data)
      } catch (error) {
        console.error(error)
      }
    }

    fetchNews()
  }, [])

  return (
    <Card className='mb-3'>
      <Card.Body>
        <ListGroup variant='flush'>
          {news
            .filter((item) => item.isImportant)
            .map((item, index) => (
              <ListGroup.Item key={index} className='bg-danger text-white'>
                <a href='#'>{item.title}</a>
                <span className='float-right text-muted'>{item.createdAt}</span>
              </ListGroup.Item>
            ))}
        </ListGroup>

        <ListGroup variant='flush'>
          {news
            .filter((item) => !item.isImportant)
            .map((item, index) => (
              <ListGroup.Item key={index}>
                <Link to={`${Urls.newsView}${item.id}`}>{item.title}</Link>
                <span className='float-right text-muted'>{item.createdAt}</span>
              </ListGroup.Item>
            ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

const NewsView = () => {
  const [news, setNews] = useState(null)
  const { id } = useParams()

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const url = endpoints.newsView(id)
        const response = await Apis.get(url)
        setNews(response.data.result)
      } catch (error) {
        console.error(error)
      }
    }

    fetchNews()
  }, [])

  return (
    <>
      {news && (
        <>
          <div className='float-right text-muted text-end'>
            {news.createdAt}
          </div>
          <h1>{news.title}</h1>

          <CKEditor
            data={news.content}
            editor={ClassicEditor}
            disabled={true}
            config={{
              toolbar: [],
            }}
          />
        </>
      )}
    </>
  )
}
export { NewsView }

export default News
