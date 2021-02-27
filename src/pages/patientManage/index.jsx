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
import ExportExcel from '../../components/ExportExcel'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

const tHeader = ['患者id', '姓名', '性别', '年龄', '手机号']
const filterVal = ['patientId', 'patientName', 'sex', 'age', 'phone']

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
    }
  }
  // 获取数据
  getData = async () => {
    const res = await axios.post(`${HOST}/Patient/list`, {
      filter: this.state.filter,
    })
    this.setState(
      {
        dataSource: res.data,
      },
      () => {
        this.setState({
          loading: false,
        })
      }
    )
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
      title: '患者ID',
      dataIndex: 'patientId',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'patientName',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 180,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => {
        console.log('record.sex', record.sex, 'value', value)
        return record.sex === value
      },
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 100,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '档案创建时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '就诊记录更新时间',
      dataIndex: 'updatedAt',
      sorter: (a, b) => +a.updatedAt - +b.updatedAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      fixed: 'right',
      dataIndex: 'action',
      width: 140,
      render: (_, record) => (
        <>
          <a onClick={() => this.clickDetail(record)}>查看</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickDelete(record)}>删除</a>
        </>
      ),
    },
  ]

  render() {
    const { filter, dataSource, loading } = this.state
    console.log(filter)
    return (
      <div>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>姓名：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.patientName}
                onChange={(e) => this.onChangeUserName(e, 'patientName')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>患者ID：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.patientId}
                onChange={(e) => this.onChangeUserName(e, 'patientId')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>手机号：</span>
              <Search
                placeholder='请输入手机号'
                prefix={<Icon type='user' />}
                value={filter.phone}
                onChange={(e) => this.onChangeUserName(e, 'phone')}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Button
              type='primary'
              onClick={() => {
                window.open('#addPatient')
              }}
              style={{ marginLeft: '8px' }}
            >
              新建患者档案
            </Button>
            <div className='btnOpera'>
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
            </div>
          </Row>
          {/* <BaseTable
            columns={this.columns}
            dataSource={dataSource}
            checkChange={this.checkChange}
            onDelete={this.onDelete}
            editClick={this.editClick}
            loading={loading}
          /> */}
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
