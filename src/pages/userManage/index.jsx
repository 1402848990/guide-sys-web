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
import { Work } from '../../utils/enum'
import ExportExcel from '../../components/ExportExcel'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

const tHeader = ['id', '姓名', '性别', '年龄', '手机号', '职业']
const filterVal = ['id', 'userName', 'sex', 'age', 'phone', 'work']

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
    const res = await axios.post(`${HOST}/Patient/userList`, {
      filter: this.state.filter,
      from: 'admin',
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
      title: `确定删除患者【${item.userName}】档案吗`,
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
      title: '用户ID',
      dataIndex: 'id',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'userName',
      width: 180,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      width: 180,
      filters: [
        { text: '男', value: 1 },
        { text: '女', value: 2 },
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
      width: 100,
    },
    {
      title: '职业',
      dataIndex: 'work',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 120,
    },
    {
      title: '住址',
      dataIndex: 'address',
      width: 120,
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
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
                value={filter.userName}
                onChange={(e) => this.onChangeUserName(e, 'userName')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>住址：</span>
              <Search
                placeholder='住址'
                prefix={<Icon type='user' />}
                value={filter.address}
                onChange={(e) => this.onChangeUserName(e, 'address')}
              />
            </Col>
          </Row>
          <Row>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>职业：</span>
              <Select
                onChange={(e) => this.onChangeUserName(e, 'work')}
                style={{ width: '100%' }}
              >
                {Work.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
              {/* <Search
                placeholder='请输入手机号'
                prefix={<Icon type='user' />}
                value={filter.phone}
                onChange={(e) => this.onChangeUserName(e, 'phone')}
              /> */}
            </Col>
          </Row>
          <Row gutter={16}>
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
