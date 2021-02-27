import React, { useState, useEffect } from 'react'
import { Row, Col, Carousel } from 'antd'
import './index.less'
import PanelGroup from './components/PanelGroup'
import axios from '../../request/axiosConfig'

const HOST = 'http://localhost:8088/interface'

const lineChartDefaultData = {}

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(
    lineChartDefaultData['New Visits']
  )
  const [stuList, setStuList] = useState([])
  const [noteList, setNoteList] = useState([])
  const [planList, setPlanList] = useState([])
  const [contactList, setContactList] = useState([])

  // 获取数据
  const getData = async () => {
    const { data: sList } = await axios.post(`${HOST}/Stu/list`)
    const { data: nList } = await axios.post(`${HOST}/User/noteList`)
    const { data: pList } = await axios.post(`${HOST}/User/planList`)
    const { data: cList } = await axios.post(`${HOST}/User/contactList`)
    setStuList(sList)
    setNoteList(nList)
    setPlanList(pList)
    setContactList(cList)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleSetLineChartData = (type) =>
    setLineChartData(lineChartDefaultData[type])

  return (
    <div className='app-container'>
      <PanelGroup
        stuList={stuList}
        noteList={noteList}
        planList={planList}
        contactList={contactList}
        handleSetLineChartData={handleSetLineChartData}
      />
    </div>
  )
}

export default Dashboard
