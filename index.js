import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

document.title = 'Climate Change Forum/Query';

let posts = [];
const originalPostTitle = 'Climate Change Today';
const originalPostBody = 'Climate change has become a prevalent issue in the modern world.  Factors that humans can control have been plaguing the planet.  One of these factors is carbon dioxide emissions.  CO2 emissions have risen by 407 ppm due to factories and other places and utilities that emit CO2.  This and other factors have caused the rising of the average global temperature and the decrease in arctic ice.  This forum provides an area for the open discussion of climate change and how to remedy its problems.';

if (localStorage.getItem('posts')) { 
    posts = JSON.parse(localStorage.getItem('posts'));
}

class Post extends React.Component {  //Post element do display user's posts
    constructor(props) {
        super(props);
        this.state = {
            baseId : 'current-',
        }
    }

    handleRemoveClick() {
        var elem = document.getElementById(this.state.baseId+this.props.id);
        for(let i=0; i<posts.length; i++) {
            if(posts[i].id === this.props.id) {
                posts.splice(i, 1);
                break;
            }
        }
        localStorage.setItem('posts', JSON.stringify(posts));
        elem.remove();
    }

    render() {
        return(
        <div id={this.state.baseId+this.props.id}>
            <h2>{this.props.title}&emsp;<button onClick={() => this.handleRemoveClick()}>Delete Post</button></h2>
            <h5>Posted by: {this.props.name} ({this.props.position})</h5>
            <p>{this.props.body}</p>
        </div>
       );
    }
}

class Form extends React.Component {  //Displays Header for page, renders posts, and takes input from 'create post' form
    constructor(props) {
        super(props);
        let tempCounter = -1;
        if (localStorage.getItem('counter')) {
            tempCounter = JSON.parse(localStorage.getItem('counter'));
        }
        this.state = {
            title: null,
            name: 'Anonymous',
            position: 'Researcher',
            body: null,
            counter: tempCounter,
        }

    }

    renderPost(title, name, position, body, id) { //Renders each post element
        return(
            <Post title={title} name={name} position={position} body={body} id={id} />
        );    
    }

    handleTitleChange(event) {  //Handles title field change
        this.setState({
            title: event.target.value,
        });
    }

    handleNameChange(event) { //Handles User name change
        this.setState({
            name: event.target.value,
        })
    }


    handlePositionChange(event) { //Handles user position changes
        this.setState({
            position: event.target.value,
        })
    }

    handleBodyChange(event) { //Handles body field change
        this.setState({
            body: event.target.value,
        });
    }

    handleSubmit(event) { //Handles form submit by clearing title and body fields and pushing new Post element to posts array
        event.preventDefault();
        
        posts.push({title: this.state.title, 
            name: this.state.name, 
            position: this.state.position, 
            body: this.state.body, 
            id: this.state.counter,});
        const currentCounter = this.state.counter;
        this.setState({
            title: '',
            name: 'Anonymous',
            body: '',
            counter: currentCounter + 1,
        });
        localStorage.setItem('posts', JSON.stringify(posts));
        localStorage.setItem('counter', JSON.stringify(this.state.counter));
    }

    render() {
        let renderedPosts = [];
        for (let i=0; i<posts.length; i++) {
            renderedPosts.push(this.renderPost(
                posts[i].title,
                posts[i].name,
                posts[i].position,
                posts[i].body,
                posts[i].id)
            );
        }
        return(
        <div>
            <h1 className='header'>Welcome to an Open Forum on Climate Change!</h1><br />
            <div className="origPost"><Post title={originalPostTitle} name="Ben Schuman" position="Student" body={originalPostBody} id='-2' />
            </div><div className="posts">{renderedPosts}</div>
            <div className='form'>
                <form className='postForm' onSubmit={(event) => this.handleSubmit(event)} >
                    <h3>Post Title:</h3>
                    <input onChange={(event) => this.handleTitleChange(event)} type='text' className="title" size='50' maxLength='50' value={this.state.title} />
                    &emsp;Your name:&ensp;<input type='text' onFocus={(event) => event.target.select()} value={this.state.name} size='30' patern='.{3,}' onChange={(event) => this.handleNameChange(event)} />
                    &emsp;Position:&ensp;<select name='position'  onChange={(event) => this.handlePositionChange(event)}>
                        <option value='Researcher'>Researcher</option>
                        <option value='Amateur'>Amateur</option>
                        <option value='Student'>Student</option>
                    </select><br />
                    <h3>Post Body:</h3>
                    <textarea onChange={(event) => this.handleBodyChange(event)} cols='140' rows='25' maxLength='1000' value={this.state.body} ></textarea><br />
                    <button type='submit'>Post</button>
                </form>
            </div>
        </div>
        );
    }
}

// Renders <Form> element to root of html ====================
ReactDOM.render(<Form />, document.getElementById('root'));
