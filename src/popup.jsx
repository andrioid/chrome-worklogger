/**
 * @jsx React.DOM
 */
var React = require("react");
var db = require("./dbwrapper.js");
db.init();

var Popup = React.createClass({
    render: function() {
        return (
            <form>
                <div class="form-container">
                    <div class="form-row">
                        <label>Tags</label>
                        <p><input name="tags" type="text" id="tag_selection" class="full-width" tabIndex="1"></input></p>
                    </div>
                    <div class="form-row">
                        <div class="first-column half-width">
                            <label>Hours</label>
                            <p><input id="form-hours" name="hours" type="text" class="short" tabIndex="2"></input></p>
                        </div>
                        <div class="second-column half-width">
                            <label>Date</label>
                            <p><input name="date" type="date" class="short" id="form-date"></input></p>
                        </div>
                    </div>
                    <div class="form-row">
                        <button type="submit" tabIndex="4">Log &amp; Clear</button> - &nbsp;
                        <a class="sublink" href="options.html" target="_blank">Options</a> - &nbsp;
                        <a class="sublink" href="views.html" target="_blank">Views</a>
                    </div>
                </div>
            </form>
        );
    }
});

React.renderComponent(<Popup/>, document.getElementById('popup'));