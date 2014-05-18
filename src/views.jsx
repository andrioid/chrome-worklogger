/**
 * @jsx React.DOM
 */

var db = require("./dbwrapper.js");
var React = require("react");

var ResultTable = React.createClass({
    render: function() {
        var self = this;
        var rows = this.props.data.map(function(obj) {
            //console.log(obj);
            var tagList = obj.tags.join(",");
            return (<ResultRow key={obj.id} date={obj.date} tags={tagList} hours={obj.hours} description={obj.description} onDelete={self.props.onDelete}/>);
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
                </tbody>
            </table>
            );
    }
});

var ResultRow = React.createClass({
    deleteObj: function() {
        this.props.onDelete(this.props.key);
    },
    render: function() {
        return (
            <tr>
                <td>{this.props.date}</td>
                <td>{this.props.tags}</td>
                <td>{this.props.hours}</td>
                <td>{this.props.description}</td>
                <td><a href="#"  onClick={this.deleteObj}>Delete</a></td>
            </tr>
            );
    }
});


var Views = React.createClass({
    deleteObj: function(key) {
        var doit = confirm("Delete entry?");
        if (doit !== true) {
            return;
        }
        var self = this;
        db.delItem(key, function(err) {
            if (err) throw err;
            var entries = self.state.data;

            var newentries = entries.filter(function(elem) {
                return elem.id != key;
            });

            self.setState({data: newentries});
        });
    },
    getInitialState: function() {
        return {data: []};
    },
    getListFromDB: function() {
        var self = this;
        db.init(function() {
                db.getAll(function(results) {
                    self.setState({data: results});
                    //console.log("our data", results);
                });
        });
    },
    componentWillMount: function() {
        this.getListFromDB();
    },
    render: function() {
        return (
            <div className="Views">
                <h3>All Results</h3>
                <ResultTable data={this.state.data} onDelete={this.deleteObj} />
            </div>
            );
    }
});

React.renderComponent(<Views/>, document.getElementById('views'));

