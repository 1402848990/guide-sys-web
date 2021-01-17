/* eslint-disable jsx-a11y/anchor-is-valid */
// /* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react'
import { Table } from 'antd'

export default class FormTable extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    const {
      checkChange,
      dataSource,
      loading,
      rowSelection,
      columns,
    } = this.props
    // const rowSelection = {
    //   onChange: checkChange,
    //   getCheckboxProps: (record) => ({
    //     disabled: record.name === 'Disabled User', // Column configuration not to be checked
    //   }),
    // }
    return (
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={dataSource}
        bordered={true}
        scroll={{ x: '100%' }}
        className='formTable'
        loading={loading}
      />
    )
  }
}
