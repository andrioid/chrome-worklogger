/**
 * @jsx React.DOM
 */
var React = require("react");
var db = require("./dbwrapper.js");
var $ = require("jquery-browserify");
var select2 = require("select2");
var moment = require("moment");

db.init();

var Popup = React.createClass({
    getInitialState: function() {
        var today = new moment(),
            todayString = today.format("YYYY-MM-DD");

        console.log("today", todayString);
        return {
            "date": todayString
        };
    },
    submitHandler: function(e) {
        var tags = this.state.tags.split(",");
        db.addData({
            "tags": tags,
            "date": this.state.date,
            "hours": this.state.hours,
            "description": this.state.description
        }, function() {
            alert("Saved");
        })
        e.preventDefault();

    },
    handleTags: function(e) {
        this.setState({tags: e.target.value});
    },
    handleHours: function(e) {
        this.setState({hours: e.target.value});
    },
    handleDate: function(e) {
        this.setState({date: e.target.value});
    },
    handleDescription: function(e) {
        this.setState({description: e.target.value});
    },
    render: function() {
        return (
            <form onSubmit={this.submitHandler}>
                <div class="form-container">
                    <div class="form-row">
                        <label>Tags</label><br/>
                        <input name="tags" type="text" id="tag_selection" className="full-width" tabIndex="1" />
                    </div>
                    <div className="form-row">
                        <div class="first-column half-width">
                            <label>Hours</label><br/>
                            <input id="form-hours" name="hours" type="text" className="short" tabIndex="2" onChange={this.handleHours}></input>
                        </div>
                        <div class="second-column half-width">
                            <label>Date</label><br/>
                            <input name="date" type="date" className="short" id="form-date" value={this.state.date} onChange={this.handleDate}></input>
                        </div>
                    </div>
                    <div className="form-row">
                        <label>Description (optional)</label><br/>
                        <textarea id="form-summary" name="summary" className="full-width" tabIndex="3" onChange={this.handleDescription}></textarea>
                    </div>
                    <div className="form-row">
                        <button type="submit" tabIndex="4">Log &amp; Clear</button> - &nbsp;
                        <a class="sublink" href="options.html" target="_blank">Options</a> - &nbsp;
                        <a class="sublink" href="views.html" target="_blank">Views</a>
                    </div>
                </div>
            </form>
        );
    },
    componentDidMount: function(rootNode) {
        var self = this;
        $('#tag_selection').select2({
            tags: [],
            //tags: tags,
            tokenSeparators: [",", " "]
        });
        $('#tag_selection').change(this.handleTags);
        /*
        $(rootNode).select2();

        if (this.props.defaultValue != null) {
            $(rootNode).select2("val", this.props.defaultValue);
        }

        $(rootNode).on("change", this._handleChange);
        */
    }
});
//Todo: Get tags and stuff from configuration, then call component with the tags prop
React.renderComponent(<Popup/>, document.getElementById('popup'));
