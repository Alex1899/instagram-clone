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
                               postId={post._id}
                               username={state.user}
                               caption={post.caption}
                               comments={post.comments}
                               likeCount={post.likeCount}
                               imageUrl="https://st1.photogallery.ind.sh/wp-content/uploads/indiacom/playboy-model-charlie-riina-will-make-your-eyes-pop-out-202001-1578409112.jpg"   
                           />
                })}
        </div>
    )
}

export default Home
