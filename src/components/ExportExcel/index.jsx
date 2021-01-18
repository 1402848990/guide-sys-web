import React, { Component } from 'react'
import {
  Table,
  Tag,
  Form,
  Icon,
  Button,
  Input,
  Radio,
  Select,
  message,
  Collapse,
} from 'antd'

const { Panel } = Collapse
class Excel extends Component {
  _isMounted = false // 这个变量是用来标志当前组件是否挂载
  state = {
    list: [
    ],
    filename: 'excel-file',
    autoWidth: true,
    bookType: 'xlsx',
    downloadLoading: false,
    selectedRows: [],
    selectedRowKeys: [],
  }
  componentDidMount() {
    this._isMounted = true
  }
  componentWillUnmount() {
    this._isMounted = false
  }
  onSelectChange = (selectedRowKeys, selectedRows) => {
    console.log('selectedRows',selectedRows)
    this.setState({ selectedRows, selectedRowKeys })
  }
  handleDownload = (type) => {
    if (type === 'selected' && this.state.selectedRowKeys.length === 0) {
      message.error('至少选择一项进行导出')
      return
    }
    this.setState({
      downloadLoading: true,
    })
    import('@/lib/Export2Excel').then((excel) => {
      // excel头部
      const tHeader = this.props.tHeader || [
        'Id',
        'Title',
        'Author',
        'Readings',
        'Date',
      ]
      // excel单元格对应值
      const filterVal = this.props.filterVal || [
        'id',
        'title',
        'author',
        'readings',
        'date',
      ]
      const list = type === 'all' ? this.props.data : this.state.selectedRows
      const data = this.formatJson(filterVal, list)
      excel.export_json_to_excel({
        header: tHeader,
        data,
        filename: this.state.filename,
        autoWidth: this.state.autoWidth,
        bookType: this.state.bookType,
      })
      this.setState({
        selectedRowKeys: [], // 导出完成后将多选框清空
        downloadLoading: false,
      })
    })
  }
  formatJson(filterVal, jsonData) {
    return jsonData.map((v) => filterVal.map((j) => v[j]))
  }
  filenameChange = (e) => {
    this.setState({
      filename: e.target.value,
    })
  }
  autoWidthChange = (e) => {
    this.setState({
      autoWidth: e.target.value,
    })
  }
  bookTypeChange = (value) => {
    this.setState({
      bookType: value,
    })
  }
  render() {
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }
    return (
      <div className='excel' style={{marginTop:'18px'}}>
        <Collapse defaultActiveKey={['1']}>
          <Panel header='导出选项' key='1'>
            <Form layout='inline'>
              <Form.Item label='文件名:'>
                <Input
                  style={{ width: '250px' }}
                  prefix={
                    <Icon type='file' style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  placeholder='请输入文件名(默认excel-file)'
                  onChange={this.filenameChange}
                />
              </Form.Item>
              <Form.Item label='单元格宽度是否自适应:'>
                <Radio.Group
                  onChange={this.autoWidthChange}
                  value={this.state.autoWidth}
                >
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label='文件类型:'>
                <Select
                  defaultValue='xlsx'
                  style={{ width: 120 }}
                  onChange={this.bookTypeChange}
                >
                  <Select.Option value='xlsx'>xlsx</Select.Option>
                  <Select.Option value='csv'>csv</Select.Option>
                  <Select.Option value='txt'>txt</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  icon='file-excel'
                  onClick={this.handleDownload.bind(null, 'all')}
                >
                  全部导出
                </Button>
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  icon='file-excel'
                  onClick={this.handleDownload.bind(null, 'selected')}
                >
                  导出已选择项
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
        <Table
        className='formTable'
        scroll={{ x: '100%' }}
          bordered
          columns={this.props.columns || []}
          rowKey={(record) => record.id}
          dataSource={this.props.data}
          // pagination={false}
          rowSelection={rowSelection}
          loading={this.props.loading}
        />
      </div>
    )
  }
}

export default Excel
