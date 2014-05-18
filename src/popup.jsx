/**
 * @jsx React.DOM
 */
var React = require("react");
var db = require("./dbwrapper.js");
var $ = require("jquery-browserify");
var select2 = require("select2");

db.init();

var Popup = React.createClass({
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
                        <label>Tags</label>
                        <p><input name="tags" type="text" id="tag_selection" className="full-width" tabIndex="1" /></p>
                    </div>
                    <div className="form-row">
                        <div class="first-column half-width">
                            <label>Hours</label>
                            <p><input id="form-hours" name="hours" type="text" className="short" tabIndex="2" onChange={this.handleHours}></input></p>
                        </div>
                        <div class="second-column half-width">
                            <label>Date</label>
                            <p><input name="date" type="date" className="short" id="form-date" onChange={this.handleDate}></input></p>
                        </div>
                    </div>
                    <div className="form-row">
                        <label>Description (optional)</label>
                        <p><textarea id="form-summary" name="summary" className="full-width" tabIndex="3" onChange={this.handleDescription}></textarea></p>
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
