import React from 'react';
import Plot from 'react-plotly.js';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    FlexibleXYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    VerticalBarSeriesCanvas,
    DiscreteColorLegend
  } from 'react-vis';

import { format } from 'd3-format';
import MenuBar from '../components/MenuBar';


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,

} from 'antd'

import { getVisualization1 } from '../fetcher'
import { getVisualization2 } from '../fetcher'
import { getVisualization4 } from '../fetcher'
import { getVisualization5 } from '../fetcher'
import { relJobVictim } from '../fetcher'


const { Column, ColumnGroup } = Table;
const wideFormat = format('.3r');


class VisualizationPage extends React.Component {
    constructor(props) {
        super(props)
        //initial states setup
        this.state = {
            useCanvas : false,
            visualization1Results: [],
            visualization2Results: [],
            visualization3Results: [],
            visualization4Results: [],
            visualization5Results: []

        }

    }

    componentDidMount() {
        getVisualization1().then(res => {
            this.setState({ visualization1Results: res.results })
        })
        getVisualization2().then(res => {
            this.setState({ visualization2Results: res.results })
        })
        relJobVictim().then(res => {
            this.setState({ visualization3Results: res.results })
        })
        getVisualization4().then(res => {
            this.setState({ visualization4Results: res.results })
        })
        getVisualization5().then(res => {
            this.setState({ visualization5Results: res.results })
        })
        
    }


    render() {
        

        const {useCanvas} = this.state;
        const BarSeries = useCanvas ? VerticalBarSeriesCanvas : VerticalBarSeries;
        var array = [];
        console.log(this.state.visualization1Results);

        var xValues = [];
        var t1 = [];
        var t2 = [];
        var t3 = [];
        var t4 = [];
        
        for (var i = 0; i < this.state.visualization1Results.length; i++) {
            var item = this.state.visualization1Results[i];
            xValues.push(item.Income_bracket);
            t1.push(item.Weapon_involved);
            t2.push(item.No_weapon_involved);
            t3.push(item.Do_not_know);
            t4.push(item.Others);
        }

        var trace1 = {
            x:xValues,
            y: t1,
            name: 'weapon involved',
            type: 'bar'
        } ;

        var trace2 = {
            x:xValues,
            y: t2,
            name: 'No weapon involved',
            type: 'bar'
        };

        var trace3 = {
            x:xValues,
            y: t3,
            name: 'Do_not_know',
            type: 'bar'
        };

        var trace4 = {
            x: xValues,
            y: t4,
            name: 'Other',
            type: 'bar'
        };

        var years = [];
        var prop = [];
        
        for (var i = 0; i < this.state.visualization3Results.length; i++) {
            var item = this.state.visualization3Results[i];
            years.push(item.Year);
            prop.push(item.Proportion);
        }

        var propTrace = {
            x: years,
            y: prop,
            name: 'Do_not_know',
            type: 'bar'
        };

        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
        ];


        var crimes = [];
        var months = [];

        for (var i = 0; i < this.state.visualization2Results.length; i++) {
            var item = this.state.visualization2Results[i];
            crimes.push((item.crime).replaceAll("_", " "));
            months.push(monthNames[item.Max_month - 1]);
        }

        const values = [
            crimes,
            months,
        ];

        const headers = [["<b> Crime </b>"], ["<b>  Month </b>"]];
        const data = [
            {
            type: "table",
            header: {
                values: headers,
                align: "center",
            },
            cells: {
                values: values,
                align: "center",
            },
            },
        ];


        var crimeNums = [];
        var month4 = [];
        var year4 = [];

        for (var i = 0; i < this.state.visualization4Results.length; i++) {
            var item = this.state.visualization4Results[i];
            crimeNums.push(item.max_crime);
            month4.push(monthNames[item.Month - 1]);
            year4.push(item.YEAR);
        }

        const headers2 = [["<b> Year </b>"], ["<b>  Month </b>"], ["<b>  Crimes in Month </b>"]];
        const data2 = [
            {
            type: "table",
            header: {
                values: headers2,
                align: "center",
            },
            cells: {
                values: [year4, month4, crimeNums],
                align: "center",
            },
            },
        ];
        var dates = [];
        var polInv = [];
        
        for (var i = 0; i < this.state.visualization5Results.length; i++) {
            var item = this.state.visualization5Results[i];
            dates.push(new Date(item.Year, item.Month, 1));
            polInv.push(item.police_involved / (item.police_involved + item.police_not_involved));
        }

        var trace6 = {
            x:dates,
            y: polInv,
            name: 'Police Involved',
            type: 'bar'
        };

        // var trace7 = {
        //     x: dates,
        //     y: polNotInv,
        //     name: 'Police Not Involved',
        //     type: 'bar'
        // };


        return (
            <div>
                <MenuBar/>
                <div>
                    <Plot
                        data={[ trace1, trace2, trace3, trace4
                        ]}
                        layout={ {width: 1200, height: 600, title: 'Weapon Use by Income Bracket', barmode: "stack", yaxis: {automargin: true} }}
                    />
                </div>
                <div>
                    <Plot
                        data={[ propTrace
                        ]}
                        layout={ {width: 1200, height: 600, title: 'Proportion of Criminals Unemployed', yaxis: {automargin: true} }}
                    />
                </div>
                <div>
                <Plot
                    data={data}
                    layout={ {width: 1200, height: 600, title: 'Month Where Specific Crimes are Committed Most'} } />
                </div>
                <div>
                <Plot
                    data={data2}
                    layout={ {width: 1200, height: 600, title: 'Months per Year with Most Crimes'} } />
                </div>
                <div>
                    <Plot
                        data={[ trace6
                        ]}
                        layout={ {width: 1200, height: 600, title: 'Police Involvation Rate over Time', barmode: "stack", yaxis: {automargin: true} }}
                    />
                </div>
          </div>
        )
    }
}

export default VisualizationPage

