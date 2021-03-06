import React, { useState, useEffect } from 'react';
import Header from './Header';
import Post from './posts/Post';
import axios from 'axios';
import { useStateValue } from '../context/StateProvider';
import '../styles/Home.css'


function Home() {
    const [ posts, setPosts ] = useState([]);
    const { state, dispatch } = useStateValue();

    useEffect(() => {
        axios.get(`/api/posts/${state.userId}`)
            .then(response => {
                console.log(response.data);
                setPosts(response.data.posts);

            })
            .catch(error => console.log(error));
    }, [state])

    return (
        <div className="home__feed">
            
            {posts.length >= 1 && posts.map(post => {
                    console.log(post.imageId);
                    return <Post
                               key={post._id}
                               postId={post._id}
                               username={state.user}
                               caption={post.caption}
                               comments={post.comments}
                               likeCount={post.userLikedList.length}
                               userLiked={post.userLikedList.length > 0 ? post.userLikedList.includes(state.userId) : false}
                               imageUrl={post.imageId}  
                           />
                })}
        </div>
    )
}

export default Home
