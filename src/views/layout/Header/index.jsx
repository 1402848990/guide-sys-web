import React from 'react'
import { Icon, Menu, Dropdown, Modal, Layout, Avatar } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import FullScreen from '@/components/FullScreen'
import Settings from '@/components/Settings'
import Hamburger from '@/components/Hamburger'
import BreadCrumb from '@/components/BreadCrumb'
import Cookie from 'js-cookie'
import './index.less'
const { Header } = Layout

const LayoutHeader = (props) => {
  const userInfo = Cookie.get('userInfo')
  console.log('userInfo', userInfo)
  const {
    token,
    avatar,
    sidebarCollapsed,
    logout,
    getUserInfo,
    showSettings,
    fixedHeader,
  } = props
  console.log('props', props)
  token && getUserInfo(token)
  const handleLogout = (token) => {
    Modal.confirm({
      title: '注销',
      content: '确定要退出系统吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        Cookie.remove('userInfo')
        props.history.push('/login')
      },
    })
  }
  const onClick = ({ key }) => {
    switch (key) {
      case 'logout':
        handleLogout(token)
        break
      default:
        break
    }
  }
  const menu = (
    <Menu onClick={onClick}>
      <Menu.Item key='dashboard'>
        <Link to='/dashboard'>首页</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key='logout'>退出</Menu.Item>
    </Menu>
  )
  const computedStyle = () => {
    let styles
    if (fixedHeader) {
      if (sidebarCollapsed) {
        styles = {
          width: 'calc(100% - 80px)',
        }
      } else {
        styles = {
          width: 'calc(100% - 200px)',
        }
      }
    } else {
      styles = {
        width: '100%',
      }
    }
    return styles
  }
  return (
    <>
      {/* 这里是仿照antd pro的做法,如果固定header，
      则header的定位变为fixed，此时需要一个定位为relative的header把原来的header位置撑起来 */}
      {fixedHeader ? <Header /> : null}
      <Header
        style={computedStyle()}
        className={fixedHeader ? 'fix-header' : ''}
      >
        <Hamburger />
        <BreadCrumb />
        <div className='right-menu'>
          <FullScreen />
          {showSettings ? <Settings /> : null}
          <div className='dropdown-wrap'>
            <Dropdown overlay={menu}>
              <div>
              设置
                <Icon style={{ color: 'rgba(0,0,0,.3)' }} type='caret-down' />
              </div>
            </Dropdown>
          </div>
        </div>
      </Header>
    </>
  )
}

export default withRouter(LayoutHeader)
