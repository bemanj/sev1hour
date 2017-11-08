import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarChartComponent implements OnInit, OnChanges {
  @ViewChild('chart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  private margin: any = { top: 20, bottom: 20, left: 20, right: 20};
  private chart: any;
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private colors: any;
  private xAxis: any;
  private yAxis: any;

  constructor() { }

  ngOnInit() {
    this.createChart();
    // if (this.data) {
    //   this.updateChart();
    // }
  }

  ngOnChanges() {
    // if (this.chart) {
    //   this.updateChart();
    // }
  }


  createCircle() {

    // const element = this.chartContainer.nativeElement;
    // this.width = element.offsetWidth - this.margin.left - this.margin.right;
    // this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    const svg = d3.select('svg'),
    width = +svg.attr('width'),
    height = +svg.attr('height'),
    g = svg.append('g').attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        const tau = 2 * Math.PI; // http://tauday.com/tau-manifesto
        // An arc function with all values bound except the endAngle. So, to compute an
        // SVG path string for a given angle, we pass an object with an endAngle
        // property to the `arc` function, and it will return the corresponding string.
        const arc = d3.arc()
            .innerRadius(180)
            .outerRadius(240)
            .startAngle(0);
        // Get the SVG container, and apply a transform such that the origin is the
        // center of the canvas. This way, we don’t need to position arcs individually.
        // Add the background arc, from 0 to 100% (tau).
        const background = g.append('path')
            .datum({endAngle: tau})
            .style('fill', '#ddd')
            .attr('d', arc);
        // Add the foreground arc in orange, currently showing 12.7%.
        const foreground = g.append('path')
            .datum({endAngle: 0.00 * tau})
            .style('fill', 'orange')
            .attr('d', arc);
        // Every so often, start a transition to a new random angle. The attrTween
        // definition is encapsulated in a separate function (a closure) below.
        let y = 0;
        let b = 0;
        d3.interval(function() {
          // y = y + 0.00028; // needs verification for accuracy
          y = y + 0.017; // 60 seconds
          b = b + 1;
          const x = y * tau;
          // const x = Math.random() * tau;
          console.log(x + ' sec ' + b);
          foreground.transition()
              .duration(1000)
              .attrTween('d', arcTween(x));

        }, 1000);
        // Returns a tween for a transition’s "d" attribute, transitioning any selected
        // arcs from their current angle to the specified new angle.
        function arcTween(newAngle) {
          // The function passed to attrTween is invoked for each selected element when
          // the transition starts, and for each element returns the interpolator to use
          // over the course of transition. This function is thus responsible for
          // determining the starting angle of the transition (which is pulled from the
          // element’s bound datum, d.endAngle), and the ending angle (simply the
          // newAngle argument to the enclosing function).
          return function(d) {
            // To interpolate between the two angles, we use the default d3.interpolate.
            // (Internally, this maps to d3.interpolateNumber, since both of the
            // arguments to d3.interpolate are numbers.) The returned function takes a
            // single argument t and returns a number between the starting angle and the
            // ending angle. When t = 0, it returns d.endAngle; when t = 1, it returns
            // newAngle; and for 0 < t < 1 it returns an angle in-between.
            const interpolate = d3.interpolate(d.endAngle, newAngle);
            // The return value of the attrTween is also a function: the function that
            // we want to run for each tick of the transition. Because we used
            // attrTween("d"), the return value of this last function will be set to the
            // "d" attribute at every tick. (It’s also possible to use transition.tween
            // to run arbitrary code for every tick, say if you want to set multiple
            // attributes from a single function.) The argument t ranges from 0, at the
            // start of the transition, to 1, at the end.
            return function(t) {
              // Calculate the current arc angle based on the transition time, t. Since
              // the t for the transition and the t for the interpolate both range from
              // 0 to 1, we can pass t directly to the interpolator.
              //
              // Note that the interpolated angle is written into the element’s bound
              // data object! This is important: it means that if the transition were
              // interrupted, the data bound to the element would still be consistent
              // with its appearance. Whenever we start a new arc transition, the
              // correct starting angle can be inferred from the data.
              d.endAngle = interpolate(t);
              // Lastly, compute the arc path given the updated data! In effect, this
              // transition uses data-space interpolation: the data is interpolated
              // (that is, the end angle) rather than the path string itself.
              // Interpolating the angles in polar coordinates, rather than the raw path
              // string, produces valid intermediate arcs during the transition.
              return arc(d);
            };
          };
        }
      }

  createChart() {
    const element = this.chartContainer.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    const svg = d3.select(element).append('svg')
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight);

    // chart plot area
    // Comment out to show bar chart
    // this.chart = svg.append('g')
    //   .attr('class', 'bars')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    // define X & Y domains
    const xDomain = this.data.map(d => d[0]);
    const yDomain = [0, d3.max(this.data, d => d[1])];

    // create scales
    // this.xScale = d3.scaleBand().padding(0.1).domain(xDomain).rangeRound([0, this.width]);
    // this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    // bar colors
    // this.colors = d3.scaleLinear().domain([0, this.data.length]).range(<any[]>['red', 'blue']);

    // x & y axis
    // this.xAxis = svg.append('g')
    //   .attr('class', 'axis axis-x')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top + this.height})`)
    //   .call(d3.axisBottom(this.xScale));
    // this.yAxis = svg.append('g')
    //   .attr('class', 'axis axis-y')
    //   .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`)
    //   .call(d3.axisLeft(this.yScale));
    this.createCircle();
  }

  updateChart() {
    // update scales & axis
    this.xScale.domain(this.data.map(d => d[0]));
    this.yScale.domain([0, d3.max(this.data, d => d[1])]);
    this.colors.domain([0, this.data.length]);
    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    const update = this.chart.selectAll('.bar')
      .data(this.data);

    // remove exiting bars
    update.exit().remove();

    // update existing bars
    this.chart.selectAll('.bar').transition()
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(d[1]))
      .attr('width', d => this.xScale.bandwidth())
      .attr('height', d => this.height - this.yScale(d[1]))
      .style('fill', (d, i) => this.colors(i));

    // add new bars
    update
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.xScale(d[0]))
      .attr('y', d => this.yScale(0))
      .attr('width', this.xScale.bandwidth())
      .attr('height', 0)
      .style('fill', (d, i) => this.colors(i))
      .transition()
      .delay((d, i) => i * 10)
      .attr('y', d => this.yScale(d[1]))
      .attr('height', d => this.height - this.yScale(d[1]));
  }
}
