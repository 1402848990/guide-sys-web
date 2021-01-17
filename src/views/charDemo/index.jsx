// import React, { Component } from 'react'
// import { Line } from '@ant-design/charts'

// const data = [
//   { year: '1991', value: 3 },
//   { year: '1992', value: 4 },
//   { year: '1993', value: 3.5 },
//   { year: '1994', value: 5 },
//   { year: '1995', value: 4.9 },
//   { year: '1996', value: 6 },
//   { year: '1997', value: 7 },
//   { year: '1998', value: 9 },
//   { year: '1999', value: 13 },
// ]
// const config = {
//   data,
//   height: 400,
//   xField: 'year',
//   yField: 'value',
//   point: {
//     size: 5,
//     shape: 'diamond',
//   },
// }

// class Page extends Component {
//   render() {
//     return (
//       <div style={{ width:'94%',backgroundColor:'white' ,padding:'20px',margin:'0 auto'}}>
//         <Line {...config} />
//       </div>
//     )
//   }
// }
// export default Page


import React, { useState, useEffect } from 'react';
import { Pie } from '@ant-design/charts';
const DemoPie: React.FC = () => {
  var data = [
    {
      type: '分类一',
      value: 27,
    },
    {
      type: '分类二',
      value: 25,
    },
    {
      type: '分类三',
      value: 18,
    },
    {
      type: '分类四',
      value: 15,
    },
    {
      type: '分类五',
      value: 10,
    },
    {
      type: '其他',
      value: 5,
    },
  ];
  var config = {
    appendPadding: 10,
    data: data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };
  return <Pie {...config} />;
};
export default DemoPie;
