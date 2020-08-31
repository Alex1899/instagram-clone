import React, { useState, useEffect } from 'react';
import Header from './Header';
import Post from './Post';
import axios from 'axios';
import { useStateValue } from '../context/StateProvider';
import '../styles/Home.css'


function Home() {
    const [ posts, setPosts ] = useState([]);
    const { state, dispatch } = useStateValue();

    useEffect(() => {
        axios.get('http://localhost:9000/posts')
            .then(response => {
                console.log(response.data);
                setPosts(response.data.posts);

            })
            .catch(error => console.log(error));
    }, [state])

    return (
        <div className="home__feed">
            
            {posts.map(post => {
                    return <Post
                               key={post._id}
                               postId={post._id}
                               username={state.user}
                               caption={post.caption}
                               comments={post.comments}
                               likeCount={post.userLikedList.length}
                               userLiked={post.userLikedList.length > 0 ? post.userLikedList.includes(state.userId) : false}
                               imageUrl={post.imageUrl}  
                           />
                })}
        </div>
    )
}

export default Home
