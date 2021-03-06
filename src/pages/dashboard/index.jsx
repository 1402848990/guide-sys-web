import React, { useState, useEffect } from 'react'
import { Row, Col, Carousel, Card } from 'antd'
import './index.less'
import { countBy } from 'lodash'
import axios from '../../request/axiosConfig'
import { Column,Line } from '@ant-design/charts'

const HOST = 'http://localhost:8088/interface'

const lineChartDefaultData = {}

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(
    lineChartDefaultData['New Visits']
  )
  const [patientToDoctorList, setPatientToDoctorList] = useState([])
  const [doctorList, setDoctorList] = useState([])
  const [departmentList, setDepartmentList] = useState([])
  const [drugsList, setDrugsList] = useState([])
  const [dateList, setDateList] = useState([])

  // 获取数据
  const getData = async () => {
    // 医生下面的患者列表
    const {
      data: patientToDoctorList,
    } = await axios.post(`${HOST}/Patient/list`, { from: 'admin' })
    const { data: doctorList } = await axios.post(`${HOST}/User/doctorList`)
    const { data: drugsList } = await axios.post(`${HOST}/Drugs/drugsList`)
    const { data: dateList } = await axios.post(`${HOST}/User/dateList`,{ from: 'admin' })

    patientToDoctorList.forEach((item) => {
      item.doctorName = JSON.parse(item.userInfo).userName
    })

    const deps = countBy(doctorList, (item) => item.department)
    console.log('deps', deps)
    const departmentList = Object.entries(deps).map((item) => {
      const [key, value] = item
      return { key, value }
    })

    console.log('drugsList', drugsList)

    setPatientToDoctorList(patientToDoctorList)
    setDoctorList(doctorList)
    setDepartmentList(departmentList)
    setDrugsList(drugsList)
    setDateList(dateList)
  }

  useEffect(() => {
    getData()
  }, [])

  const handleSetLineChartData = (type) =>
    setLineChartData(lineChartDefaultData[type])

  const departmentView = () => {
    const config = {
      data: departmentList,
      xField: 'key',
      yField: 'value',
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      meta: {
        type: { alias: '部门' },
        sales: { alias: '医生数量' },
      },
    }
    return <Column {...config} />
  }

  const doctAgeView = () => {
    const yeas = [
      {
        age: '小于35',
        num: 0,
      },
      {
        age: '35-50',
        num: 0,
      },
      {
        age: '50-60',
        num: 0,
      },
      {
        age: '60岁以上',
        num: 0,
      },
    ]
       doctorList.forEach((item) => {
      if (item.age <= 35) {
        yeas[0].num++
      } else if (item.age > 35 && item.age <= 50) {
        yeas[1].num++
      } else if (item.age > 50 && item.age <= 60) {
        yeas[2].num++
      } else {
        yeas[3].num++
      }
    })
    const config = {
      data: yeas,
      xField: 'age',
      yField: 'num',
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          opacity: 0.6,
        },
      },
      color:'#781c88',
      meta: {
        type: { alias: '年龄' },
        sales: { alias: '医生数量' },
      },
    }
    return <Column {...config} />
  }

  const drugsView = ()=>{
    const config = {
      data: drugsList,
      xField: 'name',
      yField: 'num',
      xAxis: { label: { autoRotate: false } },
      color:'#4caf50',
      slider: {
        start: 0.1,
        end: 0.6,
      },
    };
    return <Column {...config} />;
  }

  const dateView = ()=>{
    const _countBy = countBy(dateList, (item) => item.date)
    console.log('_countBy',_countBy)
    const list = Object.entries(_countBy).map((item) => {
      const [key, value] = item
      return { key, 人数:value }
    })
    console.log('list',list)
    const config = {
      data: list,
      padding: 'auto',
      xField: 'key',
      yField: '人数',
      xAxis: { tickCount: 5 },
      slider: {
        start: 0.1,
        end: 0.8,
      },
    };
    return <Line {...config} />;
  }

  return (
    <div className='app-container'>
      <Card title='医院不同部门的医生数量'>
        {/* 不同部门的医生数量 */}
        {departmentView()}
      </Card>
      <br />
      <Card title='医院不同年龄的医生分布'>
        {/* 不同部门的医生数量 */}
        {doctAgeView()}
      </Card>
      <br />
      <Card title='医院每种药品数量统计'>
        {/* 不同部门的医生数量 */}
        {drugsView()}
      </Card>
      <Card title='每日挂号人数统计'>
        {/* 不同部门的医生数量 */}
        {dateView()}
      </Card>
    </div>
  )
}

export default Dashboard
