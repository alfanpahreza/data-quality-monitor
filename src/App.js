import './App.css';
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
import { Table, Space,  Modal, Button} from 'antd';
import React, { useState } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import chartData from './chartDummy.json';
import dqData from './dataQualityDummy.json';

function getFullDate (date) {
  const dateAndTime = date.split('T');

  return dateAndTime[0].split('-').reverse().join('-');
};
function last30Days(){
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth()+1;
  const lastMonth = ((month-1) >= 10 ? (month-1) : "0"+(month-1));
  const day = date.getDate();  
  const lastDate = year+"-"+lastMonth+"-"+day;

  return chartData.filter(item => item.date > lastDate)
}
function App() {
  //Chart
  am4core.options.autoDispose = true;
  //Requires = 1. Instance, 2. Data, 3. Two Axes, 4. One Series
  let chart = am4core.create("chartdiv", am4charts.XYChart);
  chart.data = last30Days();
  chart.dataSource.parser.options.useColumnNames = true;
  chart.dataSource.events.on("error", function(ev) {
    console.log("Oops! Something went wrong");
  });

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.dataFields.category = "date";
  dateAxis.title.text = "Week";

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.dataFields.category = "value";
  valueAxis.title.text = "PB";

  let series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value";
  series.dataFields.dateX = "date";
  series.stroke = am4core.color("#ff0000");
  series.strokeWidth = 2;
  
  //adjustments
  valueAxis.min=-10;
  dateAxis.dateFormats.setKey("week", "ww");
  dateAxis.gridIntervals.setAll([
    { timeUnit: "day", count: 1 },
    { timeUnit: "day", count: 7 },
  ]);

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
      render : ((date) => getFullDate(date))
    },
    {
      title: 'group',
      dataIndex: 'group',
      key: 'group',
    },
    {
      title: 'source',
      dataIndex: 'source',
      key: 'source',
    },
    {
      title: 'PIC',
      dataIndex: 'pic',
      key: 'pic',
    },
    {
      title: 'dependents',
      dataIndex: 'dependents',
      key: 'dependents',
    },
    {
      title: 'KPI',
      dataIndex: 'kpi',
      key: 'kpi',
    },
    {
      title: 'Current Val',
      dataIndex: 'current_value',
      key: 'current_valua',
    },
    {
      title: 'Threshold',
      dataIndex: 'threshold',
      key: 'threshold',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Aging',
      dataIndex: 'aging',
      key: 'aging',
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: 'Action',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" onClick={showModal}>Last 30 Days</Button>
        </Space>
      ),
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
        <div >
          <div id="chartdiv"></div>
        </div>
      </Modal>
      <Table columns={columns} dataSource={rows}/>
    </>
  );
}

export default App;
