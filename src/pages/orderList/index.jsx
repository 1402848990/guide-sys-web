/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import {
  Row,
  Col,
  Input,
  Icon,
  Button,
  Divider,
  Rate,
  Modal,
  message,
  Select,
  Card,
} from 'antd'
import Cookie from 'js-cookie'
import ExportExcel from '../../components/ExportExcel'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

const tHeader = ['日期', '科室', '医生姓名', '医生职称', '手机号医生性别']
const filterVal = [
  'date',
  'doctorInfo.department',
  'doctorInfo.userName',
  'doctorInfo.level',
  'doctorInfo.department',
]

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
    }
  }

  // 获取挂号记录
  getData = async () => {
    const cookie = JSON.parse(Cookie.get('userInfo'))
    console.log('cookie', cookie)
    const { doctor } = this.state
    const res = await axios({
      url: 'http://localhost:8088/interface/User/dateList',
      method: 'post',
      data: {
        filter: {},
      },
    })

    let arr = []
    res.data.forEach((item) => {
      const { patientInfo } = item
      if(patientInfo){
        const list = JSON.parse(patientInfo)
        list.forEach(ele=>{
          ele.date = item.date
        })
        arr.push(...list)
      }
    })
    this.setState({
      dataSource: arr,
      loading: false,
    })
  }
  //姓名输入
  onChangeUserName = (e, field) => {
    console.log(e)
    if (e) {
      const value = !e?.target ? e : e?.target?.value
      const _filter = this.state.filter
      this.setState({
        filter: {
          ..._filter,
          [field]: value,
        },
      })
    }
  }

  //渲染
  componentDidMount() {
    this.getData()
  }
  //搜索按钮
  btnSearch_Click = () => {
    this.getData()
  }
  //重置按钮
  btnClear_Click = () => {
    this.setState(
      {
        filter: {},
      },
      () => {
        this.getData()
      }
    )
  }

  //单选框改变选择
  checkChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys: selectedRowKeys })
  }

  columns = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 80,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '职业',
      dataIndex: 'work',
      width: 100,
    },
    {
      title: '住址',
      dataIndex: 'address',
      width: 120,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 80,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => {
        console.log('record.sex', record.sex, 'value', value)
        return record.sex === value
      },
      render: (text) => (text === 1 ? '男' : '女'),
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 120,
    },

  ]

  render() {
    const { filter, dataSource, loading } = this.state
    console.log(filter, dataSource)
    return (
      <div>
        <div className='formBody'>

          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#dateManage')
              }}
              style={{ marginLeft: '8px' }}
            >
              去排班
            </Button>

          </Row>
          <ExportExcel
            loading={loading}
            tHeader={tHeader}
            filterVal={filterVal}
            columns={this.columns}
            data={dataSource}
          />
        </div>
      </div>
    )
  }
}
