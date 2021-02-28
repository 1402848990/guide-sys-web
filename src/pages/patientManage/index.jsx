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
const filterVal = ['date', 'doctorInfo.department', 'doctorInfo.userName', 'doctorInfo.level', 'doctorInfo.department']

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
        from: 'patient',
      },
    })
    const arr = res.data.filter((item) => {
      const { patientInfo } = item
      item.doctorInfo = JSON.parse(item.doctorInfo)
      item.patientInfo = patientInfo ? JSON.parse(patientInfo) : []
      let has = false

      item.patientInfo.forEach((ele = {}) => {
        console.log('ele', ele)
        if (ele.id == cookie.id) {
          has = true
        }
      })
      console.log('has', has, '')

      return has
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

  clickDetail = (record) => {
    window.open(`#addPatient?id=${record.patientId}`)
  }

  clickEdit = (record) => {
    window.open(`#addPatient?edit&id=${record.patientId}`)
  }

  clickDelete = (item) => {
    const _this = this
    Modal.confirm({
      title: `确定删除患者【${item.patientName}】档案吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/Patient/delete',
          method: 'post',
          data: { id: item.id },
        })
        message.success('删除成功！')
        _this.getData()
      },
      onCancel() {
        console.log('Cancel')
      },
    })
  }

  columns = [
    {
      title: '日期',
      dataIndex: 'date',
      width: 120,
    },
    {
      title: '科室',
      dataIndex: 'doctorInfo.department',
      width: 120,
    },
    {
      title: '医生姓名',
      dataIndex: 'doctorInfo.userName',
      width: 100,
    },
    {
      title: '医生职称',
      dataIndex: 'doctorInfo.level',
      width: 120,
    },
    {
      title: '医生性别',
      dataIndex: 'doctorInfo.sex',
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
    // {
    //   title: '操作',
    //   fixed: 'right',
    //   dataIndex: 'action',
    //   width: 140,
    //   render: (_, record) => (
    //     <>
    //       <a onClick={() => this.clickDetail(record)}>查看</a>
    //       <Divider type='vertical' />
    //       <a onClick={() => this.clickEdit(record)}>编辑</a>
    //       <Divider type='vertical' />
    //       <a onClick={() => this.clickDelete(record)}>删除</a>
    //     </>
    //   ),
    // },
  ]

  render() {
    const { filter, dataSource, loading } = this.state
    console.log(filter, dataSource)
    return (
      <div>
        <div className='formBody'>
          {/* <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>医生姓名：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.patientName}
                onChange={(e) => this.onChangeUserName(e, 'patientName')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>科室：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.patientId}
                onChange={(e) => this.onChangeUserName(e, 'patientId')}
              />
            </Col>
          </Row> */}
          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#dateManage')
              }}
              style={{ marginLeft: '8px' }}
            >
              去挂号
            </Button>
            {/* <div className='btnOpera'>
              <Button
                type='primary'
                onClick={this.btnSearch_Click}
                style={{ marginRight: '10px' }}
              >
                查询
              </Button>
              <Button
                type='primary'
                onClick={this.btnClear_Click}
                style={{
                  background: '#f8f8f8',
                  color: '#108ee9',
                  marginRight: '10px',
                }}
              >
                重置
              </Button>
            </div> */}
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
