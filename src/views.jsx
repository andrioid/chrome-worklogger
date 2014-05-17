/**
 * @jsx React.DOM
 */

var db = require("./dbwrapper.js");
var React = require("react");

var ResultTable = React.createClass({
    render: function() {
        var rows = this.props.data.map(function(obj) {
            console.log(obj);
            var tagList = obj.tags.join(",");
            return (<ResultRow date={obj.date} tags={tagList} hours={obj.hours} description={obj.description} />);
        });
        return (
            <table className="pure-table">
                <thead><tr>
                    <th>Date</th>
                    <th>Tags</th>
                    <th>Hours</th>
                    <th>Description</th>
                    <th>&nbsp;</th>
                </tr></thead>
                <tbody>
                {rows}
                <ResultRow />
                <ResultRow />
                </tbody>
            </table>
            );
    }
});

var ResultRow = React.createClass({
    render: function() {
        return (
            <tr>
                <td>{this.props.date}</td>
                <td>{this.props.tags}</td>
                <td>{this.props.hours}</td>
                <td>{this.props.description}</td>
            </tr>
            );
    }
});

db.init(function() {
    db.getAll(function(results) {
        var Views = React.createClass({
            render: function() {
                return (
                    <div class="Views">
                        <h3>All Results</h3>
                        <ResultTable data={results} />
                    </div>
                    );
            }
        });
        console.log("our data", results);
        React.renderComponent(<Views/>, document.getElementById('views'));
    });
    /*
    db.addData({
        date: "2014-17-05",
        tags: ["pie", "love", "gir", "tuna"],
        hours: 4,
        description: "test data"
    }, function() {
       console.log("data added");
    });
    */
});

