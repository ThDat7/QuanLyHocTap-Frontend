import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import Urls from '../configs/Urls'
import { Link } from 'react-router-dom'

const Header = () => {
  const navLinks = [
    { label: 'Trang chủ', url: '#home' },
    { label: 'Chương trình đào tạo', url: Urls['searchEducationProgram'] },
  ]

  return (
    <Navbar bg='primary' variant='dark' className='mb-3'>
      <Navbar.Brand>
        <Link to={Urls.home}>
          <img
            alt=''
            src='logo.png'
            width='30'
            height='30'
            className='d-inline-block align-top'
          />{' '}
          Trường Đại Học Mở TP. Hồ Chí Minh
        </Link>
      </Navbar.Brand>
      <Nav className='ml-auto'>
        {navLinks.map((link, index) => (
          <Nav.Link key={index} href={link.url}>
            {link.label}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  )
}

export default Header
