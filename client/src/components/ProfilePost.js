import React from 'react';
import '../styles/ProfilePost.css'

function ProfilePost({ imageUrl, likeCount, commentsCount }) {
    return (
        <div className="profilePost">
            <img className="profilePost__image" src={imageUrl} alt="Post image"/>
        </div>
    )
}

export default ProfilePost
