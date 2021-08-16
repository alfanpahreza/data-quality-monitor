import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table, Space,  Modal, Button} from 'antd';
import React, { useState, useEffect } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import chartData from './chartDummy.json';
import dqData from './dataQualityDummy.json';

function shortDate (date) {
  const dateAndTime = date.split('T');

  return dateAndTime[0].split('-').reverse().join('-');
};
function last30Days(date){
  const year = date.getFullYear();
  const month = date.getMonth();
  const lastMonth = (month >= 10 ? month : "0"+month);
  const day = date.getDate();  
  const lastDate = year+"-"+lastMonth+"-"+day;

  return chartData.filter(item => item.date > lastDate)
}
function loadChart(){
  //Requires = 1. Instance, 2. Data, 3. Two Axes, 4. One Series
  let chart = am4core.create(document.getElementById("chartdiv"), am4charts.XYChart);
  let date = new Date("2021-08-10");
  chart.data = last30Days(date);
  chart.dataSource.parser.options.useColumnNames = true;
  chart.dataSource.events.on("error", function(ev) {
    console.log("Oops! Something went wrong");
  });

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.dataFields.category = "date";
  dateAxis.title.text = "Week";
  dateAxis.gridIntervals.setAll([
    {timeUnit:"day",count:7}
  ]);

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.dataFields.category = "value";
  valueAxis.title.text = "PB";
  valueAxis.min=-10;

  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value";
  series.dataFields.dateX = "date";
  series.stroke = am4core.color("#ff0000");
  series.strokeWidth = 2;

  let bullet = series.bullets.push(new am4charts.LabelBullet());
  bullet.label.text = "{valueY.formatNumber('#.')}";
}
function App(){

  //Erase chart to clear up memory
  am4core.options.autoDispose = true;
  useEffect(() => {
    loadChart();
  });
  //Modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //Table
  const columns = [
    {
      title: 'date',
      dataIndex: 'date',
      key: 'date',
      render : ((date) => shortDate(date))
    },
    {
      title: 'group',
      dataIndex: 'group',
      key: 'group'
    },
    {
      title: 'source',
      dataIndex: 'source',
      key: 'source'
    },
    {
      title: 'PIC',
      dataIndex: 'pic',
      key: 'pic'
    },
    {
      title: 'dependents',
      dataIndex: 'dependents',
      key: 'dependents'
    },
    {
      title: 'KPI',
      dataIndex: 'kpi',
      key: 'kpi'
    },
    {
      title: 'Current Val',
      dataIndex: 'current_value',
      key: 'current_value'
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Aging',
      dataIndex: 'aging',
      key: 'aging'
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark'
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" onClick={showModal}>Last 30 Days</Button>
        </Space>
      )
    },
  ];
  
  const rows = dqData;

  return (
    <>
      <Modal 
        title="Basic Modal" 
        visible={isModalVisible} 
        onOk={handleOk} 
        onCancel={handleCancel}
        width={1000}
        >
        <div id="chartdiv"  style={{height: 350}} ></div>
      </Modal>
      <Table columns={columns} dataSource={rows}/>
    </>
  );
}
export default App;
