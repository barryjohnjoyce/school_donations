
# School Donations Interactive Dashboard - DonorsChoose.org

## Overview

### What is this app for?

DonorsChoose.org is a US based nonprofit organization that allows individuals to donate money directly to public school
classroom projects. Public school teachers post classroom project requests on the platform, and individuals have the
option to donate money directly to fund these projects. The classroom projects range from pencils and books to computers
 and other expensive equipments for classrooms. In more than 10 years of existence, this platform helped teachers in all
 US states to post more than 7700,000 classroom project requests and raise more than $280,000,000. DonorsChoose.org has
 made the platform data open and available for making discoveries and building applications.

### What does it do?

This app is an prototype interactive dashboard incorporating data visualization that represents school donations broken
down by different attributes.

### Design Background

The dashboard has been designed from a blank HTML web using elements of Bootstrap and Keen Dashboards. I have attempted
to use a similar colour and design scheme as that on the DonorsChoose.org website (e.g. the use of a grey and white background,
with some orange edging; the use of the main background image of DonorsChoose as the main background image on the dashboard).

## Features

The dashboard allows users to visualise school donations broken down by various attributes. Users can filter the information
by selecting a particular state through the interactive map or through a dropdown menu, which reflects throughout the graphs
on the dashboard. A Dashboard Tutorial (utilising intro.js) can be accessed by clicking on the relevant button, which gives
the user a tour of the entire dashboard, explaining each graph and the information that it contains.

## Tech Used

### Some the tech used includes:

- [D3.js]
    - This is a JavaScript based visualisation engine which renders interactive charts and graphs based on the data. D3
    creates SVG based charts which are passed into HTML div blocks.

- [Dc.js]
    - This is a JavaScript based wrapper library for D3.js which enables easy plotting of the charts.

- [Crossfilter.js]
    - This is a JavaScript based data manipulation library that enables two-way data binding. Enable drill down based analysis.

- [Queue.js]
    - This is an asynchronous helper library for JavaScript.

- [Mongo DB]
    - This is a NoSQL Database used to convert and present data in JSON format.

- [Flask]
    - This is a Python-based micro-framework used to serve data from a server to a web-based interface.