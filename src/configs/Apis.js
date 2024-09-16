import axios from 'axios'

const SERVER_CONTEXT = '/'
const SERVER_PORT = '80'
const SERVER_HOST = 'localhost'

export const endpoints = {
  allNews: '/api/news',
  newsView: (newsId) => `/api/news/view/${newsId}`,
}

export default axios.create({
  baseURL: `http://${SERVER_HOST}:${SERVER_PORT}${SERVER_CONTEXT}`,
})
