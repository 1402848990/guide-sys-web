/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import './form.less'
import moment from 'moment'
import axios from '../../request/axiosConfig'
import { Column,Bar } from '@ant-design/charts'
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
  Radio,
} from 'antd'
import CourseTag from '../../components/CourseTag'
import BaseTable from '../../components/BaseTable'
import ExportExcel from '../../components/ExportExcel'
import { DATE } from '../../utils/index'
import { groupBy } from 'lodash'

const Search = Input.Search

const HOST = 'http://localhost:8088/interface'

export default class UForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: {},
      dataSource: [],
      loading: true,
      examContent: [],
      courseList: [],
      currDate: '大一上学期',
    }
  }

  formatData = (_handledData) => {
    const { currDate } = this.state
    // 各个班级当前学期的成绩
    const oneClass = _handledData.filter(
      (item) => item.garde === '一班' && item.date === currDate
    )
    const twoClass = _handledData.filter(
      (item) => item.garde === '二班' && item.date === currDate
    )
    const threeClass = _handledData.filter(
      (item) => item.garde === '三班' && item.date === currDate
    )

    // 各个班级JAVA成绩
    const twoClassJavaArr = []
    const oneClassJavaArr = []
    const threeClassJavaArr = []

    // 各个班级数据结构成绩
    const twoClassDataArr = []
    const oneClassDataArr = []
    const threeClassDataArr = []

    // 各个班级高数成绩
    const twoClassMathArr = []
    const oneClassMathArr = []
    const threeClassMathArr = []

    oneClass.forEach((item) => {
      oneClassJavaArr.push(item['JAVA'])
      oneClassDataArr.push(item['数据结构'])
      oneClassMathArr.push(item['高数'])
    })
    twoClass.forEach((item) => {
      twoClassJavaArr.push(item['JAVA'])
      twoClassDataArr.push(item['数据结构'])
      twoClassMathArr.push(item['高数'])
    })
    threeClass.forEach((item) => {
      threeClassJavaArr.push(item['JAVA'])
      threeClassDataArr.push(item['数据结构'])
      threeClassMathArr.push(item['高数'])
    })

    const one = [
      {
        class: '一班',
        course: 'JAVA',
        number: oneClassJavaArr.map((item) => item >= 60).length,
      },
      {
        class: '一班',
        course: '数据结构',
        number: oneClassDataArr.map((item) => item >= 60).length,
      },
      {
        class: '一班',
        course: '高数',
        number: oneClassMathArr.map((item) => item >= 60).length,
      },
    ]

    const two = [
      {
        class: '二班',
        course: 'JAVA',
        number: twoClassJavaArr.map((item) => item >= 60).length,
      },
      {
        class: '二班',
        course: '数据结构',
        number: twoClassDataArr.map((item) => item >= 60).length,
      },
      {
        class: '二班',
        course: '高数',
        number: twoClassMathArr.map((item) => item >= 60).length,
      },
    ]

    const three = [
      {
        class: '三班',
        course: 'JAVA',
        number: threeClassJavaArr.map((item) => item >= 60).length,
      },
      {
        class: '三班',
        course: '数据结构',
        number: threeClassDataArr.map((item) => item >= 60).length,
      },
      {
        class: '三班',
        course: '高数',
        number: threeClassMathArr.map((item) => item >= 60).length,
      },
    ]

    const onebar = [
      {
        class: '一班',
        course: 'JAVA',
        number: oneClassJavaArr.filter((item) => item >= 60).length/ oneClassJavaArr.length,
      },
      {
        class: '一班',
        course: '数据结构',
        number: oneClassDataArr.filter((item) => item >= 60).length/oneClassDataArr.length,
      },
      {
        class: '一班',
        course: '高数',
        number: oneClassMathArr.filter((item) => item >= 60).length/oneClassMathArr.length,
      },
    ]

    const twobar = [
      {
        class: '二班',
        course: 'JAVA',
        number: twoClassJavaArr.filter((item) => item >= 60).length/twoClassJavaArr.length,
      },
      {
        class: '二班',
        course: '数据结构',
        number: twoClassDataArr.filter((item) => item >= 60).length/twoClassDataArr.length,
      },
      {
        class: '二班',
        course: '高数',
        number: twoClassMathArr.filter((item) => item >= 60).length/twoClassMathArr.length,
      },
    ]

    const threebar = [
      {
        class: '三班',
        course: 'JAVA',
        number: threeClassJavaArr.filter((item) => item >= 60).length/threeClassJavaArr.length,
      },
      {
        class: '三班',
        course: '数据结构',
        number: threeClassDataArr.filter((item) => item >= 60).length/threeClassDataArr.length,
      },
      {
        class: '三班',
        course: '高数',
        number: threeClassMathArr.filter((item) => item >= 60).length/threeClassMathArr.length,
      },
    ]
    return {num:[...one, ...two, ...three],bar:[...onebar,...twobar,...threebar]}
  }

  // 获取数据
  getData = async () => {
    const { currDate } = this.state
    // 获取成绩列表
    const { data } = await axios.post(`${HOST}/Stu/examList`, {
      filter: this.state.filter,
    })
    const _examContent = []
    const courseNameList = []

    const { data: courseList } = await axios({
      url: 'http://localhost:8088/interface/Stu/courseList',
      method: 'post',
      // data: { id: ID },
    })

    courseList.forEach((item) => {
      courseNameList.push(item.name)
      _examContent.push({
        title: item.name,
        dataIndex: item.name,
        width: 180,
      })
    })

    const handledData = data.map((item) => {
      const content = JSON.parse(item.content)
      for (let i in content) {
        item[i] = content[i]
      }
      return item
    })

    console.log('currDate', currDate)

    this.setState(
      {
        dataSource: handledData,
        examContent: _examContent,
        courseList,
        courseNameList,
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
    console.log(111)
    this.getData()
  }

  componentWillUpdate() {
    console.log(222)
    // this.getData()
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
    window.open(`#addStudent?id=${record.stuId}`)
  }

  clickEdit = (record) => {
    window.open(`#addStudent?edit&id=${record.stuId}`)
  }

  clickDelete = (item) => {
    const _this = this
    Modal.confirm({
      title: `确定删除学生【${item.name}】吗`,
      content: '',
      async onOk() {
        await axios({
          url: 'http://localhost:8088/interface/Stu/delete',
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

  columns = () => [
    {
      title: '学号',
      dataIndex: 'stuId',
      width: 80,
      sorter: (a, b) => +a.id - +b.id,
    },
    {
      title: '姓名',
      dataIndex: 'stuName',
      width: 180,
    },
    {
      title: '学期',
      dataIndex: 'date',
      width: 180,
    },
    ...this.state.examContent,
    {
      title: '班级',
      dataIndex: 'garde',
      width: 180,
      filters: [
        { text: '一班', value: '一班' },
        { text: '二班', value: '二班' },
        { text: '三班', value: '三班' },
      ],
      onFilter: (value, record) => record.garde === value,
    },
    {
      title: '性别',
      dataIndex: 'stuSex',
      width: 180,
      filters: [
        { text: '男', value: '男' },
        { text: '女', value: '女' },
      ],
      onFilter: (value, record) => record.sex === value,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: (a, b) => +a.createdAt - +b.createdAt,
      width: 200,
      render: (value) => moment(+value).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
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
          <a onClick={() => this.clickDetail(record)}>查看学生</a>
          {/* <Divider type='vertical' />
          <a onClick={() => this.clickEdit(record)}>编辑</a>
          <Divider type='vertical' />
          <a onClick={() => this.clickDelete(record)}>删除</a> */}
        </>
      ),
    },
  ]

  render() {
    const {
      filter,
      dataSource,
      loading,
      courseList,
      courseNameList = [],
      oneClass,
      twoClass,
      threeClass,
      currDate,
    } = this.state
    const tHeader = ['学号', '姓名', '学期', '班级', '性别'].concat(
      courseNameList
    )
    const filterVal = ['stuId', 'stuName', 'date', 'garde', 'stuSex'].concat(
      courseNameList
    )
    const numData = this.formatData(dataSource).num
    const barData = this.formatData(dataSource).bar
    console.log('numData', numData, 'currDate', currDate)
    const config = {
      data: numData,
      isGroup: true,
      xField: 'class',
      yField: 'number',
      seriesField: 'course',
      label: {
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    }
    const barConfig = {
      smooth: true,
      data: barData,
      isGroup: true,
      xField: 'number',
      yField: 'class',
      seriesField: 'course',
      label: {
        content: function content(item) {
          return `${(item.number*100).toFixed(2)}%`;
        },
        style: { fill: '#fff' },
        position: 'middle',
        layout: [
          { type: 'interval-adjust-position' },
          { type: 'interval-hide-overlap' },
          { type: 'adjust-color' },
        ],
      },
    }
    console.log('twoClass', twoClass)
    return (
      <div>
        <div className='formBody'>
          <Row gutter={16}>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>姓名：</span>
              <Search
                placeholder='请输入姓名'
                prefix={<Icon type='user' />}
                value={filter.stuName}
                onChange={(e) => this.onChangeUserName(e, 'stuName')}
              />
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>班级：</span>
              <Select
                placeholder='请选择班级'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.garde}
                onChange={(e) => this.onChangeUserName(e, 'garde')}
              >
                <Select.Option value='一班'>一班</Select.Option>
                <Select.Option value='二班'>二班</Select.Option>
                <Select.Option value='三班'>三班</Select.Option>
              </Select>
            </Col>
            <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>学期：</span>
              <Select
                placeholder='请选择学期'
                style={{ width: '100%' }}
                prefix={<Icon type='user' />}
                value={filter.date}
                onChange={(e) => this.onChangeUserName(e, 'date')}
              >
                {DATE.map((item) => (
                  <Select.Option value={item.value}>{item.label}</Select.Option>
                ))}
              </Select>
            </Col>
            {/* <Col className='gutter-row' sm={8}>
              <span className='filterTitle'>职务：</span>
              <Search
                placeholder='请输入职务'
                prefix={<Icon type='user' />}
                value={filter.level}
                onChange={(e) => this.onChangeUserName(e, 'level')}
              />
            </Col> */}
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
          <ExportExcel
            loading={loading}
            tHeader={tHeader}
            filterVal={filterVal}
            columns={this.columns()}
            data={dataSource}
          />
        </div>
        各班各科可视化分析
        <Card
          title={
            <>
              各班各科可视化分析&nbsp;&nbsp;{' '}
              <Radio.Group
                type='primary'
                value={currDate}
                onChange={(e) => this.setState({ currDate: e.target.value })}
              >
                {DATE.map((item) => (
                  <Radio.Button value={item.value}>{item.label}</Radio.Button>
                ))}
              </Radio.Group>
            </>
          }
        >
          <>
            <h4>JAVA、数据结构、高数及格人数对比</h4>
            <Column {...config} />
            <hr />
            <h4>JAVA、数据结构、高数及格率对比</h4>
            <Bar {...barConfig} />
          </>
        </Card>
      </div>
    )
  }
}
